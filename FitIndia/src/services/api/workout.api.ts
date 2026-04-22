import { ENDPOINTS } from '../../constants';
import { WorkoutDay, WorkoutPlan } from '../../types';
import { apiClient } from './client';
import { ApiResponse } from './interfaces';

export const workoutApi = {
  generate: (body: { days?: number; useAI?: boolean }) =>
    apiClient.post<ApiResponse<{ plan: WorkoutPlan }>>(
      ENDPOINTS.WORKOUT_GENERATE,
      body,
    ),

  getActive: () =>
    apiClient.get<ApiResponse<{ plan: WorkoutPlan }>>(ENDPOINTS.WORKOUT_ACTIVE),

  getToday: () =>
    apiClient.get<ApiResponse<{ workout: WorkoutDay }>>(
      ENDPOINTS.WORKOUT_TODAY,
    ),

  markComplete: (body: { planId: string; dayNumber: number }) =>
    apiClient.patch<ApiResponse<{ plan: WorkoutPlan }>>(
      ENDPOINTS.WORKOUT_COMPLETE,
      body,
    ),

  getQuick: (params: { focus: string; workoutType?: string }) =>
    apiClient.get<ApiResponse<{ workout: WorkoutDay }>>(
      ENDPOINTS.WORKOUT_QUICK,
      { params },
    ),
};
