import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';
import Icon from './Icon';

interface PillProps {
  label: string;
  isActive: boolean;
  isCompleted?: boolean;
}

const Pill: FC<PillProps> = ({ label, isActive, isCompleted }) => {
  const colors = useColors();

  return (
    <View
      style={[
        s.stepPill,
        {
          backgroundColor: isActive
            ? colors.primary
            : isCompleted
            ? colors.primary + '20'
            : colors.backgroundSurface,
          borderColor: isActive
            ? colors.primary
            : isCompleted
            ? colors.primary + '40'
            : colors.border,
        },
      ]}
    >
      {isCompleted && (
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="check"
          size={rs.scale(11)}
          color={colors.primary}
          style={s.iconStyle}
        />
      )}
      <Text
        style={[
          s.stepPillText,
          {
            color: isActive
              ? colors.white
              : isCompleted
              ? colors.primary
              : colors.textTertiary,
            fontFamily: isActive ? fonts.SemiBold : fonts.Regular,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default Pill;

const s = StyleSheet.create({
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(5),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  iconStyle: {
    marginRight: rs.moderateScale(3),
  },
  stepPillText: {
    fontSize: rs.font(12),
  },
});
