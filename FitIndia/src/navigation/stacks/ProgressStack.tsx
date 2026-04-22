import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProgressStackParamList } from '../../types';
import { View, Text } from 'react-native';
import { PROGRESS_ROUTES } from '../../constants';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{route.name}</Text>
  </View>
);

const Stack = createNativeStackNavigator<ProgressStackParamList>();

const ProgressStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={PROGRESS_ROUTES.PROGRESS} component={Placeholder} />
    <Stack.Screen
      name={PROGRESS_ROUTES.LOG_WEIGHT}
      component={Placeholder}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name={PROGRESS_ROUTES.CHARTS} component={Placeholder} />
    <Stack.Screen name={PROGRESS_ROUTES.STREAK} component={Placeholder} />
  </Stack.Navigator>
);

export default ProgressStack;
