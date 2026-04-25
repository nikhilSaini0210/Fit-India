import { authApi } from '../services/api';
import { useAuthStore } from '../store';

export const logoutFn = async () => {
  await authApi.logout().catch(() => {});
  useAuthStore.getState().logout();
};
