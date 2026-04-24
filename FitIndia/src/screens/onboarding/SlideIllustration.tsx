import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { OnboardingSlide } from '../../helper';
import { rs } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../../components';
import { fonts } from '../../constants';
import Particle from './Particle';

interface SlideIllustrationProps {
  slide: OnboardingSlide;
  isActive: boolean;
}

const W = rs.screenWidth;
const H = rs.screenHeight;

const SlideIllustration: FC<SlideIllustrationProps> = ({ slide, isActive }) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -12,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      floatAnim.stopAnimation();
      floatAnim.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const particles = getParticlesForSlide(slide.accentColor);

  return (
    <View style={s.illustrationWrap}>
      {isActive && particles.map((p, i) => <Particle key={i} {...p} />)}
      <Animated.View
        style={[
          s.alignItemCenter,
          {
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            opacity: opacityAnim,

            marginBottom: rs.verticalScale(28),
          },
        ]}
      >
        <LinearGradient
          colors={[slide.accentColor + '30', slide.accentColor + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.emojiBox, { borderColor: slide.accentColor + '40' }]}
        >
          <Text style={s.emoji}>{slide.emoji}</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          s.tagsRow,
          { opacity: opacityAnim, transform: [{ translateY: floatAnim }] },
        ]}
      >
        {slide.features.map((feat, i) => (
          <View
            key={i}
            style={[
              s.tag,
              {
                backgroundColor: slide.accentColor + '15',
                borderColor: slide.accentColor + '35',
              },
            ]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="check-circle"
              size={rs.scale(12)}
              color={slide.accentColor}
            />
            <Text
              style={[
                s.tagText,
                { color: slide.accentColor, fontFamily: fonts.Medium },
              ]}
            >
              {feat}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export default SlideIllustration;

const s = StyleSheet.create({
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: rs.verticalScale(60),
  },
  emojiBox: {
    width: rs.scale(148),
    height: rs.scale(148),
    borderRadius: rs.scale(38),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'visible',
  },
  alignItemCenter: { alignItems: 'center' },
  emoji: {
    fontSize: rs.scale(62),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: rs.scale(8),
    paddingHorizontal: rs.scale(24),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(5),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(6),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  tagText: { fontSize: rs.font(12) },
});

const getParticlesForSlide = (accentColor: string) => [
  { x: W * 0.08, y: H * 0.06, size: 6, delay: 0, color: accentColor },
  { x: W * 0.82, y: H * 0.1, size: 8, delay: 400, color: accentColor },
  {
    x: W * 0.88,
    y: H * 0.3,
    size: 5,
    delay: 800,
    color: accentColor + 'AA',
  },
  {
    x: W * 0.06,
    y: H * 0.38,
    size: 9,
    delay: 200,
    color: accentColor + '88',
  },
  { x: W * 0.72, y: H * 0.44, size: 4, delay: 600, color: accentColor },
  {
    x: W * 0.18,
    y: H * 0.52,
    size: 7,
    delay: 300,
    color: accentColor + 'BB',
  },
  {
    x: W * 0.78,
    y: H * 0.6,
    size: 6,
    delay: 500,
    color: accentColor + '99',
  },
  {
    x: W * 0.12,
    y: H * 0.68,
    size: 5,
    delay: 100,
    color: accentColor + 'CC',
  },
  {
    x: W * 0.68,
    y: H * 0.74,
    size: 8,
    delay: 700,
    color: accentColor + '77',
  },
  {
    x: W * 0.22,
    y: H * 0.8,
    size: 6,
    delay: 200,
    color: accentColor + 'AA',
  },
  {
    x: W * 0.82,
    y: H * 0.88,
    size: 5,
    delay: 400,
    color: accentColor + '88',
  },
];
