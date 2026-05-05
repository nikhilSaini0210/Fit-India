import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { FC, useEffect } from 'react';
import { useFadeIn } from '../../../hooks';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';
import { useColors } from '../../../store';
import { Icon, universalStyles } from '../../../components';
import Animated from 'react-native-reanimated';

interface ProfileCompletionDialogueProps {
  pct: number;
  onEdit: () => void;
}

const ProfileCompletionDialogue: FC<ProfileCompletionDialogueProps> = ({
  pct,
  onEdit,
}) => {
  const colors = useColors();

  const { fadeStyle, start: fadeStart } = useFadeIn(500, 100);

  useEffect(() => {
    fadeStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        s.completeCard,
        fadeStyle,
        {
          backgroundColor: colors.warningLight,
          borderColor: colors.warning + '40',
        },
      ]}
    >
      <Icon
        iconFamily="MaterialCommunityIcons"
        name="alert-circle-outline"
        size={rs.scale(18)}
        color={colors.warning}
      />
      <View style={universalStyles.flex}>
        <Text
          style={[
            s.completeTitle,
            { color: colors.warning, fontFamily: fonts.SemiBold },
          ]}
        >
          Profile {pct}% complete
        </Text>
        <Text
          style={[
            s.completeSub,
            { color: colors.warning + 'CC', fontFamily: fonts.Regular },
          ]}
        >
          Complete your profile for better AI recommendations
        </Text>
      </View>
      <Pressable onPress={onEdit}>
        <Text
          style={[
            {
              color: colors.warning,
              fontFamily: fonts.SemiBold,
              fontSize: rs.font(13),
            },
          ]}
        >
          Fix →
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default ProfileCompletionDialogue;

const s = StyleSheet.create({
  completeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    marginHorizontal: rs.scale(16),
    marginTop: rs.verticalScale(12),
    padding: rs.scale(12),
    borderRadius: rs.scale(12),
    borderWidth: 1,
  },
  completeTitle: {
    fontSize: rs.font(13),
  },
  completeSub: {
    fontSize: rs.font(11),
    marginTop: rs.verticalScale(1),
  },
});
