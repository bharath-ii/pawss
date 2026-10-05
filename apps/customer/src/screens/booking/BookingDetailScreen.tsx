// ─────────────────────────────────────────────
// PAWWS — Booking Detail Screen
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const BookingDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId } = route.params || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Bookings</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Booking #{bookingId || 'BK-1082'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Details</Text>
          <Text style={styles.cardName}>Full Pet Grooming & Spa</Text>
          <View style={styles.infoRow}>
            <Icon name="clock" size={14} color={COLORS.textMuted} />
            <Text style={styles.cardInfo}> Tomorrow, 2:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="home" size={14} color={COLORS.textMuted} />
            <Text style={styles.cardInfo}> Service at Home</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assigned Partner</Text>
          <Text style={styles.cardName}>Paws & Groom Studio</Text>
          <View style={styles.infoRow}>
            <Icon name="location" size={14} color={COLORS.textMuted} />
            <Text style={styles.cardInfo}> Contact via in-app chat</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Leave a Review"
          variant="outline"
          onPress={() =>
            navigation.navigate('WriteReview', { bookingId: bookingId || 'BK-1082' })
          }
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
  backBtn: { marginBottom: SPACING.md },
  backText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.md, color: COLORS.black },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: FONTS.extraBold, fontSize: FONT_SIZES.xl, color: COLORS.black },
  statusBadge: {
    backgroundColor: COLORS.statusConfirmed,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xs, color: COLORS.white },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: 4 },
  cardName: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black, marginBottom: SPACING.sm },
  cardInfo: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
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
