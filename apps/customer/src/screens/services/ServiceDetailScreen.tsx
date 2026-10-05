// ─────────────────────────────────────────────
// PAWWS — Service Detail Screen
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
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const ServiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { serviceId } = route.params || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>✂️</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Full Spa & Grooming Package</Text>
          <Text style={styles.price}>₹999 <Text style={styles.duration}>/ 60 mins</Text></Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.includedList}>
            {['Organic shampoo bath', 'Nail clipping & filing', 'Ear cleaning & hair removal', 'Blow dry & full coat brush', 'Teeth brushing & freshener'].map((item, idx) => (
              <View key={idx} style={styles.includedRow}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Proceed to Booking"
          onPress={() =>
            navigation.navigate('BookingFlow', {
              serviceId: serviceId || 'groom-full',
              partnerId: 'partner-default',
            })
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
  heroBanner: {
    height: 160,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  heroEmoji: { fontSize: 64 },
  header: { marginBottom: SPACING.xl },
  title: { fontFamily: FONTS.extraBold, fontSize: FONT_SIZES.xxl, color: COLORS.black, marginBottom: 6 },
  price: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xxl, color: COLORS.black },
  duration: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black, marginBottom: SPACING.md },
  includedList: { gap: SPACING.sm },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  check: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.md, color: COLORS.success },
  includedText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
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
