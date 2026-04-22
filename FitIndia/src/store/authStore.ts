import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState } from './interface';
import { RawTokens, zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,

      setAuth: (user, { accessToken, refreshToken }) => {
        RawTokens.set(accessToken, refreshToken);
        set({ user, accessToken, refreshToken, isLoggedIn: true });
      },

      setTokens: ({ accessToken, refreshToken }) => {
        RawTokens.set(accessToken, refreshToken);
        set({ accessToken, refreshToken });
      },

      updateUser: partial =>
        set(state => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      logout: () => {
        RawTokens.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);

export const selectUser = (s: AuthState) => s.user;
export const selectIsLoggedIn = (s: AuthState) => s.isLoggedIn;
export const selectIsPremium = (s: AuthState) => s.user?.isPremium ?? false;
export const selectProfileComplete = (s: AuthState) =>
  s.user?.profileComplete ?? false;
