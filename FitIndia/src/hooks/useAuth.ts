import { useCallback, useState } from 'react';
import { useAuthStore } from '../store';
import { authApi } from '../services/api';
import { isAppError } from '../utils';
import { logoutFn } from '../core';

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
        return {
          ok: true,
          needsProfile: !user.profileComplete,
          msg: res.data.message || 'Logged in successfully.',
        };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Login failed';
        const code = isAppError(e) ? e.code : 'UNKNOWN';
        setError(msg);
        return { ok: false, error: msg, code };
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
        return {
          ok: true,
          msg:
            res.data.message || 'Your account has been created successfully.',
        };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Registration failed';
        const code = isAppError(e) ? e.code : 'UNKNOWN';
        setError(msg);
        return { ok: false, error: msg, code };
      } finally {
        setLoading(false);
      }
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutFn();
    } catch {
      // Ignore — we're logging out regardless
    } finally {
      storeLogout();
      setLoading(false);
    }
  }, [storeLogout]);

  return { login, register, logout, loading, error, clearError };
};
