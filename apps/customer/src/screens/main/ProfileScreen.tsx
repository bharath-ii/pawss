// ─────────────────────────────────────────────
// PAWWS — Customer Profile & Account Screen
// Poppins typography, Vector icons, complete account & legal section
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import Toast from 'react-native-toast-message';

import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { AppBar, Card, Icon, ConfirmationModal } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

interface MenuItemProps {
  icon: IconName;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  danger = false,
  badge,
  isLast = false,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <View style={styles.menuLeft}>
      <View style={[styles.menuIconCircle, danger && styles.menuIconDanger]}>
        <Icon
          name={icon}
          size={18}
          color={danger ? COLORS.error : COLORS.black}
        />
      </View>
      <View>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>

    <View style={styles.menuRight}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
    </View>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      logout();
      Toast.show({ type: 'success', text1: 'Logged Out', text2: 'Come back soon!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Logout Failed', text2: 'Please try again' });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <View style={styles.screen}>
      <AppBar title="My Account" showBack={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarWrapper}>
            {profile?.photoURL ? (
              <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="profile" size={32} color={COLORS.black} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Icon name="edit" size={12} color={COLORS.black} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.displayName || 'Pet Parent'}</Text>
            <Text style={styles.userEmail}>{profile?.email || profile?.phone || 'Verified User'}</Text>
            <Text style={styles.editProfileCta}>Tap to view or edit profile</Text>
          </View>

          <Icon name="chevronRight" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Quick Nav: My Bookings Banner */}
        <TouchableOpacity
          style={styles.bookingsBanner}
          onPress={() => navigation.navigate('Bookings')}
          activeOpacity={0.85}
        >
          <View style={styles.bannerIcon}>
            <Icon name="bookings" size={22} color={COLORS.black} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>My Bookings & Appointments</Text>
            <Text style={styles.bannerSubtitle}>Track active services, schedule & past visits</Text>
          </View>
          <Icon name="chevronRight" size={18} color={COLORS.black} />
        </TouchableOpacity>

        {/* Section 1: Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card shadow="sm" padding={0} style={styles.card}>
            <MenuItem
              icon="profile"
              label="Edit Profile"
              subtitle="Personal info & emergency contact"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <MenuItem
              icon="lock"
              label="Change Password"
              subtitle="Security & credential updates"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <MenuItem
              icon="location"
              label="Saved Addresses"
              subtitle="Home and work service spots"
              onPress={() => navigation.navigate('SavedAddresses')}
            />
            <MenuItem
              icon="heart"
              label="Favorites"
              subtitle="Saved service partners & clinics"
              onPress={() => navigation.navigate('Favorites')}
              isLast
            />
          </Card>
        </View>

        {/* Section 2: Payments & Invoices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Finance</Text>
          <Card shadow="sm" padding={0} style={styles.card}>
            <MenuItem
              icon="creditCard"
              label="Payment History"
              subtitle="GST invoices, receipts & refunds"
              onPress={() => navigation.navigate('PaymentHistory')}
              isLast
            />
          </Card>
        </View>

        {/* Section 3: Preferences & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences & Privacy</Text>
          <Card shadow="sm" padding={0} style={styles.card}>
            <MenuItem
              icon="notifications"
              label="Notification Settings"
              subtitle="SMS, WhatsApp & push alert controls"
              onPress={() => navigation.navigate('NotificationSettings')}
            />
            <MenuItem
              icon="shieldCheck"
              label="Data & Privacy"
              subtitle="Data export & account deletion"
              onPress={() => navigation.navigate('DataPrivacy')}
              isLast
            />
          </Card>
        </View>

        {/* Section 4: Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <Card shadow="sm" padding={0} style={styles.card}>
            <MenuItem
              icon="messages"
              label="Contact / Support"
              subtitle="WhatsApp, email & live helpdesk"
              onPress={() => navigation.navigate('Contact')}
            />
            <MenuItem
              icon="help"
              label="Help / FAQ"
              subtitle="Common questions & booking guide"
              onPress={() => navigation.navigate('Help')}
            />
            <MenuItem
              icon="fileText"
              label="Privacy Policy"
              subtitle="Data collection & Google Maps terms"
              onPress={() => navigation.navigate('Privacy')}
            />
            <MenuItem
              icon="fileText"
              label="Terms & Conditions"
              subtitle="Marketplace platform agreements"
              onPress={() => navigation.navigate('Terms')}
            />
            <MenuItem
              icon="info"
              label="About PAWWS"
              subtitle="App version 1.0.0 & legal attributions"
              onPress={() => navigation.navigate('About')}
              isLast
            />
          </Card>
        </View>

        {/* Section 5: Logout */}
        <View style={styles.section}>
          <Card shadow="sm" padding={0} style={styles.card}>
            <MenuItem
              icon="logout"
              label="Log Out"
              onPress={() => setShowLogoutModal(true)}
              danger
              isLast
            />
          </Card>
        </View>

        {/* App Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>PAWWS v1.0.0 • Production Build</Text>
        </View>
      </ScrollView>

      {/* Confirmation Dialog for Logout */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out of your PAWWS account?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        isDestructive
        icon="logout"
        isLoading={isLoggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
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
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.black,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  editProfileCta: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.primaryDark,
  },
  bookingsBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    minHeight: 56, // Accessible touch target
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
  },
  menuLabelDanger: {
    color: COLORS.error,
  },
  menuSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.black,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerVersion: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
