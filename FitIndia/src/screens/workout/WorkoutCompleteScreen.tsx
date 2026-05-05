import { Animated as RNAnimated, Share, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { WorkoutStackScreenProps } from '../../types';
import { selectUser, useAuthStore, useColors } from '../../store';
import { resetAndNavigate, resetStack, rs, useSafeInsets } from '../../utils';
import { usePulse, useScalePop, useStagger } from '../../hooks';
import { CONFETTI_COLORS } from '../../helper';
import { Button, Icon, ScreenWrapper, universalStyles } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts, ROOT_ROUTES, WORKOUT_ROUTES } from '../../constants';
import { AchievementStat, ConfettiParticle } from './components';
import Animated from 'react-native-reanimated';

type Props = WorkoutStackScreenProps<'WorkoutComplete'>;

const WorkoutCompleteScreen: FC<Props> = ({ route }) => {
  const { caloriesBurned, duration, dayNumber } = route.params;
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);

  const { scaleStyle, start: trophyPop } = useScalePop(800);
  const { pulseStyle, start: pulseStart } = usePulse(0.96, 1.04, 1000);
  const { anims, start: staggerStart } = useStagger(3, 120, 500);

  const titleOpacity = useRef(new RNAnimated.Value(0)).current;
  const titleY = useRef(new RNAnimated.Value(40)).current;

  // Confetti config

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * rs.screenWidth,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 800,
    size: rs.scale(8 + Math.random() * 10),
  }));

  useEffect(() => {
    trophyPop();
    pulseStart();
    staggerStart();

    RNAnimated.sequence([
      RNAnimated.delay(300),
      RNAnimated.parallel([
        RNAnimated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.spring(titleY, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `🔥 Just crushed a ${duration}-minute workout and burned ${caloriesBurned} calories on FitIndia! 💪\n\n#FitIndia #IndianFitness #WorkoutComplete`,
      });
    } catch {
      /* ignore */
    }
  }, [caloriesBurned, duration]);

  const onWorkoutToday = useCallback(() => {
    resetAndNavigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen: WORKOUT_ROUTES.WORKOUT_TODAY,
      },
    });
  }, []);

  const onViewPlan = useCallback(() => {
    resetStack([
      {
        name: ROOT_ROUTES.MAIN,
        params: {
          screen: 'Workout',
          params: {
            screen: WORKOUT_ROUTES.WORKOUT_PLAN,
          },
        },
      },
      {
        name: ROOT_ROUTES.MAIN,
        params: {
          screen: 'Workout',
          params: {
            screen: WORKOUT_ROUTES.WORKOUT_TODAY,
          },
        },
      },
    ]);
  }, []);

  const motivationalLines = [
    'You crushed it! Keep going! 🔥',
    "That's what champions are made of! 🏆",
    'One workout closer to your goal! ✨',
    'Your future self thanks you! 💪',
    `${user?.name?.split(' ')[0] ?? 'You'}, you're unstoppable! ⚡`,
  ];

  const [line] = useState(
    motivationalLines[Math.floor(Math.random() * motivationalLines.length)],
  );

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={['#0F172A', '#0D2318', '#0A1628']}
        style={StyleSheet.absoluteFill}
      />
      {confetti.map((c, i) => (
        <ConfettiParticle key={i} {...c} />
      ))}

      <View
        style={[
          s.content,
          {
            paddingTop: insets.top + rs.verticalScale(32),
            paddingBottom: insets.bottom + rs.verticalScale(24),
          },
        ]}
      >
        {/* Trophy */}
        <Animated.View style={scaleStyle}>
          <Animated.View style={pulseStyle}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.trophyBg}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="trophy"
                size={rs.scale(52)}
                color="#FFF"
              />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Title */}
        <RNAnimated.View
          style={[
            s.titleWrap,
            { opacity: titleOpacity, transform: [{ translateY: titleY }] },
          ]}
        >
          <Text style={[s.title, { fontFamily: fonts.ExtraBold }]}>
            Workout Complete! 🎉
          </Text>
          <Text
            style={[
              s.motiveLine,
              { color: 'rgba(248,250,252,0.7)', fontFamily: fonts.Medium },
            ]}
          >
            {line}
          </Text>
        </RNAnimated.View>

        {/* Stats */}
        <RNAnimated.View
          style={[
            s.statsGrid,
            {
              opacity: anims[0].opacity,
              transform: [{ translateY: anims[0].translateY }],
            },
          ]}
        >
          <AchievementStat
            icon="fire"
            value={`${caloriesBurned}`}
            label="Calories burned"
            color="#EF4444"
          />
          <AchievementStat
            icon="clock-outline"
            value={`${duration}m`}
            label="Duration"
            color="#3B82F6"
          />
          <AchievementStat
            icon="calendar-check-outline"
            value={`Day ${dayNumber}`}
            label="Completed"
            color={colors.primary}
          />
        </RNAnimated.View>

        {/* Streak encouragement */}
        <RNAnimated.View
          style={[
            s.streakCard,
            {
              opacity: anims[1].opacity,
              transform: [{ translateY: anims[1].translateY }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary + '20', colors.primary + '08']}
            style={[s.streakGrad, { borderColor: colors.primary + '30' }]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="lightning-bolt"
              size={rs.scale(20)}
              color={colors.primary}
            />
            <Text
              style={[
                s.streakText,
                { color: colors.primary, fontFamily: fonts.Medium },
              ]}
            >
              Keep your streak alive! Log your next workout tomorrow.
            </Text>
          </LinearGradient>
        </RNAnimated.View>

        {/* Actions */}
        <RNAnimated.View
          style={[
            s.actions,
            {
              opacity: anims[2].opacity,
              transform: [{ translateY: anims[2].translateY }],
            },
          ]}
        >
          <Button label="Back to home" onPress={onWorkoutToday} size="lg" />
          <View style={s.secondaryRow}>
            <Button
              label="Share"
              onPress={handleShare}
              variant="ghost"
              iconLeft="share-variant-outline"
              size="md"
              fullWidth={false}
              style={universalStyles.flex}
            />
            <Button
              label="View plan"
              onPress={onViewPlan}
              variant="secondary"
              iconLeft="calendar-week"
              size="md"
              fullWidth={false}
              style={universalStyles.flex}
            />
          </View>
        </RNAnimated.View>
      </View>
    </ScreenWrapper>
  );
};

export default WorkoutCompleteScreen;

const s = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rs.scale(24),
    gap: rs.verticalScale(24),
  },
  trophyBg: {
    width: rs.scale(112),
    height: rs.scale(112),
    borderRadius: rs.scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: rs.scale(8) },
    shadowOpacity: 0.5,
    shadowRadius: rs.scale(20),
    elevation: 12,
  },
  titleWrap: { alignItems: 'center', gap: rs.verticalScale(8) },
  title: { fontSize: rs.font(30), color: '#F8FAFC', textAlign: 'center' },
  motiveLine: {
    fontSize: rs.font(16),
    textAlign: 'center',
    lineHeight: rs.font(24),
  },
  statsGrid: { flexDirection: 'row', gap: rs.scale(12), width: '100%' },
  streakCard: { width: '100%' },
  streakGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    padding: rs.scale(14),
    borderRadius: rs.scale(14),
    borderWidth: 1,
  },
  streakText: { flex: 1, fontSize: rs.font(13), lineHeight: rs.font(20) },
  actions: { width: '100%', gap: rs.verticalScale(10) },
  secondaryRow: { flexDirection: 'row', gap: rs.scale(10) },
});
