import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { rs } from '../../utils';
import { fonts } from '../../constants';
import { useColors } from '../../store';
import { Icon } from '../../components';

const features = [
  {
    icon: 'clipboard-list',
    text: 'Personalized\nDiet Plans',
    top: 0,
    left: rs.scale(10),
  },
  {
    icon: 'dumbbell',
    text: 'AI Workout\nPlans',
    top: rs.scale(65),
    left: rs.scale(50),
  },
  {
    icon: 'whatsapp',
    text: 'Smart\nReminders',
    top: rs.scale(145),
    left: rs.scale(55),
  },
  {
    icon: 'chart-line',
    text: 'Track Your\nProgress',
    top: rs.scale(220),
    left: rs.scale(25),
  },
];

const Features: FC = () => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Svg height="250" width="160" style={styles.svg}>
        <Path
          d="M20 10 Q140 140 20 270"
          stroke={colors.line}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="8,8"
        />
      </Svg>

      {features.map((item, index) => (
        <View
          key={index}
          style={[styles.item, { top: item.top, left: item.left }]}
        >
          <LinearGradient
            colors={colors.progressGradient}
            style={[styles.iconBg, { shadowColor: colors.primary }]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name={item.icon}
              size={rs.font(20)}
              color={colors.textInverse}
            />
          </LinearGradient>

          <Text style={[styles.text, { color: colors.textPrimary }]}>
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  container: {
    width: rs.scale(180),
    height: rs.scale(280),
    position: 'relative',
  },

  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  item: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
  },

  iconBg: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(20),
    alignItems: 'center',
    justifyContent: 'center',

    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },

  text: {
    fontSize: rs.font(12),
    lineHeight: rs.font(16),
    fontFamily: fonts.SemiBold,
  },
});
