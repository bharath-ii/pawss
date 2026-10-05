// ─────────────────────────────────────────────
// PAWWS — Auth Store (Zustand)
// Global authentication state
// ─────────────────────────────────────────────

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from 'firebase/auth';
import type { CustomerProfile } from '@pawws/shared';

interface AuthState {
  // Firebase user
  firebaseUser: User | null;
  // Full profile from Firestore
  profile: CustomerProfile | null;
  // Auth status
  isLoading: boolean;
  isAuthenticated: boolean;
  // Hydration
  isHydrated: boolean;
  // Setters
  setFirebaseUser: (user: User | null) => void;
  setProfile: (profile: CustomerProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      isHydrated: false,

      setFirebaseUser: (user) =>
        set({ firebaseUser: user, isAuthenticated: !!user }),

      setProfile: (profile) =>
        set({ profile }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setHydrated: (isHydrated) =>
        set({ isHydrated }),

      logout: () =>
        set({ firebaseUser: null, profile: null, isAuthenticated: false }),
    }),
    {
      name: 'pawws-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
