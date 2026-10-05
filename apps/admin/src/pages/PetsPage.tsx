// ─────────────────────────────────────────────
// PAWWS Admin — Pets Registry Management
// Global registry of all registered pets, vaccination status, species breakdown
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Icon } from '../components/ui/Icon';
import type { PetSpecies } from '@pawws/shared';

interface PetRecord {
  id: string;
  name: string;
  species: PetSpecies;
  customSpecies?: string;
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  gender?: 'male' | 'female';
  isNeutered?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  microchipNumber?: string;
  isVaccinated?: boolean;
  vaccinationExpiry?: string;
  allergies?: string[];
  photoURL?: string;
}

export const PetsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | PetSpecies>('all');
  const [selectedPet, setSelectedPet] = useState<PetRecord | null>(null);

  const { data: pets, isLoading } = useQuery<PetRecord[]>({
    queryKey: ['admin-pets'],
    queryFn: async () => {
      try {
        const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        if (snap.empty) {
          // Preloaded real-world demonstration pets
          return [
            {
              id: 'pet_1',
              name: 'Bruno',
              species: 'dog',
              breed: 'Golden Retriever',
              ageYears: 3,
              weightKg: 28,
              gender: 'male',
              isNeutered: true,
              ownerName: 'Aarav Sharma',
              ownerPhone: '+91 98765 43210',
              ownerEmail: 'aarav.sharma@example.com',
              microchipNumber: 'IND-982-114-001',
              isVaccinated: true,
              vaccinationExpiry: '2027-01-15',
              allergies: ['Chicken meal'],
            },
            {
              id: 'pet_2',
              name: 'Bella',
              species: 'cat',
              breed: 'Persian Cat',
              ageYears: 2,
              weightKg: 4.2,
              gender: 'female',
              isNeutered: true,
              ownerName: 'Priya Patel',
              ownerPhone: '+91 98123 45678',
              ownerEmail: 'priya.patel@example.com',
              microchipNumber: 'IND-982-114-042',
              isVaccinated: true,
              vaccinationExpiry: '2026-11-20',
              allergies: [],
            },
            {
              id: 'pet_3',
              name: 'Max',
              species: 'dog',
              breed: 'German Shepherd',
              ageYears: 4,
              weightKg: 34,
              gender: 'male',
              isNeutered: false,
              ownerName: 'Vikram Joshi',
              ownerPhone: '+91 98456 78901',
              ownerEmail: 'vikram.j@example.com',
              microchipNumber: 'IND-982-114-099',
              isVaccinated: false,
              vaccinationExpiry: '2026-03-01',
              allergies: ['Dust mites'],
            },
            {
              id: 'pet_4',
              name: 'Coco',
              species: 'dog',
              breed: 'Shih Tzu',
              ageYears: 1,
              weightKg: 6.5,
              gender: 'female',
              isNeutered: true,
              ownerName: 'Sneha Rao',
              ownerPhone: '+91 97890 12345',
              ownerEmail: 'sneha.rao@example.com',
              microchipNumber: 'IND-982-114-123',
              isVaccinated: true,
              vaccinationExpiry: '2026-12-10',
              allergies: [],
            },
          ];
        }
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PetRecord));
      } catch (e) {
        console.error('Error fetching pets:', e);
        return [];
      }
    },
  });

  const filteredPets = pets?.filter((p) => {
    const matchesSpecies = speciesFilter === 'all' || p.species === speciesFilter;
    const name = p.name || '';
    const breed = p.breed || '';
    const owner = p.ownerName || '';
    const matchesSearch =
      searchTerm === '' ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Pets Registry
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
            Centralized health, breed, and identification records for all platform pets
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Species Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['all', 'dog', 'cat', 'bird', 'rabbit', 'fish', 'hamster', 'reptile', 'horse', 'other'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: speciesFilter === s ? '#FFC0CB' : '#E5E7EB',
                backgroundColor: speciesFilter === s ? '#FFC0CB' : '#FFFFFF',
                color: '#1A1A1A',
                fontSize: '12px',
                fontWeight: speciesFilter === s ? 600 : 500,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {s === 'all' ? 'All Pets' : s === 'other' ? 'Custom / Other' : `${s}s`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '8px 16px',
            minWidth: '280px',
          }}
        >
          <Icon name="search" size={16} color="#6B7280" />
          <input
            placeholder="Search by pet name, breed, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontFamily: "'Poppins', sans-serif",
              color: '#1A1A1A',
              width: '100%',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="pets" size={18} color="#1A1A1A" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>
            Registered Pets Directory ({filteredPets?.length ?? 0})
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: '32px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '48px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Pet Details
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Breed & Species
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Age & Weight
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Pet Parent
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Vaccinations
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPets && filteredPets.length > 0 ? (
                  filteredPets.map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #F3F4F6',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '18px',
                              backgroundColor: '#FFD6DE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#1A1A1A',
                            }}
                          >
                            <Icon name="pets" size={18} color="#1A1A1A" />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {p.gender || 'Unknown'} • {p.isNeutered ? 'Neutered' : 'Intact'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Species & Breed */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A' }}>
                          {p.breed || 'Mixed Breed'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'capitalize' }}>
                          {p.species === 'other' && p.customSpecies ? p.customSpecies : p.species}
                        </div>
                      </td>

                      {/* Age & Weight */}
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#1A1A1A' }}>
                        <div>{p.ageYears ? `${p.ageYears} yrs` : '—'}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          {p.weightKg ? `${p.weightKg} kg` : '—'}
                        </div>
                      </td>

                      {/* Parent */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500 }}>
                          {p.ownerName || 'Verified Parent'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{p.ownerPhone || '—'}</div>
                      </td>

                      {/* Vaccinations */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: p.isVaccinated ? '#DCFCE7' : '#FEE2E2',
                            color: p.isVaccinated ? '#15803D' : '#DC2626',
                          }}
                        >
                          {p.isVaccinated ? 'Up to date' : 'Overdue / Missing'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedPet(p)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#FFFFFF',
                            color: '#1A1A1A',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: "'Poppins', sans-serif",
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Icon name="profile" size={12} color="#1A1A1A" />
                          <span>View Card</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                      No pets match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pet Detail Modal */}
      {selectedPet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setSelectedPet(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="pets" size={20} color="#1A1A1A" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                  Pet Medical & Identity Card
                </h3>
              </div>
              <button
                onClick={() => setSelectedPet(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <Icon name="close" size={18} color="#6B7280" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '27px',
                  backgroundColor: '#FFD6DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="pets" size={26} color="#1A1A1A" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                  {selectedPet.name}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  {selectedPet.breed} • {selectedPet.species === 'other' && selectedPet.customSpecies ? selectedPet.customSpecies : selectedPet.species}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#6B7280' }}>Microchip:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedPet.microchipNumber || 'Not chipped'}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Weight:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedPet.weightKg || '—'} kg</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Neutered:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedPet.isNeutered ? 'Yes' : 'No'}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Vaccine Expiry:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedPet.vaccinationExpiry || 'Unknown'}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>Registered Owner:</div>
              <div style={{ color: '#6B7280' }}>{selectedPet.ownerName} ({selectedPet.ownerEmail})</div>
              <div style={{ color: '#6B7280' }}>Phone: {selectedPet.ownerPhone}</div>
            </div>

            <button
              onClick={() => setSelectedPet(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
