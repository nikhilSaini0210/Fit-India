import { Animated, StyleSheet, Text } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useIsOnline, useSafeInsets } from '../utils';

const OfflineBanner: FC = () => {
  const insets = useSafeInsets();
  const height = 44 + insets.top;
  const isOnline = useIsOnline();
  const translateY = useRef(new Animated.Value(-height)).current;

  const [visibleText, setVisibleText] = useState('No internet connection');

  useEffect(() => {
    if (!isOnline) {
      setVisibleText('No internet connection');

      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      setVisibleText('Back online');

      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -height,
            duration: 280,
            useNativeDriver: true,
          }).start();
        }, 1200);
      });
    }
  }, [height, isOnline, translateY]);

  const dynamicStyle = {
    paddingTop: insets.top,
    height,
    transform: [{ translateY }],
    backgroundColor: isOnline ? '#22C55E' : '#EF4444',
  };

  return (
    <Animated.View style={[styles.banner, dynamicStyle]}>
      <Text style={styles.text}>{visibleText}</Text>
    </Animated.View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
