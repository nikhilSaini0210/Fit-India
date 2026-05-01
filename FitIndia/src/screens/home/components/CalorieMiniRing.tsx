import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';

interface Props {
  consumed: number;
  target: number;
  size?: number;
}

const CalorieMiniRing: FC<Props> = ({
  consumed,
  target,
  size = rs.scale(72),
}) => {
  const colors = useColors();
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const progress = useRef(new Animated.Value(0)).current;
  const isOver = consumed > target;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  const ringColor = isOver ? colors.warning : colors.primary;

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <View
        style={[
          styles.ringBg,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ringColor + '20',
            borderWidth: size * 0.07,
          },
        ]}
      />
      <View style={styles.center}>
        <Text
          style={[
            {
              fontSize: rs.font(size * 0.18),
              color: ringColor,
              fontFamily: fonts.Bold,
            },
          ]}
        >
          {consumed}
        </Text>
        <Text
          style={[
            {
              fontSize: rs.font(size * 0.1),
              color: colors.textTertiary,
              fontFamily: fonts.Regular,
            },
          ]}
        >
          kcal
        </Text>
      </View>
    </View>
  );
};

export default CalorieMiniRing;

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: { position: 'absolute' },
  center: { alignItems: 'center' },
});
