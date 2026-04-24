import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useColors } from '../../store';
import { LABEL_MAX_WIDTH, TAB_CONFIG } from './constants';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import { rs } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../../components';
import { fonts } from '../../constants';

const MAX_FONT = rs.font(12);
const MIN_FONT = rs.font(9);

interface TabItemProps {
  route: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: FC<TabItemProps> = ({
  route,
  isFocused,
  onPress,
  onLongPress,
}) => {
  const colors = useColors();
  const cfg = TAB_CONFIG[route];

  const progress = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const tapScale = useRef(new Animated.Value(1)).current;
  const iconBounce = useRef(new Animated.Value(1)).current;
  const animatedFont = useRef(new Animated.Value(MAX_FONT)).current;

  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const containerWidth = useRef(0);

  useEffect(() => {
    setReady(false);
    setMeasuredWidth(0);
    animatedFont.setValue(MAX_FONT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, isFocused]);

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.timing(progress, {
          toValue: 1,
          duration: 230,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.spring(iconBounce, {
            toValue: 1.2,
            friction: 6,
            tension: 180,
            useNativeDriver: true,
          }),
          Animated.spring(iconBounce, {
            toValue: 1,
            friction: 6,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.spring(tapScale, {
        toValue: 0.85,
        friction: 6,
        tension: 220,
        useNativeDriver: true,
      }),
      Animated.spring(tapScale, {
        toValue: 1,
        friction: 6,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPress]);

  const pillOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const labelMaxWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, LABEL_MAX_WIDTH],
    extrapolate: 'clamp',
  });

  const labelMargin = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, rs.scale(5)],
    extrapolate: 'clamp',
  });

  const labelOpacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const dotOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const iconColor = isFocused ? colors.primary : colors.tabInactive;

  useEffect(() => {
    if (measuredWidth === 0 || containerWidth.current <= 0) return;

    let low = MIN_FONT;
    let high = MAX_FONT;
    let best = MIN_FONT;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      const scaledWidth = (measuredWidth / MAX_FONT) * mid;

      if (scaledWidth <= containerWidth.current) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    Animated.timing(animatedFont, {
      toValue: best,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measuredWidth]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      android_ripple={null}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={cfg.label}
    >
      <Animated.View
        style={[styles.pill, { transform: [{ scale: tapScale }] }]}
      >
        <Animated.View
          style={[styles.pillBg, { opacity: pillOpacity }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[colors.primary + '28', colors.primary + '0E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: iconBounce }] }}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={isFocused ? cfg.iconFocused : cfg.icon}
            size={rs.scale(22)}
            color={iconColor}
          />
        </Animated.View>

        <Animated.View
          onLayout={e => {
            const width = e.nativeEvent.layout.width;

            if (width > 0 && containerWidth.current !== width) {
              containerWidth.current = width;
              setReady(false);
            }
          }}
          style={[
            styles.labelWrap,
            {
              maxWidth: labelMaxWidth,
              marginLeft: labelMargin,
              opacity: labelOpacity,
            },
          ]}
        >
          {!ready && (
            <Text
              style={styles.hiddenText}
              onLayout={e => {
                setMeasuredWidth(e.nativeEvent.layout.width);
              }}
            >
              {cfg.label}
            </Text>
          )}

          {ready && (
            <Animated.Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: iconColor,
                  fontFamily: fonts.SemiBold,
                  fontSize: animatedFont,
                },
              ]}
            >
              {cfg.label}
            </Animated.Text>
          )}
        </Animated.View>
      </Animated.View>

      {isFocused && (
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: colors.primary, opacity: dotOpacity },
          ]}
        />
      )}
    </Pressable>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs.verticalScale(2),
    minHeight: 48,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(7),
    borderRadius: rs.scale(24),
    overflow: 'hidden',
  },
  pillBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: rs.scale(24),
    overflow: 'hidden',
  },
  labelWrap: {
    overflow: 'hidden',
  },
  label: {
    flexShrink: 1,
  },
  hiddenText: {
    position: 'absolute',
    opacity: 0,
    fontSize: MAX_FONT,
    fontFamily: fonts.SemiBold,
  },
  dot: {
    width: rs.scale(4),
    height: rs.scale(4),
    borderRadius: rs.scale(2),
    marginTop: rs.verticalScale(3),
  },
});
