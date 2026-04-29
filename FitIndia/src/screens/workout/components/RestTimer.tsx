import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../../../components';
import { fonts } from '../../../constants';

interface RestTimerProps {
  seconds: number;
  onFinish?: () => void;
  onSkip?: () => void;
}

const RestTimer: FC<RestTimerProps> = ({ seconds, onFinish, onSkip }) => {
  const colors = useColors();
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Entry animation
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          Vibration.vibrate([0, 100, 50, 100]);
          onFinish?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Progress ring
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: remaining / seconds,
      duration: 900,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  // Pulse when < 5 seconds
  useEffect(() => {
    if (remaining <= 5 && remaining > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining <= 5]);

  const togglePause = useCallback(() => {
    if (running) clearInterval(intervalRef.current!);
    setRunning(r => !r);
  }, [running]);

  const urgentColor =
    remaining <= 5
      ? colors.error
      : remaining <= 15
      ? colors.warning
      : colors.primary;
  const SIZE = rs.scale(160);
  const STROKE = SIZE * 0.06;

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[colors.backgroundCard, colors.backgroundSurface]}
        style={[styles.card, { borderColor: urgentColor + '30' }]}
      >
        {/* Label */}
        <View style={styles.labelRow}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="timer-outline"
            size={rs.scale(16)}
            color={urgentColor}
          />
          <Text
            style={[
              styles.label,
              { color: urgentColor, fontFamily: fonts.SemiBold },
            ]}
          >
            Rest Time
          </Text>
        </View>

        {/* Ring */}
        <Animated.View
          style={[styles.ringWrap, { transform: [{ scale: pulseAnim }] }]}
        >
          {/* Background ring */}
          <View
            style={[
              styles.ringBg,
              {
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderWidth: STROKE,
                borderColor: urgentColor + '18',
              },
            ]}
          />
          {/* Center */}
          <View style={styles.ringCenter}>
            <Animated.Text
              style={[
                styles.timerNum,
                {
                  color: urgentColor,
                  fontFamily: fonts.ExtraBold,
                  fontSize: rs.font(SIZE * 0.26),
                },
              ]}
            >
              {remaining}
            </Animated.Text>
            <Text
              style={[
                styles.timerSec,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              seconds
            </Text>
          </View>
        </Animated.View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            onPress={togglePause}
            style={[
              styles.controlBtn,
              {
                backgroundColor: urgentColor + '15',
                borderColor: urgentColor + '40',
              },
            ]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name={running ? 'pause' : 'play'}
              size={rs.scale(20)}
              color={urgentColor}
            />
            <Text
              style={[
                styles.controlText,
                { color: urgentColor, fontFamily: fonts.Medium },
              ]}
            >
              {running ? 'Pause' : 'Resume'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onSkip}
            style={[
              styles.controlBtn,
              {
                backgroundColor: colors.backgroundSurface,
                borderColor: colors.border,
              },
            ]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="skip-next"
              size={rs.scale(20)}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.controlText,
                { color: colors.textSecondary, fontFamily: fonts.Medium },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default RestTimer;

const styles = StyleSheet.create({
  wrap: { marginVertical: rs.verticalScale(16) },
  card: {
    borderRadius: rs.scale(24),
    padding: rs.scale(24),
    alignItems: 'center',
    gap: rs.verticalScale(20),
    borderWidth: 1.5,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(6) },
  label: { fontSize: rs.font(14), letterSpacing: 0.4 },
  ringWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: { position: 'absolute' },
  ringCenter: { alignItems: 'center' },
  timerNum: {},
  timerSec: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
  controls: { flexDirection: 'row', gap: rs.scale(12) },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(6),
    paddingHorizontal: rs.scale(20),
    paddingVertical: rs.verticalScale(10),
    borderRadius: rs.scale(14),
    borderWidth: 1,
  },
  controlText: { fontSize: rs.font(13) },
});
