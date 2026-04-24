import React, { FC, useEffect, useState } from 'react';
import { SplashScreen } from '../screens';
import { AppNavigator } from './AppNavigator';
import { useAppStore, useAuthStore } from '../store';
import { initializeApp } from '../setup';

const RootApp: FC = () => {
  const isAuthHydrated = useAuthStore.persist.hasHydrated();
  const isAppHydrated = useAppStore(s => s.isHydrated);
  const setLoadingStep = useAppStore(s => s.setLoadingStep);

  const [isInitDone, setInitDone] = useState(false);

  useEffect(() => {
    if (!isAuthHydrated || !isAppHydrated) return;

    const init = async () => {
      await initializeApp();
      setInitDone(true);
      setLoadingStep(1);
    };

    init();
  }, [isAuthHydrated, isAppHydrated, setLoadingStep]);

  const isReady = isAuthHydrated && isAppHydrated && isInitDone;

  if (!isReady) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
};

export default RootApp;
