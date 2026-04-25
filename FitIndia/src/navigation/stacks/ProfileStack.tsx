import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../types';
import { PROFILE_ROUTES } from '../../constants';
import {
  AppSettingsScreen,
  EditProfileScreen,
  NotificationSettingsScreen,
  ProfileScreen,
  SubscriptionScreen,
} from '../../screens';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={PROFILE_ROUTES.PROFILE} component={ProfileScreen} />
    <Stack.Screen
      name={PROFILE_ROUTES.EDIT_PROFILE}
      component={EditProfileScreen}
    />
    <Stack.Screen
      name={PROFILE_ROUTES.NOTIFICATIONS}
      component={NotificationSettingsScreen}
    />
    <Stack.Screen
      name={PROFILE_ROUTES.SUBSCRIPTION}
      component={SubscriptionScreen}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name={PROFILE_ROUTES.SETTINGS}
      component={AppSettingsScreen}
    />
  </Stack.Navigator>
);

export default ProfileStack;
