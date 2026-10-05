// ─────────────────────────────────────────────
// PAWWS — My Pets Screen
// Manage customer's registered pets
// Vector icons, Poppins typography, clean EmptyState
// ─────────────────────────────────────────────

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { petService } from '../../services/petService';
import { AppBar, Button, Card, Skeleton, Icon, EmptyState } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import type { Pet } from '@pawws/shared';
import { getAgeFromDOB } from '@pawws/shared';

export const MyPetsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { firebaseUser, profile } = useAuthStore();
  const effectiveUserId = firebaseUser?.uid || auth.currentUser?.uid || profile?.uid || 'user_guest';

  const {
    data: pets,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['pets', effectiveUserId],
    queryFn: () => petService.getPets(effectiveUserId),
    staleTime: 5000,
  });

  // Automatically refresh pets whenever the screen gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const getPetIcon = (species: string): any => {
    switch (species) {
      case 'dog':
      case 'cat':
      case 'bird':
      case 'rabbit':
      case 'fish':
      case 'hamster':
      case 'reptile':
      case 'horse':
        return species;
      case 'other':
        return 'sparkles';
      default:
        return 'pets';
    }
  };

  const renderPetCard = ({ item, index }: { item: Pet; index: number }) => {
    const speciesLabel =
      item.species === 'other' && item.customSpecies
        ? item.customSpecies
        : item.species
        ? item.species.charAt(0).toUpperCase() + item.species.slice(1)
        : 'Pet';

    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
        <TouchableOpacity
          style={styles.petCard}
          onPress={() => navigation.navigate('EditPet', { petId: item.petId })}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.name}`}
        >
          {/* Avatar */}
          <View style={styles.petAvatar}>
            {item.photoURL ? (
              <Image source={{ uri: item.photoURL }} style={styles.petImage} />
            ) : (
              <View style={styles.petImagePlaceholder}>
                <Icon name={getPetIcon(item.species)} size={24} color={COLORS.black} />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petBreed}>
              {item.breed ? `${item.breed} • ${speciesLabel}` : speciesLabel}
            </Text>

            <View style={styles.petDetails}>
              <Text style={styles.petDetail}>
                {item.gender === 'male' ? 'Male' : item.gender === 'female' ? 'Female' : 'Pet'}
              </Text>
              {item.ageYears ? (
                <Text style={styles.petDetail}>• {item.ageYears} {item.ageYears === 1 ? 'yr' : 'yrs'}</Text>
              ) : item.dateOfBirth ? (
                <Text style={styles.petDetail}>• {getAgeFromDOB(item.dateOfBirth)}</Text>
              ) : null}
              {item.weightKg > 0 ? (
                <Text style={styles.petDetail}>• {item.weightKg} kg</Text>
              ) : null}
            </View>

          {item.allergies && item.allergies.length > 0 ? (
            <View style={styles.allergyRow}>
              <Icon name="alert" size={12} color={COLORS.error} />
              <Text style={styles.petAllergies} numberOfLines={1}>
                Allergies: {item.allergies.join(', ')}
              </Text>
            </View>
          ) : null}
        </View>

        <Icon name="chevronRight" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="My Pets"
        showBack={navigation.canGoBack()}
        rightIcon="add"
        onRightPress={() => navigation.navigate('AddPet')}
      />

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton height={90} borderRadius={RADIUS.lg} />
            </View>
          ))}
        </View>
      ) : pets && pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={(item: Pet) => item.petId}
          renderItem={renderPetCard}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
          ListFooterComponent={() => (
            <Button
              label="Add Another Pet"
              onPress={() => navigation.navigate('AddPet')}
              variant="outline"
              size="lg"
              fullWidth
              leftIcon={<Icon name="add" size={18} color={COLORS.black} />}
              style={styles.addBtn}
            />
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
        >
          <EmptyState
            icon="pets"
            title="No Pets Registered Yet"
            description="Add your dog, cat, or other pets to easily book grooming, veterinary, walking, and boarding services."
            actionLabel="Add Your First Pet"
            onAction={() => navigation.navigate('AddPet')}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  skeletonCard: {
    marginBottom: 12,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  petAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 14,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 2,
  },
  petBreed: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  petDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  petDetail: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  petAllergies: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.error,
    flex: 1,
  },
  addBtn: {
    marginTop: 12,
  },
});
