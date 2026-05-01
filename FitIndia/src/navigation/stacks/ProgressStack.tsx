import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProgressStackParamList } from '../../types';
import { PROGRESS_ROUTES } from '../../constants';
import {
  LogWeightScreen,
  ProgressChartsScreen,
  ProgressScreen,
  StreakBadgesScreen,
} from '../../screens';

const Stack = createNativeStackNavigator<ProgressStackParamList>();

const ProgressStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={PROGRESS_ROUTES.PROGRESS} component={ProgressScreen} />
    <Stack.Screen
      name={PROGRESS_ROUTES.LOG_WEIGHT}
      component={LogWeightScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={PROGRESS_ROUTES.CHARTS}
      component={ProgressChartsScreen}
    />
    <Stack.Screen
      name={PROGRESS_ROUTES.STREAK}
      component={StreakBadgesScreen}
    />
  </Stack.Navigator>
);

export default ProgressStack;
