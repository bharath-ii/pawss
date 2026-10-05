// ─────────────────────────────────────────────
// PAWWS — Review Functions
// ─────────────────────────────────────────────

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const db = admin.firestore();

// ─── SUBMIT REVIEW ────────────────────────────
export const submitReview = functions
  .region('asia-south1')
  .https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');

    const { bookingId, rating, comment, photos } = data;
    const customerId = context.auth.uid;

    if (rating < 1 || rating > 5) {
      throw new functions.https.HttpsError('invalid-argument', 'Rating must be between 1 and 5');
    }

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) throw new functions.https.HttpsError('not-found', 'Booking not found');

    const booking = bookingDoc.data()!;
    if (booking.customerId !== customerId) {
      throw new functions.https.HttpsError('permission-denied', 'Not your booking');
    }
    if (booking.bookingStatus !== 'service_completed') {
      throw new functions.https.HttpsError('failed-precondition', 'Service must be completed before reviewing');
    }
    if (booking.reviewId) {
      throw new functions.https.HttpsError('already-exists', 'Review already submitted');
    }

    const reviewRef = db.collection('reviews').doc();
    const batch = db.batch();

    batch.set(reviewRef, {
      reviewId: reviewRef.id,
      bookingId,
      customerId,
      partnerId: booking.partnerId,
      serviceId: booking.serviceId,
      rating,
      comment: comment || '',
      photos: photos || [],
      isVisible: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    batch.update(db.collection('bookings').doc(bookingId), {
      reviewId: reviewRef.id,
      updatedAt: Timestamp.now(),
    });

    await batch.commit();

    // Update partner rating
    await updatePartnerRating(booking.partnerId);

    return { reviewId: reviewRef.id };
  });

// ─── UPDATE PARTNER RATING ────────────────────
async function updatePartnerRating(partnerId: string): Promise<void> {
  const reviews = await db.collection('reviews')
    .where('partnerId', '==', partnerId)
    .where('isVisible', '==', true)
    .get();

  if (reviews.empty) return;

  const totalRating = reviews.docs.reduce((sum: number, doc: any) => sum + doc.data().rating, 0);
  const avgRating = totalRating / reviews.size;

  await db.collection('partners').doc(partnerId).update({
    rating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.size,
    updatedAt: Timestamp.now(),
  });
}
