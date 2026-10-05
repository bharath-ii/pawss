// ─────────────────────────────────────────────
// PAWWS — Confirmation Dialog / Modal Component
// Consistent, clean dialogs for delete, logout, etc.
// ─────────────────────────────────────────────

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { IconName } from '@pawws/shared';

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: IconName;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  icon,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogCard}>
              {/* Optional Icon */}
              {icon ? (
                <View
                  style={[
                    styles.iconCircle,
                    isDestructive ? styles.iconCircleDestructive : styles.iconCircleDefault,
                  ]}
                >
                  <Icon
                    name={icon}
                    size={28}
                    color={isDestructive ? COLORS.error : COLORS.black}
                  />
                </View>
              ) : null}

              {/* Title & Message */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <View style={styles.buttonCol}>
                  <Button
                    label={cancelLabel}
                    onPress={onClose}
                    variant="outline"
                    size="md"
                    disabled={isLoading}
                  />
                </View>
                <View style={styles.buttonCol}>
                  <Button
                    label={confirmLabel}
                    onPress={onConfirm}
                    variant={isDestructive ? 'primary' : 'primary'}
                    size="md"
                    loading={isLoading}
                    style={isDestructive ? { backgroundColor: COLORS.error } : undefined}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleDefault: {
    backgroundColor: COLORS.primaryLight,
  },
  iconCircleDestructive: {
    backgroundColor: '#FEE2E2',
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  buttonCol: {
    flex: 1,
  },
});
