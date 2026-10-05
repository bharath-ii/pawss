// ─────────────────────────────────────────────
// PAWWS — Explore Screen
// ─────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppBar, EmptyState } from '../../components/ui';
import { COLORS } from '../../theme';
import { useRoute } from '@react-navigation/native';

export const ExploreScreen: React.FC = () => {
  const route = useRoute<any>();
  const category = route.params?.category;

  return (
    <View style={styles.container}>
      <AppBar title={category ? `Explore: ${category}` : 'Explore'} />
      <EmptyState
        icon="search"
        title="Explore Services"
        description="Search functionality and category browsing will be available in the next update!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
});
