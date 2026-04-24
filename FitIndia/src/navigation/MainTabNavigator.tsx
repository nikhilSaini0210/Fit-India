import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types';
import { TAB_ROUTES } from '../constants';
import {
  DietStack,
  HomeStack,
  ProfileStack,
  ProgressStack,
  WorkoutStack,
} from './stacks';
import { CustomTabBar } from './main-tab';

const Tab = createBottomTabNavigator<MainTabParamList>();

const RenderTabBar = (props: any) => <CustomTabBar {...props} />;

const MainTabNavigator: FC = () => (
  <Tab.Navigator
    initialRouteName={TAB_ROUTES.HOME}
    tabBar={RenderTabBar}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name={TAB_ROUTES.HOME} component={HomeStack} />
    <Tab.Screen name={TAB_ROUTES.DIET} component={DietStack} />
    <Tab.Screen name={TAB_ROUTES.WORKOUT} component={WorkoutStack} />
    <Tab.Screen name={TAB_ROUTES.PROGRESS} component={ProgressStack} />
    <Tab.Screen name={TAB_ROUTES.PROFILE} component={ProfileStack} />
  </Tab.Navigator>
);

export default MainTabNavigator;
