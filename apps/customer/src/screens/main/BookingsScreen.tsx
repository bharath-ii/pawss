// ─────────────────────────────────────────────
// PAWWS — Bookings Screen
// Customer active & past bookings list
// Pure vector icons, Poppins typography, EmptyState
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { AppBar, Badge, Skeleton, Icon, EmptyState } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import type { Booking } from '@pawws/shared';
import {
  BOOKING_STATUS_LABELS,
  formatTime,
  formatCurrency,
} from '@pawws/shared';

type BookingTab = 'upcoming' | 'completed' | 'cancelled';

const TABS: { key: BookingTab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const TAB_STATUSES: Record<BookingTab, string[]> = {
  upcoming: ['pending', 'confirmed', 'on_the_way', 'arrived', 'service_started'],
  completed: ['service_completed'],
  cancelled: ['cancelled', 'rejected', 'no_show'],
};

export const BookingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { firebaseUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings', firebaseUser?.uid, activeTab],
    queryFn: async () => {
      if (!firebaseUser) return [];
      const statuses = TAB_STATUSES[activeTab] || [];
      const q = query(
        collection(db, 'bookings'),
        where('customerId', '==', firebaseUser.uid),
        where('bookingStatus', 'in', statuses),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d: any) => ({ ...d.data(), bookingId: d.id } as Booking));
    },
    enabled: !!firebaseUser,
    staleTime: 30 * 1000,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusBadgeVariant = (
    status: string
  ): 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    if (['service_completed'].includes(status)) return 'success';
    if (['pending'].includes(status)) return 'warning';
    if (['cancelled', 'rejected', 'no_show'].includes(status)) return 'error';
    if (['confirmed', 'on_the_way', 'arrived', 'service_started'].includes(status)) return 'info';
    return 'neutral';
  };

  const renderBookingCard = ({ item, index }: { item: Booking; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookingDetail', { bookingId: item.bookingId })}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Booking for ${item.serviceName}`}
      >
        {/* Top Row */}
        <View style={styles.cardTop}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.bookingIdText}>ID: #{item.bookingId.slice(0, 8).toUpperCase()}</Text>
          </View>
          <Badge
            label={BOOKING_STATUS_LABELS[item.bookingStatus] ?? item.bookingStatus}
            variant={getStatusBadgeVariant(item.bookingStatus)}
            dot
          />
        </View>

        {/* Details with vector icons */}
        <View style={styles.cardMeta}>
          <View style={styles.metaRow}>
            <Icon name="calendar" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaItem}>
              {' '}{item.bookingDate} • {formatTime(item.startTime)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Icon name="location" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaItem}>
              {' '}{item.serviceLocationType === 'home' ? 'Home Service (Live Tracking)' : 'At Provider Location'}
            </Text>
          </View>
        </View>

        {/* Price & Action Row */}
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.amount}>{formatCurrency(item.finalAmount)}</Text>
            <View style={styles.paymentRow}>
              <Icon
                name={item.paymentStatus === 'paid' ? 'check' : 'clock'}
                size={12}
                color={item.paymentStatus === 'paid' ? COLORS.success : COLORS.warning}
              />
              <Text
                style={[
                  styles.paymentStatus,
                  {
                    color: item.paymentStatus === 'paid' ? COLORS.success : COLORS.warning,
                  },
                ]}
              >
                {' '}{item.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRight}>
            {activeTab === 'completed' && !item.reviewId ? (
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => navigation.navigate('WriteReview', { bookingId: item.bookingId })}
              >
                <Icon name="star" size={14} color={COLORS.black} />
                <Text style={styles.reviewBtnText}> Review</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: item.bookingId })}
              >
                <Text style={styles.trackBtnText}>Details</Text>
                <Icon name="chevronRight" size={14} color={COLORS.black} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <AppBar
        title="My Bookings"
        showBack={navigation.canGoBack()}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.cardSkeleton}>
              <Skeleton height={130} borderRadius={RADIUS.lg} />
            </View>
          ))}
        </View>
      ) : bookings && bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item: Booking) => item.bookingId}
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      ) : (
        <EmptyState
          icon="bookings"
          title={`No ${activeTab} Bookings`}
          description={
            activeTab === 'upcoming'
              ? 'You have no scheduled appointments. Book a service for your pet today!'
              : `You have no ${activeTab} appointments in your history.`
          }
          actionLabel={activeTab === 'upcoming' ? 'Browse Pet Services' : undefined}
          onAction={activeTab === 'upcoming' ? () => navigation.navigate('Home') : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.offWhite,
  },
  tabActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    fontFamily: FONTS.semiBold,
    color: COLORS.black,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  skeletonContainer: {
    padding: 16,
  },
  cardSkeleton: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 2,
  },
  bookingIdText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cardMeta: {
    marginBottom: 12,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.black,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  paymentStatus: {
    fontFamily: FONTS.medium,
    fontSize: 11,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  trackBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.black,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  reviewBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.black,
  },
});
