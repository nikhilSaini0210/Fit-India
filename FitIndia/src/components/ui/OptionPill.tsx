import { Pressable, StyleSheet, Text } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../utils';
import Icon from './Icon';
import { useColors } from '../../store';
import { fonts } from '../../constants';

interface Props {
  label: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
  color: string;
}

const OptionPill: FC<Props> = ({ label, icon, selected, onSelect, color }) => {
  const colors = useColors();

  const dynamicStyle = {
    backgroundColor: selected ? color + '18' : colors.backgroundSurface,
    borderColor: selected ? color : colors.border,
    borderWidth: selected ? 2 : 1,
  };

  return (
    <Pressable onPress={onSelect} style={[styles.pill, dynamicStyle]}>
      <Icon
        iconFamily="MaterialCommunityIcons"
        name={icon}
        size={rs.scale(16)}
        color={selected ? color : colors.textTertiary}
      />
      <Text
        style={[
          styles.pillText,
          {
            color: selected ? color : colors.textSecondary,
            fontFamily: selected ? fonts.SemiBold : fonts.Regular,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default OptionPill;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(6),
    paddingHorizontal: rs.scale(14),
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(20),
  },
  pillText: { fontSize: rs.font(13) },
});
