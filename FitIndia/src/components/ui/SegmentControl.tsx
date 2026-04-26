import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { rs } from '../../utils';
import { fonts } from '../../constants';

interface Props {
  options: { value: string; label: string; icon?: string }[];
  selected: string;
  onSelect: (v: string) => void;
  colors: ReturnType<typeof useColors>;
}

const SegmentControl: FC<Props> = ({ options, selected, onSelect, colors }) => {
  return (
    <View style={[styles.wrap, { backgroundColor: colors.backgroundSurface }]}>
      {options.map(opt => {
        const active = selected === opt.value;
        return (
          <View
            key={opt.value}
            style={[
              styles.item,
              active && [
                styles.active,
                {
                  backgroundColor: colors.backgroundCard,
                  shadowColor: colors.shadow,
                },
              ],
            ]}
          >
            <Text
              onPress={() => onSelect(opt.value)}
              style={[
                styles.label,
                {
                  color: active ? colors.textPrimary : colors.textTertiary,
                  fontFamily: active ? fonts.SemiBold : fonts.Regular,
                },
              ]}
            >
              {opt.icon ? `${opt.icon} ` : ''}
              {opt.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default SegmentControl;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: rs.scale(12),
    padding: rs.scale(3),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(10),
  },
  active: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: { fontSize: rs.font(13) },
});
