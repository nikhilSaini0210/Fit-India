import { StyleSheet, Text } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { rs } from '../../utils';
import { usePulse } from '../../hooks';
import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import { fonts } from '../../constants';
import Animated from 'react-native-reanimated';

interface Props {
  color: string;
  tips: string[];
  iconName: string;
}

const GeneratingAnimation: FC<Props> = ({ color, tips, iconName }) => {
  const { pulseStyle, start: pulseStart } = usePulse(0.9, 1.1, 600);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    pulseStart();
    const t = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 1500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={['#0F172A', '#0D2318', '#0F172A']}
      style={styles.genScreen}
    >
      <Animated.View style={pulseStyle}>
        <LinearGradient
          colors={[color + '30', color + '10']}
          style={[styles.genIconBg, { borderColor: color + '40' }]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={iconName}
            size={rs.scale(42)}
            color={color}
          />
        </LinearGradient>
      </Animated.View>
      <Text
        style={[styles.genTitle, { color: '#F8FAFC', fontFamily: fonts.Bold }]}
      >
        Generating your plan...
      </Text>
      <Text
        style={[
          styles.genTip,
          { color: 'rgba(248,250,252,0.65)', fontFamily: fonts.Regular },
        ]}
      >
        {tips[tipIdx]}
      </Text>
    </LinearGradient>
  );
};

export default GeneratingAnimation;

const styles = StyleSheet.create({
  genScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(24),
    padding: rs.scale(32),
  },
  genIconBg: {
    width: rs.scale(112),
    height: rs.scale(112),
    borderRadius: rs.scale(28),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genTitle: { fontSize: rs.font(22), textAlign: 'center' },
  genTip: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
});
