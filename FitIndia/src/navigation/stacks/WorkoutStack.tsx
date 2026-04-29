import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../../types';
import { View, Text } from 'react-native';
import { WORKOUT_ROUTES } from '../../constants';
import {
  ActiveWorkoutScreen,
  WorkoutCompleteScreen,
  WorkoutPlanScreen,
  WorkoutTodayScreen,
} from '../../screens';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{`${route.name} coming soon...`}</Text>
  </View>
);

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
    <Stack.Screen name={WORKOUT_ROUTES.DAY_DETAIL} component={Placeholder} />
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
  </Stack.Navigator>
);

export default WorkoutStack;
