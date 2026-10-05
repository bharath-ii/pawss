// ─────────────────────────────────────────────
// PAWWS — Shared Types
// All core domain types shared across customer,
// partner apps and admin dashboard.
// ─────────────────────────────────────────────

import { Timestamp } from 'firebase/firestore';

// ─── USER ROLES ───────────────────────────────
export type UserRole = 'customer' | 'partner' | 'admin';

// ─── USER ─────────────────────────────────────
export interface User {
  uid: string;
  role: UserRole;
  displayName: string;
  email: string | null;
  phone: string | null;
  photoURL: string | null;
  fcmToken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CustomerProfile extends User {
  role: 'customer';
  savedAddresses: Address[];
  emergencyContact?: EmergencyContact;
  favoritePartnerIds: string[];
  favoriteServiceIds: string[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// ─── ADDRESS ──────────────────────────────────
export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  customLabel?: string;
  fullAddress: string;
  flatNo?: string;
  landmark?: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

// ─── PET ──────────────────────────────────────
export type PetSpecies =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'rabbit'
  | 'fish'
  | 'hamster'
  | 'reptile'
  | 'horse'
  | 'other';

export type PetGender = 'male' | 'female' | 'unknown';

export interface Pet {
  petId: string;
  ownerId: string;
  name: string;
  photoURL: string | null;
  species: PetSpecies;
  customSpecies?: string;
  breed: string;
  gender: PetGender;
  dateOfBirth: Timestamp | null;
  ageYears?: number;
  weightKg: number;
  vaccinations: Vaccination[];
  medicalNotes: string;
  allergies: string[];
  specialInstructions: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Vaccination {
  name: string;
  date: Timestamp;
  nextDueDate: Timestamp | null;
  vetName?: string;
}

// ─── PARTNER ──────────────────────────────────
export type BusinessType =
  | 'pet_groomer'
  | 'veterinary_clinic'
  | 'pet_trainer'
  | 'pet_walker'
  | 'pet_sitter'
  | 'pet_boarding'
  | 'pet_spa'
  | 'pet_taxi'
  | 'other';

export type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Partner {
  partnerId: string;
  uid: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  description: string;
  logoURL: string | null;
  coverURL: string | null;
  address: PartnerAddress;
  workingHours: WorkingHours;
  serviceRadius: number; // km
  businessType: BusinessType;
  supportedPetTypes: PetSpecies[];
  offersHomeService: boolean;
  offersProviderLocation: boolean;
  status: PartnerStatus;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  fcmToken?: string;
  documents: PartnerDocument[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface PartnerAddress {
  fullAddress: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  pincode: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
  breaks: Break[];
}

export interface Break {
  startTime: string;
  endTime: string;
}

export interface PartnerDocument {
  type: 'identity' | 'business_license' | 'certification' | 'other';
  label: string;
  url: string;
  uploadedAt: Timestamp;
  verified: boolean;
}

// ─── SERVICE ──────────────────────────────────
export type ServiceCategory =
  | 'grooming'
  | 'hair_spa'
  | 'bath'
  | 'haircut'
  | 'nail_trimming'
  | 'de_shedding'
  | 'veterinary'
  | 'vaccination'
  | 'pet_training'
  | 'dog_walking'
  | 'pet_sitting'
  | 'pet_boarding'
  | 'pet_taxi'
  | 'pet_photography';

export interface Service {
  serviceId: string;
  partnerId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  supportedPetTypes: PetSpecies[];
  durationMinutes: number;
  priceAtProvider: number;
  priceAtHome: number | null;
  offersHomeService: boolean;
  offersProviderLocation: boolean;
  availableDays: string[];
  maxBookingsPerSlot: number;
  isActive: boolean;
  photos: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── BOOKING ──────────────────────────────────
export type ServiceLocationType = 'home' | 'provider';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'on_the_way'
  | 'arrived'
  | 'service_started'
  | 'service_completed'
  | 'cancelled'
  | 'rejected'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface Booking {
  bookingId: string;
  customerId: string;
  partnerId: string;
  petId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceLocationType: ServiceLocationType;
  customerAddress: Address | null;
  providerAddress: PartnerAddress;
  bookingDate: string; // 'YYYY-MM-DD'
  startTime: string;   // 'HH:MM'
  endTime: string;     // 'HH:MM'
  price: number;
  travelFee: number;
  discount: number;
  couponCode: string | null;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  razorpayOrderId: string | null;
  bookingStatus: BookingStatus;
  cancelReason: string | null;
  cancelledBy: 'customer' | 'partner' | 'admin' | null;
  notes: string;
  reviewId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── REVIEW ───────────────────────────────────
export interface Review {
  reviewId: string;
  bookingId: string;
  customerId: string;
  partnerId: string;
  serviceId: string;
  rating: number; // 1-5
  comment: string;
  photos: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isVisible: boolean;
}

// ─── CHAT ─────────────────────────────────────
export interface Chat {
  chatId: string;
  participants: string[]; // [customerId, partnerId]
  bookingId: string | null;
  lastMessage: string;
  lastMessageAt: Timestamp | null;
  unreadCount: Record<string, number>;
  createdAt: Timestamp;
}

export type MessageType = 'text' | 'image' | 'booking_reference';

export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  text: string;
  imageURL?: string;
  bookingId?: string;
  createdAt: Timestamp;
  readBy: string[];
}

// ─── NOTIFICATION ─────────────────────────────
export type NotificationType =
  | 'new_booking'
  | 'booking_accepted'
  | 'booking_rejected'
  | 'booking_reminder'
  | 'provider_on_the_way'
  | 'service_started'
  | 'service_completed'
  | 'payment_successful'
  | 'payment_failed'
  | 'booking_cancelled'
  | 'review_reminder';

export interface PawwsNotification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  isRead: boolean;
  createdAt: Timestamp;
}

// ─── PAYMENT ──────────────────────────────────
export interface Payment {
  paymentId: string;
  bookingId: string;
  customerId: string;
  partnerId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  refundId: string | null;
  refundAmount: number | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── COUPON ───────────────────────────────────
export interface Coupon {
  couponId: string;
  code: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  applicableCategories: ServiceCategory[] | 'all';
  validFrom: Timestamp;
  validUntil: Timestamp;
  isActive: boolean;
}

// ─── PAYOUT ───────────────────────────────────
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  payoutId: string;
  partnerId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  bookingIds: string[];
  status: PayoutStatus;
  upiId?: string;
  bankAccount?: BankAccount;
  createdAt: Timestamp;
  processedAt: Timestamp | null;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

// ─── AVAILABILITY SLOT ────────────────────────
export interface AvailabilitySlot {
  slotId: string;
  partnerId: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:MM'
  endTime: string;
  maxBookings: number;
  currentBookings: number;
  isBlocked: boolean;
}

// ─── API RESPONSE HELPERS ─────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  lastDocId: string | null;
  hasMore: boolean;
}

// ─── CATEGORY META ────────────────────────────
export interface CategoryMeta {
  id: ServiceCategory;
  label: string;
  icon: string;
  color: string;
}

export const SERVICE_CATEGORIES: CategoryMeta[] = [
  { id: 'grooming',        label: 'Grooming',       icon: 'scissors',       color: '#FFC0CB' },
  { id: 'hair_spa',        label: 'Hair Spa',        icon: 'sparkles',       color: '#FFB3C1' },
  { id: 'bath',            label: 'Bath',            icon: 'droplets',       color: '#ADE8F4' },
  { id: 'haircut',         label: 'Haircut',         icon: 'cut',            color: '#FFC8DD' },
  { id: 'nail_trimming',   label: 'Nail Trimming',   icon: 'moon',           color: '#CDB4DB' },
  { id: 'de_shedding',     label: 'De-shedding',     icon: 'wind',           color: '#BDE0FE' },
  { id: 'veterinary',      label: 'Veterinary',      icon: 'stethoscope',    color: '#CAFFBF' },
  { id: 'vaccination',     label: 'Vaccination',     icon: 'syringe',        color: '#9BF6FF' },
  { id: 'pet_training',    label: 'Pet Training',    icon: 'award',          color: '#FDFFB6' },
  { id: 'dog_walking',     label: 'Dog Walking',     icon: 'footprints',     color: '#FFD6A5' },
  { id: 'pet_sitting',     label: 'Pet Sitting',     icon: 'home',           color: '#FFADAD' },
  { id: 'pet_boarding',    label: 'Pet Boarding',    icon: 'bed',            color: '#D0F4DE' },
  { id: 'pet_taxi',        label: 'Pet Taxi',        icon: 'car',            color: '#E9C46A' },
  { id: 'pet_photography', label: 'Photography',     icon: 'camera',         color: '#F4A261' },
];
