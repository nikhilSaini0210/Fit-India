import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { rs, useSafeInsets } from '../../utils';
import { useColors } from '../../store';

type Edge = 'top' | 'bottom' | 'left' | 'right';
interface ScreenWrapperProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  padding?: boolean;
  extraBottomPadding?: number;
  horizontalPadding?: number;
  transparent?: boolean;
  keyboard?: boolean;
  keyboardAvoidingBehavior?: 'padding' | 'height' | 'position';
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
  refreshTintColor?: string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const ScreenWrapper: FC<ScreenWrapperProps> = ({
  children,

  scroll,
  edges,
  padding,
  horizontalPadding,
  extraBottomPadding = rs.verticalScale(100),
  transparent,

  keyboard,
  keyboardAvoidingBehavior,

  onRefresh,
  refreshing = false,
  refreshTintColor,

  onEndReached,
  onEndReachedThreshold = 0.2,

  contentStyle,
  style,
}) => {
  const colors = useColors();
  const insets = useSafeInsets();

  const scrollEnabled = Boolean(scroll || onRefresh);

  const safePad = useMemo<ViewStyle>(
    () => ({
      paddingTop: edges?.includes('top') ? insets.top : 0,
      paddingBottom: edges?.includes('bottom') ? insets.bottom : 0,
      paddingLeft: edges?.includes('left') ? insets.left : 0,
      paddingRight: edges?.includes('right') ? insets.right : 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [edges?.join(','), insets.top, insets.bottom, insets.left, insets.right],
  );

  const resolvedHPad = useMemo<number>(() => {
    if (horizontalPadding !== undefined) return horizontalPadding;
    if (padding) return rs.scale(20);
    return 0;
  }, [horizontalPadding, padding]);

  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const isRefreshing = refreshing || internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setInternalRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setInternalRefreshing(false);
    }
  }, [onRefresh]);

  const handleScroll = useCallback(
    ({ nativeEvent }: { nativeEvent: any }) => {
      if (!onEndReached) return;
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const threshold =
        contentSize.height -
        layoutMeasurement.height * (1 - onEndReachedThreshold);
      if (contentOffset.y >= threshold) {
        onEndReached();
      }
    },
    [onEndReached, onEndReachedThreshold],
  );

  const scrollContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.flexGrow,
      {
        paddingHorizontal: resolvedHPad,
        paddingBottom: insets.bottom + extraBottomPadding,
      },
      contentStyle,
    ],
    [resolvedHPad, insets.bottom, extraBottomPadding, contentStyle],
  );

  const viewContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.flex, { paddingHorizontal: resolvedHPad }, contentStyle],
    [resolvedHPad, contentStyle],
  );

  const inner: ReactNode = scrollEnabled ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={scrollContentStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onScroll={onEndReached ? handleScroll : undefined}
      scrollEventThrottle={onEndReached ? 16 : undefined}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={refreshTintColor ?? colors.primary}
            colors={refreshTintColor ? [refreshTintColor] : [colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={viewContentStyle}>{children}</View>
  );

  const kavBehavior =
    keyboardAvoidingBehavior ?? (Platform.OS === 'ios' ? 'padding' : 'height');

  const kavOffset = Platform.OS === 'ios' ? insets.top : rs.verticalScale(20);

  const wrapped: ReactNode = keyboard ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={kavBehavior}
      keyboardVerticalOffset={kavOffset}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  const rootStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.flex,
      { backgroundColor: transparent ? 'transparent' : colors.background },
      safePad,
      style,
    ],
    [transparent, colors.background, safePad, style],
  );

  return <View style={rootStyle}>{wrapped}</View>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
});
