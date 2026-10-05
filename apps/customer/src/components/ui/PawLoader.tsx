// ─────────────────────────────────────────────
// PAWWS — Paw Footprints Loading Screen (Mobile)
// White background → 7 black vector paw footprints → sequential walking animation
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS } from '../../theme';

interface PawLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

// Single Vector Paw Print Component
const VectorPaw: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = COLORS.black,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    {/* Center heel pad */}
    <Path d="M12 11.5c-2.3 0-4.1 1.7-4.1 3.7 0 1.9 1.5 3.3 3.3 3.3.6 0 1.1-.3 1.5-.7.4.4.9.7 1.5.7 1.8 0 3.3-1.4 3.3-3.3 0-2-1.8-3.7-4.1-3.7-.3 0-.6.1-.9.2-.3-.1-.6-.2-.9-.2z" />
    {/* Toe 1 (Far left) */}
    <Path d="M6.5 9.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
    {/* Toe 2 (Center left) */}
    <Path d="M10 7.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
    {/* Toe 3 (Center right) */}
    <Path d="M14 7.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
    {/* Toe 4 (Far right) */}
    <Path d="M17.5 9.5c.8 0 1.5-.9 1.5-2s-.7-2-1.5-2-1.5.9-1.5 2 .7 2 1.5 2z" />
  </Svg>
);

// Animated Single Paw Item
const AnimatedPawItem: React.FC<{
  index: number;
  isLeftPaw: boolean;
  totalPaws: number;
}> = ({ index, isLeftPaw }) => {
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    const delay = index * 140; // Sequential stagger 140ms per step
    const duration = 280;

    opacity.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.ease) })),
        withDelay(400, withTiming(0.15, { duration: 350, easing: Easing.in(Easing.ease) }))
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1.1, { duration, easing: Easing.out(Easing.back(1.5)) })),
        withDelay(50, withTiming(1, { duration: 100 })),
        withDelay(400, withTiming(0.75, { duration: 350 }))
      ),
      -1,
      false
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: isLeftPaw ? '-14deg' : '14deg' },
    ] as any,
  }));

  return (
    <Animated.View
      style={[
        styles.pawItem,
        {
          marginTop: isLeftPaw ? 0 : 18,
          marginBottom: isLeftPaw ? 18 : 0,
        },
        animatedStyle,
      ]}
    >
      <VectorPaw size={26} color={COLORS.black} />
    </Animated.View>
  );
};

export const PawLoader: React.FC<PawLoaderProps> = ({
  fullScreen = true,
  message = 'Loading...',
}) => {
  const PAWS_COUNT = 7;
  const pawsArray = Array.from({ length: PAWS_COUNT });

  const containerContent = (
    <View style={styles.centerBox}>
      {/* 7 Paw Prints Walking Trail */}
      <View style={styles.pawTrailRow}>
        {pawsArray.map((_, i) => (
          <AnimatedPawItem
            key={`paw-${i}`}
            index={i}
            isLeftPaw={i % 2 === 0}
            totalPaws={PAWS_COUNT}
          />
        ))}
      </View>

      {/* Brand & Loading Label in Poppins */}
      <Text style={styles.brandTitle}>PAWWS</Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenContainer}>{containerContent}</View>;
  }

  return <View style={styles.inlineContainer}>{containerContent}</View>;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inlineContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawTrailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    marginBottom: 24,
  },
  pawItem: {
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.black,
    letterSpacing: 2,
    marginBottom: 6,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});
