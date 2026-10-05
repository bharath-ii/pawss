// ─────────────────────────────────────────────
// PAWWS Partner App — Service Management Screen
// Add / Edit / Toggle services
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { usePartnerStore } from '../../store/partnerStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Loading';
import { Icon } from '../../components/ui/Icon';
import { EmptyState } from '../../components/ui/EmptyState';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS, SHADOW } from '../../theme';
import { formatCurrency } from '@pawws/shared';
import type { Service } from '@pawws/shared';
import Toast from 'react-native-toast-message';

export const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { partner } = usePartnerStore();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['partner-services', partner?.partnerId],
    queryFn: async () => {
      if (!partner) return [];
      const q = query(
        collection(db, 'services'),
        where('partnerId', '==', partner.partnerId)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d: any) => ({ ...d.data(), serviceId: d.id } as Service));
    },
    enabled: !!partner,
  });

  // ── Toggle active status
  const toggleService = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      await updateDoc(doc(db, 'services', serviceId), {
        isActive,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-services'] });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to update service' });
    },
  });

  // ── Delete service
  const deleteService = useMutation({
    mutationFn: async (serviceId: string) => {
      await deleteDoc(doc(db, 'services', serviceId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-services'] });
      Toast.show({ type: 'success', text1: 'Service deleted' });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Failed to delete service' });
    },
  });

  const handleDelete = (serviceId: string, name: string) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteService.mutate(serviceId) },
      ]
    );
  };

  const renderServiceCard = ({ item, index }: { item: Service; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(300)}>
      <View style={[styles.serviceCard, !item.isActive && styles.serviceCardInactive]}>
        {/* Top */}
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceCategory}>
              {item.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </Text>
          </View>
          <Switch
            value={item.isActive}
            onValueChange={(val: boolean) => toggleService.mutate({ serviceId: item.serviceId, isActive: val })}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={item.isActive ? COLORS.primary : COLORS.textMuted}
          />
        </View>

        {/* Pricing */}
        <View style={styles.pricing}>
          <View style={styles.priceItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="location" size={14} color={COLORS.textMuted} />
              <Text style={styles.priceLabel}>At Provider</Text>
            </View>
            <Text style={styles.priceValue}>{formatCurrency(item.priceAtProvider)}</Text>
          </View>
          {item.offersHomeService && item.priceAtHome && (
            <View style={styles.priceItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="home" size={14} color={COLORS.textMuted} />
                <Text style={styles.priceLabel}>Home Service</Text>
              </View>
              <Text style={styles.priceValue}>{formatCurrency(item.priceAtHome)}</Text>
            </View>
          )}
          <View style={styles.priceItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="time" size={14} color={COLORS.textMuted} />
              <Text style={styles.priceLabel}>Duration</Text>
            </View>
            <Text style={styles.priceValue}>{item.durationMinutes} min</Text>
          </View>
        </View>

        {/* Supported pets */}
        <View style={styles.petTypes}>
          {item.supportedPetTypes.map((type: string) => (
            <Badge
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              variant="neutral"
            />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditService', { serviceId: item.serviceId })}
          >
            <Icon name="edit" size={16} color={COLORS.textPrimary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.serviceId, item.name)}
          >
            <Icon name="trash" size={16} color={COLORS.error} />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Services</Text>
        <Button
          label="+ Add"
          onPress={() => navigation.navigate('AddService')}
          size="sm"
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{services?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {services?.filter((s: any) => s.isActive).length ?? 0}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: COLORS.textMuted }]}>
            {services?.filter((s: any) => !s.isActive).length ?? 0}
          </Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: SPACING.md }}>
              <Skeleton height={160} borderRadius={RADIUS.lg} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={services ?? []}
          keyExtractor={(item: any) => item.serviceId}
          renderItem={renderServiceCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyStateWrapper}>
              <EmptyState
                icon="pets"
                title="No Services Yet"
                description="Add your first service to start receiving bookings"
              />
              <Button
                label="Add Your First Service"
                onPress={() => navigation.navigate('AddService')}
                style={{ marginTop: SPACING.lg }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.md,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xxl, color: COLORS.black },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xl, color: COLORS.black },
  statLabel: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  list: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 100 },
  skeletonContainer: { padding: SPACING.md },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.sm,
  },
  serviceCardInactive: { opacity: 0.6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  cardInfo: { flex: 1 },
  serviceName: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black },
  serviceCategory: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.primary, marginTop: 2 },
  pricing: { flexDirection: 'row', gap: SPACING.lg, flexWrap: 'wrap', marginBottom: SPACING.sm },
  priceItem: { gap: 4 },
  priceLabel: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  priceValue: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md, color: COLORS.black },
  petTypes: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap', marginBottom: SPACING.md },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: COLORS.offWhite,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textPrimary },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.error },
  emptyStateWrapper: { alignItems: 'center', paddingTop: SPACING.xl },
});
