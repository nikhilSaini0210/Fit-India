import React, { createContext, useContext, useCallback, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

interface ModalButton {
  label: string;
  variant: 'primary' | 'danger' | 'ghost';
  onPress: () => void;
}
interface ModalConfig {
  title: string;
  message: string;
  errors?: string[];
  buttons: ModalButton[];
}

const ModalContext = createContext<(cfg: ModalConfig) => void>(() => {});
export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [cfg, setCfg] = useState<ModalConfig | null>(null);

  const show = useCallback((c: ModalConfig) => setCfg(c), []);
  const close = () => setCfg(null);

  return (
    <ModalContext.Provider value={show}>
      {children}
      <Modal
        visible={!!cfg}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.overlay} onPress={close}>
          <Pressable style={styles.box} onPress={e => e.stopPropagation()}>
            <Text style={styles.title}>{cfg?.title}</Text>
            <Text style={styles.msg}>{cfg?.message}</Text>
            {cfg?.errors && (
              <View style={styles.errList}>
                {cfg.errors.map((e, i) => (
                  <Text key={i} style={styles.errItem}>
                    • {e}
                  </Text>
                ))}
              </View>
            )}
            <View style={styles.footer}>
              {cfg?.buttons.map((b, i) => (
                <Pressable
                  key={i}
                  style={[styles.btn, styles[b.variant]]}
                  onPress={() => {
                    b.onPress();
                    close();
                  }}
                >
                  <Text
                    style={[
                      styles.btnText,
                      b.variant === 'ghost' && styles.ghostText,
                    ]}
                  >
                    {b.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 8 },
  msg: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 16 },
  errList: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  errItem: { fontSize: 13, color: '#E24B4A', lineHeight: 18 },
  footer: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  btn: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  primary: { backgroundColor: '#111' },
  danger: { backgroundColor: '#E24B4A' },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  ghostText: { color: '#555' },
});
