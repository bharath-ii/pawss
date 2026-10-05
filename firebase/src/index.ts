// ─────────────────────────────────────────────
// PAWWS — Cloud Functions Entry Point
// ─────────────────────────────────────────────

import * as admin from 'firebase-admin';

// Initialize once
admin.initializeApp();

// Export all function groups
export * from './functions/booking';
export * from './functions/payment';
export * from './functions/partner';
export * from './functions/notifications';
export * from './functions/reviews';
export * from './functions/coupons';
export * from './functions/payouts';
export * from './functions/auth';
