// ─────────────────────────────────────────────
// PAWWS — Card Component
// ─────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = 'sm',
  padding = 16,
}: CardProps) => (
  <View style={[styles.card, shadow !== 'none' && (SHADOW as any)[shadow], { padding }, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
});
