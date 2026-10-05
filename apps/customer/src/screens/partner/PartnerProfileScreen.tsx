// ─────────────────────────────────────────────
// PAWWS — Partner Profile Screen
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

export const PartnerProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { partnerId } = route.params || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🏪</Text>
          </View>
          <Text style={styles.name}>PAWWS Verified Partner</Text>
          <Text style={styles.category}>Pet Care & Grooming Center</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>⭐ 4.9</Text>
            <Text style={styles.reviews}>(128 reviews)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.desc}>
            Dedicated pet service provider with over 5 years of certified experience in grooming, boarding, and veterinary assistance.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate('ServiceDetail', { serviceId: 'groom-full' })
            }
          >
            <View>
              <Text style={styles.serviceName}>Full Body Grooming</Text>
              <Text style={styles.serviceSub}>Bath, nail trim, haircut & styling</Text>
            </View>
            <Text style={styles.servicePrice}>₹999</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Book Appointment"
          onPress={() =>
            navigation.navigate('BookingFlow', {
              serviceId: 'groom-full',
              partnerId: partnerId || 'partner-1',
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
  profileHeader: { alignItems: 'center', marginBottom: SPACING.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarEmoji: { fontSize: 40 },
  name: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl, color: COLORS.black, marginBottom: 4 },
  category: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  star: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.warning },
  reviews: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black, marginBottom: SPACING.sm },
  desc: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 22 },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceName: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md, color: COLORS.black },
  serviceSub: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  servicePrice: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black },
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
