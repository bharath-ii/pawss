import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

export const OnboardingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Onboarding Screen (Coming Soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
});
