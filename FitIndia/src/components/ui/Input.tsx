import React, { useRef, useCallback, useState, FC } from 'react';
import {
  Animated,
  TextInput,
  Text,
  Pressable,
  View,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';
import Icon from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  hint?: string;
  iconLeft?: string;
  iconRight?: string;
  onIconRightPress?: () => void;
  containerStyle?: ViewStyle;
  secure?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  error,
  hint,
  iconLeft,
  iconRight,
  onIconRightPress,
  containerStyle,
  secure = false,
  ...props
}) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(props.value ? 1 : 0)).current;

  const onFocus = useCallback(() => {
    setFocused(true);
    Animated.parallel([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
    props.onFocus?.({} as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (!props.value) {
      Animated.timing(labelAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    props.onBlur?.({} as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.error : colors.border,
      error ? colors.error : colors.primary,
    ],
  });

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [rs.verticalScale(14), -rs.verticalScale(9)],
  });
  const labelFontSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [rs.font(15), rs.font(11)],
  });
  const labelColor = error
    ? colors.error
    : focused
    ? colors.primary
    : colors.textTertiary;

  const labelBg =
    focused || props.value ? colors.background : colors.backgroundSurface;

  const rightIconName = secure
    ? showPw
      ? 'eye-off-outline'
      : 'eye-outline'
    : iconRight;

  const inputStyle = {
    color: colors.textPrimary,
    fontFamily: fonts.Regular,
    fontSize: rs.font(15),
    paddingLeft: iconLeft ? 0 : rs.scale(4),
  };

  const rightIconAction = secure ? () => setShowPw(v => !v) : onIconRightPress;

  return (
    <View style={[s.container, containerStyle]}>
      {label && (
        <Animated.Text
          style={[
            s.floatingLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: labelColor,
              backgroundColor: labelBg,
              paddingHorizontal: rs.scale(4),
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          s.inputWrap,
          {
            borderColor,
            backgroundColor: colors.backgroundSurface,
          },
        ]}
      >
        {iconLeft && (
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={iconLeft}
            size={rs.scale(18)}
            color={focused ? colors.primary : colors.textTertiary}
            style={s.iconLeft}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={secure && !showPw}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={colors.textTertiary}
          style={[s.input, inputStyle]}
        />

        {rightIconName && (
          <Pressable onPress={rightIconAction} hitSlop={12} style={s.iconRight}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name={rightIconName}
              size={rs.scale(18)}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </Animated.View>

      {(error || hint) && (
        <View style={s.feedback}>
          {error ? (
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="alert-circle-outline"
              size={rs.scale(13)}
              color={colors.error}
            />
          ) : (
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="information-outline"
              size={rs.scale(13)}
              color={colors.textTertiary}
            />
          )}
          <Text
            style={[
              s.feedbackText,
              {
                color: error ? colors.error : colors.textTertiary,
                fontFamily: fonts.Regular,
              },
            ]}
          >
            {error ?? hint}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;

const s = StyleSheet.create({
  container: {
    marginBottom: rs.verticalScale(20),
  },
  floatingLabel: {
    position: 'absolute',
    left: rs.scale(14),
    zIndex: 1,
    fontFamily: fonts.Medium,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: rs.scale(14),
    paddingHorizontal: rs.scale(14),
    paddingVertical: rs.verticalScale(2),
    minHeight: rs.verticalScale(52),
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: rs.verticalScale(12),
  },
  iconLeft: {
    marginRight: rs.scale(10),
  },
  iconRight: {
    paddingLeft: rs.scale(10),
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(4),
    marginTop: rs.verticalScale(4),
    paddingHorizontal: rs.scale(4),
  },
  feedbackText: {
    fontSize: rs.font(12),
  },
});
