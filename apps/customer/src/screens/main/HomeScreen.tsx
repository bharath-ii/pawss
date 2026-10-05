// ─────────────────────────────────────────────
// PAWWS — Home Screen
// Main discovery screen for customer
// Pure vector icons, Poppins typography, 3-tab layout companion
// ─────────────────────────────────────────────

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
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
import { Card, Rating, Badge, Skeleton, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { SERVICE_CATEGORIES, IconName } from '@pawws/shared';
import type { Partner, Service } from '@pawws/shared';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useAuthStore();
  const firstName = profile?.displayName?.split(' ')[0] ?? 'there';
  const insets = useSafeAreaInsets();

  // ── Fetch featured partners ──
  const { data: featuredPartners, isLoading: partnersLoading, refetch } = useQuery({
    queryKey: ['featured-partners'],
    queryFn: async () => {
      const q = query(
        collection(db, 'partners'),
        where('status', '==', 'approved'),
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        limit(8)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Partner & { id: string }));
    },
    staleTime: 5 * 60 * 1000,
  });

  // ── Fetch popular services ──
  const { data: popularServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['popular-services'],
    queryFn: async () => {
      const q = query(
        collection(db, 'services'),
        where('isActive', '==', true),
        limit(10)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Service & { id: string }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* ── Top Header ── */}
      <Animated.View entering={FadeInDown.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          <View style={styles.locationRow}>
            <Icon name="location" size={14} color={COLORS.black} />
            <Text style={styles.locationText} numberOfLines={1}>
              {profile?.savedAddresses?.[0]?.fullAddress
                ? profile.savedAddresses[0].fullAddress.split(',')[0]
                : 'Bengaluru, India'}
            </Text>
          </View>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <Text style={styles.headerSub}>Find verified care for your pet</Text>
        </View>

        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Icon name="bell" size={20} color={COLORS.black} strokeWidth={2} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Quick Bookings Banner ── */}
      <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.bannerContainer}>
        <TouchableOpacity
          style={styles.bookingsBanner}
          onPress={() => navigation.navigate('Bookings')}
          activeOpacity={0.85}
        >
          <View style={styles.bannerIconBox}>
            <Icon name="bookings" size={20} color={COLORS.black} />
          </View>
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>My Bookings & Schedule</Text>
            <Text style={styles.bannerSubtitle}>View active care visits, appointments & history</Text>
          </View>
          <Icon name="chevronRight" size={18} color={COLORS.black} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Search Bar ── */}
      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.85}
        >
          <Icon name="search" size={18} color={COLORS.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search groomers, vets, dog walkers...</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Categories ── */}
      <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={SERVICE_CATEGORIES.slice(0, 8)}
          keyExtractor={(item: any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item, index }: { item: any; index: number }) => (
            <Animated.View entering={FadeInRight.delay(index * 50).duration(300)}>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Explore', { category: item.id })}
                activeOpacity={0.8}
              >
                <View style={styles.categoryIconBg}>
                  <Icon
                    name={getCategoryIconName(item.id)}
                    size={22}
                    color={COLORS.black}
                  />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      </Animated.View>

      {/* ── Top Verified Providers ── */}
      <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Providers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {partnersLoading ? (
          <FlatList
            data={[1, 2, 3]}
            keyExtractor={(i: number) => String(i)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providerList}
            renderItem={() => (
              <View style={styles.providerCardSkeleton}>
                <Skeleton height={110} borderRadius={RADIUS.lg} />
                <Skeleton height={14} width="70%" style={{ marginTop: 8 }} />
                <Skeleton height={12} width="50%" style={{ marginTop: 4 }} />
              </View>
            )}
          />
        ) : (
          <FlatList
            data={featuredPartners ?? []}
            keyExtractor={(item: any) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providerList}
            renderItem={({ item, index }: { item: any; index: number }) => (
              <Animated.View entering={FadeInRight.delay(index * 70).duration(300)}>
                <TouchableOpacity
                  style={styles.providerCard}
                  onPress={() => navigation.navigate('PartnerProfile', { partnerId: item.id })}
                  activeOpacity={0.9}
                >
                  <View style={styles.providerImagePlaceholder}>
                    {item.logoURL ? (
                      <Image source={{ uri: item.logoURL }} style={styles.providerImg} />
                    ) : (
                      <Icon name="building" size={32} color={COLORS.textMuted} />
                    )}
                  </View>

                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName} numberOfLines={1}>
                      {item.businessName}
                    </Text>
                    <Text style={styles.providerType} numberOfLines={1}>
                      {formatBusinessType(item.businessType)}
                    </Text>
                    <View style={styles.providerMeta}>
                      <Rating rating={item.rating} totalReviews={item.totalReviews} />
                    </View>
                    {item.offersHomeService ? (
                      <Badge label="Home Service" variant="primary" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No verified providers found in this area yet.</Text>
            )}
          />
        )}
      </Animated.View>

      {/* ── Popular Services ── */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(400)}
        style={[styles.section, styles.lastSection]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
        </View>

        {servicesLoading ? (
          [1, 2, 3].map((i) => (
            <View key={i} style={styles.serviceCardSkeleton}>
              <Skeleton height={68} borderRadius={RADIUS.md} />
            </View>
          ))
        ) : (
          popularServices?.map((service: any, index: number) => (
            <Animated.View key={service.id} entering={FadeInDown.delay(index * 50).duration(300)}>
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
                activeOpacity={0.85}
              >
                <View style={styles.serviceCardLeft}>
                  <View style={styles.serviceIconCircle}>
                    <Icon name={getCategoryIconName(service.category)} size={20} color={COLORS.black} />
                  </View>
                  <View style={styles.serviceTextWrap}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.durationRow}>
                      <Icon name="clock" size={12} color={COLORS.textMuted} />
                      <Text style={styles.serviceDuration}> {service.durationMinutes} min</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.serviceCardRight}>
                  <Text style={styles.servicePrice}>₹{service.priceAtProvider}</Text>
                  <Text style={styles.servicePriceLabel}>at provider</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
};

function formatBusinessType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function getCategoryIconName(category: string): IconName {
  const map: Record<string, IconName> = {
    grooming: 'pets',
    hair_spa: 'heart',
    bath: 'heart',
    haircut: 'pets',
    nail_trimming: 'pets',
    veterinary: 'shieldCheck',
    vaccination: 'shieldCheck',
    pet_training: 'star',
    dog_walking: 'location',
    pet_sitting: 'home',
    pet_boarding: 'home',
    pet_taxi: 'location',
    pet_photography: 'camera',
  };
  return map[category] || 'pets';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.black,
  },
  greeting: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.black,
    letterSpacing: 0.2,
  },
  headerSub: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryDark,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
  },
  bookingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  bannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerTextBox: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.black,
  },
  bannerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchPlaceholder: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  lastSection: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.black,
  },
  seeAll: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.primaryDark,
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  categoryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  categoryLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.black,
    textAlign: 'center',
  },
  providerList: {
    paddingRight: 20,
  },
  providerCard: {
    width: 190,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginRight: 14,
  },
  providerCardSkeleton: {
    width: 190,
    marginRight: 14,
  },
  providerImagePlaceholder: {
    height: 100,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerImg: {
    width: '100%',
    height: '100%',
  },
  providerInfo: {
    padding: 12,
  },
  providerName: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  providerType: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  providerMeta: {
    marginBottom: 8,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceCardSkeleton: {
    marginBottom: 10,
  },
  serviceCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceTextWrap: {
    flex: 1,
  },
  serviceName: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDuration: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  serviceCardRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  servicePrice: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.black,
  },
  servicePriceLabel: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    paddingVertical: 12,
  },
});
