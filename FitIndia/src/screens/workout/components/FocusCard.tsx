import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { Icon } from '../../../components';

interface Props {
  label: string;
  icon: string;
  emoji: string;
  color: string;
  selected: boolean;
  onSelect: () => void;
}

const FocusCard: FC<Props> = ({
  label,
  icon,
  emoji,
  color,
  selected,
  onSelect,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    backgroundColor: selected ? color + '15' : colors.backgroundCard,
    borderColor: selected ? color : colors.border,
    borderWidth: selected ? 2 : 1,
  };

  return (
    <Pressable onPress={onSelect} style={[styles.focusCard, dynamicStyles]}>
      <Text style={{ fontSize: rs.scale(22) }}>{emoji}</Text>
      <Text
        style={[
          styles.focusLabel,
          {
            color: selected ? color : colors.textPrimary,
            fontFamily: selected ? fonts.SemiBold : fonts.Regular,
          },
        ]}
      >
        {label}
      </Text>
      {selected && (
        <View style={[styles.focusCheck, { backgroundColor: color }]}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="check"
            size={rs.scale(9)}
            color={colors.white}
          />
        </View>
      )}
    </Pressable>
  );
};

export default FocusCard;

const styles = StyleSheet.create({
  focusCard: {
    flex: 1,
    alignItems: 'center',
    padding: rs.scale(14),
    borderRadius: rs.scale(14),
    gap: rs.verticalScale(6),
    position: 'relative',
    minHeight: rs.verticalScale(80),
    justifyContent: 'center',
  },
  focusLabel: { fontSize: rs.font(13), textAlign: 'center' },
  focusCheck: {
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
