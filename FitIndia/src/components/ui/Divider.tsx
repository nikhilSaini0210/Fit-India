import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface DividerProps {
  label?: string;
  marginV?: number;
}

const Divider: FC<DividerProps> = ({
  label,
  marginV = rs.verticalScale(20),
}) => {
  const colors = useColors();

  if (!label) {
    return (
      <View
        style={[
          s.line,
          { backgroundColor: colors.border, marginVertical: marginV },
        ]}
      />
    );
  }

  return (
    <View style={[s.row, { marginVertical: marginV }]}>
      <View style={[s.line, s.flex, { backgroundColor: colors.border }]} />
      <Text
        style={[
          s.label,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {label}
      </Text>
      <View style={[s.line, s.flex, { backgroundColor: colors.border }]} />
    </View>
  );
};

export default Divider;

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  line: { height: 0.75 },
  row: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(12) },
  label: { fontSize: rs.font(13) },
});
