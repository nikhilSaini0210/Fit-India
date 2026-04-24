import { Appearance } from 'react-native';
import { useAppStore, useAuthStore } from '../store';
import { cancelRefresh, scheduleRefresh, verifyToken } from '../core';
import { authApi } from '../services/api';

const MIN_SPLASH_MS = 4500;
const API_TIMEOUT = 8000;

const withTimeout = <T>(promise: Promise<T>, ms = API_TIMEOUT) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms),
    ),
  ]);

export const initializeApp = async (): Promise<void> => {
  console.info('[Init] Starting...');

  const { setLoadingStep } = useAppStore.getState();

  setLoadingStep(0.05);

  const minDelay = new Promise<void>(resolve =>
    setTimeout(resolve, MIN_SPLASH_MS),
  );

  setLoadingStep(0.1);

  const runBlocking = async () => {
    try {
      console.info('[Init] Token validation start.');

      setLoadingStep(0.2);

      const { accessToken, refreshToken, setTokens, logout } =
        useAuthStore.getState();

      if (accessToken) {
        const { valid } = verifyToken(accessToken);

        if (valid) {
          if (refreshToken) {
            scheduleRefresh(accessToken, async () => {
              await authApi.refresh(refreshToken);
            });
          }
          setLoadingStep(0.4);
          console.info('[Init] Token valid.');
        } else {
          if (!refreshToken) {
            cancelRefresh();
            logout();
            return;
          }

          const res = await withTimeout(authApi.refresh(refreshToken));

          const data = res.data?.data;
          if (!data?.accessToken) throw new Error('Invalid refresh');

          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
          setLoadingStep(0.4);
        }
      } else {
        setLoadingStep(0.4);
      }
    } catch {
      cancelRefresh();
      useAuthStore.getState().logout();
      console.warn('[Init] Token step failed');
    }

    try {
      setLoadingStep(0.5);
      const { isLoggedIn, setAuth, accessToken, refreshToken } =
        useAuthStore.getState();

      if (!isLoggedIn) {
        setLoadingStep(0.7);
        return;
      }

      const res = await withTimeout(authApi.getMe());

      const user = res.data?.data?.user;
      if (!user) throw new Error('Invalid user');

      setAuth(user, {
        accessToken: accessToken ?? '',
        refreshToken: refreshToken ?? '',
      });

      setLoadingStep(0.7);
      console.info('[Init] User loaded.');
    } catch {
      await authApi.logout().catch(() => {});
      useAuthStore.getState().logout();
      console.warn('[Init] User fetch failed → logout.');
    }
  };

  try {
    await Promise.all([
      runBlocking(),
      (async () => {
        await minDelay;
        setLoadingStep(0.85);
      })(),
    ]);
  } catch (err) {
    console.error('[Init] Blocking phase error:', err);
  }

  console.info('[Init] Splash can be dismissed.');

  Promise.allSettled([
    (async () => {
      const { theme, language } = useAppStore.getState();

      if (theme !== 'system') {
        const system =
          Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

        if (system !== theme) {
          Appearance.setColorScheme(theme);
        }
      }
      // i18n.changeLanguage(language);

      console.info(`[Init] Settings applied — theme:${theme} lang:${language}`);
    })(),
  ]);

  setLoadingStep(0.9);

  console.info('[Init] Done.');
};
