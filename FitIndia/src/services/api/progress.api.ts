import { ENDPOINTS } from '../../constants';
import { ProgressLog, ProgressSummary } from '../../types';
import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from './interfaces';

export const progressApi = {
  log: (body: {
    weight: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    notes?: string;
    mood?: string;
    logDate?: string;
  }) =>
    apiClient.post<ApiResponse<{ log: ProgressLog }>>(
      ENDPOINTS.PROGRESS_LOG,
      body,
    ),

  getHistory: (params?: { period?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<ProgressLog>>(ENDPOINTS.PROGRESS_HISTORY, {
      params,
    }),

  getSummary: () =>
    apiClient.get<ApiResponse<{ summary: ProgressSummary }>>(
      ENDPOINTS.PROGRESS_SUMMARY,
    ),

  getStreak: () =>
    apiClient.get<
      ApiResponse<{ streak: { current: number; longest: number } }>
    >(ENDPOINTS.PROGRESS_STREAK),

  getLatest: () =>
    apiClient.get<ApiResponse<{ log: ProgressLog | null }>>(
      ENDPOINTS.PROGRESS_LATEST,
    ),
};
