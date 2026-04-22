import { apiClient } from '.';
import { ENDPOINTS } from '../../constants';
import { AuthResponse, AuthTokens, User } from '../../types';
import {
  ApiResponse,
  ChangePassBody,
  LoginBody,
  RegisterBody,
} from './interfaces';

export const authApi = {
  register: (body: RegisterBody) =>
    apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.REGISTER, body),

  login: (body: LoginBody) =>
    apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.LOGIN, body),

  logout: () => apiClient.post(ENDPOINTS.LOGOUT),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>(ENDPOINTS.REFRESH, {
      refreshToken,
    }),

  getMe: () => apiClient.get<ApiResponse<{ user: User }>>(ENDPOINTS.ME),

  changePassword: (body: ChangePassBody) =>
    apiClient.patch(ENDPOINTS.CHANGE_PASSWORD, body),
};
