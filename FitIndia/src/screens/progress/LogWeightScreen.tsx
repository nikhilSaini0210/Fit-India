import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { goBack, rs, useSafeInsets } from '../../utils';
import {
  Button,
  Card,
  Header,
  Icon,
  Input,
  ScreenWrapper,
  universalStyles,
} from '../../components';
import {
  selectLatestLog,
  selectUser,
  useAuthStore,
  useColors,
  useProgressStore,
} from '../../store';
import { useApiError, useLogProgress, useStagger } from '../../hooks';
import { ProgressStackScreenProps } from '../../types';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../constants';
import { MOODS } from '../../helper';

type Props = ProgressStackScreenProps<'LogWeight'>;

const LogWeightScreen: FC<Props> = ({ route }) => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const latestLog = useProgressStore(selectLatestLog);
  const handleError = useApiError();

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<string>('good');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arms, setArms] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [logDate] = useState(
    route.params?.prefillDate
      ? new Date(route.params.prefillDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  );

  const { mutate, loading } = useLogProgress();
  const { anims, start } = useStagger(4, 80, 400);
  const measureAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    start();
    if (latestLog?.weight) {
      setWeight(String(latestLog.weight));
    } else if (user?.weight) {
      setWeight(String(user.weight));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(measureAnim, {
      toValue: showMeasurements ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMeasurements]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const w = parseFloat(weight);
    if (!weight) e.weight = 'Weight is required';
    else if (isNaN(w)) e.weight = 'Enter a valid number';
    else if (w < 20 || w > 300) e.weight = 'Weight must be between 20–300 kg';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLog = useCallback(async () => {
    if (!validate()) return;

    const body: Parameters<typeof mutate>[0] = {
      weight: parseFloat(weight),
      mood,
      logDate,
    };

    if (bodyFat) body.bodyFat = parseFloat(bodyFat);
    if (chest) body.chest = parseFloat(chest);
    if (waist) body.waist = parseFloat(waist);
    if (hips) body.hips = parseFloat(hips);
    if (arms) body.arms = parseFloat(arms);
    if (notes.trim()) body.notes = notes.trim();

    const result = await mutate(body);

    if (result.ok) {
      goBack();
    } else {
      handleError({
        code: result?.code ?? 'UNKNOWN',
        message: result.error ?? 'Failed to log',
        isAppError: true,
      });
    }
  }, [
    validate,
    weight,
    mood,
    logDate,
    bodyFat,
    chest,
    waist,
    hips,
    arms,
    notes,
    mutate,
    handleError,
  ]);

  // Weight change preview
  const prevWeight = latestLog?.weight ?? user?.weight;
  const weightNum = parseFloat(weight) || 0;
  const delta = prevWeight
    ? parseFloat((weightNum - prevWeight).toFixed(1))
    : null;
  const goal = user?.goal;

  return (
    <ScreenWrapper keyboard>
      <Header
        title="Log Weight"
        showBack
        onBack={goBack}
        transparent
        subtitle={new Date(logDate).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })}
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
          <Card style={styles.weightCard}>
            <LinearGradient
              colors={[colors.primary + '15', colors.primary + '05']}
              style={styles.weightGradient}
            >
              <Text
                style={[
                  styles.weightTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                Today's weight
              </Text>
              <View style={styles.weightInputRow}>
                <Pressable
                  onPress={() =>
                    setWeight(v =>
                      String(Math.max(20, (parseFloat(v) || 0) - 0.5)),
                    )
                  }
                  style={[
                    styles.weightBtn,
                    {
                      backgroundColor: colors.backgroundCard,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="minus"
                    size={rs.scale(20)}
                    color={colors.textPrimary}
                  />
                </Pressable>

                <View style={styles.weightDisplayWrap}>
                  <Input
                    value={weight}
                    onChangeText={t => {
                      setWeight(t);
                      setErrors(e => ({ ...e, weight: '' }));
                    }}
                    keyboardType="decimal-pad"
                    style={universalStyles.textCenter}
                    error={errors.weight}
                    containerStyle={universalStyles.bottomZero}
                  />
                  <Text
                    style={[
                      styles.kgLabel,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    kg
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setWeight(v => String((parseFloat(v) || 0) + 0.5))
                  }
                  style={[
                    styles.weightBtn,
                    {
                      backgroundColor: colors.backgroundCard,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="plus"
                    size={rs.scale(20)}
                    color={colors.textPrimary}
                  />
                </Pressable>
              </View>

              {/* Delta preview */}
              {delta !== null && Math.abs(delta) > 0 && (
                <View
                  style={[
                    styles.deltaPreview,
                    {
                      backgroundColor: (
                        goal === 'weight_loss' ? delta < 0 : delta > 0
                      )
                        ? colors.successLight
                        : colors.errorLight,
                    },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name={delta < 0 ? 'trending-down' : 'trending-up'}
                    size={rs.scale(14)}
                    color={
                      (goal === 'weight_loss' ? delta < 0 : delta > 0)
                        ? colors.success
                        : colors.error
                    }
                  />
                  <Text
                    style={[
                      styles.deltaText,
                      {
                        color: (goal === 'weight_loss' ? delta < 0 : delta > 0)
                          ? colors.success
                          : colors.error,
                        fontFamily: fonts.SemiBold,
                      },
                    ]}
                  >
                    {delta > 0 ? '+' : ''}
                    {delta}kg from last log ({prevWeight}kg)
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Card>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[1].opacity,
            transform: [{ translateY: anims[1].translateY }],
          }}
        >
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            HOW ARE YOU FEELING?
          </Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <Pressable
                key={m.value}
                onPress={() => setMood(m.value)}
                style={[
                  styles.moodBtn,
                  {
                    backgroundColor:
                      mood === m.value
                        ? colors.primary + '15'
                        : colors.backgroundSurface,
                    borderColor:
                      mood === m.value ? colors.primary : colors.border,
                    borderWidth: mood === m.value ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    {
                      color:
                        mood === m.value ? colors.primary : colors.textTertiary,
                      fontFamily: fonts.Regular,
                    },
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[2].opacity,
            transform: [{ translateY: anims[2].translateY }],
          }}
        >
          <Input
            label="Body fat % (optional)"
            iconLeft="percent-outline"
            keyboardType="decimal-pad"
            value={bodyFat}
            onChangeText={setBodyFat}
            hint="Measure with callipers or bioimpedance scale"
          />
          <Input
            label="Notes (optional)"
            iconLeft="note-text-outline"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
            hint="e.g. slept 8h, cheat meal yesterday"
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[3].opacity,
            transform: [{ translateY: anims[3].translateY }],
          }}
        >
          <Pressable
            onPress={() => setShowMeasurements(v => !v)}
            style={[
              styles.accordionHeader,
              {
                backgroundColor: colors.backgroundSurface,
                borderColor: colors.border,
              },
            ]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="tape-measure"
              size={rs.scale(18)}
              color={colors.primary}
            />
            <Text
              style={[
                styles.accordionTitle,
                { color: colors.textPrimary, fontFamily: fonts.Medium },
              ]}
            >
              Body measurements (optional)
            </Text>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name={showMeasurements ? 'chevron-up' : 'chevron-down'}
              size={rs.scale(18)}
              color={colors.textTertiary}
              style={{ marginLeft: 'auto' }}
            />
          </Pressable>

          <Animated.View
            style={{
              maxHeight: measureAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 400],
              }),
              overflow: 'hidden',
            }}
          >
            <View style={styles.measureGrid}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Chest (cm)"
                  iconLeft="human-male"
                  keyboardType="decimal-pad"
                  value={chest}
                  onChangeText={setChest}
                  containerStyle={{ marginBottom: rs.verticalScale(12) }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Waist (cm)"
                  iconLeft="human"
                  keyboardType="decimal-pad"
                  value={waist}
                  onChangeText={setWaist}
                  containerStyle={{ marginBottom: rs.verticalScale(12) }}
                />
              </View>
            </View>
            <View style={styles.measureGrid}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Hips (cm)"
                  iconLeft="human-male"
                  keyboardType="decimal-pad"
                  value={hips}
                  onChangeText={setHips}
                  containerStyle={{ marginBottom: rs.verticalScale(12) }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Arms (cm)"
                  iconLeft="arm-flex"
                  keyboardType="decimal-pad"
                  value={arms}
                  onChangeText={setArms}
                  containerStyle={{ marginBottom: rs.verticalScale(12) }}
                />
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Button
          label="Save log"
          onPress={handleLog}
          loading={loading}
          iconRight="check-circle-outline"
          size="lg"
          style={{ marginTop: rs.verticalScale(8) }}
        />
        <Button
          label="Cancel"
          onPress={goBack}
          variant="ghost"
          size="md"
          style={{ marginTop: rs.verticalScale(6) }}
        />
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default LogWeightScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(8),
    gap: rs.verticalScale(4),
  },
  weightCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: rs.verticalScale(20),
  },
  weightGradient: { padding: rs.scale(20), gap: rs.verticalScale(16) },
  weightTitle: { fontSize: rs.font(16), textAlign: 'center' },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
  },
  weightBtn: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightDisplayWrap: { flex: 1, position: 'relative' },
  kgLabel: {
    textAlign: 'center',
    fontSize: rs.font(13),
    marginTop: rs.verticalScale(-4),
  },
  deltaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(6),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(10),
  },
  deltaText: { fontSize: rs.font(13) },
  sectionLabel: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
    marginTop: rs.verticalScale(8),
  },
  moodRow: {
    flexDirection: 'row',
    gap: rs.scale(8),
    marginBottom: rs.verticalScale(20),
  },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rs.verticalScale(10),
    borderRadius: rs.scale(12),
    gap: rs.verticalScale(4),
  },
  moodEmoji: { fontSize: rs.scale(20) },
  moodLabel: { fontSize: rs.font(10) },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    padding: rs.scale(14),
    borderRadius: rs.scale(12),
    borderWidth: 0.5,
    marginBottom: rs.verticalScale(12),
  },
  accordionTitle: { fontSize: rs.font(14) },
  measureGrid: { flexDirection: 'row', gap: rs.scale(12) },
});
