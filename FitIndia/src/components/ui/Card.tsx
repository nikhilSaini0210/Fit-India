import React, { FC, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  gradient?: boolean;
  gradientColors?: [string, string];
  padding?: number;
  radius?: number;
}

export const Card: FC<CardProps> = ({
  children,
  style,
  onPress,
  gradient = false,
  gradientColors,
  padding = rs.scale(16),
  radius = rs.scale(16),
}) => {
  const colors = useColors();
  const gc = gradientColors ?? [colors.primary, colors.primaryDark];

  const content = (
    <>
      {gradient ? (
        <LinearGradient
          colors={gc}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.gradient, { padding, borderRadius: radius }]}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={{ padding }}>{children}</View>
      )}
    </>
  );

  const cardStyle: ViewStyle = {
    backgroundColor: gradient ? 'transparent' : colors.backgroundCard,
    borderRadius: radius,
    borderWidth: gradient ? 0 : 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: rs.verticalScale(2) },
    shadowOpacity: 0.06,
    shadowRadius: rs.scale(8),
    elevation: 3,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.primary + '15' }}
        style={[cardStyle, style]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{content}</View>;
};

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}

export const StatCard: FC<StatCardProps> = ({
  value,
  label,
  icon,
  color,
  style,
}) => {
  const colors = useColors();

  return (
    <Card style={[s.statCard, style]}>
      {icon && (
        <View
          style={[
            s.statIconWrap,
            { backgroundColor: (color ?? colors.primary) + '18' },
          ]}
        >
          {icon}
        </View>
      )}
      <Text
        style={[
          s.statValue,
          { color: color ?? colors.textPrimary, fontFamily: fonts.Bold },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          s.statLabel,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {label}
      </Text>
    </Card>
  );
};

const s = StyleSheet.create({
  gradient: {},
  statCard: {
    alignItems: 'center',
    padding: rs.scale(16),
    gap: rs.verticalScale(4),
  },
  statIconWrap: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs.verticalScale(4),
  },
  statValue: {
    fontSize: rs.font(24),
  },
  statLabel: {
    fontSize: rs.font(12),
    textAlign: 'center',
  },
});
