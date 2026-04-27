import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { rs } from '../../utils';
import { usePulse, useRotate } from '../../hooks';
import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import { fonts } from '../../constants';

interface Props {
  color: string;
  tips: string[];
}

const GeneratingAnimation: FC<Props> = ({ color, tips }) => {
  const { rotate, start } = useRotate(1200);
  const { scale, start: pulseStart } = usePulse(0.9, 1.1, 600);

  useEffect(() => {
    start();
    pulseStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 1500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.genWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={[color + '30', color + '10']}
          style={[styles.genIconBg, { borderColor: color + '40' }]}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="lightning-bolt"
              size={rs.scale(40)}
              color={color}
            />
          </Animated.View>
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
    </View>
  );
};

export default GeneratingAnimation;

const styles = StyleSheet.create({
  genWrap: {
    alignItems: 'center',
    gap: rs.verticalScale(20),
    paddingHorizontal: rs.scale(32),
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
