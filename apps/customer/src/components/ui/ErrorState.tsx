// ─────────────────────────────────────────────
// PAWWS — Unified Error & Offline State Component
// Friendly error handling with retry trigger
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { COLORS, FONTS } from '../../theme';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  isOffline?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this data. Please check your connection and try again.',
  onRetry,
  retryLabel = 'Try Again',
  isOffline = false,
  style,
}) => {
  const displayTitle = isOffline ? 'No Internet Connection' : title;
  const displayMessage = isOffline
    ? 'Please check your Wi-Fi or mobile data connection and tap below to retry.'
    : message;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon
          name={isOffline ? 'alert' : 'refresh'}
          size={32}
          color={COLORS.error}
          strokeWidth={2}
        />
      </View>

      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>

      {onRetry ? (
        <View style={styles.actionWrap}>
          <Button
            label={retryLabel}
            onPress={onRetry}
            variant="outline"
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2', // Soft red
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  actionWrap: {
    minWidth: 150,
  },
});
