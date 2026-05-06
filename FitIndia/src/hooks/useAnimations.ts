import { useCallback, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
  withSpring,
  withRepeat,
  withSequence,
  makeMutable,
} from 'react-native-reanimated';

export const useFadeIn = (duration = 600, delay = 0) => {
  const opacity = useSharedValue(0);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const start = useCallback(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [opacity, duration, delay]);

  return { fadeStyle, start };
};

export const useSlideUp = (distance = 40, duration = 600, delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(distance);

  const slideStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const start = useCallback(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration, easing: Easing.out(Easing.exp) }),
    );
  }, [opacity, translateY, duration, delay]);

  return { slideStyle, start };
};

export const useScalePop = (delay = 0) => {
  const scale = useSharedValue(0.6);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const start = useCallback(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
  }, [scale, delay]);

  return { scaleStyle, start };
};

export const usePulse = (min = 0.97, max = 1.03, duration = 900) => {
  const scale = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const start = useCallback(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(max, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(min, { duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [scale, min, max, duration]);

  const stop = useCallback(() => {
    scale.value = withTiming(1, { duration: 200 });
  }, [scale]);

  return { pulseStyle, start, stop };
};

export const useShimmer = (width: number, duration = 1200) => {
  const translateX = useSharedValue(-width);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const start = useCallback(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [translateX, width, duration]);

  return { shimmerStyle, start };
};

export const usePressScale = (toValue = 0.95) => {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(toValue, { damping: 15, stiffness: 300 });
  }, [scale, toValue]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  return { pressStyle, onPressIn, onPressOut };
};

export const useStagger = (
  count: number,
  staggerMs = 80,
  baseDuration = 500,
) => {
  const opacities = useRef(
    Array.from({ length: count }, () => makeMutable(0)),
  ).current;

  const translatesY = useRef(
    Array.from({ length: count }, () => makeMutable(24)),
  ).current;

  const staggerStyles = opacities.map((opacity, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translatesY[i].value }],
    })),
  );

  const start = useCallback(() => {
    opacities.forEach((opacity, i) => {
      const delay = i * staggerMs;
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: baseDuration,
          easing: Easing.out(Easing.cubic),
        }),
      );
      translatesY[i].value = withDelay(
        delay,
        withTiming(0, {
          duration: baseDuration,
          easing: Easing.out(Easing.exp),
        }),
      );
    });
  }, [opacities, translatesY, staggerMs, baseDuration]);

  return { staggerStyles, start };
};

export const useRotate = (duration = 1500) => {
  const rotation = useSharedValue(0);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  const start = useCallback(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation, duration]);

  return { rotateStyle, start };
};

export const useSpringScale = (from = 0.5) => {
  const scale = useSharedValue(from);

  const scaleSpringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const start = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 120 });
  }, [scale]);

  const reset = useCallback(() => {
    scale.value = from;
  }, [scale, from]);

  return { scaleSpringStyle, start, reset };
};
