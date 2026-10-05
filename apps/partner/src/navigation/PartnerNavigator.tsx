// ─────────────────────────────────────────────
// PAWWS Partner — Navigation
// 3-Button Bottom Tab (Dashboard | Services | Profile) + Full Stack
// Vector icons, Poppins typography, PawLoader
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ServicesScreen } from '../screens/services/ServicesScreen';
import { usePartnerStore } from '../store/partnerStore';
import { Icon, PawLoader } from '../components/ui';
import { COLORS, FONTS, RADIUS } from '../theme';
import { IconName } from '@pawws/shared';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── 3-BUTTON PARTNER TAB BAR ────────────────
const PARTNER_TABS: Record<string, { label: string; icon: IconName }> = {
  Dashboard: { label: 'Dashboard', icon: 'home' },
  Services: { label: 'Services', icon: 'pets' },
  Profile: { label: 'Profile', icon: 'profile' },
};

function PartnerBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = PARTNER_TABS[route.name] || { label: route.name, icon: 'home' as IconName };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const activeColor = COLORS.black;
          const inactiveColor = COLORS.textMuted;
          const currentColor = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || config.label}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Icon
                  name={config.icon}
                  size={22}
                  color={currentColor}
                  strokeWidth={isFocused ? 2.2 : 1.8}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: currentColor, fontFamily: isFocused ? FONTS.semiBold : FONTS.regular },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── 3-BUTTON BOTTOM TABS ────────────────────
function PartnerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <PartnerBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen
        name="Profile"
        getComponent={() => require('../screens/profile/PartnerProfileScreen').PartnerProfileScreen}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PartnerLogin"
        getComponent={() => require('../screens/auth/PartnerLoginScreen').PartnerLoginScreen}
      />
      <Stack.Screen
        name="PartnerSignup"
        getComponent={() => require('../screens/auth/PartnerSignupScreen').PartnerSignupScreen}
      />
      <Stack.Screen
        name="Onboarding"
        getComponent={() => require('../screens/auth/OnboardingScreen').OnboardingScreen}
      />
    </Stack.Navigator>
  );
}

export function PartnerNavigator() {
  const { isAuthenticated, partner, isLoading } = usePartnerStore();

  if (isLoading) {
    return <PawLoader fullScreen message="Loading PAWWS Partner..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={PartnerTabs} />

            {/* Core Destinations outside 3 tabs */}
            <Stack.Screen
              name="Bookings"
              getComponent={() => require('../screens/bookings/PartnerBookingsScreen').PartnerBookingsScreen}
            />
            <Stack.Screen
              name="Calendar"
              getComponent={() => require('../screens/calendar/CalendarScreen').CalendarScreen}
            />
            <Stack.Screen
              name="AddService"
              getComponent={() => require('../screens/services/AddServiceScreen').AddServiceScreen}
            />
            <Stack.Screen
              name="ServiceDetails"
              getComponent={() => require('../screens/services/ServiceDetailsScreen').ServiceDetailsScreen}
            />
            <Stack.Screen
              name="BookingDetail"
              getComponent={() => require('../screens/bookings/PartnerBookingDetailScreen').PartnerBookingDetailScreen}
            />
            <Stack.Screen
              name="Earnings"
              getComponent={() => require('../screens/earnings/EarningsScreen').EarningsScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
    marginTop: 1,
  },
});
