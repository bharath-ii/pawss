// ─────────────────────────────────────────────
// PAWWS — Payout Functions
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();
const PLATFORM_FEE = 0.15; // 15%

// ─── CALCULATE PARTNER EARNINGS ──────────────
export const calculateEarnings = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { period } = data as { period: 'today' | 'week' | 'month' | 'all' };

    // Verify caller is a partner
    const partnerQuery = await db.collection('partners')
      .where('uid', '==', context.auth.uid).limit(1).get();
    if (partnerQuery.empty) throw new functions.https.HttpsError('not-found', 'Partner not found');
    const partnerId = partnerQuery.docs[0].id;

    let startDate: Date;
    const now = new Date();

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0);
    }

    const bookings = await db.collection('bookings')
      .where('partnerId', '==', partnerId)
      .where('bookingStatus', '==', 'service_completed')
      .where('paymentStatus', '==', 'paid')
      .where('createdAt', '>=', Timestamp.fromDate(startDate))
      .get();

    let totalRevenue = 0;
    let totalBookings = 0;

    for (const doc of bookings.docs) {
      const b = doc.data();
      totalRevenue += b.finalAmount;
      totalBookings++;
    }

    const platformFee = totalRevenue * PLATFORM_FEE;
    const netEarnings = totalRevenue - platformFee;

    return { totalRevenue, platformFee, netEarnings, totalBookings };
  });

// ─── PROCESS PAYOUT (Admin Only) ─────────────
export const processPayout = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
    if (context.auth.token?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin only');
    }

    const { partnerId, bookingIds, amount } = data;

    const payoutRef = db.collection('payouts').doc();
    const platformFee = amount * PLATFORM_FEE;
    const netAmount = amount - platformFee;

    await payoutRef.set({
      payoutId: payoutRef.id,
      partnerId,
      amount,
      platformFee,
      netAmount,
      bookingIds,
      status: 'processing',
      createdAt: Timestamp.now(),
      processedAt: null,
    });

    // In production: integrate with Razorpay Payouts API here

    return { payoutId: payoutRef.id, netAmount };
  });
