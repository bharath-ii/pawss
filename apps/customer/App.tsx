// ─────────────────────────────────────────────
// PAWWS Customer App — Root Entry Point
// ─────────────────────────────────────────────

import 'react-native-gesture-handler';
import React, { useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

import { auth, db } from './src/config/firebase';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PawLoader } from './src/components/ui/PawLoader';
import { useAuthStore } from './src/store/authStore';
import type { CustomerProfile } from '@pawws/shared';

// ── Keep splash screen visible until ready, ignore if already hidden
SplashScreen.preventAutoHideAsync().catch(() => {});

// ── Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ── TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  const { setFirebaseUser, setProfile, setLoading } = useAuthStore();

  // ── Load Poppins fonts with error handling
  const [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  // ── Hide splash screen once fonts load or fail
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // ── Firebase Auth listener with timeout safeguard
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: ensure loading screen resolves within 2 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2000);

    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        if (!isMounted) return;
        setFirebaseUser(user);
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && isMounted) {
              setProfile(userDoc.data() as CustomerProfile);
            }

            // Safe FCM registration (non-blocking)
            try {
              const { status } = await Notifications.requestPermissionsAsync();
              if (status === 'granted') {
                const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
                if (token?.data && isMounted) {
                  await updateDoc(doc(db, 'users', user.uid), {
                    fcmToken: token.data,
                  }).catch(() => {});
                }
              }
            } catch {
              // Notification errors in dev / Expo Go are non-fatal
            }
          } catch (e) {
            console.error('Error loading user profile:', e);
          }
        } else {
          if (isMounted) setProfile(null);
        }
        if (isMounted) setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        if (isMounted) setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsub();
    };
  }, []);

  // Show loader while fonts are actively loading without errors
  if (!fontsLoaded && !fontError) {
    return <PawLoader fullScreen message="Loading PAWWS..." />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <AppNavigator />
          <Toast />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
