// ─────────────────────────────────────────────
// PAWWS — Rating Stars Component
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../theme';

interface RatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  totalReviews,
  size = 'sm',
  showCount = true,
}: RatingProps) => {
  const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const fontSize = size === 'sm' ? FONT_SIZES.xs : size === 'md' ? FONT_SIZES.sm : FONT_SIZES.md;

  return (
    <View style={styles.container}>
      <Text style={[styles.star, { fontSize: starSize }]}>★</Text>
      <Text style={[styles.rating, { fontSize }]}>{rating.toFixed(1)}</Text>
      {showCount && totalReviews !== undefined && (
        <Text style={[styles.count, { fontSize: fontSize - 1 }]}>
          ({totalReviews.toLocaleString()})
        </Text>
      )}
    </View>
  );
};

// ─── INTERACTIVE STAR RATING ─────────────────
interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 32,
  readonly = false,
}: StarRatingProps) => (
  <View style={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => !readonly && onChange?.(star)}
        disabled={readonly}
        activeOpacity={readonly ? 1 : 0.7}
      >
        <Text style={[{ fontSize: size }, star <= value ? styles.starFilled : styles.starEmpty]}>
          ★
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  star: { color: '#F59E0B' },
  rating: { fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  count: { fontFamily: FONTS.regular, color: COLORS.textMuted },
  stars: { flexDirection: 'row', gap: 4 },
  starFilled: { color: '#F59E0B' },
  starEmpty: { color: COLORS.border },
});
