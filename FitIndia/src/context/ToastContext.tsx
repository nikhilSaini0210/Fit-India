import React, { createContext, useContext, useCallback, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useColors } from '../store';
import { AppColors, fonts } from '../constants';
import { rs } from '../utils';
import { Icon } from '../components';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  type: ToastType;
  title: string;
  message: string;
  action?: { label: string; onPress: () => void };
  duration?: number;
}

interface ToastItem extends ToastConfig {
  id: string;
  anim: Animated.Value;
}

const ToastContext = createContext<(cfg: ToastConfig) => void>(() => {});
export const useToast = () => useContext(ToastContext);

const getColors = (Colors: AppColors) => ({
  success: {
    bg: Colors.successLight,
    text: Colors.success,
    dot: Colors.success,
  },
  error: { bg: Colors.errorLight, text: Colors.error, dot: Colors.error },
  warning: {
    bg: Colors.warningLight,
    text: Colors.warning,
    dot: Colors.warning,
  },
  info: { bg: Colors.infoLight, text: Colors.info, dot: Colors.info },
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const COLORS = getColors(colors);

  const dismiss = useCallback((id: string, anim: Animated.Value) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setToasts(p => p.filter(t => t.id !== id)));
  }, []);

  const show = useCallback(
    (cfg: ToastConfig) => {
      const id = Date.now().toString();
      const anim = new Animated.Value(0);
      setToasts(p => [...p, { ...cfg, id, anim }]);
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      const dur = cfg.duration ?? 4000;
      setTimeout(() => dismiss(id, anim), dur);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <View style={styles.region} pointerEvents="box-none">
        {toasts.map(t => {
          const c = COLORS[t.type];
          return (
            <Animated.View
              key={t.id}
              style={[
                styles.toast,
                {
                  opacity: t.anim,
                  backgroundColor: c.bg,
                  shadowColor: c.bg,
                  transform: [
                    {
                      translateY: t.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: c.dot }]} />
              <View style={styles.toastBody}>
                <Text
                  style={[styles.toastTitle, { color: c.text }]}
                >
                  {t.title}
                </Text>
                <Text
                  style={[styles.toastMsg, { color: colors.textSecondary }]}
                >
                  {t.message}
                </Text>
                {t.action && (
                  <Pressable
                    onPress={() => {
                      t.action!.onPress();
                      dismiss(t.id, t.anim);
                    }}
                  >
                    <Text style={[styles.toastAction, { color: c.dot }]}>
                      {t.action.label}
                    </Text>
                  </Pressable>
                )}
              </View>
              <Pressable
                onPress={() => dismiss(t.id, t.anim)}
                style={styles.closeBtn}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="close"
                  size={rs.font(14)}
                  color={colors.iconSecondary}
                />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  region: {
    position: 'absolute',
    bottom: rs.scale(32),
    left: rs.scale(16),
    right: rs.scale(16),
    gap: rs.scale(10),
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rs.scale(12),

    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    shadowOpacity: 0.08,
    shadowRadius: rs.scale(12),
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dot: {
    width: rs.scale(8),
    height: rs.scale(8),
    borderRadius: rs.scale(4),
    marginTop: rs.verticalScale(5),
    flexShrink: 0,
  },
  toastBody: {
    flex: 1,
  },
  toastTitle: {
    fontSize: rs.font(14),
    fontFamily: fonts.SemiBold,
    marginBottom: rs.verticalScale(2),
  },
  toastMsg: {
    fontSize: rs.font(13),
    fontFamily: fonts.Regular,
    lineHeight: rs.font(18),
  },
  toastAction: {
    fontSize: rs.font(13),
    fontFamily: fonts.SemiBold,
    marginTop: rs.verticalScale(8),
  },
  closeBtn: {
    padding: rs.scale(2),
  },
});
