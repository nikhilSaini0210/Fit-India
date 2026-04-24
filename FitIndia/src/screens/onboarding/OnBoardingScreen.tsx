import React, { useRef, useState, useCallback, useEffect, FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  FlatList,
  type ViewToken,
  Platform,
  type ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useColors } from '../../store';
import { AUTH_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import { getOnboardingSlides, OnboardingSlide } from '../../helper';
import { resetAndNavigate, rs, useSafeInsets } from '../../utils';
import { Badge, Icon, StepDots } from '../../components';
import { useOnboarding } from '../../hooks';
import { useBackPress } from '../../hooks/useBackPress';
import SlideIllustration from './SlideIllustration';

const OnboardingScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const flatRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [current, setCurrent] = useState(0);

  const ONBOARDING_SLIDES = getOnboardingSlides(colors);

  const { finish, skip, isComplete } = useOnboarding();

  const goToLogin = useCallback(() => {
    resetAndNavigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
  }, []);

  useEffect(() => {
    if (isComplete()) {
      goToLogin();
    }
  }, [goToLogin, isComplete]);

  const handleBack = useCallback(() => {
    if (Platform.OS !== 'android') return;
    if (current > 0) {
      flatRef.current?.scrollToIndex({ index: current - 1, animated: true });
      return true;
    }
    return false;
  }, [current]);

  useBackPress({ handler: handleBack });

  const scrollTo = useCallback(
    (index: number) => {
      const safeIndex = Math.max(
        0,
        Math.min(index, ONBOARDING_SLIDES.length - 1),
      );
      flatRef.current?.scrollToIndex({ index: safeIndex, animated: true });
    },
    [ONBOARDING_SLIDES.length],
  );

  const textOpacity = useRef(new Animated.Value(1)).current;
  const textTranslateY = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const newIndex = viewableItems[0]?.index;
      if (newIndex == null) return;

      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 10,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrent(newIndex);
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.spring(textTranslateY, {
            toValue: 0,
            friction: 8,
            tension: 100,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
  ).current;

  const goNext = useCallback(() => {
    if (current < ONBOARDING_SLIDES.length - 1) {
      scrollTo(current + 1);
    } else {
      finish();
    }
  }, [current, ONBOARDING_SLIDES.length, scrollTo, finish]);

  const isLast = current === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[current];

  const renderItem = ({ item, index }: ListRenderItemInfo<OnboardingSlide>) => (
    <View style={{ width: rs.screenWidth }}>
      <SlideIllustration slide={item} isActive={index === current} />
    </View>
  );

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={slide.gradientColors}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[s.topBar, { paddingTop: insets.top + rs.verticalScale(10) }]}
      >
        {!isLast ? (
          <Pressable onPress={skip} hitSlop={12} style={s.skipBtn}>
            <Text
              style={[
                s.skipText,
                { fontFamily: fonts.Medium, color: colors.iconSecondary },
              ]}
            >
              Skip
            </Text>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="chevron-right"
              size={rs.scale(14)}
              color={colors.iconSecondary}
            />
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <FlatList
        ref={flatRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: rs.screenWidth,
          offset: rs.screenWidth * index,
          index,
        })}
        style={s.root}
      />

      <View
        style={[
          s.bottomPanel,
          { paddingBottom: insets.bottom + rs.verticalScale(20) },
        ]}
      >
        <Animated.View style={{ opacity: textOpacity }}>
          {slide.badge && (
            <Badge
              label={slide.badge}
              style={[
                s.badge,
                {
                  backgroundColor: slide.accentColor + '20',
                  borderColor: slide.accentColor + '40',
                },
              ]}
            />
          )}
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          }}
        >
          <Text
            style={[
              s.title,
              { fontFamily: fonts.Bold, color: colors.textHighEmphasis },
            ]}
          >
            {slide.title}
          </Text>
          <Text
            style={[
              s.titleAccent,
              { color: slide.accentColor, fontFamily: fonts.ExtraBold },
            ]}
          >
            {slide.subtitle}
          </Text>
          <Text
            style={[
              s.description,
              { fontFamily: fonts.Regular, color: colors.iconSecondary },
            ]}
          >
            {slide.description}
          </Text>
        </Animated.View>

        <StepDots
          current={current}
          total={ONBOARDING_SLIDES.length}
          color={slide.accentColor}
        />

        <View style={s.ctaRow}>
          {current > 0 && (
            <Pressable
              onPress={() => scrollTo(current - 1)}
              hitSlop={8}
              style={[s.backCircle, { borderColor: colors.borderSubtle }]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="arrow-left"
                size={rs.scale(20)}
                color={colors.iconPrimary}
              />
            </Pressable>
          )}

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              s.ctaBtn,
              {
                shadowColor: colors.black,
                backgroundColor: slide.accentColor,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text
              style={[
                s.ctaText,
                { fontFamily: fonts.SemiBold, color: colors.white },
              ]}
            >
              {isLast ? "Let's start! 🚀" : 'Next'}
            </Text>
            {!isLast && (
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="arrow-right"
                size={rs.scale(18)}
                color={colors.white}
                style={{ marginLeft: rs.scale(6) }}
              />
            )}
          </Pressable>
        </View>

        <Pressable onPress={goToLogin} hitSlop={12} style={s.loginBtn}>
          <Text
            style={[
              s.loginLink,
              { fontFamily: fonts.Regular, color: colors.textStrong },
            ]}
          >
            Already have an account?{' '}
            <Text
              style={{ color: slide.accentColor, fontFamily: fonts.SemiBold }}
            >
              Login
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: rs.scale(16),
    zIndex: 10,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(2),
    paddingVertical: rs.verticalScale(6),
    paddingHorizontal: rs.scale(8),
  },
  skipText: {
    fontSize: rs.font(14),
  },

  bottomPanel: {
    paddingHorizontal: rs.scale(24),
    paddingTop: rs.verticalScale(16),
    gap: rs.verticalScale(14),
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  title: {
    fontSize: rs.font(26),
    lineHeight: rs.font(34),
  },
  titleAccent: {
    fontSize: rs.font(30),
    lineHeight: rs.font(38),
    marginBottom: rs.verticalScale(6),
  },
  description: {
    fontSize: rs.font(14),
    lineHeight: rs.font(22),
  },

  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
  },
  backCircle: {
    width: rs.scale(52),
    height: rs.scale(52),
    borderRadius: rs.scale(26),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rs.scale(16),
    paddingVertical: rs.verticalScale(16),
    shadowOffset: { width: 0, height: rs.verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: rs.scale(8),
    elevation: 6,
  },
  ctaText: {
    fontSize: rs.font(16),
  },
  loginBtn: {
    alignItems: 'center',
  },
  loginLink: {
    fontSize: rs.font(13),
    textAlign: 'center',
  },
});
