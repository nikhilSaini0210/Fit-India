import React, { FC } from 'react';
import { useColors } from '../../store';
import { rs } from '../../utils';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../constants';
import Icon from './Icon';

interface OptionGridProps {
  options: { value: string; label: string; icon: string; desc?: string }[];
  selected: string;
  onSelect: (v: string) => void;
  columns?: number;
}

const OptionGrid: FC<OptionGridProps> = ({
  options,
  selected,
  onSelect,
  columns = 2,
}) => {
  const colors = useColors();

  const colWidth = `${100 / columns - 2}%`;

  return (
    <View style={[s.grid, { gap: rs.scale(10) }]}>
      {options.map(opt => {
        const isActive = selected === opt.value;
        const activeColor = isActive
          ? colors.primary + '15'
          : colors.backgroundCard;
        const borderColor = isActive ? colors.primary : colors.border;
        const borderWidth = isActive ? 2 : 1;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              s.option,
              {
                width: colWidth as any,
                backgroundColor: activeColor,
                borderColor: borderColor,
                borderWidth: borderWidth,
              },
            ]}
          >
            <Text style={s.optIcon}>{opt.icon}</Text>
            <Text
              style={[
                s.optLabel,
                {
                  color: isActive ? colors.primary : colors.textPrimary,
                  fontFamily: fonts.SemiBold,
                },
              ]}
            >
              {opt.label}
            </Text>
            {opt.desc && (
              <Text
                style={[
                  s.optDesc,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {opt.desc}
              </Text>
            )}
            {isActive && (
              <View style={[s.checkBadge, { backgroundColor: colors.primary }]}>
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="check"
                  size={rs.scale(10)}
                  color={colors.white}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default OptionGrid;

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  option: {
    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    alignItems: 'center',
    gap: rs.verticalScale(6),
    minHeight: rs.verticalScale(90),
    justifyContent: 'center',
    position: 'relative',
  },
  optIcon: { fontSize: rs.scale(26) },
  optLabel: { fontSize: rs.font(13), textAlign: 'center' },
  optDesc: {
    fontSize: rs.font(11),
    textAlign: 'center',
    lineHeight: rs.font(16),
  },
  checkBadge: {
    position: 'absolute',
    top: rs.scale(6),
    right: rs.scale(6),
    width: rs.scale(18),
    height: rs.scale(18),
    borderRadius: rs.scale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
