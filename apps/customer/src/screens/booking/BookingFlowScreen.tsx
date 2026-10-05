// ─────────────────────────────────────────────
// PAWWS — Booking Flow Screen
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const BookingFlowScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { serviceId, partnerId } = route.params || {};

  const [serviceType, setServiceType] = useState<'home' | 'center'>('home');
  const [selectedDate, setSelectedDate] = useState('Today, 2:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Booking Confirmed!',
        text2: 'The provider has received your appointment request.',
      });
      navigation.navigate('Bookings');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Icon name="chevronLeft" size={18} color={COLORS.black} />
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Confirm Booking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service Mode</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, serviceType === 'home' && styles.toggleBtnActive]}
              onPress={() => setServiceType('home')}
            >
              <Icon name="home" size={20} color={serviceType === 'home' ? COLORS.primaryDark : COLORS.textMuted} />
              <Text style={[styles.toggleText, serviceType === 'home' && styles.toggleTextActive]}>
                At Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, serviceType === 'center' && styles.toggleBtnActive]}
              onPress={() => setServiceType('center')}
            >
              <Icon name="building" size={20} color={serviceType === 'center' ? COLORS.primaryDark : COLORS.textMuted} />
              <Text style={[styles.toggleText, serviceType === 'center' && styles.toggleTextActive]}>
                At Clinic / Center
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Slot</Text>
          <View style={styles.slotCard}>
            <Icon name="clock" size={16} color={COLORS.textMuted} />
            <Text style={styles.slotText}> {selectedDate}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Cost</Text>
            <Text style={styles.summaryVal}>₹999</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & Fees</Text>
            <Text style={styles.summaryVal}>₹49</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹1,048</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Confirm & Pay"
          onPress={handleConfirmBooking}
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
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.md, color: COLORS.black, marginBottom: SPACING.sm },
  toggleRow: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
  },
  toggleBtnActive: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
  },
  toggleEmoji: { fontSize: 24, marginBottom: 4 },
  toggleText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.black },
  toggleTextActive: { fontFamily: FONTS.bold, color: COLORS.black },
  slotCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  slotText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md, color: COLORS.black },
  summaryCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.xl,
    marginTop: SPACING.sm,
  },
  summaryTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.md, color: COLORS.black, marginBottom: SPACING.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  summaryLabel: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  summaryVal: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.black },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm, marginTop: SPACING.sm },
  totalLabel: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.md, color: COLORS.black },
  totalVal: { fontFamily: FONTS.extraBold, fontSize: FONT_SIZES.lg, color: COLORS.black },
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
