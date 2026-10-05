// ─────────────────────────────────────────────
// PAWWS — Notification Functions
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

// ─── SEND NOTIFICATION (Admin / Server Only) ──
export const sendNotification = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
    if (context.auth.token?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin only');
    }

    const { userId, title, body, type, extraData } = data;

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new functions.https.HttpsError('not-found', 'User not found');

    const fcmToken = userDoc.data()?.fcmToken;

    // Store in-app notification
    const notifRef = db.collection('notifications').doc();
    await notifRef.set({
      notificationId: notifRef.id,
      userId,
      type,
      title,
      body,
      data: extraData || {},
      isRead: false,
      createdAt: Timestamp.now(),
    });

    // Send push if token exists
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: { type, ...extraData },
      }).catch(() => {});
    }

    return { success: true };
  });

// ─── BOOKING REMINDER SCHEDULER ───────────────
// Runs every hour to send reminders for upcoming bookings
export const bookingReminderScheduler = functions
  .region('asia-south1')
  .pubsub.schedule('every 60 minutes')
  .onRun(async () => {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const dateKey = reminderTime.toISOString().split('T')[0];
    const timeKey = `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;

    const bookings = await db.collection('bookings')
      .where('bookingDate', '==', dateKey)
      .where('startTime', '==', timeKey)
      .where('bookingStatus', '==', 'confirmed')
      .where('paymentStatus', '==', 'paid')
      .get();

    const notifications: Promise<void>[] = [];

    for (const doc of bookings.docs) {
      const booking = doc.data();

      // Notify customer
      const customerPromise = db.collection('users').doc(booking.customerId).get().then(async (customerDoc: any) => {
        const token = customerDoc.data()?.fcmToken;
        if (token) {
          await admin.messaging().send({
            token,
            notification: {
              title: '⏰ Booking Reminder',
              body: `Your ${booking.serviceName} is scheduled in 1 hour!`,
            },
            data: { type: 'booking_reminder', bookingId: doc.id },
          }).catch(() => {});
        }
      });

      notifications.push(customerPromise);
    }

    await Promise.all(notifications);
    return null;
  });
