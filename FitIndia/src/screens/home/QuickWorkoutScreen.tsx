import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { goBack, rs, useSafeInsets } from '../../utils';
import {
  Button,
  Card,
  GeneratingAnimation,
  Header,
  ScreenWrapper,
  universalStyles,
} from '../../components';
import { selectUser, useAuthStore, useColors } from '../../store';
import { useApiError, useStagger } from '../../hooks';
import { workoutApi } from '../../services/api';
import LinearGradient from 'react-native-linear-gradient';
import { FOCUS_OPTIONS, quickTips, TYPE_OPTIONS } from '../../helper';
import { fonts } from '../../constants';
import { ExerciseRow } from './components';

const QuickWorkoutScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const handleError = useApiError();

  const [focus, setFocus] = useState('full_body');
  const [workType, setWorkType] = useState(user?.workoutType ?? 'home');
  const [generating, setGenerating] = useState(false);
  const [workout, setWorkout] = useState<any>(null);

  const { anims, start } = useStagger(3, 80, 400);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusCfg =
    FOCUS_OPTIONS.find(f => f.value === focus) ?? FOCUS_OPTIONS[0];

  const handleGenerate = async () => {
    setGenerating(true);
    setWorkout(null);
    try {
      const res = await workoutApi.getQuick({ focus, workoutType: workType });
      const data = (res as any)?.data?.data ?? (res as any)?.data ?? res;
      setWorkout(data?.workout ?? data);
    } catch (err) {
      handleError(err);
    } finally {
      setGenerating(false);
    }
  };

  if (generating) {
    return (
      <GeneratingAnimation
        color={focusCfg.color}
        iconName="lightning-bolt"
        tips={quickTips}
      />
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Quick Workout" showBack onBack={goBack} transparent />
      <ScreenWrapper
        scroll
        contentStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(24) },
        ]}
      >
        {!workout ? (
          <>
            {/* Focus selector */}
            <Animated.View
              style={{
                opacity: anims[0].opacity,
                transform: [{ translateY: anims[0].translateY }],
              }}
            >
              <Text
                style={[
                  s.label,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                FOCUS AREA
              </Text>
              <View style={s.focusGrid}>
                {FOCUS_OPTIONS.map(opt => {
                  const isActive = focus === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setFocus(opt.value)}
                      style={[
                        s.focusBtn,
                        {
                          backgroundColor: isActive
                            ? opt.color + '18'
                            : colors.backgroundCard,
                          borderColor: isActive ? opt.color : colors.border,
                          borderWidth: isActive ? 2 : 1,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: rs.scale(22) }}>
                        {opt.emoji}
                      </Text>
                      <Text
                        style={[
                          s.focusBtnText,
                          {
                            color: isActive ? opt.color : colors.textSecondary,
                            fontFamily: isActive
                              ? fonts.SemiBold
                              : fonts.Regular,
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>

            {/* Type selector */}
            <Animated.View
              style={{
                opacity: anims[1].opacity,
                transform: [{ translateY: anims[1].translateY }],
              }}
            >
              <Text
                style={[
                  s.label,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                WORKOUT TYPE
              </Text>
              <View style={s.typeRow}>
                {TYPE_OPTIONS.map(opt => {
                  const isActive = workType === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => setWorkType(opt.value as any)}
                      style={[
                        s.typeBtn,
                        {
                          flex: 1,
                          backgroundColor: isActive
                            ? colors.primary + '12'
                            : colors.backgroundCard,
                          borderColor: isActive
                            ? colors.primary
                            : colors.border,
                          borderWidth: isActive ? 2 : 1,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: rs.scale(24) }}>
                        {opt.emoji}
                      </Text>
                      <View>
                        <Text
                          style={[
                            s.typeBtnTitle,
                            {
                              color: isActive
                                ? colors.primary
                                : colors.textPrimary,
                              fontFamily: fonts.SemiBold,
                            },
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text
                          style={[
                            s.typeBtnSub,
                            {
                              color: colors.textTertiary,
                              fontFamily: fonts.Regular,
                            },
                          ]}
                        >
                          {opt.desc}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>

            {/* Generate CTA */}
            <Animated.View
              style={{
                opacity: anims[2].opacity,
                transform: [{ translateY: anims[2].translateY }],
              }}
            >
              <Button
                label={`Generate ${focusCfg.label} Workout`}
                onPress={handleGenerate}
                iconRight="lightning-bolt"
                size="lg"
              />
            </Animated.View>
          </>
        ) : (
          <>
            <LinearGradient
              colors={[focusCfg.color + '20', focusCfg.color + '06']}
              style={[s.resultHero, { borderColor: focusCfg.color + '30' }]}
            >
              <Text style={{ fontSize: rs.scale(36) }}>{focusCfg.emoji}</Text>
              <View style={universalStyles.flex}>
                <Text
                  style={[
                    s.resultTitle,
                    { color: colors.textPrimary, fontFamily: fonts.Bold },
                  ]}
                >
                  {focusCfg.label} Workout
                </Text>
                <Text
                  style={[
                    s.resultSub,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {workout.exercises?.length ?? 0} exercises ·{' '}
                  {workout.duration ?? 30} min · ~
                  {workout.caloriesBurned ?? 200} kcal
                </Text>
              </View>
            </LinearGradient>

            {/* Exercises */}
            <Card style={s.exercisesCard}>
              <Text
                style={[
                  s.label,
                  {
                    color: colors.textTertiary,
                    fontFamily: fonts.SemiBold,
                    marginBottom: rs.verticalScale(8),
                  },
                ]}
              >
                EXERCISES
              </Text>
              {(workout.exercises ?? []).map((ex: any, i: number) => (
                <ExerciseRow
                  key={i}
                  exercise={ex}
                  index={i}
                  color={focusCfg.color}
                  colors={colors}
                />
              ))}
            </Card>

            {/* CTAs */}
            <View style={s.resultCtaRow}>
              <Button
                label="Regenerate"
                onPress={handleGenerate}
                variant="ghost"
                fullWidth={false}
                iconLeft="refresh"
                size="md"
              />
              <Button
                label="Start workout"
                onPress={goBack}
                iconRight="play"
                size="md"
                style={universalStyles.flex}
              />
            </View>
          </>
        )}
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default QuickWorkoutScreen;

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(8),
    gap: rs.verticalScale(20),
  },
  label: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
  },
  focusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(8) },
  focusBtn: {
    width: (rs.screenWidth - rs.scale(56)) / 4,
    borderRadius: rs.scale(14),
    alignItems: 'center',
    gap: rs.verticalScale(4),
    paddingVertical: rs.verticalScale(12),
    paddingHorizontal: rs.scale(4),
  },
  focusBtnText: { fontSize: rs.font(12), textAlign: 'center' },
  typeRow: { flexDirection: 'row', gap: rs.scale(10) },
  typeBtn: {
    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
  },
  typeBtnTitle: { fontSize: rs.font(15) },
  typeBtnSub: { fontSize: rs.font(12), marginTop: rs.verticalScale(1) },
  resultHero: {
    borderRadius: rs.scale(18),
    borderWidth: 1.5,
    padding: rs.scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(14),
  },
  resultTitle: { fontSize: rs.font(20) },
  resultSub: { fontSize: rs.font(13), marginTop: rs.verticalScale(2) },
  exercisesCard: { padding: rs.scale(14) },
  resultCtaRow: { flexDirection: 'row', gap: rs.scale(10) },
});
