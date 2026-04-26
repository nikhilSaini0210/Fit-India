import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { HOME_ROUTES } from '../../constants';
import { HomeStackParamList } from '../../types';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{`${route.name} coming soon...`}</Text>
  </View>
);

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={HOME_ROUTES.HOME} component={Placeholder} />
    <Stack.Screen
      name={HOME_ROUTES.QUICK_WORKOUT}
      component={Placeholder}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen name={HOME_ROUTES.STREAK} component={Placeholder} />
    <Stack.Screen
      name={HOME_ROUTES.NUTRITION_TARGETS}
      component={Placeholder}
    />
  </Stack.Navigator>
);

export default HomeStack;
