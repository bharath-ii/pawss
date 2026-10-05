// ─────────────────────────────────────────────
// PAWWS — Shared Constants
// ─────────────────────────────────────────────

export * from './icons';
export * from './legal';

export const PAWWS_COLORS = {
  primary: '#FFC0CB',
  primaryLight: '#FFD6DE',
  primaryDark: '#FF8FA3',
  black: '#1A1A1A',
  white: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceDark: '#121212',
  cardLight: '#FFFFFF',
  cardDark: '#1E1E1E',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderDark: '#374151',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const PAWWS_FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
  light: 'Poppins_300Light',
} as const;

export const PAWWS_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const PAWWS_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const PAWWS_SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ─── BOOKING STATUS LABELS ────────────────────
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  on_the_way: 'Provider On The Way',
  arrived: 'Arrived',
  service_started: 'Service Started',
  service_completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  no_show: 'No Show',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  on_the_way: '#8B5CF6',
  arrived: '#EC4899',
  service_started: '#10B981',
  service_completed: '#059669',
  cancelled: '#EF4444',
  rejected: '#DC2626',
  no_show: '#6B7280',
};

// ─── PAYMENT STATUS LABELS ────────────────────
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  partially_refunded: 'Partially Refunded',
};

// ─── FIREBASE COLLECTIONS ─────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  PETS: 'pets',
  PARTNERS: 'partners',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  CHATS: 'chats',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  COUPONS: 'coupons',
  CATEGORIES: 'categories',
  ADDRESSES: 'addresses',
  AVAILABILITY: 'availability',
  PAYOUTS: 'payouts',
} as const;

// ─── CLOUD FUNCTION NAMES ─────────────────────
export const CF = {
  CREATE_BOOKING: 'createBooking',
  CANCEL_BOOKING: 'cancelBooking',
  UPDATE_BOOKING_STATUS: 'updateBookingStatus',
  CREATE_RAZORPAY_ORDER: 'createRazorpayOrder',
  VERIFY_PAYMENT: 'verifyPayment',
  RAZORPAY_WEBHOOK: 'razorpayWebhook',
  VALIDATE_COUPON: 'validateCoupon',
  SUBMIT_REVIEW: 'submitReview',
  APPROVE_PARTNER: 'approvePartner',
  PROCESS_PAYOUT: 'processPayout',
  SEND_NOTIFICATION: 'sendNotification',
} as const;

// ─── STORAGE PATHS ────────────────────────────
export const STORAGE = {
  userPhotos: (uid: string) => `users/${uid}/profile.jpg`,
  petPhotos: (ownerId: string, petId: string) => `pets/${ownerId}/${petId}/photo.jpg`,
  partnerLogo: (partnerId: string) => `partners/${partnerId}/logo.jpg`,
  partnerCover: (partnerId: string) => `partners/${partnerId}/cover.jpg`,
  partnerDocs: (partnerId: string, docName: string) => `partners/${partnerId}/docs/${docName}`,
  servicePhotos: (partnerId: string, serviceId: string, idx: number) =>
    `services/${partnerId}/${serviceId}/photo_${idx}.jpg`,
  reviewPhotos: (reviewId: string, idx: number) => `reviews/${reviewId}/photo_${idx}.jpg`,
  chatImages: (chatId: string, messageId: string) => `chats/${chatId}/${messageId}.jpg`,
} as const;

// ─── PAGINATION ───────────────────────────────
export const PAGE_SIZE = 20;
export const SERVICES_PAGE_SIZE = 15;
export const BOOKINGS_PAGE_SIZE = 10;

// ─── PLATFORM FEE ────────────────────────────
export const PLATFORM_FEE_PERCENT = 15; // 15%

// ─── MAX IMAGE SIZE (bytes) ───────────────────
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const IMAGE_QUALITY = 0.8;

// ─── PET SPECIES CATALOG ──────────────────────
import type { PetSpecies } from '../types';
import type { IconName } from './icons';

export interface PetSpeciesOption {
  id: PetSpecies;
  label: string;
  icon: IconName;
  emoji: string;
  defaultBreedPlaceholder: string;
}

export const PET_SPECIES_LIST: PetSpeciesOption[] = [
  { id: 'dog', label: 'Dog', icon: 'dog', emoji: '🐕', defaultBreedPlaceholder: 'e.g. Golden Retriever, Labrador, Indie' },
  { id: 'cat', label: 'Cat', icon: 'cat', emoji: '🐈', defaultBreedPlaceholder: 'e.g. Persian, Siamese, Domestic Shorthair' },
  { id: 'bird', label: 'Bird', icon: 'bird', emoji: '🦜', defaultBreedPlaceholder: 'e.g. Budgerigar, Cockatiel, Parakeet' },
  { id: 'rabbit', label: 'Rabbit', icon: 'rabbit', emoji: '🐇', defaultBreedPlaceholder: 'e.g. Holland Lop, Netherland Dwarf' },
  { id: 'fish', label: 'Fish', icon: 'fish', emoji: '🐠', defaultBreedPlaceholder: 'e.g. Betta, Goldfish, Guppy' },
  { id: 'hamster', label: 'Hamster / Rodent', icon: 'hamster', emoji: '🐹', defaultBreedPlaceholder: 'e.g. Syrian Hamster, Guinea Pig' },
  { id: 'reptile', label: 'Reptile / Turtle', icon: 'reptile', emoji: '🐢', defaultBreedPlaceholder: 'e.g. Red-Eared Slider, Bearded Dragon' },
  { id: 'horse', label: 'Horse / Farm', icon: 'horse', emoji: '🐴', defaultBreedPlaceholder: 'e.g. Marwari, Thoroughbred, Pony' },
  { id: 'other', label: 'Custom / Other', icon: 'sparkles', emoji: '✨', defaultBreedPlaceholder: 'e.g. Specify breed or variety (optional)' },
];
