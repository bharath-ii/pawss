// ─────────────────────────────────────────────
// PAWWS — Notification Settings Screen
// Granular notification preferences
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppBar, Card, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

interface NotificationOption {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    id: 'bookings',
    icon: 'calendar',
    title: 'Booking Status Updates',
    description: 'Instant alerts when your service provider confirms, arrives, or completes a booking.',
  },
  {
    id: 'tracking',
    icon: 'location',
    title: 'Provider GPS & Live Tracking',
    description: 'Notifications when your home pet care specialist is on the way to your address.',
  },
  {
    id: 'vaccinations',
    icon: 'shieldCheck',
    title: 'Pet Health & Vaccination Reminders',
    description: 'Timely reminders for upcoming annual booster shots, deworming, and checkups.',
  },
  {
    id: 'messages',
    icon: 'messages',
    title: 'Provider Chat Messages',
    description: 'Direct in-app messages and photo updates from your active groomer, walker, or vet.',
  },
  {
    id: 'promos',
    icon: 'tag',
    title: 'Club Offers & Promotions',
    description: 'Member discounts, weekend grooming flash sales, and seasonal pet health tips.',
  },
];

export const NotificationSettingsScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    bookings: true,
    tracking: true,
    vaccinations: true,
    messages: true,
    promos: false,
  });

  const handleToggle = (id: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: value }));
    Toast.show({
      type: 'success',
      text1: 'Preference Updated',
      visibilityTime: 1500,
    });
  };

  return (
    <View style={styles.screen}>
      <AppBar title="Notification Settings" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerNotice}>
          Manage how and when you receive notifications from PAWWS.
        </Text>

        <Card shadow="sm" padding={0} style={styles.card}>
          {NOTIFICATION_OPTIONS.map((item, index) => {
            const isLast = index === NOTIFICATION_OPTIONS.length - 1;
            const isEnabled = preferences[item.id] ?? true;

            return (
              <View
                key={item.id}
                style={[styles.row, !isLast && styles.rowBorder]}
              >
                <View style={styles.iconWrap}>
                  <Icon name={item.icon} size={20} color={COLORS.black} />
                </View>

                <View style={styles.textWrap}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>

                <Switch
                  value={isEnabled}
                  onValueChange={(val) => handleToggle(item.id, val)}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryDark }}
                  thumbColor={COLORS.white}
                />
              </View>
            );
          })}
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
  },
  headerNotice: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  itemDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
