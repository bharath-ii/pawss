// ─────────────────────────────────────────────
// PAWWS Partner App — Dashboard Screen
// Today's overview for partners
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { usePartnerStore } from '../../store/partnerStore';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/ui/Icon';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS, SHADOW } from '../../theme';
import { formatTime, formatCurrency } from '@pawws/shared';
import type { Booking, IconName } from '@pawws/shared';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { partner } = usePartnerStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const insets = useSafeAreaInsets();

  // ── Today's date
  const todayKey = new Date().toISOString().split('T')[0];

  // ── Fetch today's bookings
  const { data: todayBookings, isLoading, refetch } = useQuery({
    queryKey: ['today-bookings', partner?.partnerId],
    queryFn: async () => {
      if (!partner) return [];
      const q = query(
        collection(db, 'bookings'),
        where('partnerId', '==', partner.partnerId),
        where('bookingDate', '==', todayKey),
        orderBy('startTime', 'asc'),
        limit(20)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d: any) => ({ ...d.data(), bookingId: d.id } as Booking));
    },
    enabled: !!partner,
    staleTime: 30 * 1000,
  });

  // ── Pending requests
  const pendingBookings = todayBookings?.filter((b: any) => b.bookingStatus === 'pending') ?? [];
  const confirmedBookings = todayBookings?.filter((b: any) => b.bookingStatus === 'confirmed') ?? [];
  const completedBookings = todayBookings?.filter((b: any) => b.bookingStatus === 'service_completed') ?? [];
  const todayRevenue = completedBookings.reduce((sum: number, b: any) => sum + (b.finalAmount || 0), 0);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const StatCard = ({ icon, value, label, color }: { icon: IconName; value: string; label: string; color: string }) => (
    <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
      <Icon name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ── Header ── */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View>
          <Text style={styles.headerGreeting}>
            Good {getGreeting()}, {partner?.ownerName?.split(' ')[0] ?? 'Partner'}!
          </Text>
          <Text style={styles.businessName}>{partner?.businessName ?? 'Your Business'}</Text>
          {partner?.status === 'approved' ? (
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Live & Active</Text>
            </View>
          ) : (
            <View style={styles.statusBadge}>
              <Icon name="time" size={14} color={COLORS.warning} />
              <Text style={[styles.statusText, { color: COLORS.warning, marginLeft: 2 }]}>
                Awaiting Approval
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Stats Grid ── */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsGrid}>
        <StatCard icon="calendar" value={String(todayBookings?.length ?? 0)} label="Today" color="#3B82F6" />
        <StatCard icon="time" value={String(pendingBookings.length)} label="Pending" color="#F59E0B" />
        <StatCard icon="check-circle" value={String(completedBookings.length)} label="Done" color="#10B981" />
        <StatCard icon="wallet" value={`₹${todayRevenue}`} label="Revenue" color="#E91E8C" />
      </Animated.View>

      {/* ── Pending Requests ── */}
      {pendingBookings.length > 0 && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="flash" size={20} color={COLORS.warning} />
              <Text style={styles.sectionTitle}>Pending Requests</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingBookings.length}</Text>
            </View>
          </View>

          {pendingBookings.map((booking: any, index: number) => (
            <Animated.View key={booking.bookingId} entering={FadeInDown.delay(index * 80).duration(300)}>
              <TouchableOpacity
                style={styles.requestCard}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.bookingId })}
                activeOpacity={0.85}
              >
                <View style={styles.requestLeft}>
                  <Text style={styles.requestService}>{booking.serviceName}</Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="time" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.requestTime}>{formatTime(booking.startTime)}</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="location" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.requestType}>
                      {booking.serviceLocationType === 'home' ? 'Home Service' : 'At Your Location'}
                    </Text>
                  </View>
                </View>
                <View style={styles.requestRight}>
                  <Text style={styles.requestAmount}>{formatCurrency(booking.finalAmount)}</Text>
                  <View style={styles.requestActions}>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <Text style={styles.acceptBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rejectBtn}>
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* ── Upcoming Today ── */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={20} color={COLORS.black} />
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          [1, 2].map((i) => (
            <View key={i} style={{ marginBottom: SPACING.sm }}>
              <Skeleton height={80} borderRadius={RADIUS.lg} />
            </View>
          ))
        ) : confirmedBookings.length === 0 && completedBookings.length === 0 ? (
          <EmptyState
            icon="star"
            title="Free Day!"
            description="You don't have any more appointments scheduled for today."
          />
        ) : (
          [...confirmedBookings, ...completedBookings].map((booking, index) => (
            <Animated.View key={booking.bookingId} entering={FadeInRight.delay(index * 80)}>
              <TouchableOpacity
                style={styles.scheduleCard}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.bookingId })}
                activeOpacity={0.85}
              >
                <View style={styles.scheduleTime}>
                  <Text style={styles.scheduleTimeText}>{formatTime(booking.startTime)}</Text>
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleService}>{booking.serviceName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name={booking.serviceLocationType === 'home' ? 'home' : 'location'} size={12} color={COLORS.textSecondary} />
                    <Text style={styles.scheduleLocation}>
                      {booking.serviceLocationType === 'home' ? 'Home' : 'At Store'}
                    </Text>
                  </View>
                </View>
                <View style={styles.scheduleRight}>
                  <Text style={styles.scheduleAmount}>{formatCurrency(booking.finalAmount)}</Text>
                  <Badge
                    label={booking.bookingStatus === 'service_completed' ? 'Done' : 'Confirmed'}
                    variant={booking.bookingStatus === 'service_completed' ? 'success' : 'info'}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.xxxl,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
  },
  headerGreeting: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 4 },
  businessName: { fontFamily: FONTS.extraBold, fontSize: FONT_SIZES.xxl, color: COLORS.black, marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, marginRight: 6 },
  statusText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.xs, color: COLORS.success },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.xl,
    marginTop: -SPACING.xl,
    justifyContent: 'space-between',
    rowGap: SPACING.sm,
  },
  statCard: {
    width: '48%',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    ...SHADOW.sm,
  },
  statValue: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg },
  statLabel: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  section: { marginTop: SPACING.lg, paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black },
  pendingBadge: { backgroundColor: COLORS.error, borderRadius: RADIUS.full, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  pendingBadgeText: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.xs, color: COLORS.white },
  seeAll: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primary },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  requestLeft: { flex: 1, gap: 4 },
  requestService: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md, color: COLORS.black },
  requestTime: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  requestType: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  requestRight: { alignItems: 'flex-end', gap: SPACING.sm },
  requestAmount: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.lg, color: COLORS.black },
  requestActions: { flexDirection: 'row', gap: SPACING.xs },
  acceptBtn: { backgroundColor: COLORS.success + '22', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  acceptBtnText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs, color: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.error + '22', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  rejectBtnText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.xs, color: COLORS.error },
  scheduleCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  scheduleTime: { backgroundColor: COLORS.primaryAlpha, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.md, minWidth: 60, alignItems: 'center' },
  scheduleTimeText: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primaryDark },
  scheduleInfo: { flex: 1, gap: 4 },
  scheduleService: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.md, color: COLORS.black },
  scheduleLocation: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  scheduleRight: { alignItems: 'flex-end', gap: 6 },
  scheduleAmount: { fontFamily: FONTS.bold, fontSize: FONT_SIZES.md, color: COLORS.black },
});
