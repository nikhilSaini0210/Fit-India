import {
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Icon, ScreenWrapper } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { goBack, replace, rs } from '../../utils';
import { useApiError, useBackPress, useMarkWorkoutComplete } from '../../hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, useWorkoutStore } from '../../store';
import { WorkoutStackScreenProps } from '../../types';
import { MUSCLE_COLORS } from '../../helper';
import { fonts, ROOT_ROUTES, WORKOUT_ROUTES } from '../../constants';
import { RestTimer } from './components';

type Props = WorkoutStackScreenProps<'ActiveWorkout'>;

const ActiveWorkoutScreen: FC<Props> = ({ route }) => {
  const { dayNumber, planId } = route.params;
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const handleError = useApiError();

  const plan = useWorkoutStore(s => s.activePlan);
  const workout = plan?.weeklyPlan?.find(d => d.day === dayNumber);

  // Edge case: workout not found
  useEffect(() => {
    if (!workout) {
      Alert.alert('Error', 'Could not load workout. Please try again.', [
        { text: 'OK', onPress: goBack },
      ]);
    }
  }, [workout]);

  const { mutate: markComplete, loading: completing } =
    useMarkWorkoutComplete();

  const exercises = useMemo(() => workout?.exercises ?? [], [workout]);
  const totalSets = exercises.reduce((s, e) => s + (e.sets ?? 1), 0);

  // State
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [showRest, setShowRest] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [phase, setPhase] = useState<
    'warmup' | 'workout' | 'cooldown' | 'done'
  >('warmup');
  const [elapsed, setElapsed] = useState(0);

  // Workout timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // Slide animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const animateIn = useCallback(() => {
    slideAnim.setValue(40);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress
  const completedCount = completedSets.size;
  const progressPct = totalSets > 0 ? completedCount / totalSets : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 400,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressPct]);

  // Android back guard during workout

  const handleLeave = useCallback(() => {
    if (completedSets.size === 0) {
      goBack();
      return;
    }
    Alert.alert('Leave workout?', 'Your progress will be lost. Are you sure?', [
      { text: 'Continue workout', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: goBack,
      },
    ]);
  }, [completedSets]);

  const handleBack = useCallback(() => {
    handleLeave();
    return true;
  }, [handleLeave]);

  useBackPress({ handler: handleBack });

  const currentExercise = exercises[currentExIdx];
  const setKey = `${currentExIdx}-${currentSet}`;
  const isCurrentSetDone = completedSets.has(setKey);
  const focus = workout?.focus ?? 'default';
  const color = MUSCLE_COLORS[focus] ?? colors.primary;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const markSetDone = useCallback(() => {
    const key = `${currentExIdx}-${currentSet}`;
    setCompletedSets(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    Vibration.vibrate(40);

    const totalSetsForEx = currentExercise?.sets ?? 1;
    const restTime = currentExercise?.rest ?? 60;

    if (currentSet < totalSetsForEx) {
      // Move to next set
      setRestSeconds(restTime);
      setShowRest(true);
    } else {
      // Move to next exercise
      if (currentExIdx < exercises.length - 1) {
        setRestSeconds(restTime + 30); // longer rest between exercises
        setShowRest(true);
        setTimeout(() => {
          setCurrentExIdx(i => i + 1);
          setCurrentSet(1);
          animateIn();
        }, 100);
      } else {
        // All exercises done
        setPhase('cooldown');
      }
    }
  }, [currentExIdx, currentSet, currentExercise, exercises, animateIn]);

  const handleRestFinish = useCallback(() => {
    setShowRest(false);
    if (currentSet < (currentExercise?.sets ?? 1)) {
      setCurrentSet(s => s + 1);
    }
    animateIn();
  }, [currentSet, currentExercise, animateIn]);

  const handleFinish = useCallback(async () => {
    clearInterval(timerRef.current!);
    const result = await markComplete({ planId, dayNumber });
    if (result.ok) {
      replace(ROOT_ROUTES.MAIN, {
        screen: 'Workout',
        params: {
          screen: WORKOUT_ROUTES.COMPLETE,
          params: {
            caloriesBurned: workout?.caloriesBurned ?? 0,
            duration: Math.floor(elapsed / 60),
            dayNumber,
          },
        },
      });
    } else {
      handleError(result.error);
    }
  }, [planId, dayNumber, elapsed, workout, markComplete, handleError]);

  if (!workout) return null;

  // ── Phases ────────────────────────────────────────────────────────────────
  const isWarmup = phase === 'warmup';
  const isCooldown = phase === 'cooldown';

  return (
    <ScreenWrapper>
      <LinearGradient
        colors={[color + '20', colors.background]}
        style={[s.topBar, { paddingTop: insets.top + rs.verticalScale(8) }]}
      >
        <Pressable
          onPress={handleLeave}
          hitSlop={12}
          style={[
            s.closeBtn,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="close"
            size={rs.scale(18)}
            color={colors.textPrimary}
          />
        </Pressable>

        <View style={s.topCenter}>
          <Text style={[s.topFocus, { color, fontFamily: fonts.Bold }]}>
            {focus.replace('_', ' ').toUpperCase()}
          </Text>
          <Text
            style={[
              s.topTimer,
              { color: colors.textPrimary, fontFamily: fonts.ExtraBold },
            ]}
          >
            {formatTime(elapsed)}
          </Text>
        </View>

        <View style={[s.progressCircle, { borderColor: color + '30' }]}>
          <Text style={[s.progressPct, { color, fontFamily: fonts.Bold }]}>
            {Math.round(progressPct * 100)}%
          </Text>
        </View>
      </LinearGradient>

      <View
        style={[s.progressBar, { backgroundColor: colors.backgroundMuted }]}
      >
        <Animated.View
          style={[
            s.progressFill,
            {
              backgroundColor: color,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <ScreenWrapper
        scroll
        contentStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(32) },
        ]}
      >
        {isWarmup && workout.warmup?.length > 0 && (
          <View style={s.phaseSection}>
            <Text
              style={[
                s.phaseTitle,
                { color: colors.warning, fontFamily: fonts.Bold },
              ]}
            >
              🔥 Warm Up First
            </Text>
            {workout.warmup.map((w, i) => (
              <View
                key={i}
                style={[
                  s.phaseRow,
                  {
                    backgroundColor: colors.warningLight,
                    borderColor: colors.warning + '30',
                  },
                ]}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="fire-circle"
                  size={rs.scale(18)}
                  color={colors.warning}
                />
                <Text
                  style={[
                    s.phaseRowText,
                    { color: colors.textPrimary, fontFamily: fonts.Medium },
                  ]}
                >
                  {w.exercise}
                </Text>
                <Text
                  style={[
                    s.phaseRowDur,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {w.duration}
                </Text>
              </View>
            ))}
            <Button
              label="I'm warmed up — Let's go! 💪"
              onPress={() => {
                setPhase('workout');
                animateIn();
              }}
              size="md"
            />
          </View>
        )}

        {phase === 'workout' && currentExercise && (
          <Animated.View
            style={[s.exerciseWrap, { transform: [{ translateY: slideAnim }] }]}
          >
            {/* Exercise counter */}
            <View style={s.exCounter}>
              <Text
                style={[
                  s.exCounterText,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Exercise {currentExIdx + 1} of {exercises.length}
              </Text>
            </View>

            {/* Main exercise card */}
            <LinearGradient
              colors={[color + '18', color + '06']}
              style={[s.mainCard, { borderColor: color + '30' }]}
            >
              <Text
                style={[
                  s.exName,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                {currentExercise.exercise}
              </Text>

              {currentExercise.muscle && (
                <View style={[s.muscleChip, { backgroundColor: color + '20' }]}>
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="dumbbell"
                    size={rs.scale(12)}
                    color={color}
                  />
                  <Text
                    style={[
                      s.muscleText,
                      { color, fontFamily: fonts.SemiBold },
                    ]}
                  >
                    {currentExercise.muscle}
                  </Text>
                </View>
              )}

              {/* Sets tracker */}
              <View style={s.setsRow}>
                {Array.from({ length: currentExercise.sets ?? 1 }).map(
                  (_, si) => {
                    const sKey = `${currentExIdx}-${si + 1}`;
                    const isDone = completedSets.has(sKey);
                    const isAct = si + 1 === currentSet;
                    return (
                      <View
                        key={si}
                        style={[
                          s.setDot,
                          {
                            backgroundColor: isDone
                              ? colors.success
                              : isAct
                              ? color
                              : colors.backgroundMuted,
                            borderColor: isDone
                              ? colors.success
                              : isAct
                              ? color
                              : colors.border,
                            borderWidth: isAct ? 2.5 : 1,
                            width: isAct ? rs.scale(44) : rs.scale(32),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            s.setDotText,
                            {
                              color:
                                isDone || isAct ? '#FFF' : colors.textTertiary,
                              fontFamily: fonts.SemiBold,
                            },
                          ]}
                        >
                          {isDone ? '✓' : si + 1}
                        </Text>
                      </View>
                    );
                  },
                )}
              </View>

              {/* Reps / duration */}
              <View style={s.targetRow}>
                {currentExercise.reps && (
                  <View
                    style={[
                      s.targetChip,
                      { backgroundColor: colors.info + '15' },
                    ]}
                  >
                    <Text
                      style={[
                        s.targetVal,
                        { color: colors.info, fontFamily: fonts.ExtraBold },
                      ]}
                    >
                      {currentExercise.reps}
                    </Text>
                    <Text
                      style={[
                        s.targetLabel,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      reps
                    </Text>
                  </View>
                )}
                {currentExercise.duration && (
                  <View
                    style={[
                      s.targetChip,
                      { backgroundColor: colors.secondary + '15' },
                    ]}
                  >
                    <Text
                      style={[
                        s.targetVal,
                        {
                          color: colors.secondary,
                          fontFamily: fonts.ExtraBold,
                        },
                      ]}
                    >
                      {currentExercise.duration}
                    </Text>
                  </View>
                )}
              </View>

              {currentExercise.notes && (
                <Text
                  style={[
                    s.exNotes,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  💡 {currentExercise.notes}
                </Text>
              )}
            </LinearGradient>

            {/* Rest timer */}
            {showRest && (
              <RestTimer
                seconds={restSeconds}
                onFinish={handleRestFinish}
                onSkip={() => {
                  setShowRest(false);
                  handleRestFinish();
                }}
              />
            )}

            {/* Done set button */}
            {!showRest && (
              <Pressable
                onPress={markSetDone}
                disabled={isCurrentSetDone}
                style={[
                  s.doneBtn,
                  {
                    backgroundColor: isCurrentSetDone ? colors.success : color,
                  },
                ]}
              >
                <Text style={[s.doneBtnText, { fontFamily: fonts.Bold }]}>
                  {isCurrentSetDone
                    ? '✓ Set done'
                    : `Done — Set ${currentSet} of ${
                        currentExercise.sets ?? 1
                      }`}
                </Text>
              </Pressable>
            )}

            {/* Skip exercise */}
            <Pressable
              onPress={() => {
                if (currentExIdx < exercises.length - 1) {
                  setCurrentExIdx(i => i + 1);
                  setCurrentSet(1);
                  setShowRest(false);
                  animateIn();
                } else {
                  setPhase('cooldown');
                }
              }}
              style={s.skipEx}
            >
              <Text
                style={[
                  s.skipExText,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Skip exercise
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {isCooldown && (
          <View style={s.phaseSection}>
            <Text
              style={[
                s.phaseTitle,
                { color: colors.info, fontFamily: fonts.Bold },
              ]}
            >
              🧘 Cool Down
            </Text>
            {workout.cooldown?.map((w, i) => (
              <View
                key={i}
                style={[
                  s.phaseRow,
                  {
                    backgroundColor: colors.infoLight,
                    borderColor: colors.info + '30',
                  },
                ]}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="yoga"
                  size={rs.scale(18)}
                  color={colors.info}
                />
                <Text
                  style={[
                    s.phaseRowText,
                    { color: colors.textPrimary, fontFamily: fonts.Medium },
                  ]}
                >
                  {w.exercise}
                </Text>
                <Text
                  style={[
                    s.phaseRowDur,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {w.duration}
                </Text>
              </View>
            ))}
            <Button
              label="Finish workout 🎉"
              onPress={handleFinish}
              loading={completing}
              size="lg"
            />
          </View>
        )}

        {phase === 'workout' && currentExIdx < exercises.length - 1 && (
          <View style={s.upcomingSection}>
            <Text
              style={[
                s.upcomingTitle,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              UP NEXT
            </Text>
            {exercises
              .slice(currentExIdx + 1, currentExIdx + 3)
              .map((ex, i) => (
                <View
                  key={i}
                  style={[
                    s.upcomingRow,
                    {
                      backgroundColor: colors.backgroundSurface,
                      borderColor: colors.borderMuted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.upcomingIndex,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    {currentExIdx + i + 2}
                  </Text>
                  <Text
                    style={[
                      s.upcomingName,
                      { color: colors.textSecondary, fontFamily: fonts.Medium },
                    ]}
                  >
                    {ex.exercise}
                  </Text>
                  {ex.sets && ex.reps && (
                    <Text
                      style={[
                        s.upcomingMeta,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {ex.sets}×{ex.reps}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default ActiveWorkoutScreen;

const s = StyleSheet.create({
  topBar: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  topCenter: { alignItems: 'center' },
  topFocus: { fontSize: rs.font(12), letterSpacing: 0.8 },
  topTimer: { fontSize: rs.font(22) },
  progressCircle: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(22),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPct: { fontSize: rs.font(12) },
  progressBar: { height: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(12),
    gap: rs.verticalScale(12),
  },
  exerciseWrap: { gap: rs.verticalScale(12) },
  exCounter: { alignItems: 'center' },
  exCounterText: { fontSize: rs.font(13) },
  mainCard: {
    borderRadius: rs.scale(20),
    padding: rs.scale(20),
    borderWidth: 1.5,
    gap: rs.verticalScale(14),
  },
  exName: { fontSize: rs.font(22), lineHeight: rs.font(30) },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(5),
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(4),
    borderRadius: rs.scale(8),
    alignSelf: 'flex-start',
  },
  muscleText: { fontSize: rs.font(12) },
  setsRow: {
    flexDirection: 'row',
    gap: rs.scale(8),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  setDot: {
    height: rs.scale(32),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDotText: { fontSize: rs.font(12) },
  targetRow: { flexDirection: 'row', gap: rs.scale(12) },
  targetChip: {
    alignItems: 'center',
    paddingHorizontal: rs.scale(20),
    paddingVertical: rs.verticalScale(12),
    borderRadius: rs.scale(14),
  },
  targetVal: { fontSize: rs.font(28) },
  targetLabel: { fontSize: rs.font(12) },
  exNotes: { fontSize: rs.font(13), lineHeight: rs.font(19) },
  doneBtn: {
    borderRadius: rs.scale(18),
    paddingVertical: rs.verticalScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rs.verticalScale(4),
  },
  doneBtnText: { fontSize: rs.font(17), color: '#FFF' },
  skipEx: { alignItems: 'center', paddingVertical: rs.verticalScale(10) },
  skipExText: { fontSize: rs.font(13) },
  upcomingSection: { gap: rs.verticalScale(8), marginTop: rs.verticalScale(8) },
  upcomingTitle: { fontSize: rs.font(11), letterSpacing: 0.7 },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(10),
    borderRadius: rs.scale(10),
    borderWidth: 0.5,
  },
  upcomingIndex: { fontSize: rs.font(13), width: rs.scale(20) },
  upcomingName: { flex: 1, fontSize: rs.font(14) },
  upcomingMeta: { fontSize: rs.font(12) },
  phaseSection: { gap: rs.verticalScale(12) },
  phaseTitle: { fontSize: rs.font(20) },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    padding: rs.scale(12),
    borderRadius: rs.scale(12),
    borderWidth: 0.5,
  },
  phaseRowText: { flex: 1, fontSize: rs.font(14) },
  phaseRowDur: { fontSize: rs.font(12) },
});
