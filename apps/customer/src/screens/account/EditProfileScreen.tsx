// ─────────────────────────────────────────────
// PAWWS — Edit Profile Screen
// Update user personal details & emergency contacts
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Toast from 'react-native-toast-message';

import { auth, db, storage } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { AppBar, Button, Input, Icon } from '../../components/ui';
import { COLORS, FONTS, RADIUS } from '../../theme';
import { STORAGE } from '@pawws/shared';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, firebaseUser, setProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(profile?.emergencyContact?.relation || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(profile?.photoURL || null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Needed', 'Please enable photo library access to upload your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri && firebaseUser) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      setIsUploadingPhoto(true);

      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, STORAGE.userPhotos(firebaseUser.uid));
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          photoURL: downloadUrl,
          updatedAt: serverTimestamp(),
        });

        if (profile) {
          setProfile({ ...profile, photoURL: downloadUrl });
        }
        Toast.show({ type: 'success', text1: 'Photo Updated', text2: 'Your new avatar is live!' });
      } catch (err) {
        console.error('Avatar upload error:', err);
        Toast.show({ type: 'error', text1: 'Upload Failed', text2: 'Could not upload photo. Please retry.' });
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Toast.show({ type: 'error', text1: 'Missing Name', text2: 'Please enter your full name.' });
      return;
    }

    if (!firebaseUser) return;
    setIsSaving(true);

    try {
      const updatedData: Record<string, any> = {
        displayName: displayName.trim(),
        phone: phone.trim() || null,
        updatedAt: serverTimestamp(),
      };

      if (emergencyName.trim() || emergencyPhone.trim()) {
        updatedData.emergencyContact = {
          name: emergencyName.trim(),
          phone: emergencyPhone.trim(),
          relation: emergencyRelation.trim() || 'Emergency Contact',
        };
      }

      await updateDoc(doc(db, 'users', firebaseUser.uid), updatedData);

      if (profile) {
        setProfile({
          ...profile,
          displayName: displayName.trim(),
          phone: phone.trim() || null,
          emergencyContact: updatedData.emergencyContact || profile.emergencyContact,
        });
      }

      Toast.show({ type: 'success', text1: 'Profile Saved', text2: 'Your information has been updated.' });
      navigation.goBack();
    } catch (err) {
      console.error('Update profile error:', err);
      Toast.show({ type: 'error', text1: 'Save Failed', text2: 'Could not update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <AppBar title="Edit Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickPhoto}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Change profile picture"
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Icon name="profile" size={44} color={COLORS.textMuted} />
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Icon name="camera" size={15} color={COLORS.black} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>
            {isUploadingPhoto ? 'Uploading photo...' : 'Tap to change photo'}
          </Text>
        </View>

        {/* Basic Info Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Personal Information</Text>

          <Input
            label="Full Name"
            placeholder="e.g. Bharathi Kumar"
            value={displayName}
            onChangeText={setDisplayName}
            leftIcon={<Icon name="user" size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={profile?.email || ''}
            editable={false}
            leftIcon={<Icon name="mail" size={18} color={COLORS.textMuted} />}
            hint="Email is linked to your Google/Firebase login"
          />

          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Icon name="phone" size={18} color={COLORS.textSecondary} />}
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Emergency Contact</Text>
          <Text style={styles.sectionSubtitle}>
            Shared with service providers during active home services for safety.
          </Text>

          <Input
            label="Contact Name"
            placeholder="e.g. Sarah (Family)"
            value={emergencyName}
            onChangeText={setEmergencyName}
            leftIcon={<Icon name="profile" size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Emergency Phone"
            placeholder="+91 98765 00000"
            keyboardType="phone-pad"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            leftIcon={<Icon name="phone" size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Relationship"
            placeholder="e.g. Spouse / Sibling / Friend"
            value={emergencyRelation}
            onChangeText={setEmergencyRelation}
            leftIcon={<Icon name="shieldCheck" size={18} color={COLORS.textSecondary} />}
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonWrapper}>
          <Button
            label="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            loading={isSaving}
            disabled={isSaving || isUploadingPhoto}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    position: 'relative',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
    lineHeight: 18,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});
