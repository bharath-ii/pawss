// ─────────────────────────────────────────────
// PAWWS — Messages / Chat Screen
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppBar, EmptyState } from '../../components/ui';
import { COLORS } from '../../theme';

export const MessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppBar title="Messages" />
      <EmptyState
        icon="messageCircle"
        title="No Messages Yet"
        description="Your conversations with service providers will appear here after your first booking."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
});
