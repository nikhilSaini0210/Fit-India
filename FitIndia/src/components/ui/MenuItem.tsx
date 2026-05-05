import {  Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { usePressScale } from '../../hooks';
import Icon from './Icon';
import { rs } from '../../utils';
import { fonts } from '../../constants';
import Badge from './Badge';
import Animated from 'react-native-reanimated';

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
  rightElement?: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}

const MenuItem: FC<MenuItemProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  danger = false,
  badge,
  rightElement,
  colors,
}) => {
  const { pressStyle, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      android_ripple={{ color: colors.primary + '15' }}
    >
      <Animated.View style={[styles.menuItem, pressStyle]}>
        <View
          style={[
            styles.menuIconWrap,
            {
              backgroundColor: danger
                ? colors.errorLight
                : colors.backgroundSurface,
            },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={icon}
            size={rs.scale(19)}
            color={danger ? colors.error : colors.primary}
          />
        </View>
        <View style={styles.menuText}>
          <Text
            style={[
              styles.menuLabel,
              {
                color: danger ? colors.error : colors.textPrimary,
                fontFamily: fonts.Medium,
              },
            ]}
          >
            {label}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.menuSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {badge ? (
          <Badge label={badge} variant="warning" small />
        ) : rightElement ? (
          rightElement
        ) : (
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="chevron-right"
            size={rs.scale(18)}
            color={colors.textTertiary}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs.scale(14),
    paddingVertical: rs.verticalScale(13),
    gap: rs.scale(12),
  },
  menuIconWrap: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: rs.verticalScale(1),
  },
  menuLabel: {
    fontSize: rs.font(14),
  },
  menuSub: {
    fontSize: rs.font(12),
  },
});
