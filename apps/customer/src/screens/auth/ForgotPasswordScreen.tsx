// ─────────────────────────────────────────────
// PAWWS — Forgot Password Screen
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { auth } from '../../config/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../theme';

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async () => {
    if (!email || !email.includes('@')) {
      Toast.show({ type: 'error', text1: 'Please enter a valid email address' });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setIsSent(true);
      Toast.show({
        type: 'success',
        text1: 'Reset email sent',
        text2: 'Check your inbox for password reset instructions',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Password reset failed',
        text2: error.message || 'Please check your email and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your PAWWS account and we will send you a reset link.
          </Text>
        </View>

        {!isSent ? (
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Button
              label="Send Reset Link"
              onPress={handleReset}
              loading={isLoading}
              size="lg"
              fullWidth
              style={styles.actionBtn}
            />
          </View>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>📧</Text>
            <Text style={styles.successTitle}>Check Your Inbox</Text>
            <Text style={styles.successDesc}>
              We sent a password reset link to {email}. Click the link in the email to set a new password.
            </Text>
            <Button
              label="Back to Login"
              onPress={() => navigation.navigate('Login')}
              size="lg"
              fullWidth
              style={styles.actionBtn}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.xl, paddingTop: SPACING.xxl },
  backBtn: { marginBottom: SPACING.lg },
  backText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.md, color: COLORS.black },
  header: { marginBottom: SPACING.xxl },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  form: { gap: SPACING.md },
  actionBtn: { marginTop: SPACING.md },
  successBox: { alignItems: 'center', marginTop: SPACING.lg },
  successEmoji: { fontSize: 60, marginBottom: SPACING.md },
  successTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  successDesc: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
});
