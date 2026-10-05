// ─────────────────────────────────────────────
// PAWWS — Coupon Validation Function
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

export const validateCoupon = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { code, amount, serviceCategory } = data;

    const couponQuery = await db.collection('coupons')
      .where('code', '==', code.toUpperCase())
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (couponQuery.empty) {
      throw new functions.https.HttpsError('not-found', 'Invalid coupon code');
    }

    const coupon = couponQuery.docs[0].data();
    const now = Timestamp.now();

    if (now.toMillis() < coupon.validFrom.toMillis()) {
      throw new functions.https.HttpsError('failed-precondition', 'Coupon is not yet active');
    }
    if (now.toMillis() > coupon.validUntil.toMillis()) {
      throw new functions.https.HttpsError('failed-precondition', 'Coupon has expired');
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new functions.https.HttpsError('resource-exhausted', 'Coupon usage limit reached');
    }
    if (amount < coupon.minOrderAmount) {
      throw new functions.https.HttpsError('failed-precondition', `Minimum order amount is ₹${coupon.minOrderAmount}`);
    }
    if (coupon.applicableCategories !== 'all' && !coupon.applicableCategories.includes(serviceCategory)) {
      throw new functions.https.HttpsError('failed-precondition', 'Coupon not applicable for this service');
    }

    let discount = coupon.discountType === 'flat'
      ? coupon.discountValue
      : (amount * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    discount = Math.round(discount);

    return {
      valid: true,
      discount,
      description: coupon.description,
      couponId: couponQuery.docs[0].id,
    };
  });
