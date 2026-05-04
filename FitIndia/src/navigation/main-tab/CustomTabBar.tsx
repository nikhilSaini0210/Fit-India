import { Platform, StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColors } from '../../store';
import { rs } from '../../utils';
import TabItem from './TabItem';
import { TAB_ACCENT } from './constants';

const getBottomPadding = () => {
  if (Platform.OS !== 'ios') return rs.verticalScale(6);

  return rs.screenHeight >= 812 ? rs.verticalScale(24) : rs.verticalScale(8);
};

const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const colors = useColors();

  const focusedRoute = state.routes[state.index];
  const accentColor = TAB_ACCENT[focusedRoute?.name] ?? colors.primary;

  return (
    <View
      style={[
        styles.tabBarOuter,
        {
          shadowColor: accentColor,
          backgroundColor: colors.tabBar,
          paddingBottom: getBottomPadding(),
        },
      ]}
    >
      <View
        style={[
          styles.hairline,
          {
            backgroundColor: accentColor,
            shadowColor: accentColor,
          },
        ]}
      />

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented)
            navigation.navigate(route.name);
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            route={route.name}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBarOuter: {
    flexDirection: 'row',
    paddingTop: rs.verticalScale(8),
    paddingHorizontal: rs.scale(6),
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 24,
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
    opacity: 0.9,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
});
