import { useState, useCallback } from 'react';
import { useAuthStore } from '../store';
import { User } from '../types';
import { isAppError } from '../utils';
import { userApi } from '../services/api';

export const useProfile = () => {
  const updateUser = useAuthStore(s => s.updateUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await userApi.updateProfile(data);
        updateUser(res.data.data.user);
        return { ok: true, msg: 'Profile updated successfully.' };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Profile update failed';
        const code = isAppError(e) ? e.code : 'UNKNOWN';
        setError(msg);
        return { ok: false, error: msg, code };
      } finally {
        setLoading(false);
      }
    },
    [updateUser],
  );

  const updateNotifications = useCallback(
    async (prefs: User['notifications']) => {
      setLoading(true);
      setError(null);
      try {
        await userApi.updateNotifications(prefs);
        updateUser({ notifications: prefs });
        return { ok: true, msg: 'Notification settings updated.' };
      } catch (e) {
        const msg = isAppError(e)
          ? e.message
          : 'Failed to update notification settings';
        const code = isAppError(e) ? e.code : 'UNKNOWN';
        setError(msg);
        return { ok: false, error: msg, code };
      } finally {
        setLoading(false);
      }
    },
    [updateUser],
  );

  return { updateProfile, updateNotifications, loading, error };
};
