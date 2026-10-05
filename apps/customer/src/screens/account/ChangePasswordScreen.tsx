// ─────────────────────────────────────────────
// PAWWS — Change Password Screen
// Secure password update & reset triggers
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import Toast from 'react-native-toast-message';

import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { AppBar, Button, Input, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { firebaseUser } = useAuthStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetSending, setIsResetSending] = useState(false);

  const isGoogleProvider = firebaseUser?.providerData?.some(
    (p) => p.providerId === 'google.com'
  );

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords Do Not Match',
        text2: 'Please recheck both password fields.',
      });
      return;
    }

    if (!firebaseUser) return;
    setIsSubmitting(true);

    try {
      await updatePassword(firebaseUser, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password was changed successfully.',
      });
      navigation.goBack();
    } catch (err: any) {
      console.error('Password change error:', err);
      if (err.code === 'auth/requires-recent-login') {
        Toast.show({
          type: 'error',
          text1: 'Re-authentication Needed',
          text2: 'Please log out and log back in before changing your password.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: err.message || 'Could not update password. Please try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!firebaseUser?.email) return;
    setIsResetSending(true);

    try {
      await sendPasswordResetEmail(auth, firebaseUser.email);
      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: `A password reset link was sent to ${firebaseUser.email}`,
      });
    } catch (err: any) {
      console.error('Reset email error:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Email',
        text2: err.message || 'Please try again later.',
      });
    } finally {
      setIsResetSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <AppBar title="Change Password" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="lock" size={30} color={COLORS.black} />
          </View>

          <Text style={styles.cardTitle}>Set New Password</Text>
          <Text style={styles.cardDesc}>
            Create a strong password with at least 6 characters including letters and numbers.
          </Text>

          {isGoogleProvider ? (
            <View style={styles.googleNotice}>
              <Text style={styles.googleNoticeText}>
                Your account is currently linked with Google sign-in. You can set a direct password or send a reset email to your address.
              </Text>
            </View>
          ) : null}

          <Input
            label="New Password"
            placeholder="At least 6 characters"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            leftIcon={<Icon name="lock" size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            leftIcon={<Icon name="lock" size={18} color={COLORS.textSecondary} />}
          />

          <View style={styles.buttonSpacing}>
            <Button
              label="Update Password"
              onPress={handleChangePassword}
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || !newPassword}
            />
          </View>

          {firebaseUser?.email ? (
            <View style={styles.resetWrap}>
              <Text style={styles.orText}>— OR —</Text>
              <Button
                label="Send Password Reset Email"
                onPress={handleSendResetEmail}
                variant="outline"
                size="md"
                fullWidth
                loading={isResetSending}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  googleNotice: {
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  googleNoticeText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  buttonSpacing: {
    width: '100%',
    marginTop: 8,
  },
  resetWrap: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  orText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
});
