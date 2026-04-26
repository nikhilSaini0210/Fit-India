import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { selectUser, useAuthStore, useColors } from '../../store';
import { rs, useSafeInsets } from '../../utils';
import { useApiError, useStagger } from '../../hooks';
import { PLANS } from '../../helper';
import { Header, Icon, ScreenWrapper } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../constants';

const SubscriptionScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);

  const currentPlan = user?.plan ?? 'free';
  // const updateUser = useAuthStore(s => s.updateUser);
  const handleError = useApiError();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const { anims, start } = useStagger(PLANS.length, 100, 450);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Edge case: payment handler with loading + error states
  const handleSubscribe = useCallback(
    async (planId: string, planName: string) => {
      if (purchasing) return; // prevent double-tap
      Alert.alert(
        `Upgrade to ${planName}`,
        'Razorpay payment integration required. In production, this will open the payment gateway.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Proceed to payment',
            onPress: async () => {
              setPurchasing(planId);
              try {
                // TODO: Replace with actual Razorpay SDK call
                // const { RazorpayCheckout } = require('react-native-razorpay');
                // await RazorpayCheckout.open({ key: 'rzp_live_xxx', amount, currency: 'INR', ... });
                // await userApi.activatePlan(planId);
                // updateUser({ plan: planId as any, isPremium: planId !== 'free' });
                Alert.alert(
                  'Coming soon',
                  'Payment gateway integration in progress. Contact support to manually upgrade.',
                );
              } catch (err) {
                handleError(err);
              } finally {
                setPurchasing(null);
              }
            },
          },
        ],
      );
    },
    [purchasing, handleError],
  );

  return (
    <ScreenWrapper>
      <Header title="Subscription" showBack />
      <ScreenWrapper
        scroll
        contentStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(40) },
        ]}
      >
        <LinearGradient colors={['#0F172A', '#1E3A2F']} style={styles.hero}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="crown"
            size={rs.scale(32)}
            color="#F59E0B"
          />
          <Text style={[styles.heroTitle, { fontFamily: fonts.Bold }]}>
            Choose your plan
          </Text>
          <Text style={[styles.heroSub, { fontFamily: fonts.Regular }]}>
            Unlock AI-powered Indian fitness coaching
          </Text>
        </LinearGradient>

        {PLANS.map((plan, i) => {
          const isActive = currentPlan === plan.id;
          const borderColor = isActive ? plan.color : colors.border;
          const borderWidth = isActive ? 2 : 0.5;
          return (
            <Animated.View
              key={plan.id}
              style={{
                opacity: anims[i].opacity,
                transform: [{ translateY: anims[i].translateY }],
              }}
            >
              <View
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.backgroundCard,
                    borderColor,
                    borderWidth,
                  },
                ]}
              >
                {/* Header row */}
                <View style={styles.planHeader}>
                  <View style={styles.planNameRow}>
                    <Text
                      style={[
                        styles.planName,
                        { color: plan.color, fontFamily: fonts.Bold },
                      ]}
                    >
                      {plan.name}
                    </Text>
                    {plan.badge && (
                      <View
                        style={[
                          styles.planBadge,
                          { backgroundColor: plan.color + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.planBadgeText,
                            { color: plan.color, fontFamily: fonts.SemiBold },
                          ]}
                        >
                          {plan.badge}
                        </Text>
                      </View>
                    )}
                    {isActive && (
                      <View
                        style={[
                          styles.activeBadge,
                          { backgroundColor: colors.success + '20' },
                        ]}
                      >
                        <Icon
                          iconFamily="MaterialCommunityIcons"
                          name="check-circle"
                          size={rs.scale(12)}
                          color={colors.success}
                        />
                        <Text
                          style={[
                            styles.activeBadgeText,
                            {
                              color: colors.success,
                              fontFamily: fonts.SemiBold,
                            },
                          ]}
                        >
                          Current
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.priceRow}>
                    <Text
                      style={[
                        styles.price,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.ExtraBold,
                        },
                      ]}
                    >
                      {plan.price}
                    </Text>
                    <Text
                      style={[
                        styles.period,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {' '}
                      {plan.period}
                    </Text>
                  </View>
                </View>

                {/* Features */}
                <View style={styles.featureList}>
                  {plan.features.map((feat, fi) => (
                    <View key={fi} style={styles.featureRow}>
                      <Icon
                        iconFamily="MaterialCommunityIcons"
                        name={feat.included ? 'check-circle' : 'close-circle'}
                        size={rs.scale(16)}
                        color={
                          feat.included ? colors.success : colors.textTertiary
                        }
                      />
                      <Text
                        style={[
                          styles.featureText,
                          {
                            color: feat.included
                              ? colors.textPrimary
                              : colors.textTertiary,
                            fontFamily: fonts.Regular,
                          },
                        ]}
                      >
                        {feat.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* CTA */}
                {!isActive && plan.id !== 'free' && (
                  <TouchableOpacity
                    activeOpacity={purchasing === plan.id ? 0.5 : 1}
                    onPress={() => handleSubscribe(plan.id, plan.name)}
                    disabled={purchasing !== null}
                    style={[
                      styles.planCta,
                      {
                        backgroundColor: plan.color,
                      },
                    ]}
                  >
                    {purchasing === plan.id ? (
                      <Text
                        style={[
                          styles.planCtaText,
                          { fontFamily: fonts.SemiBold },
                        ]}
                      >
                        Processing…
                      </Text>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.planCtaText,
                            { fontFamily: fonts.SemiBold },
                          ]}
                        >
                          Upgrade to {plan.name}
                        </Text>
                        <Icon
                          iconFamily="MaterialCommunityIcons"
                          name="arrow-right"
                          size={rs.scale(16)}
                          color="#FFF"
                        />
                      </>
                    )}
                  </TouchableOpacity>
                )}
                {isActive && (
                  <View
                    style={[
                      styles.planCta,
                      { backgroundColor: colors.backgroundSurface },
                    ]}
                  >
                    <Icon
                      iconFamily="MaterialCommunityIcons"
                      name="check-circle"
                      size={rs.scale(16)}
                      color={colors.success}
                    />
                    <Text
                      style={[
                        styles.planCtaText,
                        { color: colors.success, fontFamily: fonts.SemiBold },
                      ]}
                    >
                      Your current plan
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}

        <View
          style={[
            styles.guaranteeRow,
            { backgroundColor: colors.successLight },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="shield-check-outline"
            size={rs.scale(18)}
            color={colors.success}
          />
          <Text
            style={[
              styles.guaranteeText,
              { color: colors.success, fontFamily: fonts.Regular },
            ]}
          >
            7-day money-back guarantee · Cancel anytime · Secure payment via
            Razorpay
          </Text>
        </View>
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: rs.scale(16) },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rs.scale(20),
    padding: rs.scale(28),
    marginTop: rs.verticalScale(16),
    marginBottom: rs.verticalScale(20),
    gap: rs.verticalScale(8),
  },
  heroTitle: { fontSize: rs.font(22), color: '#FFF' },
  heroSub: {
    fontSize: rs.font(14),
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  planCard: {
    borderRadius: rs.scale(18),
    padding: rs.scale(18),
    marginBottom: rs.verticalScale(12),
    overflow: 'hidden',
  },
  planHeader: { marginBottom: rs.verticalScale(14) },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(8),
    marginBottom: rs.verticalScale(6),
    flexWrap: 'wrap',
  },
  planName: { fontSize: rs.font(20) },
  planBadge: {
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(20),
  },
  planBadgeText: { fontSize: rs.font(11) },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(3),
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(20),
  },
  activeBadgeText: { fontSize: rs.font(11) },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: rs.font(30) },
  period: { fontSize: rs.font(14) },
  featureList: {
    gap: rs.verticalScale(10),
    marginBottom: rs.verticalScale(16),
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(10) },
  featureText: { fontSize: rs.font(13), flex: 1 },
  planCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.scale(8),
    borderRadius: rs.scale(12),
    paddingVertical: rs.verticalScale(14),
  },
  planCtaText: { fontSize: rs.font(15), color: '#FFF' },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rs.scale(10),
    padding: rs.scale(14),
    borderRadius: rs.scale(14),
    marginTop: rs.verticalScale(8),
  },
  guaranteeText: { flex: 1, fontSize: rs.font(12), lineHeight: rs.font(18) },
});
