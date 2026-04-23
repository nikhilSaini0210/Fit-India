import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { resetAndNavigate, rs, useSafeInsets } from '../../utils';
import { Button, Icon, Input } from '../../components';
import { fonts, ROOT_ROUTES } from '../../constants';
import { useColors } from '../../store';
import { useApiError, useProfile } from '../../hooks';

const STEPS = [
  'Basic info',
  'Body stats',
  'Your goal',
  'Diet type',
  'Fitness level',
] as const;
type Step = 0 | 1 | 2 | 3 | 4;

const ProfileSetupScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const { updateProfile, loading } = useProfile();
  const handleError = useApiError();

  const [step, setStep] = useState<Step>(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [dietType, setDietType] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / (STEPS.length - 1),
      duration: 400,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setStep(s => (s + 1) as Step);
    } else {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setStep(s => (s - 1) as Step);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const resetToMain = useCallback(() => {
    resetAndNavigate(ROOT_ROUTES.MAIN);
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = await updateProfile({
      name: name.trim() || undefined,
      age: age ? parseInt(age) : undefined,
      gender: (gender as any) || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      goal: (goal as any) || undefined,
      dietType: (dietType as any) || undefined,
      fitnessLevel: (fitnessLevel as any) || undefined,
      workoutType: (workoutType as any) || undefined,
      activityLevel: (activityLevel as any) || undefined,
    });
    if (result.ok) {
      resetToMain();
    } else {
      handleError({
        code: 'UNKNOWN',
        message: result.error ?? 'Failed to save',
        isAppError: true,
      });
    }
  }, [
    activityLevel,
    age,
    dietType,
    fitnessLevel,
    gender,
    goal,
    handleError,
    height,
    name,
    resetToMain,
    updateProfile,
    weight,
    workoutType,
  ]);

  // Step content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={s.stepContent}>
            <Text
              style={[
                s.stepTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              What should we call you? 👋
            </Text>
            <Text
              style={[
                s.stepSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Your name helps us personalise your experience
            </Text>
            <Input
              label="Your name"
              iconLeft="account-outline"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <Text
              style={[
                s.stepTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.Bold,
                  marginTop: rs.verticalScale(16),
                },
              ]}
            >
              Your gender
            </Text>
            <OptionGrid
              options={[
                { value: 'male', label: 'Male', icon: '👨', desc: 'He/Him' },
                {
                  value: 'female',
                  label: 'Female',
                  icon: '👩',
                  desc: 'She/Her',
                },
                {
                  value: 'other',
                  label: 'Other',
                  icon: '🧑',
                  desc: 'They/Them',
                },
              ]}
              selected={gender}
              onSelect={setGender}
              columns={3}
            />
          </View>
        );
      case 1:
        return (
          <View style={s.stepContent}>
            <Text
              style={[
                s.stepTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              Body stats 📏
            </Text>
            <Text
              style={[
                s.stepSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Used to calculate your personalised nutrition targets
            </Text>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Age (years)"
                  iconLeft="calendar-outline"
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Weight (kg)"
                  iconLeft="scale-outline"
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>
            <Input
              label="Height (cm)"
              iconLeft="human-male-height"
              keyboardType="decimal-pad"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        );
      case 2:
        return (
          <View style={s.stepContent}>
            <Text
              style={[
                s.stepTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              What's your goal? 🎯
            </Text>
            <Text
              style={[
                s.stepSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              We'll build your plan around this
            </Text>
            <OptionGrid
              options={[
                {
                  value: 'weight_loss',
                  label: 'Lose weight',
                  icon: '🔥',
                  desc: 'Burn fat, feel lighter',
                },
                {
                  value: 'weight_gain',
                  label: 'Gain weight',
                  icon: '⬆️',
                  desc: 'Healthy bulk up',
                },
                {
                  value: 'muscle_gain',
                  label: 'Build muscle',
                  icon: '💪',
                  desc: 'Lean and strong',
                },
                {
                  value: 'maintenance',
                  label: 'Stay fit',
                  icon: '⚖️',
                  desc: 'Maintain current shape',
                },
              ]}
              selected={goal}
              onSelect={setGoal}
              columns={2}
            />
            <Text
              style={[
                s.stepTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.Bold,
                  marginTop: rs.verticalScale(20),
                },
              ]}
            >
              Activity level
            </Text>
            <OptionGrid
              options={[
                {
                  value: 'sedentary',
                  label: 'Sedentary',
                  icon: '🛋️',
                  desc: 'Desk job, little exercise',
                },
                {
                  value: 'light',
                  label: 'Light',
                  icon: '🚶',
                  desc: '1-3 days/week',
                },
                {
                  value: 'moderate',
                  label: 'Moderate',
                  icon: '🏃',
                  desc: '3-5 days/week',
                },
                {
                  value: 'active',
                  label: 'Active',
                  icon: '⚡',
                  desc: '6-7 days/week',
                },
              ]}
              selected={activityLevel}
              onSelect={setActivityLevel}
              columns={2}
            />
          </View>
        );
      case 3:
        return (
          <View style={s.stepContent}>
            <Text
              style={[
                s.stepTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              Your diet preference 🍽️
            </Text>
            <Text
              style={[
                s.stepSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              All plans use authentic Indian ingredients
            </Text>
            <OptionGrid
              options={[
                {
                  value: 'veg',
                  label: 'Vegetarian',
                  icon: '🥦',
                  desc: 'No meat, eggs ok',
                },
                {
                  value: 'non_veg',
                  label: 'Non-Veg',
                  icon: '🍗',
                  desc: 'Includes meat & eggs',
                },
                {
                  value: 'jain',
                  label: 'Jain',
                  icon: '🌿',
                  desc: 'No root vegetables',
                },
                {
                  value: 'vegan',
                  label: 'Vegan',
                  icon: '🌱',
                  desc: 'No animal products',
                },
              ]}
              selected={dietType}
              onSelect={setDietType}
              columns={2}
            />
          </View>
        );
      case 4:
        return (
          <View style={s.stepContent}>
            <Text
              style={[
                s.stepTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              Fitness level & preference 🏋️
            </Text>
            <Text
              style={[
                s.stepSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              We'll match workout intensity to your level
            </Text>
            <OptionGrid
              options={[
                {
                  value: 'beginner',
                  label: 'Beginner',
                  icon: '🌱',
                  desc: 'Just getting started',
                },
                {
                  value: 'intermediate',
                  label: 'Intermediate',
                  icon: '🔥',
                  desc: 'Some experience',
                },
                {
                  value: 'advanced',
                  label: 'Advanced',
                  icon: '⚡',
                  desc: 'Serious athlete',
                },
              ]}
              selected={fitnessLevel}
              onSelect={setFitnessLevel}
              columns={3}
            />
            <Text
              style={[
                s.stepTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.Bold,
                  marginTop: rs.verticalScale(20),
                },
              ]}
            >
              Where do you work out?
            </Text>
            <OptionGrid
              options={[
                {
                  value: 'home',
                  label: 'Home',
                  icon: '🏠',
                  desc: 'Bodyweight & minimal equipment',
                },
                {
                  value: 'gym',
                  label: 'Gym',
                  icon: '🏋️',
                  desc: 'Full gym equipment',
                },
              ]}
              selected={workoutType}
              onSelect={setWorkoutType}
              columns={2}
            />
          </View>
        );
    }
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      {/* Header with progress */}
      <View
        style={[
          s.header,
          {
            paddingTop: insets.top + rs.verticalScale(16),
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={s.headerRow}>
          {step > 0 ? (
            <Pressable
              onPress={goBack}
              hitSlop={12}
              style={[s.backBtn, { backgroundColor: colors.backgroundSurface }]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="arrow-left"
                size={rs.scale(18)}
                color={colors.textPrimary}
              />
            </Pressable>
          ) : (
            <View style={s.backBtn} />
          )}

          <Text
            style={[
              s.stepLabel,
              { color: colors.textTertiary, fontFamily: fonts.Medium },
            ]}
          >
            Step {step + 1} of {STEPS.length}
          </Text>

          <Pressable onPress={resetToMain} hitSlop={12}>
            <Text
              style={[
                {
                  color: colors.textTertiary,
                  fontFamily: fonts.Regular,
                  fontSize: rs.font(13),
                },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Progress bar */}
        <View
          style={[s.progressTrack, { backgroundColor: colors.backgroundMuted }]}
        >
          <Animated.View
            style={[
              s.progressFill,
              {
                backgroundColor: colors.primary,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['20%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* Step name pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.stepsScroll}
          contentContainerStyle={{
            gap: rs.scale(8),
            paddingHorizontal: rs.scale(16),
          }}
        >
          {STEPS.map((s_name, i) => (
            <View
              key={i}
              style={[
                s.stepPill,
                {
                  backgroundColor:
                    i === step
                      ? colors.primary
                      : i < step
                      ? colors.primary + '20'
                      : colors.backgroundSurface,
                  borderColor:
                    i === step
                      ? colors.primary
                      : i < step
                      ? colors.primary + '40'
                      : colors.border,
                },
              ]}
            >
              {i < step && (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="check"
                  size={rs.scale(11)}
                  color={colors.primary}
                  style={{ marginRight: 3 }}
                />
              )}
              <Text
                style={[
                  s.stepPillText,
                  {
                    color:
                      i === step
                        ? '#FFF'
                        : i < step
                        ? colors.primary
                        : colors.textTertiary,
                    fontFamily: i === step ? fonts.SemiBold : fonts.Regular,
                  },
                ]}
              >
                {s_name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Step content */}
      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: insets.bottom + rs.verticalScale(100) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </Animated.ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          s.bottomCta,
          {
            paddingBottom: insets.bottom + rs.verticalScale(16),
            backgroundColor: colors.background,
            borderTopColor: colors.borderMuted,
          },
        ]}
      >
        <Button
          label={step === STEPS.length - 1 ? "Let's go! 🚀" : 'Continue'}
          onPress={goNext}
          loading={loading && step === STEPS.length - 1}
          iconRight={step < STEPS.length - 1 ? 'arrow-right' : undefined}
          size="lg"
        />
      </View>
    </View>
  );
};

export default ProfileSetupScreen;

const OptionGrid = ({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: { value: string; label: string; icon: string; desc?: string }[];
  selected: string;
  onSelect: (v: string) => void;
  columns?: number;
}) => {
  const colors = useColors();
  return (
    <View style={[s.grid, { gap: rs.scale(10) }]}>
      {options.map(opt => {
        const isActive = selected === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              s.option,
              {
                width: `${100 / columns - 2}%`,
                backgroundColor: isActive
                  ? colors.primary + '15'
                  : colors.backgroundCard,
                borderColor: isActive ? colors.primary : colors.border,
                borderWidth: isActive ? 2 : 1,
              },
            ]}
          >
            <Text style={s.optIcon}>{opt.icon}</Text>
            <Text
              style={[
                s.optLabel,
                {
                  color: isActive ? colors.primary : colors.textPrimary,
                  fontFamily: fonts.SemiBold,
                },
              ]}
            >
              {opt.label}
            </Text>
            {opt.desc && (
              <Text
                style={[
                  s.optDesc,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {opt.desc}
              </Text>
            )}
            {isActive && (
              <View style={[s.checkBadge, { backgroundColor: colors.primary }]}>
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="check"
                  size={rs.scale(10)}
                  color="#FFF"
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(12),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: rs.verticalScale(12),
  },
  backBtn: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { fontSize: rs.font(13) },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    marginBottom: rs.verticalScale(12),
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  stepsScroll: { flexGrow: 0 },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(5),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  stepPillText: { fontSize: rs.font(12) },
  scrollContent: {
    paddingHorizontal: rs.scale(20),
    paddingTop: rs.verticalScale(8),
  },
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
  row: { flexDirection: 'row', gap: rs.scale(12) },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  option: {
    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    alignItems: 'center',
    gap: rs.verticalScale(6),
    minHeight: rs.verticalScale(90),
    justifyContent: 'center',
    position: 'relative',
  },
  optIcon: { fontSize: rs.scale(26) },
  optLabel: { fontSize: rs.font(13), textAlign: 'center' },
  optDesc: {
    fontSize: rs.font(11),
    textAlign: 'center',
    lineHeight: rs.font(16),
  },
  checkBadge: {
    position: 'absolute',
    top: rs.scale(6),
    right: rs.scale(6),
    width: rs.scale(18),
    height: rs.scale(18),
    borderRadius: rs.scale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCta: {
    paddingHorizontal: rs.scale(20),
    paddingTop: rs.verticalScale(12),
    borderTopWidth: 0.5,
  },
});
