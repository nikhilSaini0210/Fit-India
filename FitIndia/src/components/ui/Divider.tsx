import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface DividerProps {
  label?: string;
  marginV?: number;
  backgroundColor?: string;
  height?: number;
  labelColor?: string;
  marginL?: number;
}

const Divider: FC<DividerProps> = ({
  label,
  marginV = rs.verticalScale(20),
  backgroundColor,
  height = 0.75,
  labelColor,
  marginL = 0,
}) => {
  const colors = useColors();

  const dividerColor = backgroundColor ?? colors.border;
  const textColor = labelColor ?? colors.textTertiary;

  if (!label) {
    return (
      <View
        style={{
          backgroundColor: dividerColor,
          marginVertical: marginV,
          height,
          marginLeft: marginL,
        }}
      />
    );
  }

  return (
    <View style={[s.row, { marginVertical: marginV, marginLeft: marginL }]}>
      <View style={[s.flex, { backgroundColor: dividerColor, height }]} />
      <Text
        style={[s.label, { color: textColor, fontFamily: fonts.Regular }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <View style={[s.flex, { backgroundColor: dividerColor, height }]} />
    </View>
  );
};

export default Divider;

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
  },
  label: {
    fontSize: rs.font(13),
  },
});
