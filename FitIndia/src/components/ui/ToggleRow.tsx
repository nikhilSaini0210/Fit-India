import { StyleSheet, Switch, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { rs } from '../../utils';
import { fonts } from '../../constants';
import Icon from './Icon';

interface ToggleRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: ReturnType<typeof useColors>;
  disabled?: boolean;
}

const ToggleRow: FC<ToggleRowProps> = ({
  icon,
  label,
  subtitle,
  value,
  onToggle,
  colors,
  disabled = false,
}) => {
  const opacity = disabled ? 0.5 : 1;

  return (
    <View style={[styles.row, { opacity }]}>
      <View
        style={[styles.iconWrap, { backgroundColor: colors.backgroundSurface }]}
      >
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={icon}
          size={rs.scale(18)}
          color={value ? colors.primary : colors.textTertiary}
        />
      </View>
      <View style={styles.text}>
        <Text
          style={[
            styles.label,
            { color: colors.textPrimary, fontFamily: fonts.Medium },
          ]}
        >
          {label}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.sub,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: colors.backgroundMuted,
          true: colors.primary + '55',
        }}
        thumbColor={value ? colors.primary : colors.textTertiary}
        ios_backgroundColor={colors.backgroundMuted}
      />
    </View>
  );
};

export default ToggleRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rs.verticalScale(12),
    gap: rs.scale(12),
  },
  iconWrap: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: { fontSize: rs.font(14) },
  sub: { fontSize: rs.font(12), marginTop: rs.verticalScale(1) },
});
