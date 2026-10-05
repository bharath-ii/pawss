// ─────────────────────────────────────────────
// PAWWS — Booking Cloud Functions
// ALL booking business logic runs server-side.
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

// ─── TYPES (minimal inline for Functions) ─────
interface CreateBookingPayload {
  partnerId: string;
  petId: string;
  serviceId: string;
  serviceLocationType: 'home' | 'provider';
  customerAddressId: string | null;
  bookingDate: string;
  startTime: string;
  couponCode?: string;
  notes?: string;
}

// ─── CREATE BOOKING ───────────────────────────
// Called by customer. Validates, calculates price,
// creates booking, triggers notification.
export const createBooking = functions
  .region('asia-south1')
  .https.onCall(async (data: CreateBookingPayload, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const customerId = context.auth.uid;
    const { partnerId, petId, serviceId, serviceLocationType, customerAddressId, bookingDate, startTime, couponCode, notes } = data;

    // ── Validate customer
    const customerDoc = await db.collection('users').doc(customerId).get();
    if (!customerDoc.exists) throw new functions.https.HttpsError('not-found', 'Customer not found');

    // ── Validate partner is active & approved
    const partnerDoc = await db.collection('partners').doc(partnerId).get();
    if (!partnerDoc.exists || partnerDoc.data()?.status !== 'approved') {
      throw new functions.https.HttpsError('failed-precondition', 'Partner is not available');
    }

    // ── Validate service
    const serviceDoc = await db.collection('services').doc(serviceId).get();
    if (!serviceDoc.exists || !serviceDoc.data()?.isActive) {
      throw new functions.https.HttpsError('not-found', 'Service not found or inactive');
    }
    const service = serviceDoc.data()!;

    // ── Validate pet belongs to customer
    const petDoc = await db.collection('pets').doc(petId).get();
    if (!petDoc.exists || petDoc.data()?.ownerId !== customerId) {
      throw new functions.https.HttpsError('permission-denied', 'Pet not found');
    }

    // ── Validate home service availability
    if (serviceLocationType === 'home' && !service.offersHomeService) {
      throw new functions.https.HttpsError('failed-precondition', 'Home service not available for this service');
    }

    // ── Calculate price server-side (NEVER trust client price)
    const basePrice = serviceLocationType === 'home'
      ? service.priceAtHome
      : service.priceAtProvider;

    let discount = 0;
    let couponCodeUsed: string | null = null;

    // ── Validate coupon if provided
    if (couponCode) {
      const couponResult = await validateCouponInternal(couponCode, basePrice, customerId);
      discount = couponResult.discount;
      couponCodeUsed = couponCode;
    }

    // ── Travel fee for home service
    const travelFee = serviceLocationType === 'home' ? 0 : 0; // Calculated later by partner

    const finalAmount = Math.max(0, basePrice - discount + travelFee);

    // ── Calculate end time
    const [sh, sm] = startTime.split(':').map(Number);
    const endMinutes = sh * 60 + sm + service.durationMinutes;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    // ── Get customer address if home service
    let customerAddress = null;
    if (serviceLocationType === 'home' && customerAddressId) {
      const addrDoc = await db.collection('users').doc(customerId)
        .collection('addresses').doc(customerAddressId).get();
      if (!addrDoc.exists) throw new functions.https.HttpsError('not-found', 'Address not found');
      customerAddress = addrDoc.data();
    }

    // ── Create Razorpay order
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: functions.config().razorpay.key_id,
      key_secret: functions.config().razorpay.key_secret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // paise
      currency: 'INR',
      receipt: `pawws_${Date.now()}`,
      notes: { customerId, partnerId, serviceId },
    });

    // ── Create booking document
    const bookingRef = db.collection('bookings').doc();
    const booking = {
      bookingId: bookingRef.id,
      customerId,
      partnerId,
      petId,
      serviceId,
      serviceName: service.name,
      serviceCategory: service.category,
      serviceLocationType,
      customerAddress,
      providerAddress: partnerDoc.data()!.address,
      bookingDate,
      startTime,
      endTime,
      price: basePrice,
      travelFee,
      discount,
      couponCode: couponCodeUsed,
      finalAmount,
      paymentStatus: 'pending',
      paymentId: null,
      razorpayOrderId: order.id,
      bookingStatus: 'pending',
      cancelReason: null,
      cancelledBy: null,
      notes: notes || '',
      reviewId: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await bookingRef.set(booking);

    // ── Create payment record
    const paymentRef = db.collection('payments').doc();
    await paymentRef.set({
      paymentId: paymentRef.id,
      bookingId: bookingRef.id,
      customerId,
      partnerId,
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      amount: finalAmount,
      currency: 'INR',
      status: 'pending',
      method: null,
      refundId: null,
      refundAmount: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // ── Notify partner
    const partnerData = partnerDoc.data()!;
    if (partnerData.fcmToken) {
      await admin.messaging().send({
        token: partnerData.fcmToken,
        notification: {
          title: '🐾 New Booking Request!',
          body: `${customerDoc.data()!.displayName} booked ${service.name}`,
        },
        data: { type: 'new_booking', bookingId: bookingRef.id },
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default' } } },
      });
    }

    return {
      bookingId: bookingRef.id,
      razorpayOrderId: order.id,
      amount: finalAmount,
      currency: 'INR',
    };
  });

// ─── VERIFY PAYMENT ───────────────────────────
export const verifyPayment = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = data;
    const customerId = context.auth.uid;

    // Verify signature
    const crypto = require('crypto');
    const keySecret = functions.config().razorpay.key_secret;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new functions.https.HttpsError('invalid-argument', 'Payment verification failed');
    }

    // Validate booking belongs to customer
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists || bookingDoc.data()?.customerId !== customerId) {
      throw new functions.https.HttpsError('permission-denied', 'Booking not found');
    }

    const batch = db.batch();

    // Update booking
    batch.update(db.collection('bookings').doc(bookingId), {
      paymentStatus: 'paid',
      paymentId: razorpayPaymentId,
      updatedAt: Timestamp.now(),
    });

    // Update payment record
    const paymentQuery = await db.collection('payments')
      .where('bookingId', '==', bookingId).limit(1).get();
    if (!paymentQuery.empty) {
      batch.update(paymentQuery.docs[0].ref, {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
        updatedAt: Timestamp.now(),
      });
    }

    await batch.commit();

    // Notify customer
    const customerDoc = await db.collection('users').doc(customerId).get();
    if (customerDoc.data()?.fcmToken) {
      await admin.messaging().send({
        token: customerDoc.data()!.fcmToken,
        notification: {
          title: '✅ Payment Successful!',
          body: `Your booking is confirmed. Payment of ₹${bookingDoc.data()!.finalAmount} received.`,
        },
        data: { type: 'payment_successful', bookingId },
      });
    }

    return { success: true };
  });

// ─── UPDATE BOOKING STATUS (Partner Only) ─────
export const updateBookingStatus = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { bookingId, newStatus, reason } = data;
    const uid = context.auth.uid;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) throw new functions.https.HttpsError('not-found', 'Booking not found');

    const booking = bookingDoc.data()!;

    // Determine who is calling
    const isPartner = booking.partnerId === uid ||
      (await db.collection('partners').where('uid', '==', uid).limit(1).get()).docs.some((d: any) => d.id === booking.partnerId);
    const isCustomer = booking.customerId === uid;
    const isAdmin = context.auth.token?.role === 'admin';

    // Permission matrix
    const partnerAllowed = ['confirmed', 'rejected', 'on_the_way', 'arrived', 'service_started', 'service_completed'];
    const customerAllowed = ['cancelled'];

    if (isPartner && !partnerAllowed.includes(newStatus)) {
      throw new functions.https.HttpsError('permission-denied', 'Partner cannot set this status');
    }
    if (isCustomer && !customerAllowed.includes(newStatus)) {
      throw new functions.https.HttpsError('permission-denied', 'Customer cannot set this status');
    }
    if (!isPartner && !isCustomer && !isAdmin) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized');
    }

    const updates: Record<string, unknown> = {
      bookingStatus: newStatus,
      updatedAt: Timestamp.now(),
    };

    if (reason) {
      updates.cancelReason = reason;
      updates.cancelledBy = isPartner ? 'partner' : isCustomer ? 'customer' : 'admin';
    }

    await db.collection('bookings').doc(bookingId).update(updates);

    // Send notification to the other party
    const notifyUserId = isPartner ? booking.customerId : booking.partnerId;
    const userDoc = await db.collection('users').doc(notifyUserId).get();
    const partnerDoc = await db.collection('partners')
      .where('uid', '==', booking.partnerId).limit(1).get();

    const token = isPartner
      ? userDoc.data()?.fcmToken
      : partnerDoc.docs[0]?.data()?.fcmToken;

    if (token) {
      const titles: Record<string, string> = {
        confirmed: '✅ Booking Confirmed!',
        rejected: '❌ Booking Rejected',
        on_the_way: '🚗 Provider On The Way',
        arrived: '📍 Provider Has Arrived',
        service_started: '✂️ Service Started',
        service_completed: '🎉 Service Completed!',
        cancelled: '❌ Booking Cancelled',
      };
      await admin.messaging().send({
        token,
        notification: { title: titles[newStatus] || 'Booking Update', body: `Your booking for ${booking.serviceName} has been updated.` },
        data: { type: `booking_${newStatus}`, bookingId },
      }).catch(() => {});
    }

    return { success: true };
  });

// ─── CANCEL BOOKING ───────────────────────────
export const cancelBooking = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { bookingId, reason } = data;
    const customerId = context.auth.uid;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) throw new functions.https.HttpsError('not-found', 'Booking not found');

    const booking = bookingDoc.data()!;
    if (booking.customerId !== customerId) throw new functions.https.HttpsError('permission-denied', 'Not your booking');

    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(booking.bookingStatus)) {
      throw new functions.https.HttpsError('failed-precondition', 'Booking cannot be cancelled at this stage');
    }

    const batch = db.batch();
    batch.update(db.collection('bookings').doc(bookingId), {
      bookingStatus: 'cancelled',
      cancelReason: reason || 'Cancelled by customer',
      cancelledBy: 'customer',
      updatedAt: Timestamp.now(),
    });

    // Trigger refund if payment was made
    if (booking.paymentStatus === 'paid') {
      // Refund via Razorpay (handled by razorpayWebhook or manually)
      // For now, mark as refund pending
      batch.update(db.collection('bookings').doc(bookingId), { paymentStatus: 'refunded' });
    }

    await batch.commit();

    return { success: true };
  });

// ─── INTERNAL: Validate Coupon ────────────────
async function validateCouponInternal(code: string, amount: number, userId: string) {
  const couponQuery = await db.collection('coupons')
    .where('code', '==', code.toUpperCase())
    .where('isActive', '==', true)
    .limit(1)
    .get();

  if (couponQuery.empty) return { discount: 0, valid: false };

  const coupon = couponQuery.docs[0].data();
  const now = Timestamp.now();

  if (now.toMillis() < coupon.validFrom.toMillis() || now.toMillis() > coupon.validUntil.toMillis()) {
    return { discount: 0, valid: false };
  }
  if (coupon.usedCount >= coupon.usageLimit) return { discount: 0, valid: false };
  if (amount < coupon.minOrderAmount) return { discount: 0, valid: false };

  let discount = coupon.discountType === 'flat'
    ? coupon.discountValue
    : (amount * coupon.discountValue) / 100;

  if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);

  return { discount: Math.round(discount), valid: true };
}
