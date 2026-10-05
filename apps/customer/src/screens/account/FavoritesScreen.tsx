// ─────────────────────────────────────────────
// PAWWS — Favorites Screen
// Bookmarked providers and services
// ─────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppBar, EmptyState } from '../../components/ui';
import { COLORS } from '../../theme';

export const FavoritesScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <AppBar title="Favorites" />
      <EmptyState
        icon="heart"
        title="No Favorites Yet"
        description="Tap the heart icon on any partner clinic, groomer, or trainer to save them here for quick access."
        actionLabel="Explore Pet Services"
        onAction={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
});
