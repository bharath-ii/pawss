// ─────────────────────────────────────────────
// PAWWS — App Store (Zustand)
// Global app-level state
// ─────────────────────────────────────────────

import { create } from 'zustand';
import type { ThemeMode } from '../theme';

interface AppState {
  theme: ThemeMode;
  isOnline: boolean;
  selectedPetId: string | null;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  notificationPermission: 'granted' | 'denied' | 'undetermined';
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setOnline: (online: boolean) => void;
  setSelectedPetId: (petId: string | null) => void;
  setLocationPermission: (perm: 'granted' | 'denied' | 'undetermined') => void;
  setNotificationPermission: (perm: 'granted' | 'denied' | 'undetermined') => void;
}

export const useAppStore = create<AppState>()((set) => ({
  theme: 'light',
  isOnline: true,
  selectedPetId: null,
  locationPermission: 'undetermined',
  notificationPermission: 'undetermined',

  setTheme: (theme) => set({ theme }),
  setOnline: (isOnline) => set({ isOnline }),
  setSelectedPetId: (selectedPetId) => set({ selectedPetId }),
  setLocationPermission: (locationPermission) => set({ locationPermission }),
  setNotificationPermission: (notificationPermission) => set({ notificationPermission }),
}));
