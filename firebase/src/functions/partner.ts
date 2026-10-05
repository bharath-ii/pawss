// ─────────────────────────────────────────────
// PAWWS — Partner Functions
// Approval, onboarding, profile management
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

// ─── APPROVE / REJECT PARTNER (Admin Only) ────
export const approvePartner = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
    if (context.auth.token?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin only');
    }

    const { partnerId, action, reason } = data as {
      partnerId: string;
      action: 'approve' | 'reject';
      reason?: string;
    };

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    await db.collection('partners').doc(partnerId).update({
      status: newStatus,
      rejectionReason: action === 'reject' ? (reason || null) : null,
      updatedAt: Timestamp.now(),
    });

    // Set custom claim for partner role
    const partnerDoc = await db.collection('partners').doc(partnerId).get();
    const partnerUid = partnerDoc.data()?.uid;

    if (action === 'approve' && partnerUid) {
      await admin.auth().setCustomUserClaims(partnerUid, {
        role: 'partner',
        partnerId,
      });

      // Notify partner
      const partnerData = partnerDoc.data()!;
      if (partnerData.fcmToken) {
        await admin.messaging().send({
          token: partnerData.fcmToken,
          notification: {
            title: '🎉 Your PAWWS Profile is Approved!',
            body: 'You can now start receiving booking requests from pet owners.',
          },
          data: { type: 'partner_approved', partnerId },
        }).catch(() => {});
      }
    }

    return { success: true, status: newStatus };
  });

// ─── SET CUSTOM USER ROLE (Admin Only) ────────
export const setUserRole = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
    if (context.auth.token?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Admin only');
    }

    const { uid, role } = data as { uid: string; role: 'customer' | 'partner' | 'admin' };

    if (!['customer', 'partner', 'admin'].includes(role)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
    }

    await admin.auth().setCustomUserClaims(uid, { role });
    await db.collection('users').doc(uid).update({ role, updatedAt: Timestamp.now() });

    return { success: true };
  });

// ─── ON NEW USER CREATED ──────────────────────
export const onUserCreated = functions
  .region('asia-south1')
  .auth.user().onCreate(async (user: any) => {
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      role: 'customer',
      displayName: user.displayName || '',
      email: user.email || null,
      phone: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      fcmToken: null,
      savedAddresses: [],
      favoritePartnerIds: [],
      favoriteServiceIds: [],
      isActive: true,
      isDeleted: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }, { merge: true });

    // Set default customer role claim
    await admin.auth().setCustomUserClaims(user.uid, { role: 'customer' });
  });

// ─── ON USER DELETED ──────────────────────────
export const onUserDeleted = functions
  .region('asia-south1')
  .auth.user().onDelete(async (user: any) => {
    await db.collection('users').doc(user.uid).update({
      isDeleted: true,
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  });
