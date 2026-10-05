// ─────────────────────────────────────────────
// PAWWS — Phone Auth Screen
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
import Toast from 'react-native-toast-message';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const PhoneAuthScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Toast.show({ type: 'error', text1: 'Please enter a valid 10-digit phone number' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      Toast.show({ type: 'success', text1: 'OTP sent successfully to your number' });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Toast.show({ type: 'error', text1: 'Please enter the 6-digit OTP' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({ type: 'success', text1: 'Phone verified successfully!' });
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{step === 'phone' ? 'Phone Login' : 'Enter OTP'}</Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'We will send a one-time verification code'
              : `Enter the code sent to +91 ${phoneNumber}`}
          </Text>
        </View>

        {step === 'phone' ? (
          <View style={styles.form}>
            <Input
              label="Phone Number"
              placeholder="98765 43210"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <Button
              label="Send OTP"
              onPress={handleSendOtp}
              loading={isLoading}
              size="lg"
              fullWidth
              style={styles.actionBtn}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Verification Code"
              placeholder="6-digit OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
            <Button
              label="Verify & Proceed"
              onPress={handleVerifyOtp}
              loading={isLoading}
              size="lg"
              fullWidth
              style={styles.actionBtn}
            />
            <TouchableOpacity style={styles.resendBtn} onPress={() => setStep('phone')}>
              <Text style={styles.resendText}>Change Phone Number</Text>
            </TouchableOpacity>
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
  resendBtn: { alignItems: 'center', marginTop: SPACING.md },
  resendText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryDark,
  },
});
