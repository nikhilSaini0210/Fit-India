import React, { createContext, useContext, useCallback, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Button } from '../components';
import { rs } from '../utils';
import { fonts } from '../constants';
import { useColors } from '../store';

interface ModalButton {
  label: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
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
  const colors = useColors();
  const [cfg, setCfg] = useState<ModalConfig | null>(null);

  const show = useCallback((c: ModalConfig) => setCfg(c), []);
  const close = () => setCfg(null);

  return (
    <ModalContext.Provider value={show}>
      {children}
      <Modal
        visible={!!cfg}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          onPress={close}
        >
          <Pressable
            style={[styles.box, { backgroundColor: colors.background }]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {cfg?.title}
            </Text>
            <Text style={[styles.msg, { color: colors.textSecondary }]}>
              {cfg?.message}
            </Text>
            {cfg?.errors && (
              <View
                style={[styles.errList, { backgroundColor: colors.errorLight }]}
              >
                {cfg.errors.map((e, i) => (
                  <Text
                    key={i}
                    style={[styles.errItem, { color: colors.error }]}
                  >
                    • {e}
                  </Text>
                ))}
              </View>
            )}
            <View style={styles.footer}>
              {cfg?.buttons.map((b, i) => (
                <Button
                  key={i}
                  label={b.label}
                  onPress={() => {
                    b.onPress();
                    close();
                  }}
                  size="sm"
                  variant={b.variant}
                />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: rs.scale(24),
  },
  box: {
    borderRadius: rs.scale(20),
    padding: rs.scale(24),
    width: '100%',
    maxWidth: rs.scale(400),
  },
  title: {
    fontSize: rs.font(17),
    fontFamily: fonts.Medium,
    marginBottom: rs.verticalScale(8),
  },
  msg: {
    fontSize: rs.font(14),
    fontFamily: fonts.Regular,
    lineHeight: rs.font(20),
    marginBottom: rs.verticalScale(16),
  },
  errList: {
    borderRadius: rs.scale(10),
    padding: rs.scale(12),
    marginBottom: rs.verticalScale(16),
    gap: rs.scale(4),
  },
  errItem: {
    fontSize: rs.font(13),
    fontFamily: fonts.Regular,
    lineHeight: rs.font(18),
  },
  footer: {
    flexDirection: 'row',
    gap: rs.scale(10),
    justifyContent: 'flex-end',
  },
});
