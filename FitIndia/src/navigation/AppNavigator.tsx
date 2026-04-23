import React, { useEffect, useRef } from 'react';
import {
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, AppState, type AppStateStatus } from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import AuthStack from './stacks/AuthStack';
import {
  selectIsLoggedIn,
  selectProfileComplete,
  useAuthStore,
  useIsDark,
} from '../store';
import { replayOfflineQueue, setInterceptorCallbacks } from '../services/api';
import { RootStackParamList } from '../types';
import { navigationRef, resetAndNavigate } from '../utils';
import { AUTH_ROUTES, ROOT_ROUTES } from '../constants';
import NetInfo from '@react-native-community/netinfo';
import {
  cleanupPushNotifications,
  initPushNotifications,
} from '../services/noti';

const resetToAuth = async () => {
  resetAndNavigate(ROOT_ROUTES.AUTH);
};

const Root = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const isDark = useIsDark();
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const profileComplete = useAuthStore(selectProfileComplete);
  const { logout, setTokens } = useAuthStore();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    setInterceptorCallbacks({
      onForceLogout: () => {
        logout();
        cleanupPushNotifications();
        resetToAuth();
      },
      onTokensRefreshed: (access, refresh) => {
        setTokens({ accessToken: access, refreshToken: refresh });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      initPushNotifications().catch(() => {});
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        replayOfflineQueue().catch(() => {});
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const wasBackground =
        appState.current.match(/inactive|background/) && next === 'active';
      appState.current = next;

      if (wasBackground) {
        // Next API call will trigger refresh if token expired while backgrounded.
        // The interceptor handles it silently — nothing explicit needed here.
      }
    });
    return () => sub.remove();
  }, []);

  const getInitialRoute = (): keyof RootStackParamList => {
    if (isLoggedIn && profileComplete) return ROOT_ROUTES.MAIN;
    return ROOT_ROUTES.AUTH;
  };

  useEffect(() => {
    if (!navigationRef.isReady()) return;
    if (isLoggedIn && !profileComplete) {
      resetAndNavigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.PROFILE_SETUP });
    }
  }, [isLoggedIn, profileComplete]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state: NavigationState | undefined) => {
        if (__DEV__ && state) {
          const route = getActiveRouteName(state);
          console.log('[NAV]', route);
        }
      }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <Root.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Root.Screen name={ROOT_ROUTES.AUTH} component={AuthStack} />
        <Root.Screen name={ROOT_ROUTES.MAIN} component={MainTabNavigator} />
      </Root.Navigator>
    </NavigationContainer>
  );
};

const getActiveRouteName = (state: NavigationState): string => {
  const route = state.routes[state.index];
  if (route.state) return getActiveRouteName(route.state as NavigationState);
  return route.name;
};
