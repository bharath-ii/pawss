// ─────────────────────────────────────────────
// PAWWS — Saved Addresses Screen
// Manage delivery and service locations
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppBar, Card, EmptyState, Icon, Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, RADIUS } from '../../theme';
import type { Address } from '@pawws/shared';

export const SavedAddressesScreen: React.FC = () => {
  const { profile } = useAuthStore();
  const addresses: Address[] = profile?.savedAddresses || [];

  return (
    <View style={styles.screen}>
      <AppBar title="Saved Addresses" />

      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => (
            <Card shadow="sm" padding={16} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Icon name="location" size={20} color={COLORS.black} />
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.titleRow}>
                    <Text style={styles.label}>{item.customLabel || item.label.toUpperCase()}</Text>
                    {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>Default</Text></View>}
                  </View>
                  <Text style={styles.addressText}>{item.fullAddress}</Text>
                  {item.flatNo ? <Text style={styles.subText}>Flat/Door: {item.flatNo}</Text> : null}
                </View>
              </View>
            </Card>
          )}
        />
      ) : (
        <EmptyState
          icon="location"
          title="No Saved Addresses"
          description="Save your home and office locations to quickly book home pet grooming, walking, and sitting services."
          actionLabel="Add New Address"
          onAction={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: RADIUS.lg,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  defaultText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.black,
  },
  addressText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  subText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
