// ─────────────────────────────────────────────
// PAWWS — Welcome / Onboarding Screen
// Beautiful first impression
// ─────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'pets' as const,
    title: 'Find Pet Services\nNear You',
    description: 'Discover trusted groomers, vets, trainers & more — all in one place.',
    bg: ['#FFF0F3', '#FFD6DE'] as [string, string],
  },
  {
    id: '2',
    icon: 'bookings' as const,
    title: 'Book in\nSeconds',
    description: 'Choose home service or visit the provider. Simple, fast booking.',
    bg: ['#F0FFF4', '#D1FAE5'] as [string, string],
  },
  {
    id: '3',
    icon: 'shieldCheck' as const,
    title: 'Your Pet\nDeserves the Best',
    description: 'Verified providers, real reviews, and seamless payments.',
    bg: ['#FFF8F0', '#FFE4CC'] as [string, string],
  },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / W);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.bg}
            style={styles.slide}
          >
            <View style={styles.iconCircle}>
              <Icon name={item.icon} size={42} color={COLORS.primaryDark} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.description}</Text>
          </LinearGradient>
        )}
      />

      {/* Bottom Panel */}
      <View style={styles.bottom}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandName}>PAWWS</Text>
          <Text style={styles.brandTag}>Pet Services Marketplace</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Actions */}
        <Button
          label={activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
          fullWidth
          style={styles.ctaButton}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  slide: {
    width: W,
    height: H * 0.62,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  slideTitle: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: SPACING.md,
  },
  slideDesc: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  bottom: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -RADIUS.xxl,
    alignItems: 'center',
  },
  brand: { alignItems: 'center', marginBottom: SPACING.lg },
  brandName: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black,
    letterSpacing: 4,
  },
  brandTag: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: SPACING.lg },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  ctaButton: { marginBottom: SPACING.md },
  skipBtn: { padding: SPACING.sm },
  skipText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});
