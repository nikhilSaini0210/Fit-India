import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../../store';
import { DEFAULT_QUOTES, QUOTES } from '../../../helper';
import LinearGradient from 'react-native-linear-gradient';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';
import { universalStyles } from '../../../components';

interface Props {
  streak: number;
  goal?: string;
}

const MotivationalBanner: FC<Props> = ({ streak, goal }) => {
  const colors = useColors();
  const pool = (goal ? QUOTES[goal] : null) ?? DEFAULT_QUOTES;
  const quote = pool[Math.floor(Date.now() / 86400000) % pool.length];

  return (
    <LinearGradient
      colors={[colors.primary + '18', colors.primary + '08']}
      style={mb.wrap}
    >
      <Text style={mb.icon}>
        {streak >= 7 ? '🏆' : streak >= 3 ? '🔥' : '💪'}
      </Text>
      <View style={universalStyles.flex}>
        <Text
          style={[
            mb.quote,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          {quote}
        </Text>
        {streak > 0 && (
          <Text
            style={[
              mb.streak,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            {streak}-day streak 🔥 Keep it up!
          </Text>
        )}
      </View>
    </LinearGradient>
  );
};

export default MotivationalBanner;

const mb = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    borderRadius: rs.scale(18),
    padding: rs.scale(16),
  },
  icon: { fontSize: rs.scale(28) },
  quote: { fontSize: rs.font(14), lineHeight: rs.font(21) },
  streak: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
});
