// ─────────────────────────────────────────────
// PAWWS — Write Review Screen
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/ui/Button';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const WriteReviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Review Submitted ⭐',
        text2: 'Thank you for helping our pet community!',
      });
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Rate Your Experience</Text>
        </View>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Share details about the service, timeliness, and how your pet liked it..."
            placeholderTextColor={COLORS.textMuted}
            value={comment}
            onChangeText={setComment}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Submit Review"
          onPress={handleSubmit}
          loading={isSubmitting}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.xl, paddingTop: SPACING.xxl, paddingBottom: 100 },
  header: { marginBottom: SPACING.xl },
  closeBtn: { marginBottom: SPACING.sm },
  closeText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.md, color: COLORS.black },
  title: { fontFamily: FONTS.extraBold, fontSize: FONT_SIZES.xxl, color: COLORS.black },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginVertical: SPACING.xl },
  star: { fontSize: 44, color: COLORS.border },
  starActive: { color: COLORS.warning },
  inputWrap: { marginTop: SPACING.md },
  label: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.black, marginBottom: SPACING.xs },
  textArea: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.black,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
