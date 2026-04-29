import { Animated } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { universalStyles } from '../../../components';
import { rs } from '../../../utils';

interface Props {
  x: number;
  color: string;
  delay: number;
  size: number;
}

const ConfettiParticle: FC<Props> = ({ x, color, delay, size }) => {
  const y = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: rs.screenHeight * 0.75,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleX, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateStr = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        universalStyles.absolute,
        universalStyles.topZero,
        {
          left: x,
          width: size,
          height: size * 0.5,
          borderRadius: size * 0.1,
          backgroundColor: color,
          opacity,
          transform: [{ translateY: y }, { rotate: rotateStr }, { scaleX }],
        },
      ]}
    />
  );
};

export default ConfettiParticle;
