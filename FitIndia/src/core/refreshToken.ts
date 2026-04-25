import { authApi } from '../services/api';
import { useAuthStore } from '../store';
import { logger } from '../utils';
import { logoutFn } from './logoutFn';
import { scheduleRefresh } from './scheduler';

export const doRefresh = async () => {
  const { refreshToken, setTokens } = useAuthStore.getState();

  if (!refreshToken) throw new Error('No refresh token');

  const res = await authApi.refresh(refreshToken);
  const data = res.data?.data;

  if (!data?.accessToken) throw new Error('Invalid refresh response');

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
};

export const startRefreshScheduler = () => {
  const { accessToken } = useAuthStore.getState();

  scheduleRefresh(accessToken, async () => {
    try {
      await doRefresh();
    } catch (err: any) {
      logger.warn('Refresh failed', {
        tag: 'AuthStore',
        data: err?.message,
      });

      if (err?.response?.status === 401) {
        await logoutFn().catch(() => {});
      }
    }
  });
};
