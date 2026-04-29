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
import { useApiError, useGenerateDietPlan, useStagger } from '../../hooks';
import { useBackPress } from '../../hooks';
import {
  DIET_ROUTES,
  fonts,
  PROFILE_ROUTES,
  ROOT_ROUTES,
} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
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
import { DietLabel, GoalLabel, TIPS } from '../../helper';
import { useModal } from '../../context';

const GenerateDietScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const modal = useModal();
  const handleError = useApiError();

  const [days, setDays] = useState(7);
  const [useAI, setUseAI] = useState(true);

  const { mutate, loading } = useGenerateDietPlan();
  const { anims, start } = useStagger(4, 100, 450);

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
        screen: 'Diet',
        params: {
          screen: DIET_ROUTES.DIET_PLAN,
        },
      });
    } else {
      handleError({
        code: result?.code ?? 'UNKNOWN',
        message: result?.error ?? 'Failed to generate plan',
        isAppError: true,
      });
    }
  }, [
    user?.profileComplete,
    mutate,
    days,
    useAI,
    modal,
    onGotoProfile,
    handleError,
  ]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#0F172A', '#0D2318', '#0F172A']}
        style={s.genScreen}
      >
        <GeneratingAnimation color={colors.primary} tips={TIPS} />
      </LinearGradient>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Generate Diet Plan" showBack onBack={goBack} transparent />

      <ScreenWrapper
        scroll
        contentStyle={[
          s.scroll,
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
            style={s.hero}
          >
            <View
              style={[
                s.heroIconBg,
                {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary + '40',
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="robot-excited-outline"
                size={rs.scale(36)}
                color={colors.primary}
              />
            </View>
            <Text
              style={[
                s.heroTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              AI-Powered Indian Diet Plan
            </Text>
            <Text
              style={[
                s.heroSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Personalised meals using roti, dal, sabzi, paneer & more — built
              around your goals
            </Text>

            {/* Profile badges */}
            {user && (
              <View style={s.badgeRow}>
                {user.dietType && (
                  <Badge
                    label={DietLabel[user.dietType] ?? user.dietType}
                    variant="success"
                  />
                )}
                {user.goal && (
                  <Badge
                    label={GoalLabel[user.goal] ?? user.goal}
                    variant="info"
                  />
                )}
                {user.weight && (
                  <Badge label={`${user.weight}kg`} variant="default" />
                )}
              </View>
            )}
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
              s.sectionLabel,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            PLAN DURATION
          </Text>
          <Card style={s.optionCard}>
            <View style={s.pillRow}>
              {[
                { label: '3 days', icon: 'calendar-week', val: 3 },
                { label: '7 days', icon: 'calendar-range', val: 7 },
                { label: '14 days', icon: 'calendar-month-outline', val: 14 },
                { label: '30 days', icon: 'calendar-multiselect', val: 30 },
              ].map(opt => (
                <OptionPill
                  key={opt.val}
                  label={opt.label}
                  icon={opt.icon}
                  selected={days === opt.val}
                  onSelect={() => setDays(opt.val)}
                  color={colors.primary}
                />
              ))}
            </View>
          </Card>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[2].opacity,
            transform: [{ translateY: anims[2].translateY }],
          }}
        >
          <Text
            style={[
              s.sectionLabel,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            GENERATION MODE
          </Text>
          <View style={s.modeRow}>
            <Pressable
              onPress={() => setUseAI(true)}
              style={[
                s.modeCard,
                {
                  backgroundColor: useAI
                    ? colors.primary + '12'
                    : colors.backgroundCard,
                  borderColor: useAI ? colors.primary : colors.border,
                  borderWidth: useAI ? 2 : 1,
                },
              ]}
            >
              <View
                style={[s.modeIconBg, { backgroundColor: '#8B5CF6' + '20' }]}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="brain"
                  size={rs.scale(22)}
                  color="#8B5CF6"
                />
              </View>
              <Text
                style={[
                  s.modeTitle,
                  { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                ]}
              >
                AI Generated
              </Text>
              <Text
                style={[
                  s.modeSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Fully personalised by AI — best results
              </Text>
              {useAI && (
                <Badge
                  label="Recommended"
                  variant="success"
                  small
                  style={{ marginTop: rs.verticalScale(6) }}
                />
              )}
            </Pressable>

            <Pressable
              onPress={() => setUseAI(false)}
              style={[
                s.modeCard,
                {
                  backgroundColor: !useAI
                    ? colors.info + '12'
                    : colors.backgroundCard,
                  borderColor: !useAI ? colors.info : colors.border,
                  borderWidth: !useAI ? 2 : 1,
                },
              ]}
            >
              <View
                style={[s.modeIconBg, { backgroundColor: colors.info + '20' }]}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="lightning-bolt"
                  size={rs.scale(22)}
                  color={colors.info}
                />
              </View>
              <Text
                style={[
                  s.modeTitle,
                  { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                ]}
              >
                Quick Template
              </Text>
              <Text
                style={[
                  s.modeSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Instant — uses proven Indian meal patterns
              </Text>
              {!useAI && (
                <Badge
                  label="Faster"
                  variant="info"
                  small
                  style={{ marginTop: rs.verticalScale(6) }}
                />
              )}
            </Pressable>
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
              s.sectionLabel,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            WHAT YOU GET
          </Text>
          <Card>
            {[
              {
                icon: 'food-apple-outline',
                color: '#10B981',
                text: '4 meals per day — breakfast, lunch, snack & dinner',
              },
              {
                icon: 'currency-inr',
                color: colors.warning,
                text: 'Budget-friendly — under ₹150 per meal',
              },
              {
                icon: 'calculator-variant-outline',
                color: colors.info,
                text: 'Accurate calorie & macro breakdown per meal',
              },
              {
                icon: 'leaf',
                color: colors.primary,
                text: 'Only authentic Indian ingredients & recipes',
              },
              {
                icon: 'refresh',
                color: '#8B5CF6',
                text: 'Regenerate anytime — new plan in seconds',
              },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  s.featureRow,
                  i > 0 && {
                    borderTopWidth: 0.5,
                    borderTopColor: colors.borderMuted,
                    marginTop: rs.verticalScale(10),
                    paddingTop: rs.verticalScale(10),
                  },
                ]}
              >
                <View
                  style={[
                    s.featureIconWrap,
                    { backgroundColor: item.color + '15' },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name={item.icon}
                    size={rs.scale(16)}
                    color={item.color}
                  />
                </View>
                <Text
                  style={[
                    s.featureText,
                    { color: colors.textSecondary, fontFamily: fonts.Regular },
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        <View style={s.ctaWrap}>
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

export default GenerateDietScreen;

const s = StyleSheet.create({
  genScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(8),
    gap: rs.verticalScale(20),
  },
  hero: {
    borderRadius: rs.scale(20),
    padding: rs.scale(20),
    alignItems: 'center',
    gap: rs.verticalScale(10),
  },
  heroIconBg: {
    width: rs.scale(72),
    height: rs.scale(72),
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
  sectionLabel: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
  },
  optionCard: { padding: rs.scale(14) },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(8) },

  modeRow: { flexDirection: 'row', gap: rs.scale(12) },
  modeCard: {
    flex: 1,
    borderRadius: rs.scale(16),
    padding: rs.scale(16),
    gap: rs.verticalScale(4),
  },
  modeIconBg: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs.verticalScale(4),
  },
  modeTitle: { fontSize: rs.font(14) },
  modeSub: { fontSize: rs.font(12), lineHeight: rs.font(17) },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(12) },
  featureIconWrap: {
    width: rs.scale(32),
    height: rs.scale(32),
    borderRadius: rs.scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1, fontSize: rs.font(13), lineHeight: rs.font(19) },
  ctaWrap: { gap: rs.verticalScale(10), marginTop: rs.verticalScale(4) },
});
