import React, { useRef, useCallback, FC } from 'react';
import {
  Animated,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';
import Icon from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const SIZE_MAP = {
  sm: {
    paddingV: rs.verticalScale(10),
    paddingH: rs.scale(16),
    fontSize: rs.font(13),
    iconSize: rs.scale(15),
    radius: rs.scale(10),
  },
  md: {
    paddingV: rs.verticalScale(14),
    paddingH: rs.scale(24),
    fontSize: rs.font(15),
    iconSize: rs.scale(18),
    radius: rs.scale(14),
  },
  lg: {
    paddingV: rs.verticalScale(18),
    paddingH: rs.scale(32),
    fontSize: rs.font(17),
    iconSize: rs.scale(20),
    radius: rs.scale(16),
  },
};

const Button: FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  const sz = SIZE_MAP[size];

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const isDisabled = disabled || loading;

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const textColor = isPrimary
    ? colors.white
    : isDanger
    ? colors.white
    : isSecondary
    ? colors.primary
    : colors.textSecondary;

  const gradientColors: [string, string] = isDanger
    ? [colors.dangerA, colors.dangerB]
    : isPrimary
    ? [colors.primary, colors.primaryDark]
    : ['transparent', 'transparent'];

  const wrapperStyle: ViewStyle = {
    borderRadius: sz.radius,
    borderWidth: isGhost || isSecondary ? 1.5 : 0,
    borderColor: isSecondary
      ? colors.primary
      : isGhost
      ? colors.border
      : 'transparent',
    overflow: 'hidden',
    opacity: isDisabled ? 0.55 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={wrapperStyle}
        android_ripple={{ color: colors.whiteTr, borderless: false }}
      >
        <LinearGradient
          colors={
            isPrimary || isDanger
              ? gradientColors
              : ['transparent', 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            s.inner,
            {
              paddingVertical: sz.paddingV,
              paddingHorizontal: sz.paddingH,
              backgroundColor: isSecondary
                ? colors.primary + '10'
                : isGhost
                ? 'transparent'
                : undefined,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size={sz.iconSize} color={textColor} />
          ) : (
            <>
              {iconLeft && (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name={iconLeft}
                  size={sz.iconSize}
                  color={textColor}
                  style={s.iconL}
                />
              )}
              <Text
                style={[
                  s.label,
                  {
                    fontSize: sz.fontSize,
                    color: textColor,
                    fontFamily: fonts.SemiBold,
                  },
                  textStyle,
                ]}
              >
                {label}
              </Text>
              {iconRight && (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name={iconRight}
                  size={sz.iconSize}
                  color={textColor}
                  style={s.iconR}
                />
              )}
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default Button;

const s = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.scale(6),
  },
  label: { textAlign: 'center' },
  iconL: { marginRight: rs.scale(2) },
  iconR: { marginLeft: rs.scale(2) },
});
