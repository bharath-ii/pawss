// ─────────────────────────────────────────────
// PAWWS — Edit Pet Screen
// Full species selector (maximum coverage + custom)
// Clean Poppins typography, vector icons, Firestore integration
// ─────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { PET_SPECIES_LIST, PetSpecies, PetGender, Pet } from '@pawws/shared';
import { db, auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { petService } from '../../services/petService';
import { AppBar, Button, Input, Icon } from '../../components/ui';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../theme';

export const EditPetScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const { petId } = route.params || {};
  const { firebaseUser, profile } = useAuthStore();
  const effectiveUserId = firebaseUser?.uid || auth.currentUser?.uid || profile?.uid || 'user_guest';

  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [customSpecies, setCustomSpecies] = useState('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch pet data if petId exists
  useEffect(() => {
    let isMounted = true;
    if (!petId) return;

    async function loadPet() {
      try {
        // Check local cache first
        const pets = await petService.getPets(effectiveUserId);
        const match = pets.find((p) => p.petId === petId);
        if (match && isMounted) {
          setName(match.name || '');
          setSpecies(match.species || 'dog');
          setCustomSpecies(match.customSpecies || '');
          setBreed(match.breed || '');
          setGender(match.gender || 'male');
          setAge(match.ageYears ? String(match.ageYears) : '');
          setWeight(match.weightKg ? String(match.weightKg) : '');
          setAllergies(match.allergies ? match.allergies.join(', ') : '');
          setMedicalNotes(match.medicalNotes || '');
          return;
        }

        const petRef = doc(db, 'pets', petId);
        const snap = await getDoc(petRef);
        if (snap.exists() && isMounted) {
          const data = snap.data() as Pet;
          setName(data.name || '');
          setSpecies(data.species || 'dog');
          setCustomSpecies(data.customSpecies || '');
          setBreed(data.breed || '');
          setGender(data.gender || 'male');
          setAge(data.ageYears ? String(data.ageYears) : '');
          setWeight(data.weightKg ? String(data.weightKg) : '');
          setAllergies(data.allergies ? data.allergies.join(', ') : '');
          setMedicalNotes(data.medicalNotes || '');
        }
      } catch (err) {
        console.warn('[EditPetScreen] Load pet error:', err);
      }
    }

    loadPet();
    return () => {
      isMounted = false;
    };
  }, [petId, effectiveUserId]);

  const selectedSpeciesOption =
    PET_SPECIES_LIST.find((s) => s.id === species) || PET_SPECIES_LIST[0];

  const handleUpdate = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Name Required',
        text2: 'Please enter pet name',
      });
      return;
    }

    if (species === 'other' && !customSpecies.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Custom Species Required',
        text2: 'Please enter your pet type (e.g. Ferret, Hedgehog, Iguana)',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (petId) {
        const updates: Partial<Pet> = {
          name: name.trim(),
          species,
          customSpecies: species === 'other' ? customSpecies.trim() : undefined,
          breed: breed.trim() || (species === 'other' ? customSpecies.trim() : selectedSpeciesOption.label),
          gender,
          ageYears: age ? parseFloat(age) : 0,
          weightKg: weight ? parseFloat(weight) : 0,
          allergies: allergies.trim()
            ? allergies.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          medicalNotes: medicalNotes.trim(),
        };

        await petService.updatePet(petId, updates, effectiveUserId);

        // Update React Query caches
        queryClient.setQueryData(['pets', effectiveUserId], (old: Pet[] | undefined) => {
          if (!old) return old;
          return old.map((p) => (p.petId === petId ? { ...p, ...updates } : p));
        });
        queryClient.setQueryData(['pets'], (old: Pet[] | undefined) => {
          if (!old) return old;
          return old.map((p) => (p.petId === petId ? { ...p, ...updates } : p));
        });
        await queryClient.invalidateQueries({ queryKey: ['pets'] });
      }

      Toast.show({
        type: 'success',
        text1: 'Profile Updated! 🐾',
        text2: `${name}’s profile has been updated`,
      });

      navigation.goBack();
    } catch (err: any) {
      console.error('[EditPetScreen] Update error:', err);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err?.message || 'Could not update pet details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Remove Pet',
      `Are you sure you want to remove ${name || 'this pet'} from your profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              if (petId) {
                await petService.deletePet(petId, effectiveUserId);
                queryClient.setQueryData(['pets', effectiveUserId], (old: Pet[] | undefined) => {
                  if (!old) return [];
                  return old.filter((p) => p.petId !== petId);
                });
                queryClient.setQueryData(['pets'], (old: Pet[] | undefined) => {
                  if (!old) return [];
                  return old.filter((p) => p.petId !== petId);
                });
                await queryClient.invalidateQueries({ queryKey: ['pets'] });
              }
              Toast.show({
                type: 'info',
                text1: 'Pet Removed',
                text2: `${name} has been removed`,
              });
              navigation.goBack();
            } catch (e: any) {
              console.error('[EditPetScreen] Delete error:', e);
              navigation.goBack();
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppBar
        title="Edit Pet Profile"
        showBack
        onBack={() => navigation.goBack()}
        rightIcon="trash"
        onRightPress={handleDelete}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introHeader}>
          <Text style={styles.title}>Update Pet Details</Text>
          <Text style={styles.subtitle}>
            Modify species, custom animal details, or care information
          </Text>
        </View>

        {/* ─── SPECIES GRID (MAXIMUM SPECIES + CUSTOM) ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pet Species</Text>
          <View style={styles.speciesGrid}>
            {PET_SPECIES_LIST.map((item) => {
              const isSelected = species === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.speciesCard,
                    isSelected && styles.speciesCardActive,
                  ]}
                  onPress={() => setSpecies(item.id)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item.label}`}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleActive,
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={22}
                      color={isSelected ? COLORS.black : COLORS.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.speciesName,
                      isSelected && styles.speciesNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── CUSTOM SPECIES INPUT (WHEN 'OTHER' IS SELECTED) ─── */}
        {species === 'other' && (
          <View style={styles.customNoticeCard}>
            <View style={styles.customNoticeHeader}>
              <Icon name="sparkles" size={18} color={COLORS.primaryDark} />
              <Text style={styles.customNoticeTitle}>Custom Pet Type</Text>
            </View>
            <Text style={styles.customNoticeText}>
              Tell us the specific kind of animal (e.g. Ferret, Hedgehog, Sugar Glider, Duck, Lizard).
            </Text>
            <Input
              label="Pet Type / Animal *"
              placeholder="e.g. Ferret, Hedgehog, Iguana, Duck"
              value={customSpecies}
              onChangeText={setCustomSpecies}
              containerStyle={styles.customInputContainer}
            />
          </View>
        )}

        {/* ─── PET BASIC DETAILS ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Basic Information</Text>

          <Input
            label="Pet Name *"
            placeholder="e.g. Milo, Bella"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Breed or Variety"
            placeholder={selectedSpeciesOption.defaultBreedPlaceholder}
            value={breed}
            onChangeText={setBreed}
          />

          {/* Gender Selector */}
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {(
              [
                { id: 'male', label: '♂ Male' },
                { id: 'female', label: '♀ Female' },
                { id: 'unknown', label: '🐾 Not Specified' },
              ] as const
            ).map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.genderPill,
                  gender === g.id && styles.genderPillActive,
                ]}
                onPress={() => setGender(g.id)}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g.id && styles.genderTextActive,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Age and Weight */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Input
                label="Age (Years)"
                placeholder="e.g. 2"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Weight (kg)"
                placeholder="e.g. 12"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>
        </View>

        {/* ─── HEALTH & SPECIAL CARE (OPTIONAL) ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Health & Care Notes</Text>
          <Input
            label="Known Allergies"
            placeholder="e.g. Chicken, Peanuts (comma separated)"
            value={allergies}
            onChangeText={setAllergies}
          />
          <Input
            label="Medical Notes / Special Instructions"
            placeholder="e.g. Shy around strangers, loves ear rubs"
            value={medicalNotes}
            onChangeText={setMedicalNotes}
            multiline
            numberOfLines={2}
          />
        </View>

        <TouchableOpacity
          style={styles.deleteLink}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Icon name="trash" size={16} color={COLORS.error} />
          <Text style={styles.deleteLinkText}>Remove this pet from profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ─── STICKY FOOTER ─── */}
      <View style={styles.footer}>
        <Button
          label="Save Changes"
          onPress={handleUpdate}
          loading={isLoading}
          size="lg"
          fullWidth
          leftIcon={<Icon name="check" size={18} color={COLORS.black} />}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    padding: SPACING.md,
    paddingBottom: 110,
  },
  introHeader: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.extraBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.black,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  speciesCard: {
    width: '31%',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryDark,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryDark,
  },
  speciesName: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  speciesNameActive: {
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  customNoticeCard: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  customNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  customNoticeTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.black,
  },
  customNoticeText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  customInputContainer: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.offWhite,
    alignItems: 'center',
  },
  genderPillActive: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
  },
  genderText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  genderTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  col: {
    flex: 1,
  },
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.md,
    marginTop: SPACING.xs,
  },
  deleteLinkText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
