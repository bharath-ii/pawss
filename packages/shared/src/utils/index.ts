// ─────────────────────────────────────────────
// PAWWS — Shared Utilities
// ─────────────────────────────────────────────

import { Timestamp } from 'firebase/firestore';

// ─── DATE HELPERS ────────────────────────────
export function formatDate(date: Date | Timestamp): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export function getAgeFromDOB(dob: Timestamp): string {
  const now = new Date();
  const birth = dob.toDate();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  if (years === 0) return `${Math.max(months, 1)} month${months !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''}`;
}

// ─── CURRENCY HELPERS ─────────────────────────
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ─── DISTANCE ────────────────────────────────
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// ─── VALIDATION HELPERS ───────────────────────
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

// ─── STRING HELPERS ───────────────────────────
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, length = 60): string {
  return str.length > length ? str.slice(0, length) + '…' : str;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ─── RATING HELPERS ───────────────────────────
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Average';
  return 'Below Average';
}

// ─── BOOKING STATUS HELPERS ───────────────────
export function isBookingActive(status: string): boolean {
  return ['confirmed', 'on_the_way', 'arrived', 'service_started'].includes(status);
}

export function isBookingComplete(status: string): boolean {
  return status === 'service_completed';
}

export function isBookingCancellable(status: string): boolean {
  return ['pending', 'confirmed'].includes(status);
}

// ─── SLOT TIME GENERATION ─────────────────────
export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  durationMinutes: number,
  breakTimes: Array<{ startTime: string; endTime: string }>
): string[] {
  const slots: string[] = [];
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);
  let current = oh * 60 + om;
  const end = ch * 60 + cm;

  while (current + durationMinutes <= end) {
    const hh = Math.floor(current / 60).toString().padStart(2, '0');
    const mm = (current % 60).toString().padStart(2, '0');
    const slotTime = `${hh}:${mm}`;

    const isDuringBreak = breakTimes.some(b => {
      const [bsh, bsm] = b.startTime.split(':').map(Number);
      const [beh, bem] = b.endTime.split(':').map(Number);
      return current >= bsh * 60 + bsm && current < beh * 60 + bem;
    });

    if (!isDuringBreak) slots.push(slotTime);
    current += 30; // 30-min increments
  }

  return slots;
}
