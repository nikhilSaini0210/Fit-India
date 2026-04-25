import React, { FC, useEffect, useRef, useState } from 'react';
import { SplashScreen } from '../screens';
import { AppNavigator } from './AppNavigator';
import { useAppStore, useAuthStore } from '../store';
import { initializeApp } from '../setup';
import { StyleSheet, View } from 'react-native';

const RootApp: FC = () => {
  const isAuthHydrated = useAuthStore.persist.hasHydrated();
  const isAppHydrated = useAppStore(s => s.isHydrated);
  const setLoadingStep = useAppStore(s => s.setLoadingStep);

  const [isInitDone, setInitDone] = useState(false);

  const [isNavReady, setNavReady] = useState(false);

  const hasInit = useRef(false);

  useEffect(() => {
    if (!isAuthHydrated || !isAppHydrated) return;
    if (hasInit.current) return;
    hasInit.current = true;

    const init = async () => {
      await initializeApp();
      setLoadingStep(1);
      setInitDone(true);
    };

    init();
  }, [isAuthHydrated, isAppHydrated, setLoadingStep]);

  const showSplash =
    !isAuthHydrated || !isAppHydrated || !isInitDone || !isNavReady;

  const splashCanNavigate = isInitDone && isNavReady;

  return (
    <View style={styles.root}>
      <AppNavigator onReady={() => setNavReady(true)} />

      {showSplash && (
        <View style={styles.splashOverlay}>
          <SplashScreen canNavigate={splashCanNavigate} />
        </View>
      )}
    </View>
  );
};

export default RootApp;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
  },
});
