import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState } from './interface';
import { RawTokens, zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';
import { cancelRefresh, startRefreshScheduler, verifyToken } from '../core';
import { logger } from '../utils';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isLoggedIn: false,
      isHydrated: false,

      setAuth: (user, { accessToken, refreshToken }) => {
        const { valid, payload, error } = verifyToken(accessToken);
        if (!valid || !payload) {
          logger.warn('setAuth rejected', {
            tag: 'AuthStore',
            data: error,
          });
          return false;
        }
        RawTokens.set(accessToken, refreshToken);
        set({
          user,
          accessToken,
          refreshToken: refreshToken ?? get().refreshToken,
          isLoggedIn: true,
          tokenExpiry: payload.exp * 1000,
        });

        startRefreshScheduler();

        return true;
      },

      setTokens: ({ accessToken, refreshToken }) => {
        const { valid, payload, error } = verifyToken(accessToken);
        if (!valid || !payload) {
          logger.warn('setTokens rejected', {
            tag: 'AuthStore',
            data: error,
          });
          return false;
        }
        RawTokens.set(accessToken, refreshToken);
        set({ accessToken, refreshToken, tokenExpiry: payload.exp * 1000 });

        startRefreshScheduler();

        return true;
      },

      updateUser: partial =>
        set(state => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      logout: () => {
        cancelRefresh();
        RawTokens.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          isLoggedIn: false,
        });
        logger.info('User logged out', { tag: 'AuthStore' });
      },

      _onHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
        tokenExpiry: state.tokenExpiry,
      }),
      onRehydrateStorage: () => state => {
        if (!state) return;
        const { valid } = verifyToken(state.accessToken);
        if (valid) {
          state.isLoggedIn = true;
          setTimeout(() => {
            startRefreshScheduler();
          }, 0);
        } else {
          state.accessToken =
            state.refreshToken =
            state.tokenExpiry =
            state.user =
              null;
          state.isLoggedIn = false;
        }
        state._onHydrated();
      },
    },
  ),
);

export const selectUser = (s: AuthState) => s.user;
export const selectIsLoggedIn = (s: AuthState) => s.isLoggedIn;
export const selectIsPremium = (s: AuthState) => s.user?.isPremium ?? false;
export const selectProfileComplete = (s: AuthState) =>
  s.user?.profileComplete ?? false;
export const selectIsHydrated = (s: AuthState) => s.isHydrated;
