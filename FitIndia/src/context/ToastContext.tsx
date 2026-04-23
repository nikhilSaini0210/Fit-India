import React, { createContext, useContext, useCallback, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useColors } from '../store';

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

const COLORS = {
  success: { bg: '#EAF3DE', text: '#3B6D11', dot: '#639922' },
  error: { bg: '#FCEBEB', text: '#A32D2D', dot: '#E24B4A' },
  warning: { bg: '#FAEEDA', text: '#854F0B', dot: '#EF9F27' },
  info: { bg: '#E6F1FB', text: '#185FA5', dot: '#378ADD' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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
                <Text style={styles.toastTitle}>{t.title}</Text>
                <Text style={styles.toastMsg}>{t.message}</Text>
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
                <Text style={styles.closeText}>✕</Text>
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
    bottom: 32,
    left: 16,
    right: 16,
    gap: 10,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  toastBody: { flex: 1 },
  toastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  toastMsg: { fontSize: 13, color: '#666', lineHeight: 18 },
  toastAction: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  closeBtn: { padding: 2 },
  closeText: { fontSize: 14, color: '#aaa' },
});
