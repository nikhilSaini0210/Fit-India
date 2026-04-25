import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import {
  Button,
  Card,
  ChipGroup,
  Header,
  Input,
  ScreenWrapper,
  TagInput,
  universalStyles,
} from '../../components';
import { goBack, rs } from '../../utils';
import { fonts } from '../../constants';
import { selectUser, useAuthStore, useColors } from '../../store';
import { useApiError, useProfile } from '../../hooks';
import {
  ActivityLevel,
  DietType,
  FitnessLevel,
  Goal,
  WorkoutType,
} from '../../types';
import { updateValidate } from '../../helper';
import { useToast } from '../../context';

const EditProfileScreen: FC = () => {
  const colors = useColors();
  const user = useAuthStore(selectUser);
  const { updateProfile, loading } = useProfile();
  const handleError = useApiError();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [age, setAge] = useState(user?.age?.toString() ?? '');
  const [weight, setWeight] = useState(user?.weight?.toString() ?? '');
  const [height, setHeight] = useState(user?.height?.toString() ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [goal, setGoal] = useState<Goal>(user?.goal ?? 'maintenance');
  const [dietType, setDietType] = useState<DietType>(user?.dietType ?? 'veg');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.activityLevel ?? 'moderate',
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(
    user?.fitnessLevel ?? 'beginner',
  );
  const [workoutType, setWorkoutType] = useState<WorkoutType>(
    user?.workoutType ?? 'home',
  );
  const [allergies, setAllergies] = useState<string[]>(user?.allergies ?? []);
  const [injuries, setInjuries] = useState<string[]>(user?.injuries ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = useCallback(async () => {
    Keyboard.dismiss();
    const isValid = updateValidate({
      name,
      age,
      phone,
      weight,
      height,
      setErrors,
    });

    if (!isValid) return;

    const result = await updateProfile({
      name: name.trim(),
      phone: phone || undefined,
      age: age ? parseInt(age, 10) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      gender: (gender as any) || undefined,
      goal,
      dietType,
      activityLevel,
      fitnessLevel,
      workoutType,
      allergies,
      injuries,
    });
    if (result.ok) {
      toast({
        type: 'success',
        title: 'Profile updated',
        message: result.msg || 'Your changes have been saved successfully.',
      });
      goBack();
    } else {
      handleError({
        code: result.code ?? 'UNKNOWN',
        message: result.error ?? 'Save failed',
        isAppError: true,
      });
    }
  }, [
    activityLevel,
    age,
    allergies,
    dietType,
    fitnessLevel,
    gender,
    goal,
    handleError,
    height,
    injuries,
    name,
    phone,
    toast,
    updateProfile,
    weight,
    workoutType,
  ]);

  return (
    <ScreenWrapper>
      <Header
        title="Edit Profile"
        showBack
        rightLabel={loading ? 'saving...' : 'Save'}
        onRightPress={save}
      />
      <ScreenWrapper scroll contentStyle={styles.scroll} keyboard>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          PERSONAL
        </Text>
        <Card style={styles.card}>
          <Input
            label="Full name"
            iconLeft="account-outline"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />
          <Input
            label="Phone (optional)"
            iconLeft="phone-outline"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            hint="For WhatsApp reminders"
          />
          <ChipGroup
            label="Gender"
            options={[
              { value: 'male', label: 'Male', icon: '👨' },
              { value: 'female', label: 'Female', icon: '👩' },
              { value: 'other', label: 'Other', icon: '🧑' },
            ]}
            selected={gender}
            onSelect={setGender}
            colors={colors}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          BODY STATS
        </Text>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={universalStyles.flex}>
              <Input
                label="Age"
                iconLeft="calendar-outline"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                error={errors.age}
              />
            </View>
            <View style={universalStyles.flex}>
              <Input
                label="Weight (kg)"
                iconLeft="scale-outline"
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                error={errors.weight}
              />
            </View>
          </View>
          <Input
            label="Height (cm)"
            iconLeft="human-male-height"
            keyboardType="decimal-pad"
            value={height}
            onChangeText={setHeight}
            error={errors.height}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          FITNESS GOAL
        </Text>
        <Card style={styles.card}>
          <ChipGroup
            label="Your goal"
            options={[
              { value: 'weight_loss', label: 'Lose weight', icon: '🔥' },
              { value: 'weight_gain', label: 'Gain weight', icon: '⬆️' },
              { value: 'muscle_gain', label: 'Build muscle', icon: '💪' },
              { value: 'maintenance', label: 'Stay fit', icon: '⚖️' },
            ]}
            selected={goal}
            onSelect={v => setGoal(v as Goal)}
            colors={colors}
          />
          <ChipGroup
            label="Activity level"
            options={[
              { value: 'sedentary', label: 'Sedentary' },
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'active', label: 'Active' },
              { value: 'very_active', label: 'Very active' },
            ]}
            selected={activityLevel}
            onSelect={v => setActivityLevel(v as ActivityLevel)}
            colors={colors}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          DIET PREFERENCE
        </Text>
        <Card style={styles.card}>
          <ChipGroup
            label="Diet type"
            options={[
              { value: 'veg', label: 'Vegetarian', icon: '🥦' },
              { value: 'non_veg', label: 'Non-Veg', icon: '🍗' },
              { value: 'jain', label: 'Jain', icon: '🌿' },
              { value: 'vegan', label: 'Vegan', icon: '🌱' },
            ]}
            selected={dietType}
            onSelect={v => setDietType(v as DietType)}
            colors={colors}
          />
          <TagInput
            label="Food allergies / avoid"
            tags={allergies}
            onAdd={t => setAllergies(a => [...a, t])}
            onRemove={t => setAllergies(a => a.filter(x => x !== t))}
            placeholder="e.g. peanuts, lactose..."
            colors={colors}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          WORKOUT PREFERENCE
        </Text>
        <Card style={styles.card}>
          <ChipGroup
            label="Fitness level"
            options={[
              { value: 'beginner', label: 'Beginner', icon: '🌱' },
              { value: 'intermediate', label: 'Intermediate', icon: '🔥' },
              { value: 'advanced', label: 'Advanced', icon: '⚡' },
            ]}
            selected={fitnessLevel}
            onSelect={v => setFitnessLevel(v as FitnessLevel)}
            colors={colors}
          />
          <ChipGroup
            label="Workout location"
            options={[
              { value: 'home', label: 'Home', icon: '🏠' },
              { value: 'gym', label: 'Gym', icon: '🏋️' },
            ]}
            selected={workoutType}
            onSelect={v => setWorkoutType(v as WorkoutType)}
            colors={colors}
          />
          <TagInput
            label="Injuries / avoid exercises"
            tags={injuries}
            onAdd={t => setInjuries(a => [...a, t])}
            onRemove={t => setInjuries(a => a.filter(x => x !== t))}
            placeholder="e.g. bad knees, lower back..."
            colors={colors}
          />
        </Card>

        <Button
          label="Save changes"
          onPress={save}
          loading={loading}
          iconLeft="content-save-outline"
          size="lg"
          style={{
            marginTop: rs.verticalScale(8),
            marginBottom: rs.verticalScale(32),
          }}
        />
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(40),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginTop: rs.verticalScale(20),
    marginBottom: rs.verticalScale(8),
    paddingHorizontal: rs.scale(4),
  },
  card: {
    padding: rs.scale(16),
    marginBottom: rs.verticalScale(4),
  },
  row: {
    flexDirection: 'row',
    gap: rs.scale(12),
  },
});
