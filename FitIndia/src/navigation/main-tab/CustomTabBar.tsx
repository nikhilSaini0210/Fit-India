import { Platform, StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColors } from '../../store';
import { rs } from '../../utils';
import TabItem from './TabItem';

const getBottomPadding = () => {
  if (Platform.OS !== 'ios') return rs.verticalScale(6);

  return rs.screenHeight >= 812 ? rs.verticalScale(24) : rs.verticalScale(8);
};

const CustomTabBar: FC<BottomTabBarProps> = ({ state, navigation }) => {
  const colors = useColors();

  return (
    <View
      style={[
        styles.tabBarOuter,
        {
          shadowColor: colors.black,
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: getBottomPadding(),
        },
      ]}
    >
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
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: rs.verticalScale(8),
    paddingHorizontal: rs.scale(6),
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 20,
  },
});
