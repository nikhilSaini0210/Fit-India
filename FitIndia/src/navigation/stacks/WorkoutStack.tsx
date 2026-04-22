import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { WorkoutStackParamList } from '../../types';
import { View, Text } from 'react-native';
import { WORKOUT_ROUTES } from '../../constants';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{route.name}</Text>
  </View>
);

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

const WorkoutStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={WORKOUT_ROUTES.WORKOUT_TODAY} component={Placeholder} />
    <Stack.Screen name={WORKOUT_ROUTES.WORKOUT_PLAN} component={Placeholder} />
    <Stack.Screen name={WORKOUT_ROUTES.DAY_DETAIL} component={Placeholder} />
    <Stack.Screen
      name={WORKOUT_ROUTES.ACTIVE_WORKOUT}
      component={Placeholder}
      options={{
        gestureEnabled: false,
        animation: 'slide_from_bottom',
      }}
    />
    <Stack.Screen
      name={WORKOUT_ROUTES.COMPLETE}
      component={Placeholder}
      options={{
        gestureEnabled: false,
        animation: 'fade',
      }}
    />
  </Stack.Navigator>
);

export default WorkoutStack;
