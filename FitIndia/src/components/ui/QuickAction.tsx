import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { usePressScale } from '../../hooks';
import { useColors } from '../../store';
import { rs } from '../../utils';
import Icon from './Icon';
import { fonts } from '../../constants';

interface Props {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  badge?: string;
}

const QuickAction: FC<Props> = ({ icon, label, color, onPress, badge }) => {
  const colors = useColors();
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.wrap,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.iconBg, { backgroundColor: color + '18' }]}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={icon}
            size={rs.scale(22)}
            color={color}
          />
        </View>
        {badge && (
          <View style={[styles.badgeDot, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeDotText}>{badge}</Text>
          </View>
        )}
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, fontFamily: fonts.Medium },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  wrap: {
    width: (rs.screenWidth - rs.scale(52)) / 4,
    alignItems: 'center',
    borderRadius: rs.scale(16),
    borderWidth: 1,
    padding: rs.scale(12),
    gap: rs.verticalScale(6),
    position: 'relative',
  },
  iconBg: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: rs.font(11), textAlign: 'center' },
  badgeDot: {
    position: 'absolute',
    top: rs.scale(8),
    right: rs.scale(8),
    width: rs.scale(8),
    height: rs.scale(8),
    borderRadius: rs.scale(4),
  },
  badgeDotText: { color: '#FFF', fontSize: rs.font(8) },
});
