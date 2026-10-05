// ─────────────────────────────────────────────
// PAWWS — Pet Service
// Hybrid Offline-First Local + Firestore Persistence
// Ensures pets are instantly visible and persisted
// ─────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import type { Pet } from '@pawws/shared';

const getStorageKey = (userId: string) => `@pawws_pets_${userId || 'default'}`;

export const petService = {
  /**
   * Retrieves pets for the given user, merging local AsyncStorage cache with Firestore.
   */
  async getPets(userId: string): Promise<Pet[]> {
    const key = getStorageKey(userId);
    let localPets: Pet[] = [];

    // 1. Read from local AsyncStorage cache
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        localPets = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[petService] Failed to load local pets:', e);
    }

    // 2. Fetch from Firestore if user has an ID
    const effectiveUid = auth.currentUser?.uid || (userId !== 'guest_user' ? userId : null);
    if (effectiveUid) {
      try {
        const q = query(
          collection(db, 'pets'),
          where('ownerId', '==', effectiveUid),
          where('isActive', '==', true)
        );
        const snap = await getDocs(q);
        const remotePets = snap.docs.map(
          (d) => ({ ...d.data(), petId: d.id } as Pet)
        );

        if (remotePets.length > 0) {
          // Merge unique by petId, prioritizing newest data
          const map = new Map<string, Pet>();
          remotePets.forEach((p) => map.set(p.petId, p));
          localPets.forEach((p) => {
            if (!map.has(p.petId) && p.isActive !== false) {
              map.set(p.petId, p);
            }
          });
          const merged = Array.from(map.values());
          await AsyncStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('[petService] Firestore fetch pets error (using local cache):', err);
      }
    }

    return localPets.filter((p) => p.isActive !== false);
  },

  /**
   * Adds a new pet to local cache immediately and persists to Firestore.
   */
  async addPet(
    petData: Omit<Pet, 'petId' | 'ownerId' | 'createdAt' | 'updatedAt' | 'dateOfBirth'> & {
      dateOfBirth?: any;
    },
    userId: string
  ): Promise<Pet> {
    const effectiveUid = auth.currentUser?.uid || userId || 'user_guest';
    const petRef = doc(collection(db, 'pets'));
    const petId = petRef.id;

    const newPet: Pet = {
      dateOfBirth: null,
      ...petData,
      petId,
      ownerId: effectiveUid,
      isActive: true,
      createdAt: new Date().toISOString() as any,
      updatedAt: new Date().toISOString() as any,
    };

    // 1. Immediately store to local AsyncStorage so it is instantly available
    const key = getStorageKey(effectiveUid);
    try {
      const existing = await this.getPets(effectiveUid);
      const updated = [newPet, ...existing.filter((p) => p.petId !== petId)];
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('[petService] Failed to persist pet locally:', e);
    }

    // 2. Persist to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'pets', petId), {
          ...newPet,
          ownerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.warn('[petService] Firestore write failed, preserved in local storage:', firestoreErr);
      }
    }

    return newPet;
  },

  /**
   * Updates an existing pet in local cache and Firestore.
   */
  async updatePet(
    petId: string,
    updates: Partial<Pet>,
    userId: string
  ): Promise<void> {
    const effectiveUid = auth.currentUser?.uid || userId || 'user_guest';
    const key = getStorageKey(effectiveUid);

    try {
      const existing = await this.getPets(effectiveUid);
      const updated = existing.map((p) =>
        p.petId === petId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() as any }
          : p
      );
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('[petService] Failed to update pet locally:', e);
    }

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'pets', petId), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.warn('[petService] Firestore update pet error:', firestoreErr);
      }
    }
  },

  /**
   * Deletes a pet (sets isActive to false) in local cache and Firestore.
   */
  async deletePet(petId: string, userId: string): Promise<void> {
    const effectiveUid = auth.currentUser?.uid || userId || 'user_guest';
    const key = getStorageKey(effectiveUid);

    try {
      const existing = await this.getPets(effectiveUid);
      const updated = existing.filter((p) => p.petId !== petId);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('[petService] Failed to delete pet locally:', e);
    }

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'pets', petId), {
          isActive: false,
          updatedAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.warn('[petService] Firestore delete pet error:', firestoreErr);
      }
    }
  },
};
