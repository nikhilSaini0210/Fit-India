import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_ROUTES } from '../../constants';
import { HomeStackParamList } from '../../types';
import {
  HomeScreen,
  NutritionTargetsScreen,
  QuickWorkoutScreen,
  StreakBadgesScreen,
} from '../../screens';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={HOME_ROUTES.HOME} component={HomeScreen} />
    <Stack.Screen
      name={HOME_ROUTES.QUICK_WORKOUT}
      component={QuickWorkoutScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name={HOME_ROUTES.STREAK} component={StreakBadgesScreen} />
    <Stack.Screen
      name={HOME_ROUTES.NUTRITION_TARGETS}
      component={NutritionTargetsScreen}
    />
  </Stack.Navigator>
);

export default HomeStack;
