import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { Icon } from '../../../components';
import { fonts } from '../../../constants';

interface Props {
  label: string;
  current?: number;
  unit: string;
  icon: string;
  color: string;
}

const MeasurementRow: FC<Props> = ({ label, current, unit, icon, color }) => {
  const colors = useColors();

  if (!current) return null;

  return (
    <View style={[ms.row, { borderBottomColor: colors.borderMuted }]}>
      <View style={[ms.iconWrap, { backgroundColor: color + '15' }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={icon}
          size={rs.scale(16)}
          color={color}
        />
      </View>
      <Text
        style={[
          ms.label,
          { color: colors.textSecondary, fontFamily: fonts.Medium },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          ms.value,
          { color: colors.textPrimary, fontFamily: fonts.SemiBold },
        ]}
      >
        {current}{' '}
        <Text style={[ms.unit, { color: colors.textTertiary }]}>{unit}</Text>
      </Text>
    </View>
  );
};

export default MeasurementRow;

const ms = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    paddingVertical: rs.verticalScale(10),
    borderBottomWidth: 0.5,
  },
  iconWrap: {
    width: rs.scale(32),
    height: rs.scale(32),
    borderRadius: rs.scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: rs.font(14) },
  value: { fontSize: rs.font(16) },
  unit: { fontSize: rs.font(12) },
});
