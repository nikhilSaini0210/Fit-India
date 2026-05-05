import React, { FC, useEffect, useRef } from 'react';
import {
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, AppState, type AppStateStatus } from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import {
  selectIsLoggedIn,
  selectProfileComplete,
  useAuthStore,
  useIsDark,
} from '../store';
import { replayOfflineQueue, setInterceptorCallbacks } from '../services/api';
import { RootStackParamList } from '../types';
import { logger, navigationRef, resetAndNavigate } from '../utils';
import { AUTH_ROUTES, ROOT_ROUTES } from '../constants';
import NetInfo from '@react-native-community/netinfo';
import {
  cleanupPushNotifications,
  initPushNotifications,
} from '../services/noti';
import { AuthStack } from './stacks';
import { doRefresh, logoutFn, needsRefresh, verifyToken } from '../core';

const resetToAuth = async () => {
  resetAndNavigate(ROOT_ROUTES.AUTH);
};

const Root = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  onReady?: () => void;
}

export const AppNavigator: FC<AppNavigatorProps> = ({ onReady }) => {
  const isDark = useIsDark();
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const profileComplete = useAuthStore(selectProfileComplete);
  const { setTokens } = useAuthStore();
  const appState = useRef(AppState.currentState);

  const isMounted = useRef(false);

  useEffect(() => {
    setInterceptorCallbacks({
      onForceLogout: async () => {
        await logoutFn().catch(() => {});
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
    } else {
      cleanupPushNotifications();
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
    const sub = AppState.addEventListener(
      'change',
      async (next: AppStateStatus) => {
        const prev = appState.current;
        appState.current = next;
        const wasBackground =
          prev.match(/inactive|background/) && next === 'active';

        logger.info(`App resumed → checking token: ${next}`, {
          tag: 'AppState',
        });

        if (!wasBackground) return;

        const { accessToken, refreshToken } = useAuthStore.getState();

        if (!accessToken && !refreshToken) {
          return;
        }

        const { valid, expired } = verifyToken(accessToken);

        if (!valid || expired || needsRefresh(accessToken)) {
          await doRefresh().catch(err => {
            if (err?.response?.status === 401) {
              logoutFn();
            }
          });
        }
      },
    );
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!navigationRef.isReady()) return;

    if (isLoggedIn && profileComplete) {
      resetAndNavigate(ROOT_ROUTES.MAIN);
    } else if (isLoggedIn && !profileComplete) {
      resetAndNavigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.PROFILE_SETUP });
    } else {
      resetAndNavigate(ROOT_ROUTES.AUTH, {
        screen: AUTH_ROUTES.LOGIN,
      });
    }
  }, [isLoggedIn, profileComplete]);

  const getInitialRoute = (): keyof RootStackParamList => {
    if (isLoggedIn && profileComplete) return ROOT_ROUTES.MAIN;
    return ROOT_ROUTES.AUTH;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={(state: NavigationState | undefined) => {
        if (__DEV__ && state) {
          const route = getActiveRouteName(state);
          logger.info(`Route: ${route}`, { tag: 'NAV' });
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
