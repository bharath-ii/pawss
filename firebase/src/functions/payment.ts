// ─────────────────────────────────────────────
// PAWWS — Payment Functions
// Razorpay webhook + order creation
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as crypto from 'crypto';

const db = admin.firestore();

// ─── CREATE RAZORPAY ORDER ────────────────────
export const createRazorpayOrder = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { bookingId } = data;
    const customerId = context.auth.uid;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists || bookingDoc.data()?.customerId !== customerId) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data()!;
    if (booking.paymentStatus === 'paid') {
      throw new functions.https.HttpsError('already-exists', 'Payment already completed');
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: functions.config().razorpay.key_id,
      key_secret: functions.config().razorpay.key_secret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(booking.finalAmount * 100),
      currency: 'INR',
      receipt: `pawws_${bookingId}`,
      notes: { bookingId, customerId },
    });

    await db.collection('bookings').doc(bookingId).update({
      razorpayOrderId: order.id,
      updatedAt: Timestamp.now(),
    });

    return {
      orderId: order.id,
      amount: booking.finalAmount,
      currency: 'INR',
      keyId: functions.config().razorpay.key_id,
    };
  });

// ─── RAZORPAY WEBHOOK ─────────────────────────
// Handles payment.captured, payment.failed, refund.created
export const razorpayWebhook = functions
  .region('asia-south1')
  .https.onRequest(async (req: any, res: any) => {
    const webhookSecret = functions.config().razorpay.webhook_secret;
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const bookingId = payment.notes?.bookingId;
      if (!bookingId) { res.json({ received: true }); return; }

      const batch = db.batch();
      batch.update(db.collection('bookings').doc(bookingId), {
        paymentStatus: 'paid',
        paymentId: payment.id,
        updatedAt: Timestamp.now(),
      });

      const paymentQuery = await db.collection('payments')
        .where('bookingId', '==', bookingId).limit(1).get();
      if (!paymentQuery.empty) {
        batch.update(paymentQuery.docs[0].ref, {
          razorpayPaymentId: payment.id,
          status: 'paid',
          method: payment.method,
          updatedAt: Timestamp.now(),
        });
      }
      await batch.commit();
    }

    if (event === 'payment.failed') {
      const payment = payload.payment.entity;
      const bookingId = payment.notes?.bookingId;
      if (bookingId) {
        await db.collection('bookings').doc(bookingId).update({
          paymentStatus: 'failed',
          updatedAt: Timestamp.now(),
        });
      }
    }

    if (event === 'refund.created') {
      const refund = payload.refund.entity;
      const paymentQuery = await db.collection('payments')
        .where('razorpayPaymentId', '==', refund.payment_id).limit(1).get();
      if (!paymentQuery.empty) {
        await paymentQuery.docs[0].ref.update({
          refundId: refund.id,
          refundAmount: refund.amount / 100,
          status: 'refunded',
          updatedAt: Timestamp.now(),
        });
      }
    }

    res.json({ received: true });
  });
