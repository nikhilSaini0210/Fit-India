import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DietStackParamList } from '../../types';
import { View, Text } from 'react-native';
import { DIET_ROUTES } from '../../constants';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{`${route.name} coming soon...`}</Text>
  </View>
);

const Stack = createNativeStackNavigator<DietStackParamList>();

const DietStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={DIET_ROUTES.DIET_TODAY} component={Placeholder} />
    <Stack.Screen name={DIET_ROUTES.DIET_PLAN} component={Placeholder} />
    <Stack.Screen name={DIET_ROUTES.DAY_DETAIL} component={Placeholder} />
    <Stack.Screen
      name={DIET_ROUTES.MEAL_DETAIL}
      component={Placeholder}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={DIET_ROUTES.GENERATE}
      component={Placeholder}
      options={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    <Stack.Screen name={DIET_ROUTES.HISTORY} component={Placeholder} />
    {/* <Stack.Screen name={DIET_ROUTES.NUTRITION} component={Placeholder} /> */}
  </Stack.Navigator>
);

export default DietStack;
