// ─────────────────────────────────────────────
// PAWWS — Contact & Support Screen
// Helpdesk, WhatsApp chat, email and operating hours
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { AppBar, Card, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { LEGAL_CONTENT } from '@pawws/shared';

export const ContactSupportScreen: React.FC = () => {
  const handleEmail = () => {
    Linking.openURL(`mailto:${LEGAL_CONTENT.SUPPORT_EMAIL}?subject=PAWWS Support Request`).catch(() => {
      Alert.alert('Contact Error', `Please email us at ${LEGAL_CONTENT.SUPPORT_EMAIL}`);
    });
  };

  const handleWhatsApp = () => {
    const cleanNumber = LEGAL_CONTENT.SUPPORT_WHATSAPP.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${cleanNumber}&text=Hello PAWWS Support team, I need assistance with my pet booking.`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${cleanNumber}`).catch(() => {
        Alert.alert('WhatsApp Error', 'Could not open WhatsApp on this device.');
      });
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${LEGAL_CONTENT.SUPPORT_PHONE}`).catch(() => {
      Alert.alert('Call Error', `Please call us at ${LEGAL_CONTENT.SUPPORT_PHONE}`);
    });
  };

  return (
    <View style={styles.screen}>
      <AppBar title="Contact & Support" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>
          We are here to ensure you and your pet have a seamless experience. Reach out anytime.
        </Text>

        {/* Support Channels */}
        <Card shadow="sm" padding={0} style={styles.menuCard}>
          <TouchableOpacity style={styles.row} onPress={handleWhatsApp} activeOpacity={0.7}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="messages" size={20} color="#15803D" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Chat on WhatsApp</Text>
              <Text style={styles.rowDesc}>Fastest response within 5 minutes</Text>
            </View>
            <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={handleEmail} activeOpacity={0.7}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="mail" size={20} color="#4338CA" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Email Customer Care</Text>
              <Text style={styles.rowDesc}>{LEGAL_CONTENT.SUPPORT_EMAIL}</Text>
            </View>
            <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={handleCall} activeOpacity={0.7}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="phone" size={20} color="#B45309" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Call Us Directly</Text>
              <Text style={styles.rowDesc}>{LEGAL_CONTENT.SUPPORT_PHONE}</Text>
            </View>
            <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Operating Hours */}
        <Card shadow="sm" padding={18} style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Icon name="clock" size={20} color={COLORS.black} />
            <Text style={styles.cardHeaderTitle}>Support Operating Hours</Text>
          </View>
          <Text style={styles.infoText}>
            Monday – Sunday: 8:00 AM – 10:00 PM IST{'\n'}
            For emergency vet consultations, partners provide 24/7 tele-triage.
          </Text>
        </Card>

        {/* Address */}
        <Card shadow="sm" padding={18} style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Icon name="building" size={20} color={COLORS.black} />
            <Text style={styles.cardHeaderTitle}>Corporate Office</Text>
          </View>
          <Text style={styles.infoText}>
            PAWWS Pet Marketplace Technologies Pvt. Ltd.{'\n'}
            Indiranagar, 100ft Road, Bengaluru, Karnataka 560038, India
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 70,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  rowDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  infoCard: {
    borderRadius: RADIUS.lg,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardHeaderTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
