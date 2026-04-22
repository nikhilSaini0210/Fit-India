import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../types';
import { View, Text } from 'react-native';
import { PROFILE_ROUTES } from '../../constants';

const Placeholder = ({ route }: any) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{route.name}</Text>
  </View>
);

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={PROFILE_ROUTES.PROFILE} component={Placeholder} />
    <Stack.Screen name={PROFILE_ROUTES.EDIT_PROFILE} component={Placeholder} />
    <Stack.Screen name={PROFILE_ROUTES.NOTIFICATIONS} component={Placeholder} />
    <Stack.Screen
      name={PROFILE_ROUTES.SUBSCRIPTION}
      component={Placeholder}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen name={PROFILE_ROUTES.SETTINGS} component={Placeholder} />
  </Stack.Navigator>
);

export default ProfileStack;
