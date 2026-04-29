import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { useColors } from '../../../store';
import { Icon } from '../../../components';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';

interface Props {
  icon: string;
  value: string;
  label: string;
  color: string;
}

const AchievementStat: FC<Props> = ({ icon, value, label, color }) => {
  const colors = useColors();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      delay: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.stat, { transform: [{ scale }] }]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={icon}
          size={rs.scale(22)}
          color={color}
        />
      </View>
      <Text
        style={[
          styles.statValue,
          { color: colors.textPrimary, fontFamily: fonts.ExtraBold },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

export default AchievementStat;

const styles = StyleSheet.create({
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: rs.verticalScale(6),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: rs.scale(16),
    padding: rs.scale(14),
  },
  statIconWrap: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: rs.font(22), color: '#F8FAFC' },
  statLabel: { fontSize: rs.font(11), textAlign: 'center' },
});
