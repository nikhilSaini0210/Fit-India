import axios from 'axios';
import { RawTokens, useAuthStore } from '../store';
import { API_BASE_URL, API_TIMEOUT_MS, ENDPOINTS } from '../constants';

let isLoggingOut = false;

export const logoutFn = async () => {
  if (isLoggingOut) return;

  isLoggingOut = true;

  try {
    const token = RawTokens.getAccess();

    await axios
      .post(
        `${API_BASE_URL}${ENDPOINTS.LOGOUT}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: API_TIMEOUT_MS,
        },
      )
      .catch(() => {});
  } finally {
    RawTokens.clear();
    useAuthStore.getState().logout();
    isLoggingOut = false;
  }
};
