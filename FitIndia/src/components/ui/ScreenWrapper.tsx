import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, ReactNode } from 'react';
import { rs, useSafeInsets } from '../../utils';
import { useColors } from '../../store';

interface ScreenWrapperProps {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  padding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const ScreenWrapper: FC<ScreenWrapperProps> = ({
  children,
  scroll,
  keyboard,
  padding,
  edges,
  style,
  contentStyle,
}) => {
  const colors = useColors();
  const insets = useSafeInsets();

  const safePad = {
    paddingTop: edges?.includes('top') ? insets.top : 0,
    paddingBottom: edges?.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges?.includes('left') ? insets.left : 0,
    paddingRight: edges?.includes('right') ? insets.right : 0,
  };

  const hPad = padding ? rs.scale(20) : 0;

  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        { paddingHorizontal: hPad, paddingBottom: rs.verticalScale(32) },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { paddingHorizontal: hPad }, contentStyle]}>
      {children}
    </View>
  );

  const wrapped = keyboard ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : rs.verticalScale(20)}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: colors.background },
        safePad,
        style,
      ]}
    >
      {wrapped}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
