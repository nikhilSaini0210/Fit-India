import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState } from './interface';
import { RawTokens, zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';
import { cancelRefresh, scheduleRefresh, verifyToken } from '../core';
import { authApi } from '../services/api';

const doRefresh = async (r: string | null) => {
  if (!r) throw new Error('No refresh token');
  await authApi.refresh(r);
};

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
          console.warn('[AuthStore] setAuth rejected:', error);
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
        if (refreshToken) {
          scheduleRefresh(accessToken, async () => {
            try {
              await doRefresh(refreshToken);
            } catch {
              get().logout();
            }
          });
        }

        return true;
      },

      setTokens: ({ accessToken, refreshToken }) => {
        const { valid, payload, error } = verifyToken(accessToken);
        if (!valid || !payload) {
          console.warn('[AuthStore] setTokens rejected:', error);
          return false;
        }
        RawTokens.set(accessToken, refreshToken);
        set({ accessToken, refreshToken, tokenExpiry: payload.exp * 1000 });
        if (refreshToken) {
          scheduleRefresh(accessToken, async () => {
            try {
              await doRefresh(refreshToken);
            } catch {
              get().logout();
            }
          });
        }
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
          scheduleRefresh(state.accessToken, async () => {
            try {
              await doRefresh(state.refreshToken);
            } catch {
              state.logout();
            }
          });
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
