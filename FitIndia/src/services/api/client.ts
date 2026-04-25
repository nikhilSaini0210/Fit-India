import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL, API_TIMEOUT_MS, ENDPOINTS, HTTP } from '../../constants';
import { dequeueAll, enqueueOffline, RawTokens } from '../../store';
import { createAppError, logger } from '../../utils';
import { ApiResponse } from './interfaces';
import { AuthTokens } from '../../types';

let isRefreshing = false;
let waitingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (token: string | null, err: unknown = null) => {
  waitingQueue.forEach(p => (token ? p.resolve(token) : p.reject(err)));
  waitingQueue = [];
};

let _onForceLogout: () => void = () => {};
let _onTokensRefreshed: (a: string, r: string) => void = () => {};

export const setInterceptorCallbacks = (opts: {
  onForceLogout: () => void;
  onTokensRefreshed: (accessToken: string, refreshToken: string) => void;
}) => {
  _onForceLogout = opts.onForceLogout;
  _onTokensRefreshed = opts.onTokensRefreshed;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = RawTokens.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const method = config.method?.toLowerCase() ?? '';
      if (['post', 'put', 'patch', 'delete'].includes(method)) {
        enqueueOffline({
          method,
          url: config.url ?? '',
          data: config.data,
          params: config.params,
          timestamp: Date.now(),
        });
      }
      return Promise.reject(
        createAppError('NO_NETWORK', 'No internet connection. Request queued.'),
      );
    }

    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw createAppError('TIMEOUT', 'Request timed out. Please try again.');
      }
      throw createAppError(
        'NETWORK_ERROR',
        'Network error. Check your connection.',
      );
    }

    const { status, data } = error.response;
    const message = data?.message ?? 'Something went wrong';

    if (status === HTTP.UNAUTHORIZED && !originalRequest._retry) {
      if (originalRequest.url?.includes(ENDPOINTS.LOGIN)) {
        throw createAppError('VALIDATION', message);
      }

      if (originalRequest.url?.includes(ENDPOINTS.REFRESH)) {
        _onForceLogout();
        throw createAppError(
          'SESSION_EXPIRED',
          'Session expired. Please login.',
        );
      }

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          waitingQueue.push({
            resolve: newToken => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = RawTokens.getRefresh();

      if (!refreshToken) {
        isRefreshing = false;
        flushQueue(null, createAppError('SESSION_EXPIRED', 'Session expired.'));
        _onForceLogout();
        throw createAppError(
          'SESSION_EXPIRED',
          'Session expired. Please login.',
        );
      }

      try {
        const { data: refreshData } = await axios.post<ApiResponse<AuthTokens>>(
          `${API_BASE_URL}${ENDPOINTS.REFRESH}`,
          { refreshToken },
          { timeout: API_TIMEOUT_MS },
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshData.data;

        RawTokens.set(accessToken, newRefreshToken);
        _onTokensRefreshed(accessToken, newRefreshToken);

        flushQueue(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        flushQueue(null, createAppError('SESSION_EXPIRED', 'Session expired.'));
        RawTokens.clear();
        _onForceLogout();
        throw createAppError(
          'SESSION_EXPIRED',
          'Session expired. Please login again.',
        );
      } finally {
        isRefreshing = false;
      }
    }

    if (status === HTTP.FORBIDDEN) throw createAppError('FORBIDDEN', message);
    if (status === HTTP.NOT_FOUND) throw createAppError('NOT_FOUND', message);
    if (status === HTTP.CONFLICT) throw createAppError('CONFLICT', message);
    if (status === HTTP.UNPROCESSABLE)
      throw createAppError('VALIDATION', message, (data as any)?.errors);
    if (status === HTTP.TOO_MANY)
      throw createAppError(
        'RATE_LIMIT',
        'Too many requests. Please slow down.',
      );
    if (status >= HTTP.SERVER_ERROR)
      throw createAppError('SERVER_ERROR', 'Server error. Try again shortly.');

    throw createAppError('UNKNOWN', message);
  },
);

export async function replayOfflineQueue(): Promise<void> {
  const queue = dequeueAll();
  if (!queue.length) return;

  const results = await Promise.allSettled(
    queue.map(req =>
      apiClient({
        method: req.method,
        url: req.url,
        data: req.data,
        params: req.params,
      } as AxiosRequestConfig),
    ),
  );

  const failed = results.filter(r => r.status === 'rejected').length;
  if (__DEV__ && failed)
    logger.warn(`[OfflineQueue] ${failed}/${queue.length} failed on replay`);
}
