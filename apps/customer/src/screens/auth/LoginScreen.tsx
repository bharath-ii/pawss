// ─────────────────────────────────────────────
// PAWWS — Login Screen
// Email + Google + Phone auth options
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
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onEmailLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Auth state listener in App.tsx will handle navigation
    } catch (error: any) {
      const msg = error.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Login failed. Please try again.';
      Toast.show({ type: 'error', text1: 'Login Failed', text2: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      let GoogleSigninModule: any = null;
      try {
        GoogleSigninModule = require('@react-native-google-signin/google-signin').GoogleSignin;
      } catch {
        // Native module unavailable in Expo Go
      }

      if (!GoogleSigninModule) {
        Toast.show({
          type: 'info',
          text1: 'Google Sign-In',
          text2: 'Native Google sign-in requires a standalone build. Please use Email or Phone login.',
        });
        setIsGoogleLoading(false);
        return;
      }

      await GoogleSigninModule.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSigninModule.signIn();
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      if (error?.code !== 'SIGN_IN_CANCELLED') {
        Toast.show({
          type: 'info',
          text1: 'Google Sign-In Note',
          text2: 'Please sign in using email & password or phone auth in Expo Go.',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#FFF0F3', '#FFD6DE']}
          style={styles.header}
        >
          <View style={styles.logoIcon}>
            <Icon name="pets" size={36} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.brandName}>PAWWS</Text>
          <Text style={styles.tagline}>Welcome back!</Text>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Log in to book pet services</Text>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
                required
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoComplete="password"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
                required
                rightIcon={
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} color={COLORS.textMuted} />
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            )}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            label="Sign In"
            onPress={handleSubmit(onEmailLogin)}
            isLoading={isLoading}
            fullWidth
            size="lg"
            style={styles.loginBtn}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In */}
          <Button
            label="Continue with Google"
            onPress={onGoogleLogin}
            variant="outline"
            isLoading={isGoogleLoading}
            fullWidth
            size="lg"
          />

          {/* Phone Auth */}
          <Button
            label="Continue with Phone"
            onPress={() => navigation.navigate('PhoneAuth')}
            variant="ghost"
            fullWidth
            size="lg"
            style={styles.phoneBtn}
          />

          {/* Signup Link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1 },
  header: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  brandName: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black,
    letterSpacing: 4,
  },
  tagline: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  form: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  eyeIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -SPACING.xs, marginBottom: SPACING.md },
  forgotText: { fontFamily: FONTS.medium, fontSize: FONT_SIZES.sm, color: COLORS.primary },
  loginBtn: { marginTop: SPACING.xs },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  phoneBtn: { marginTop: SPACING.sm },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  signupText: { fontFamily: FONTS.regular, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  signupLink: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZES.sm, color: COLORS.primary },
});
