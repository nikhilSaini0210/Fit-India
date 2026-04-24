import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { resetAndNavigate, rs, useSafeInsets } from '../../utils';
import { Button, GradientProgressBar, Icon, Pill } from '../../components';
import { fonts, ROOT_ROUTES } from '../../constants';
import { useColors } from '../../store';
import { useApiError, useProfile } from '../../hooks';
import { STEPS } from '../../helper';
import { StepA, StepB, StepC, StepD, StepE } from './steps';
import { useToast } from '../../context';

type Step = 0 | 1 | 2 | 3 | 4;

const ProfileSetupScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const { updateProfile, loading } = useProfile();
  const handleError = useApiError();
  const toast = useToast();

  const [step, setStep] = useState<Step>(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const pillsScrollRef = useRef<ScrollView>(null);
  const pillLayouts = useRef<{ x: number; width: number }[]>([]);

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

    const layout = pillLayouts.current[step];
    if (layout && pillsScrollRef.current) {
      pillsScrollRef.current.scrollTo({
        x: layout.x - rs.scale(16),
        animated: true,
      });
    }

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
      age: age ? parseInt(age, 10) : undefined,
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
      toast({
        type: 'success',
        title: 'Profile Updated',
        message: result.msg || 'Your profile has been updated successfully.',
      });
      resetToMain();
    } else {
      handleError({
        code: result.code || 'UNKNOWN',
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
    toast,
    updateProfile,
    weight,
    workoutType,
  ]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepA
            name={name}
            setName={setName}
            gender={gender}
            setGender={setGender}
          />
        );
      case 1:
        return (
          <StepB
            age={age}
            setAge={setAge}
            weight={weight}
            setWeight={setWeight}
            height={height}
            setHeight={setHeight}
          />
        );
      case 2:
        return (
          <StepC
            goal={goal}
            setGoal={setGoal}
            activityLevel={activityLevel}
            setActivityLevel={setActivityLevel}
          />
        );
      case 3:
        return <StepD dietType={dietType} setDietType={setDietType} />;
      case 4:
        return (
          <StepE
            fitnessLevel={fitnessLevel}
            setFitnessLevel={setFitnessLevel}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
          />
        );
    }
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
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

        <View style={s.progressTrack}>
          <GradientProgressBar
            progress={step / (STEPS.length - 1)}
            height={rs.verticalScale(4)}
            borderRadius={rs.scale(4)}
            backgroundColor={colors.backgroundMuted}
            gradientColors={colors.progressGradient}
          />
        </View>

        <ScrollView
          ref={pillsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.stepsScroll}
          contentContainerStyle={{
            gap: rs.scale(8),
          }}
        >
          {STEPS.map((s_name, i) => (
            <View
              key={i}
              onLayout={(e: LayoutChangeEvent) => {
                pillLayouts.current[i] = {
                  x: e.nativeEvent.layout.x,
                  width: e.nativeEvent.layout.width,
                };
              }}
            >
              <Pill
                label={s_name}
                isActive={i === step}
                isCompleted={i < step}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <Animated.ScrollView
        style={[s.root, { opacity: fadeAnim }]}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: insets.bottom + rs.verticalScale(100) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </Animated.ScrollView>

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
  stepLabel: {
    fontSize: rs.font(13),
  },
  progressTrack: {
    marginBottom: rs.verticalScale(12),
  },
  progressFill: {
    height: '100%',
    borderRadius: rs.scale(4),
  },
  stepsScroll: { flexGrow: 0 },

  scrollContent: {
    paddingHorizontal: rs.scale(20),
    paddingTop: rs.verticalScale(8),
  },

  bottomCta: {
    paddingHorizontal: rs.scale(20),
    paddingTop: rs.verticalScale(12),
    borderTopWidth: 0.5,
  },
});
