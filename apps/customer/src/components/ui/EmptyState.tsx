// ─────────────────────────────────────────────
// PAWWS — Unified Empty State Component
// Vector icon, Poppins typography, clean actions
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'pets',
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Vector Icon in soft circular badge */}
      <View style={styles.iconCircle}>
        <Icon name={icon} size={36} color={COLORS.black} strokeWidth={1.8} />
      </View>

      {/* Title & Description in Poppins */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Action CTA */}
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button
            label={actionLabel}
            onPress={onAction}
            variant={actionVariant}
            size="md"
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionWrap: {
    minWidth: 160,
  },
});
