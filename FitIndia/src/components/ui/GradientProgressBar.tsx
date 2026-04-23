import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../store';

interface Props {
  progress: number;
  height?: number;
  backgroundColor?: string;
  gradientColors?: string[];
  borderRadius?: number;
  animated?: boolean;
  duration?: number;
}

const GradientProgressBar: React.FC<Props> = ({
  progress,
  height = 10,
  backgroundColor,
  gradientColors,
  borderRadius = 10,
  animated = true,
  duration = 500,
}) => {
  const colors = useColors();
  backgroundColor = backgroundColor || colors.progressBg;
  gradientColors = gradientColors || colors.progressGradient;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
      ]}
    >
      <Animated.View style={[styles.aniView, { width: widthInterpolate }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.flex,
            {
              borderRadius,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

export default GradientProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  aniView: {
    height: '100%',
  },
  flex: {
    flex: 1,
  },
});
