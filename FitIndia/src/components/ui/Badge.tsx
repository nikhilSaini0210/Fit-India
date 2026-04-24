import React, { FC } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'premium';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  style?: ViewStyle | ViewStyle[];
  small?: boolean;
}

const Badge: FC<BadgeProps> = ({
  label,
  variant = 'default',
  icon,
  style,
  small = false,
}) => {
  const colors = useColors();

  const variantMap: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning },
    error: { bg: colors.errorLight, text: colors.error },
    info: { bg: colors.infoLight, text: colors.info },
    default: { bg: colors.backgroundMuted, text: colors.textSecondary },
    premium: { bg: colors.premiumLight, text: colors.premium },
  };

  const { bg, text } = variantMap[variant];

  return (
    <View
      style={[
        s.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: small ? rs.scale(8) : rs.scale(10),
          paddingVertical: small ? rs.verticalScale(2) : rs.verticalScale(4),
          borderRadius: small ? rs.scale(6) : rs.scale(8),
          gap: rs.scale(4),
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={small ? rs.scale(11) : rs.scale(13)}
          color={text}
        />
      )}
      <Text
        style={[
          s.label,
          {
            color: text,
            fontFamily: fonts.SemiBold,
            fontSize: small ? rs.font(10) : rs.font(12),
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;

const s = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {},
});
