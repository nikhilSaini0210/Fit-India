import { ENDPOINTS } from '../../constants';
import { NutritionTargets, User } from '../../types';
import { apiClient } from './client';
import { ApiResponse } from './interfaces';

export const userApi = {
  getProfile: () =>
    apiClient.get<ApiResponse<{ user: User }>>(ENDPOINTS.PROFILE),

  updateProfile: (body: Partial<User>) =>
    apiClient.patch<ApiResponse<{ user: User }>>(ENDPOINTS.PROFILE, body),

  updateNotifications: (body: User['notifications']) =>
    apiClient.patch<ApiResponse<{ notifications: User['notifications'] }>>(
      ENDPOINTS.NOTIFICATIONS_PREFS,
      body,
    ),

  getNutritionTargets: () =>
    apiClient.get<ApiResponse<{ targets: NutritionTargets }>>(
      ENDPOINTS.NUTRITION_TARGETS,
    ),

  deleteAccount: () => apiClient.delete(ENDPOINTS.PROFILE),
};
