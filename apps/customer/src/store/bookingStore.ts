// ─────────────────────────────────────────────
// PAWWS — Booking Store (Zustand)
// In-progress booking flow state
// ─────────────────────────────────────────────

import { create } from 'zustand';
import type { ServiceLocationType } from '@pawws/shared';

export interface BookingDraft {
  partnerId: string | null;
  partnerName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  serviceCategory: string | null;
  serviceLocationType: ServiceLocationType | null;
  petId: string | null;
  petName: string | null;
  addressId: string | null;
  bookingDate: string | null; // 'YYYY-MM-DD'
  startTime: string | null;
  basePrice: number | null;
  travelFee: number;
  discount: number;
  couponCode: string | null;
  finalAmount: number | null;
  notes: string;
}

interface BookingStore {
  draft: BookingDraft;
  setDraft: (draft: Partial<BookingDraft>) => void;
  resetDraft: () => void;
}

const INITIAL_DRAFT: BookingDraft = {
  partnerId: null,
  partnerName: null,
  serviceId: null,
  serviceName: null,
  serviceCategory: null,
  serviceLocationType: null,
  petId: null,
  petName: null,
  addressId: null,
  bookingDate: null,
  startTime: null,
  basePrice: null,
  travelFee: 0,
  discount: 0,
  couponCode: null,
  finalAmount: null,
  notes: '',
};

export const useBookingStore = create<BookingStore>()((set) => ({
  draft: INITIAL_DRAFT,
  setDraft: (draft) =>
    set((state) => ({ draft: { ...state.draft, ...draft } })),
  resetDraft: () =>
    set({ draft: INITIAL_DRAFT }),
}));
