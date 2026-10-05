// ─────────────────────────────────────────────
// PAWWS — Navigation
// 3-Button Bottom Tab (Home | Pets | Profile) + Full Stack
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Main Screens
import { HomeScreen } from '../screens/main/HomeScreen';
import { MyPetsScreen } from '../screens/pets/MyPetsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { BookingsScreen } from '../screens/main/BookingsScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { MessagesScreen } from '../screens/main/MessagesScreen';
import { ExploreScreen } from '../screens/main/ExploreScreen';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { PhoneAuthScreen } from '../screens/auth/PhoneAuthScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Service & Partner Screens
import { PartnerProfileScreen } from '../screens/partner/PartnerProfileScreen';
import { ServiceDetailScreen } from '../screens/services/ServiceDetailScreen';
import { BookingFlowScreen } from '../screens/booking/BookingFlowScreen';
import { BookingDetailScreen } from '../screens/booking/BookingDetailScreen';
import { WriteReviewScreen } from '../screens/reviews/WriteReviewScreen';

// Pet Management Screens
import { AddPetScreen } from '../screens/pets/AddPetScreen';
import { EditPetScreen } from '../screens/pets/EditPetScreen';

// Account & Settings Screens
import {
  EditProfileScreen,
  ChangePasswordScreen,
  NotificationSettingsScreen,
  PrivacyPolicyScreen,
  TermsScreen,
  AboutScreen,
  ContactSupportScreen,
  HelpFaqScreen,
  DataPrivacyScreen,
  SavedAddressesScreen,
  FavoritesScreen,
  PaymentHistoryScreen,
} from '../screens/account';

import { BottomNavigation, PawLoader } from '../components/ui';
import { useAuthStore } from '../store/authStore';

// ─── STACK TYPES ─────────────────────────────
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  PhoneAuth: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Pets: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  Bookings: undefined;
  Notifications: undefined;
  Messages: undefined;
  Explore: { category?: string } | undefined;
  PartnerProfile: { partnerId: string };
  ServiceDetail: { serviceId: string };
  BookingFlow: { serviceId: string; partnerId: string };
  BookingDetail: { bookingId: string };
  WriteReview: { bookingId: string };
  MyPets: undefined;
  AddPet: undefined;
  EditPet: { petId: string };
  EditProfile: undefined;
  ChangePassword: undefined;
  NotificationSettings: undefined;
  SavedAddresses: undefined;
  Favorites: undefined;
  PaymentHistory: undefined;
  Privacy: undefined;
  Terms: undefined;
  About: undefined;
  Contact: undefined;
  Help: undefined;
  DataPrivacy: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// ─── 3-BUTTON BOTTOM TABS ────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pets" component={MyPetsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ─── AUTH STACK ───────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

// ─── ROOT NAVIGATOR ───────────────────────────
export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PawLoader fullScreen message="Loading PAWWS..." />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator as any} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />

            {/* Core Destinations outside Bottom Tabs */}
            <RootStack.Screen name="Bookings" component={BookingsScreen} />
            <RootStack.Screen name="Notifications" component={NotificationsScreen} />
            <RootStack.Screen name="Messages" component={MessagesScreen} />
            <RootStack.Screen name="Explore" component={ExploreScreen} />

            {/* Booking Flow & Profiles */}
            <RootStack.Screen name="PartnerProfile" component={PartnerProfileScreen} />
            <RootStack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <RootStack.Screen
              name="BookingFlow"
              component={BookingFlowScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen name="BookingDetail" component={BookingDetailScreen} />
            <RootStack.Screen
              name="WriteReview"
              component={WriteReviewScreen}
              options={{ presentation: 'modal' }}
            />

            {/* Pets Management */}
            <RootStack.Screen name="MyPets" component={MyPetsScreen} />
            <RootStack.Screen name="AddPet" component={AddPetScreen} />
            <RootStack.Screen name="EditPet" component={EditPetScreen} />

            {/* Account & Legal Section */}
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
            <RootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <RootStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <RootStack.Screen name="Privacy" component={PrivacyPolicyScreen} />
            <RootStack.Screen name="Terms" component={TermsScreen} />
            <RootStack.Screen name="About" component={AboutScreen} />
            <RootStack.Screen name="Contact" component={ContactSupportScreen} />
            <RootStack.Screen name="Help" component={HelpFaqScreen} />
            <RootStack.Screen name="DataPrivacy" component={DataPrivacyScreen} />

            {/* Saved items & Payments */}
            <RootStack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
            <RootStack.Screen name="Favorites" component={FavoritesScreen} />
            <RootStack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
