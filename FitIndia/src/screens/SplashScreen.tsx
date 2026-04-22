import React, { FC, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
  OnboardingStorage,
  selectIsLoggedIn,
  selectProfileComplete,
  useAuthStore,
} from '../store';
import { resetAndNavigate } from '../utils';
import { AUTH_ROUTES, ROOT_ROUTES } from '../constants';

export const SplashScreen: FC = () => {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const profileComplete = useAuthStore(selectProfileComplete);

  useEffect(() => {
    const resolve = async () => {
      await new Promise<void>(r => setTimeout(r, 600));

      if (!isLoggedIn) {
        const onboarded = OnboardingStorage.isComplete();
        resetAndNavigate(ROOT_ROUTES.AUTH, {
          screen: onboarded ? AUTH_ROUTES.LOGIN : AUTH_ROUTES.ONBOARDING,
        });
        return;
      }

      if (!profileComplete) {
        resetAndNavigate(ROOT_ROUTES.AUTH, {
          screen: AUTH_ROUTES.PROFILE_SETUP,
        });
        return;
      }

      resetAndNavigate(ROOT_ROUTES.MAIN);
    };

    resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FitIndia 💪</Text>
      <ActivityIndicator size="large" color="#22C55E" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  spinner: {
    marginTop: 8,
  },
});
