import { ENDPOINTS } from '../../constants';
import { DietDay, DietPlan } from '../../types';
import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from './interfaces';

export const dietApi = {
  generate: (body: { days?: number; useAI?: boolean }) =>
    apiClient.post<ApiResponse<{ plan: DietPlan }>>(
      ENDPOINTS.DIET_GENERATE,
      body,
    ),

  getActive: () =>
    apiClient.get<ApiResponse<{ plan: DietPlan }>>(ENDPOINTS.DIET_ACTIVE),

  getToday: () =>
    apiClient.get<ApiResponse<{ meals: DietDay }>>(ENDPOINTS.DIET_TODAY),

  getHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<DietPlan>>(ENDPOINTS.DIET_HISTORY, {
      params,
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<{ plan: DietPlan }>>(ENDPOINTS.DIET_BY_ID(id)),
};
