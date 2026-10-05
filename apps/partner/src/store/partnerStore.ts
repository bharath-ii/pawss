// ─────────────────────────────────────────────
// PAWWS Partner App — Partner Store (Zustand)
// ─────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Partner } from '@pawws/shared';

interface PartnerState {
  partner: Partner | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setPartner: (partner: Partner | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (auth: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const usePartnerStore = create<PartnerState>()(
  persist(
    (set) => ({
      partner: null,
      isLoading: true,
      isAuthenticated: false,
      isHydrated: false,

      setPartner: (partner) => set({ partner, isAuthenticated: !!partner }),
      setLoading: (isLoading) => set({ isLoading }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setHydrated: (isHydrated) => set({ isHydrated }),
      logout: () => set({ partner: null, isAuthenticated: false }),
    }),
    {
      name: 'pawws-partner',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ partner: state.partner }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
