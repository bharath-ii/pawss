// ─────────────────────────────────────────────
// PAWWS Partner — Login Mock
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../theme';
import { Button } from '../../components/ui/Button';
import { usePartnerStore } from '../../store/partnerStore';

export const PartnerLoginScreen: React.FC = () => {
  const { setPartner, setAuthenticated } = usePartnerStore();

  const handleLogin = () => {
    // Mock login to bypass auth screen and view the app
    setPartner({
      partnerId: 'partner-123',
      ownerName: 'John Doe',
      businessName: 'Paws & Groom Studio',
      email: 'hello@pawsgroom.com',
      phone: '+91 98765 43210',
      address: { fullAddress: 'Indiranagar, Bangalore' },
      status: 'approved',
      rating: 4.8,
      reviewsCount: 124,
      isVerified: true,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    } as any);
    setAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>🐾</Text>
        </View>
        <Text style={styles.title}>PAWWS Partner</Text>
        <Text style={styles.subtitle}>Manage your pet services, bookings, and earnings easily.</Text>
      </View>

      <View style={styles.footer}>
        <Button
          label="Log In (Demo Mode)"
          onPress={handleLogin}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    width: '100%',
  },
});
