// ─────────────────────────────────────────────
// PAWWS — About Screen
// App version, mission, attribution and credits
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { AppBar, Card, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { LEGAL_CONTENT } from '@pawws/shared';

export const AboutScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <AppBar title="About PAWWS" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Hero */}
        <View style={styles.brandHero}>
          <View style={styles.logoBadge}>
            <Icon name="pets" size={38} color={COLORS.black} />
          </View>
          <Text style={styles.brandName}>PAWWS</Text>
          <Text style={styles.brandTagline}>India's Premium Pet Care Marketplace</Text>
          <Text style={styles.versionBadge}>Version {LEGAL_CONTENT.VERSION} (Build 2026)</Text>
        </View>

        {/* Mission Card */}
        <Card shadow="sm" padding={18} style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardBody}>
            PAWWS was founded to empower pet parents with effortless access to trusted, top-tier pet care professionals — from certified grooming spas and veterinary care to experienced daily dog walkers and safe pet boarding. We treat every pet like family.
          </Text>
        </Card>

        {/* Platform Pillars */}
        <Card shadow="sm" padding={18} style={styles.card}>
          <Text style={styles.cardTitle}>Why Pet Parents Trust Us</Text>

          <View style={styles.pillarRow}>
            <Icon name="shieldCheck" size={20} color={COLORS.black} />
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>100% Verified Partners</Text>
              <Text style={styles.pillarDesc}>KYC verified, background-checked and credential-reviewed professionals.</Text>
            </View>
          </View>

          <View style={styles.pillarRow}>
            <Icon name="location" size={20} color={COLORS.black} />
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>Live GPS Service Tracking</Text>
              <Text style={styles.pillarDesc}>Real-time navigation updates powered by Google Maps Platform.</Text>
            </View>
          </View>

          <View style={styles.pillarRow}>
            <Icon name="creditCard" size={20} color={COLORS.black} />
            <View style={styles.pillarContent}>
              <Text style={styles.pillarTitle}>PCI-DSS Secure Payments</Text>
              <Text style={styles.pillarDesc}>Encrypted UPI, Cards, NetBanking, and Instant Refunds via Razorpay.</Text>
            </View>
          </View>
        </Card>

        {/* Google Maps Attribution */}
        <View style={styles.attributionCard}>
          <Text style={styles.attributionTitle}>Third-Party Attributions</Text>
          <Text style={styles.attributionBody}>
            {LEGAL_CONTENT.GOOGLE_MAPS_ATTRIBUTION}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © 2026 {LEGAL_CONTENT.COMPANY_NAME}{'\n'}
            Made with ❤️ for pets across India
          </Text>
        </View>
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
  brandHero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  brandName: {
    fontFamily: FONTS.extraBold,
    fontSize: 28,
    color: COLORS.black,
    letterSpacing: 2,
    marginBottom: 4,
  },
  brandTagline: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  versionBadge: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card: {
    marginBottom: 14,
    borderRadius: RADIUS.lg,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 10,
  },
  cardBody: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 12,
  },
  pillarContent: {
    flex: 1,
  },
  pillarTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 2,
  },
  pillarDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  attributionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 16,
  },
  attributionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.black,
    marginBottom: 4,
  },
  attributionBody: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  copyrightText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
