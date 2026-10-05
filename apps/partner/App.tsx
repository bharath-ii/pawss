// ─────────────────────────────────────────────
// PAWWS Partner App — Root Entry Point
// ─────────────────────────────────────────────

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { StyleSheet } from 'react-native';

import { auth, db } from './src/config/firebase';
import { PartnerNavigator } from './src/navigation/PartnerNavigator';
import { PawLoader } from './src/components/ui/PawLoader';
import { usePartnerStore } from './src/store/partnerStore';
import type { Partner } from '@pawws/shared';

SplashScreen.preventAutoHideAsync().catch(() => {});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30 * 1000 },
  },
});

export default function App() {
  const { setPartner, setLoading } = usePartnerStore();

  const [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    let isMounted = true;

    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2000);

    const unsub = onAuthStateChanged(
      auth,
      async (user) => {
        if (!isMounted) return;
        if (user) {
          try {
            const q = query(
              collection(db, 'partners'),
              where('uid', '==', user.uid),
              where('isActive', '==', true)
            );
            const snap = await getDocs(q);
            if (!snap.empty && isMounted) {
              setPartner({ ...snap.docs[0].data(), partnerId: snap.docs[0].id } as Partner);

              try {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status === 'granted') {
                  const token = await Notifications.getExpoPushTokenAsync().catch(() => null);
                  if (token?.data && isMounted) {
                    await updateDoc(doc(db, 'partners', snap.docs[0].id), {
                      fcmToken: token.data,
                    }).catch(() => {});
                  }
                }
              } catch {}
            } else {
              if (isMounted) setPartner(null);
            }
          } catch (e) {
            console.error('Error loading partner profile:', e);
            if (isMounted) setPartner(null);
          }
        } else {
          if (isMounted) setPartner(null);
        }
        if (isMounted) setLoading(false);
      },
      () => {
        if (isMounted) setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsub();
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return <PawLoader fullScreen message="Loading PAWWS Partner..." />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <PartnerNavigator />
          <Toast />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
