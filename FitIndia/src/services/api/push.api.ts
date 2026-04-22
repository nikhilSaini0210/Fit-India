import { ENDPOINTS } from '../../constants';
import { apiClient } from './client';
import { ApiResponse } from './interfaces';

export const pushApi = {
  registerToken: (body: {
    fcmToken: string;
    platform: 'android' | 'ios' | 'web';
    deviceId: string;
    deviceName?: string;
    appVersion?: string;
  }) =>
    apiClient.post<ApiResponse<{ tokenId: string }>>(
      ENDPOINTS.PUSH_REGISTER,
      body,
    ),

  removeToken: (fcmToken: string) =>
    apiClient.delete(ENDPOINTS.PUSH_TOKEN, { data: { fcmToken } }),

  sendTest: (body?: { title?: string; body?: string }) =>
    apiClient.post(ENDPOINTS.PUSH_TEST, body),
};
