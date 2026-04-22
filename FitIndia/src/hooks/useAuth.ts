import { useCallback, useState } from 'react';
import { OnboardingStorage, useAuthStore } from '../store';
import { authApi } from '../services/api';
import { isAppError } from '../utils';

export const useAuth = () => {
  const { setAuth, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await authApi.login({ email, password });
        const { user, accessToken, refreshToken } = res.data.data;
        setAuth(user, { accessToken, refreshToken });
        OnboardingStorage.markComplete();
        return { ok: true, needsProfile: !user.profileComplete };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Login failed';
        setError(msg);
        return { ok: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [setAuth],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await authApi.register({ name, email, password, phone });
        const { user, accessToken, refreshToken } = res.data.data;
        setAuth(user, { accessToken, refreshToken });
        return { ok: true };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Registration failed';
        setError(msg);
        return { ok: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore — we're logging out regardless
    } finally {
      storeLogout();
      setLoading(false);
    }
  }, [storeLogout]);

  return { login, register, logout, loading, error, clearError };
};
