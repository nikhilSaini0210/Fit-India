import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import Icon from './Icon';
import { rs } from '../../utils';
import { fonts } from '../../constants';
import { useColors } from '../../store';

interface Props {
  icon: string;
  value: string;
  label: string;
  color: string;
}

const StatChip: FC<Props> = ({ icon, value, label, color }) => {
  const colors = useColors();

  return (
    <View
      style={[
        styles.statChip,
        { backgroundColor: color + '15', borderColor: color + '30' },
      ]}
    >
      <Icon
        iconFamily="MaterialCommunityIcons"
        name={icon}
        size={rs.scale(16)}
        color={color}
      />
      <View>
        <Text
          style={[
            styles.chipValue,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          {value}
        </Text>
        <Text
          style={[
            styles.chipLabel,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

export default StatChip;

const styles = StyleSheet.create({
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(8),
    padding: rs.scale(10),
    borderRadius: rs.scale(12),
    borderWidth: 1,
    flex: 1,
    minWidth: rs.scale(80),
  },
  chipValue: { fontSize: rs.font(14) },
  chipLabel: { fontSize: rs.font(10) },
});
