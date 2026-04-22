import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform, StyleSheet } from 'react-native';
import type { MainTabParamList } from '../types';
import { TAB_ROUTES } from '../constants';
import HomeStack from './stacks/HomeStack';
import DietStack from './stacks/DietStack';
import WorkoutStack from './stacks/WorkoutStack';
import ProgressStack from './stacks/ProgressStack';
import ProfileStack from './stacks/ProfileStack';

// ─── Tab icon (simple SVG-style using View shapes) ───────────────────────────
const ICONS: Record<string, string> = {
  [TAB_ROUTES.HOME]: '⌂',
  [TAB_ROUTES.DIET]: '🍛',
  [TAB_ROUTES.WORKOUT]: '💪',
  [TAB_ROUTES.PROGRESS]: '📈',
  [TAB_ROUTES.PROFILE]: '👤',
};

const TabIcon = ({
  routeName,
  focused,
  color,
}: {
  routeName: string;
  focused: boolean;
  color: string;
}) => (
  <View style={styles.iconWrap}>
    <Text style={[styles.icon, { opacity: focused ? 1 : 0.45 }]}>
      {ICONS[routeName] ?? '●'}
    </Text>
    {focused && <View style={[styles.dot, { backgroundColor: color }]} />}
  </View>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: FC = () => (
  <Tab.Navigator
    initialRouteName={TAB_ROUTES.HOME}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#22C55E',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarLabelStyle: styles.label,
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ focused, color }) => (
        <TabIcon routeName={route.name} focused={focused} color={color} />
      ),
    })}
  >
    <Tab.Screen
      name={TAB_ROUTES.HOME}
      component={HomeStack}
      options={{ title: 'Home' }}
    />
    <Tab.Screen
      name={TAB_ROUTES.DIET}
      component={DietStack}
      options={{ title: 'Diet' }}
    />
    <Tab.Screen
      name={TAB_ROUTES.WORKOUT}
      component={WorkoutStack}
      options={{ title: 'Workout' }}
    />
    <Tab.Screen
      name={TAB_ROUTES.PROGRESS}
      component={ProgressStack}
      options={{ title: 'Progress' }}
    />
    <Tab.Screen
      name={TAB_ROUTES.PROFILE}
      component={ProfileStack}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F1F5F9',
    borderTopWidth: 0.5,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 26,
  },
  icon: {
    fontSize: 20,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
