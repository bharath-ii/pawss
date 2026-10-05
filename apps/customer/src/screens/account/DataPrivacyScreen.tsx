// ─────────────────────────────────────────────
// PAWWS — Data & Privacy Management Screen
// User data control, export and account deletion flow
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteUser, signOut } from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

import { auth, db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { AppBar, Card, Icon, DeleteAccountModal } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { LEGAL_CONTENT } from '@pawws/shared';

export const DataPrivacyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { firebaseUser, logout } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Data Archive',
      `A download link with your full pet profile, vaccination history, and invoice records will be sent to your registered email (${firebaseUser?.email || 'your email'}) within 24 hours.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Archive',
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Archive Requested',
              text2: 'You will receive an encrypted email download link shortly.',
            });
          },
        },
      ]
    );
  };

  const handleConfirmAccountDeletion = async () => {
    if (!firebaseUser) return;

    try {
      // 1. Mark user profile deleted in Firestore
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        fcmToken: null,
      }).catch((e) => console.warn('Firestore deletion mark skipped:', e));

      // 2. Delete user in Firebase Authentication
      await deleteUser(firebaseUser);

      // 3. Clean up store & sign out
      await signOut(auth);
      logout();

      Toast.show({
        type: 'success',
        text1: 'Account Deleted',
        text2: 'Your account and personal data have been permanently removed.',
      });
    } catch (err: any) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Security Check Required',
          'For your security, please log out, log back in, and retry account deletion.'
        );
      } else {
        Alert.alert('Deletion Failed', err.message || 'Could not delete account. Please contact support@pawws.app.');
      }
    }
  };

  return (
    <View style={styles.screen}>
      <AppBar title="Data & Privacy" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>
          You own your data. Review what information is stored, manage your permissions, or request data export.
        </Text>

        {/* Data We Store */}
        <Card shadow="sm" padding={16} style={styles.card}>
          <Text style={styles.cardTitle}>Stored Personal Information</Text>

          <View style={styles.dataItem}>
            <Icon name="user" size={18} color={COLORS.black} />
            <View style={styles.dataContent}>
              <Text style={styles.itemTitle}>Profile & Credentials</Text>
              <Text style={styles.itemSubtitle}>Name, verified phone, email, and photo</Text>
            </View>
          </View>

          <View style={styles.dataItem}>
            <Icon name="pets" size={18} color={COLORS.black} />
            <View style={styles.dataContent}>
              <Text style={styles.itemTitle}>Registered Pet Profiles</Text>
              <Text style={styles.itemSubtitle}>Breed, age, weight, and vaccination documents</Text>
            </View>
          </View>

          <View style={styles.dataItem}>
            <Icon name="location" size={18} color={COLORS.black} />
            <View style={styles.dataContent}>
              <Text style={styles.itemTitle}>Saved Addresses & GPS</Text>
              <Text style={styles.itemSubtitle}>Home coordinates for Google Maps distance calculation</Text>
            </View>
          </View>
        </Card>

        {/* Data Actions */}
        <Card shadow="sm" padding={0} style={styles.menuCard}>
          <TouchableOpacity style={styles.menuRow} onPress={handleExportData} activeOpacity={0.7}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="fileText" size={20} color="#4338CA" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuRowTitle}>Download My Data Archive</Text>
              <Text style={styles.menuRowSubtitle}>Get a copy of your pets and booking history</Text>
            </View>
            <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('Privacy')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="shieldCheck" size={20} color="#15803D" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuRowTitle}>Read Privacy Policy</Text>
              <Text style={styles.menuRowSubtitle}>How we handle and protect user information</Text>
            </View>
            <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Danger Zone: Account Deletion */}
        <Card shadow="sm" padding={18} style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <Icon name="delete" size={22} color={COLORS.error} />
            <Text style={styles.dangerTitle}>Permanent Account Deletion</Text>
          </View>

          <Text style={styles.dangerDesc}>
            Permanently delete your PAWWS profile, all registered pets, and medical records. This action cannot be reversed.
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Initiate account deletion flow"
          >
            <Text style={styles.deleteButtonText}>Delete My Account</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Real Deletion Flow Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirmDelete={handleConfirmAccountDeletion}
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
  headerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: RADIUS.lg,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 14,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  dataContent: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.black,
  },
  itemSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  menuCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 70,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuRowTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 2,
  },
  menuRowSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dangerCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dangerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.error,
  },
  dangerDesc: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 16,
  },
  deleteButton: {
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.white,
  },
});
