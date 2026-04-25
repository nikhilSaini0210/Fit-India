import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface ChipGroupProps {
  label: string;
  options: { value: string; label: string; icon?: string }[];
  selected: string;
  onSelect: (v: string) => void;
  colors: ReturnType<typeof useColors>;
}

const ChipGroup: FC<ChipGroupProps> = ({
  label,
  options,
  selected,
  onSelect,
  colors,
}) => {
  const dynamicStyles = (active: boolean) => ({
    backgroundColor: active ? colors.primary + '18' : colors.backgroundSurface,
    borderColor: active ? colors.primary : colors.border,
    borderWidth: active ? 1.5 : 1,
  });

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, fontFamily: fonts.Medium },
        ]}
      >
        {label}
      </Text>
      <View style={styles.row}>
        {options.map(opt => {
          const active = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={({ pressed }) => [
                styles.chip,
                dynamicStyles(active),
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              {opt.icon && (
                <Text style={{ fontSize: rs.scale(14) }}>{opt.icon}</Text>
              )}
              <Text
                style={[
                  styles.chipText,
                  {
                    color: active ? colors.primary : colors.textSecondary,
                    fontFamily: active ? fonts.SemiBold : fonts.Regular,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default ChipGroup;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: rs.verticalScale(20),
  },
  label: {
    fontSize: rs.font(13),
    marginBottom: rs.verticalScale(8),
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(8),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(5),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(20),
  },
  chipText: {
    fontSize: rs.font(13),
  },
});
