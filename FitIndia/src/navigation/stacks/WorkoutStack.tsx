import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../../types';
import { WORKOUT_ROUTES } from '../../constants';
import {
  ActiveWorkoutScreen,
  GenerateWorkoutScreen,
  WorkoutCompleteScreen,
  WorkoutDayDetailScreen,
  WorkoutPlanScreen,
  WorkoutTodayScreen,
} from '../../screens';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

const WorkoutStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name={WORKOUT_ROUTES.WORKOUT_TODAY}
      component={WorkoutTodayScreen}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.WORKOUT_PLAN}
      component={WorkoutPlanScreen}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.DAY_DETAIL}
      component={WorkoutDayDetailScreen}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.ACTIVE_WORKOUT}
      component={ActiveWorkoutScreen}
      options={{
        gestureEnabled: false,
        animation: 'slide_from_bottom',
      }}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.COMPLETE}
      component={WorkoutCompleteScreen}
      options={{
        gestureEnabled: false,
        animation: 'fade',
      }}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.GENERATE}
      component={GenerateWorkoutScreen}
      options={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
  </Stack.Navigator>
);

export default WorkoutStack;
