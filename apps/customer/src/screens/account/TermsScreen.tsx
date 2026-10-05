// ─────────────────────────────────────────────
// PAWWS — Terms & Conditions Screen
// Marketplace platform agreements and policies
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppBar, Card, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { LEGAL_CONTENT } from '@pawws/shared';

export const TermsScreen: React.FC = () => {
  const terms = LEGAL_CONTENT.TERMS_OF_SERVICE;

  return (
    <View style={styles.screen}>
      <AppBar title="Terms & Conditions" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBox}>
          <Text style={styles.termsTitle}>{terms.title}</Text>
          <Text style={styles.lastUpdated}>Last Updated: {terms.lastUpdated}</Text>
        </View>

        {/* Google Maps Attribution Notice */}
        <View style={styles.attributionCard}>
          <View style={styles.attributionHeader}>
            <Icon name="location" size={18} color={COLORS.black} />
            <Text style={styles.attributionTitle}>Google Maps Platform Terms</Text>
          </View>
          <Text style={styles.attributionText}>
            {LEGAL_CONTENT.GOOGLE_MAPS_ATTRIBUTION}
          </Text>
        </View>

        {/* Terms Sections */}
        {terms.sections.map((section, idx) => (
          <Card key={idx} shadow="sm" padding={16} style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionBody}>{section.content}</Text>
          </Card>
        ))}

        <View style={styles.footerBox}>
          <Text style={styles.footerText}>
            © 2026 PAWWS Pet Marketplace Technologies Pvt. Ltd. All rights reserved.
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
  headerBox: {
    marginBottom: 16,
  },
  termsTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.black,
    marginBottom: 4,
  },
  lastUpdated: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  attributionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    marginBottom: 16,
  },
  attributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  attributionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: '#1E40AF',
  },
  attributionText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  sectionCard: {
    marginBottom: 14,
    borderRadius: RADIUS.lg,
  },
  sectionHeading: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  footerBox: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
