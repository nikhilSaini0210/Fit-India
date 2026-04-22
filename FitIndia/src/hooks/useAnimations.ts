import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useFadeIn = (duration = 600, delay = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const start = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [opacity, duration, delay]);

  return { opacity, start };
};

export const useSlideUp = (distance = 40, duration = 600, delay = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  const start = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, duration, delay]);

  return { opacity, translateY, start };
};

export const useScalePop = (delay = 0) => {
  const scale = useRef(new Animated.Value(0.6)).current;

  const start = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      delay,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scale, delay]);

  return { scale, start };
};

export const usePulse = (min = 0.97, max = 1.03, duration = 900) => {
  const scale = useRef(new Animated.Value(1)).current;

  const start = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: max,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: min,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scale, min, max, duration]);

  const stop = useCallback(() => scale.stopAnimation(), [scale]);

  return { scale, start, stop };
};

export const useShimmer = (width: number, duration = 1200) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  const start = useCallback(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [translateX, width, duration]);

  return { translateX, start };
};

export const usePressScale = (toValue = 0.95) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scale, toValue]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
};

export const useStagger = (
  count: number,
  staggerMs = 80,
  baseDuration = 500,
) => {
  const anims = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(24),
    })),
  ).current;

  const start = useCallback(() => {
    Animated.stagger(
      staggerMs,
      anims.map(({ opacity, translateY }) =>
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: baseDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: baseDuration,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
  }, [anims, staggerMs, baseDuration]);

  return { anims, start };
};

export const useRotate = (duration = 1500) => {
  const rotate = useRef(new Animated.Value(0)).current;

  const start = useCallback(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotate, duration]);

  const interpolate = () =>
    rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return { rotate: interpolate(), start };
};
