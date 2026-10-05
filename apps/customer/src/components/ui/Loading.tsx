// ─────────────────────────────────────────────
// PAWWS — Loading States Component
// Skeleton + Spinner
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { COLORS, RADIUS } from '../../theme';

// ─── SPINNER ─────────────────────────────────
interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  color = COLORS.primary,
  style,
}: SpinnerProps) => (
  <View style={[styles.spinnerContainer, style]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// ─── SKELETON ────────────────────────────────
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.sm,
  style,
}: SkeletonProps) => {
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.4, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        animStyle,
        { width: width as any, height, borderRadius },
        style,
      ]}
    />
  );
};

// ─── FULL SCREEN LOADER ───────────────────────
export const FullScreenLoader: React.FC = () => (
  <View style={styles.fullScreen}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  spinnerContainer: { alignItems: 'center', justifyContent: 'center' },
  skeleton: { backgroundColor: COLORS.border },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
  },
});
