// ─────────────────────────────────────────────
// PAWWS — Badge Component
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  dot = false,
}: BadgeProps) => {
  const badgeStyle = (styles as Record<string, any>)[variant];
  const colorConfig = BADGE_COLORS[variant] || BADGE_COLORS.primary;
  return (
    <View style={[styles.container, badgeStyle]}>
      {dot && <View style={[styles.dot, { backgroundColor: colorConfig.text }]} />}
      <Text style={[styles.label, { color: colorConfig.text }]}>
        {label}
      </Text>
    </View>
  );
};

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: 'rgba(255,192,203,0.2)', text: '#FF8FA3' },
  success: { bg: 'rgba(16,185,129,0.15)', text: '#059669' },
  warning: { bg: 'rgba(245,158,11,0.15)', text: '#D97706' },
  error: { bg: 'rgba(239,68,68,0.15)', text: '#DC2626' },
  info: { bg: 'rgba(59,130,246,0.15)', text: '#2563EB' },
  neutral: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280' },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  primary: { backgroundColor: BADGE_COLORS.primary.bg },
  success: { backgroundColor: BADGE_COLORS.success.bg },
  warning: { backgroundColor: BADGE_COLORS.warning.bg },
  error: { backgroundColor: BADGE_COLORS.error.bg },
  info: { backgroundColor: BADGE_COLORS.info.bg },
  neutral: { backgroundColor: BADGE_COLORS.neutral.bg },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs },
});
