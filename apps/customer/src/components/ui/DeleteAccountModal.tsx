// ─────────────────────────────────────────────
// PAWWS — Real Account Deletion Flow Component
// Confirmation with safety typing barrier and data disclosures
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { LEGAL_CONTENT } from '@pawws/shared';

export interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirmDelete,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmationText.trim().toUpperCase() === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete();
    } finally {
      setIsDeleting(false);
      setConfirmationText('');
      onClose();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentWrap}
          >
            {/* Warning Header */}
            <View style={styles.iconCircle}>
              <Icon name="alert" size={30} color={COLORS.error} />
            </View>

            <Text style={styles.title}>{LEGAL_CONTENT.ACCOUNT_DELETION.title}</Text>
            <Text style={styles.warningText}>
              {LEGAL_CONTENT.ACCOUNT_DELETION.warning}
            </Text>

            {/* Checklist of what will be erased */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>What will be permanently deleted:</Text>
              {LEGAL_CONTENT.ACCOUNT_DELETION.itemsDeleted.map((item, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Statutory retention note */}
            <Text style={styles.statutoryNote}>
              Note: Tax invoices for completed transactions will be preserved in anonymized form for 7 years to comply with statutory financial laws.
            </Text>

            {/* Safety Confirmation Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                To confirm, type <Text style={styles.highlightText}>DELETE</Text> below:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="DELETE"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="characters"
                value={confirmationText}
                onChangeText={setConfirmationText}
                editable={!isDeleting}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonStack}>
              <Button
                label={isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}
                onPress={handleDelete}
                variant="primary"
                size="lg"
                disabled={!isConfirmed || isDeleting}
                loading={isDeleting}
                style={StyleSheet.flatten([
                  styles.deleteButton,
                  !isConfirmed && styles.deleteButtonDisabled,
                ])}
              />

              <Button
                label="Cancel & Keep My Account"
                onPress={handleClose}
                variant="outline"
                size="md"
                disabled={isDeleting}
                style={styles.cancelButton}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
  },
  contentWrap: {
    padding: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.error,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    color: COLORS.error,
    fontSize: 16,
    marginRight: 8,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  statutoryNote: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputSection: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },
  textInput: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonDisabled: {
    opacity: 0.4,
  },
  cancelButton: {
    marginTop: 4,
  },
});
