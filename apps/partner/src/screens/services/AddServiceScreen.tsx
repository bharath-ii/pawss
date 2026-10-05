import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const AddServiceScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Add Service Screen (Coming Soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
});
