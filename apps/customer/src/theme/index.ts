// ─────────────────────────────────────────────
// PAWWS — Design System / Theme
// Poppins font + Pink/Black/White palette
// ─────────────────────────────────────────────

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const COLORS = {
  // Brand
  primary: '#FFC0CB',
  primaryLight: '#FFD6DE',
  primaryDark: '#FF8FA3',
  primaryAlpha: 'rgba(255,192,203,0.15)',

  // Neutrals
  black: '#1A1A1A',
  white: '#FFFFFF',
  offWhite: '#F8F8F8',

  // Surface
  surfaceLight: '#FFFFFF',
  surfaceDark: '#121212',
  cardLight: '#FFFFFF',
  cardDark: '#1E1E1E',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#1A1A1A',
  textDark: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderDark: '#2D2D2D',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Booking status
  statusPending: '#F59E0B',
  statusConfirmed: '#3B82F6',
  statusOnTheWay: '#8B5CF6',
  statusArrived: '#EC4899',
  statusStarted: '#10B981',
  statusCompleted: '#059669',
  statusCancelled: '#EF4444',
  statusRejected: '#DC2626',
} as const;

export const FONTS = {
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
} as const;

export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  pink: {
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} as const;

// ─── THEME OBJECT ────────────────────────────
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryLight: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: COLORS.offWhite,
    surface: COLORS.white,
    card: COLORS.cardLight,
    text: COLORS.textPrimary,
    textSecondary: COLORS.textSecondary,
    border: COLORS.border,
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: COLORS.surfaceDark,
    surface: '#1A1A1A',
    card: COLORS.cardDark,
    text: COLORS.white,
    textSecondary: '#9CA3AF',
    border: COLORS.borderDark,
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
  },
};
