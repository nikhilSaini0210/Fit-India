import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { selectUser, useAuthStore, useColors } from '../../store';
import {
  goBack,
  navigate,
  resetAndNavigate,
  rs,
  useSafeInsets,
} from '../../utils';
import {
  useApiError,
  useBackPress,
  useGenerateWorkoutPlan,
  useStagger,
} from '../../hooks';
import { useModal } from '../../context';
import {
  fonts,
  PROFILE_ROUTES,
  ROOT_ROUTES,
  WORKOUT_ROUTES,
} from '../../constants';
import {
  Badge,
  Button,
  Card,
  GeneratingAnimation,
  Header,
  Icon,
  OptionPill,
  ScreenWrapper,
} from '../../components';
import { WORKOUT_TIPS } from '../../helper';
import LinearGradient from 'react-native-linear-gradient';
import { FocusCard } from './components';

const GenerateWorkoutScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const handleError = useApiError();
  const modal = useModal();

  const [days, setDays] = useState(7);
  const [useAI, setUseAI] = useState(true);
  const [workoutType, setWorkoutType] = useState(user?.workoutType ?? 'home');
  const [fitnessLevel, setFitnessLevel] = useState(
    user?.fitnessLevel ?? 'beginner',
  );

  const { mutate, loading } = useGenerateWorkoutPlan();
  const { anims, start } = useStagger(5, 90, 400);
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    if (loading) {
      return true;
    }
    return false;
  }, [loading]);

  useBackPress({ handler: handleBack });

  const onGotoProfile = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.PROFILE,
      },
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!user?.profileComplete) {
      modal({
        title: 'Profile incomplete',
        message:
          'Please complete your profile (weight, height, goal, diet type) before generating a plan.',
        buttons: [
          {
            label: 'Go to profile',
            variant: 'primary',
            onPress: onGotoProfile,
          },
          { label: 'Cancel', variant: 'ghost', onPress: () => {} },
        ],
      });
      return;
    }
    const result = await mutate({ days, useAI });
    if (result.ok) {
      resetAndNavigate(ROOT_ROUTES.MAIN, {
        screen: 'Workout',
        params: {
          screen: WORKOUT_ROUTES.WORKOUT_PLAN,
        },
      });
    } else {
      handleError({
        code: result?.code ?? 'UNKNOWN',
        message: result.error ?? 'Failed to generate',
        isAppError: true,
      });
    }
  }, [user, mutate, days, useAI, modal, onGotoProfile, handleError]);

  if (loading) {
    return (
      <GeneratingAnimation
        color={colors.primary}
        tips={WORKOUT_TIPS}
        iconName="lightning-bolt"
      />
    );
  }

  const fitnessLabels: Record<string, string> = {
    beginner: '🌱 Beginner',
    intermediate: '🔥 Intermediate',
    advanced: '⚡ Advanced',
  };
  const goalLabels: Record<string, string> = {
    weight_loss: '🔥 Fat Loss',
    weight_gain: '⬆️ Bulk',
    muscle_gain: '💪 Muscle',
    maintenance: '⚖️ Maintain',
  };

  return (
    <ScreenWrapper>
      <Header
        title="Generate Workout Plan"
        showBack
        onBack={goBack}
        transparent
      />
      <ScreenWrapper
        scroll
        contentStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(24) },
        ]}
      >
        <Animated.View
          style={{
            opacity: anims[0].opacity,
            transform: [{ translateY: anims[0].translateY }],
          }}
        >
          <LinearGradient
            colors={[colors.primary + '20', colors.primary + '05']}
            style={styles.hero}
          >
            <View
              style={[
                styles.heroIcon,
                {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary + '40',
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="dumbbell"
                size={rs.scale(34)}
                color={colors.primary}
              />
            </View>
            <Text
              style={[
                styles.heroTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              AI Workout Plan
            </Text>
            <Text
              style={[
                styles.heroSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Tailored to your level, goal and available equipment
            </Text>
            <View style={styles.badgeRow}>
              {user?.fitnessLevel && (
                <Badge
                  label={fitnessLabels[user.fitnessLevel] ?? user.fitnessLevel}
                  variant="success"
                />
              )}
              {user?.goal && (
                <Badge
                  label={goalLabels[user.goal] ?? user.goal}
                  variant="info"
                />
              )}
              {user?.workoutType && (
                <Badge
                  label={user.workoutType === 'home' ? '🏠 Home' : '🏋️ Gym'}
                  variant="default"
                />
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[1].opacity,
            transform: [{ translateY: anims[1].translateY }],
          }}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            WHERE DO YOU WORK OUT?
          </Text>
          <View style={styles.typeRow}>
            {[
              {
                val: 'home',
                icon: 'home-outline',
                emoji: '🏠',
                label: 'Home',
                color: '#10B981',
              },
              {
                val: 'gym',
                icon: 'dumbbell',
                emoji: '🏋️',
                label: 'Gym',
                color: colors.primary,
              },
            ].map(opt => (
              <FocusCard
                key={opt.val}
                label={opt.label}
                icon={opt.icon}
                emoji={opt.emoji}
                color={opt.color}
                selected={workoutType === opt.val}
                onSelect={() => setWorkoutType(opt.val as 'gym' | 'home')}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[2].opacity,
            transform: [{ translateY: anims[2].translateY }],
          }}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            FITNESS LEVEL
          </Text>
          <View style={styles.typeRow}>
            {[
              {
                val: 'beginner',
                emoji: '🌱',
                label: 'Beginner',
                color: '#10B981',
              },
              {
                val: 'intermediate',
                emoji: '🔥',
                label: 'Intermediate',
                color: colors.secondary,
              },
              {
                val: 'advanced',
                emoji: '⚡',
                label: 'Advanced',
                color: colors.error,
              },
            ].map(opt => (
              <FocusCard
                key={opt.val}
                label={opt.label}
                icon="star-outline"
                emoji={opt.emoji}
                color={opt.color}
                selected={fitnessLevel === opt.val}
                onSelect={() =>
                  setFitnessLevel(
                    opt.val as 'beginner' | 'intermediate' | 'advanced',
                  )
                }
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[3].opacity,
            transform: [{ translateY: anims[3].translateY }],
          }}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            PLAN DURATION
          </Text>
          <Card style={styles.pillCard}>
            <View style={styles.pillRow}>
              {[
                { val: 7, icon: 'calendar-week', label: '1 week' },
                { val: 14, icon: 'calendar-range', label: '2 weeks' },
                { val: 28, icon: 'calendar-month-outline', label: '4 weeks' },
              ].map(opt => (
                <OptionPill
                  key={opt.val}
                  label={opt.label}
                  icon={opt.icon}
                  selected={days === opt.val}
                  onSelect={() => setDays(opt.val)}
                  color={'#22C55E'}
                />
              ))}
            </View>
          </Card>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[4].opacity,
            transform: [{ translateY: anims[4].translateY }],
          }}
        >
          <Text
            style={[
              styles.label,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            GENERATION MODE
          </Text>
          <View style={styles.modeRow}>
            {[
              {
                val: true,
                icon: 'brain',
                color: '#8B5CF6',
                title: 'AI Generated',
                sub: 'Fully personalised plan',
                badge: 'Best results',
              },
              {
                val: false,
                icon: 'lightning-bolt',
                color: colors.info,
                title: 'Quick Template',
                sub: 'Instant proven routines',
                badge: 'Fastest',
              },
            ].map(opt => (
              <Pressable
                key={String(opt.val)}
                onPress={() => setUseAI(opt.val)}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor:
                      useAI === opt.val
                        ? opt.color + '12'
                        : colors.backgroundCard,
                    borderColor: useAI === opt.val ? opt.color : colors.border,
                    borderWidth: useAI === opt.val ? 2 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.modeIcon,
                    { backgroundColor: opt.color + '20' },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name={opt.icon}
                    size={rs.scale(20)}
                    color={opt.color}
                  />
                </View>
                <Text
                  style={[
                    styles.modeTitle,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {opt.title}
                </Text>
                <Text
                  style={[
                    styles.modeSub,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {opt.sub}
                </Text>
                {useAI === opt.val && (
                  <Badge
                    label={opt.badge}
                    variant="success"
                    small
                    style={{ marginTop: rs.verticalScale(4) }}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <View style={styles.ctaWrap}>
          <Button
            label={`Generate ${days}-Day Plan`}
            onPress={handleGenerate}
            iconRight="arrow-right"
            size="lg"
          />
          <Button label="Cancel" onPress={goBack} variant="ghost" size="md" />
        </View>
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default GenerateWorkoutScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(8),
    gap: rs.verticalScale(20),
  },
  hero: {
    borderRadius: rs.scale(20),
    padding: rs.scale(20),
    alignItems: 'center',
    gap: rs.verticalScale(8),
  },
  heroIcon: {
    width: rs.scale(68),
    height: rs.scale(68),
    borderRadius: rs.scale(20),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs.verticalScale(4),
  },
  heroTitle: { fontSize: rs.font(20), textAlign: 'center' },
  heroSub: {
    fontSize: rs.font(13),
    textAlign: 'center',
    lineHeight: rs.font(20),
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(8),
    justifyContent: 'center',
    marginTop: rs.verticalScale(4),
  },
  label: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
  },
  typeRow: {
    flexDirection: 'row',
    gap: rs.scale(10),
  },
  pillCard: { padding: rs.scale(14) },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(8) },
  modeRow: { flexDirection: 'row', gap: rs.scale(10) },
  modeCard: {
    flex: 1,
    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    gap: rs.verticalScale(4),
  },
  modeIcon: {
    width: rs.scale(38),
    height: rs.scale(38),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs.verticalScale(2),
  },
  modeTitle: { fontSize: rs.font(14) },
  modeSub: { fontSize: rs.font(12), lineHeight: rs.font(17) },
  ctaWrap: { gap: rs.verticalScale(10), marginTop: rs.verticalScale(4) },
});
