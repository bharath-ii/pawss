// ─────────────────────────────────────────────
// PAWWS Admin — Services & Categories Catalog
// Master catalog management, pricing rules, commission tiers
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../config/firebase';
import { Icon } from '../components/ui/Icon';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  commissionPercent: number;
  activePartnersCount: number;
  isActive: boolean;
}

const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    id: 'cat_grooming',
    name: 'Pet Grooming & Spa',
    description: 'Bathing, haircutting, nail clipping, ear cleaning and styling',
    basePrice: 799,
    commissionPercent: 15,
    activePartnersCount: 14,
    isActive: true,
  },
  {
    id: 'cat_veterinary',
    name: 'Veterinary Healthcare',
    description: 'Consultations, vaccinations, diagnosis, and emergency surgical care',
    basePrice: 599,
    commissionPercent: 12,
    activePartnersCount: 18,
    isActive: true,
  },
  {
    id: 'cat_walking',
    name: 'Dog Walking & Exercise',
    description: '30/45/60 min private walking sessions with GPS tracking',
    basePrice: 299,
    commissionPercent: 18,
    activePartnersCount: 22,
    isActive: true,
  },
  {
    id: 'cat_boarding',
    name: 'Pet Boarding & Daycare',
    description: 'Cage-free home boarding, overnight stays, and day nursery',
    basePrice: 999,
    commissionPercent: 15,
    activePartnersCount: 9,
    isActive: true,
  },
  {
    id: 'cat_training',
    name: 'Behavioral Pet Training',
    description: 'Puppy socialization, basic obedience, agility, and behavioral therapy',
    basePrice: 1499,
    commissionPercent: 15,
    activePartnersCount: 7,
    isActive: true,
  },
  {
    id: 'cat_taxi',
    name: 'Pet Taxi & Ambulance',
    description: 'Safe climate-controlled pet transport to clinics, parks, and airports',
    basePrice: 499,
    commissionPercent: 20,
    activePartnersCount: 5,
    isActive: true,
  },
];

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceCategory[]>(DEFAULT_SERVICES);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(499);
  const [newServiceCommission, setNewServiceCommission] = useState(15);

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    toast.success('Service status updated');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const newCat: ServiceCategory = {
      id: `cat_${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc,
      basePrice: Number(newServicePrice),
      commissionPercent: Number(newServiceCommission),
      activePartnersCount: 0,
      isActive: true,
    };
    setServices((prev) => [newCat, ...prev]);
    setIsAddModalOpen(false);
    setNewServiceName('');
    setNewServiceDesc('');
    toast.success('New service category added to marketplace catalog');
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Services & Categories Catalog
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
            Configure marketplace verticals, commission takes, and base price floors
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#FFC0CB',
            color: '#1A1A1A',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(255,192,203,0.4)',
          }}
        >
          <Icon name="add" size={16} color="#1A1A1A" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {services.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              opacity: s.isActive ? 1 : 0.7,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '21px',
                  backgroundColor: '#FFD6DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="tag" size={20} color="#1A1A1A" />
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  backgroundColor: s.isActive ? '#DCFCE7' : '#F3F4F6',
                  color: s.isActive ? '#15803D' : '#6B7280',
                }}
              >
                {s.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{s.name}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', flex: 1 }}>
              {s.description}
            </div>

            <div
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '12px',
                padding: '12px 16px',
                margin: '16px 0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#6B7280' }}>Base Price:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>₹{s.basePrice}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Platform Take:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{s.commissionPercent}%</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#6B7280' }}>Active Providers:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{s.activePartnersCount} clinics/pros</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleActive(s.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: s.isActive ? '#EF4444' : '#10B981',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {s.isActive ? 'Disable Category' : 'Enable Category'}
              </button>

              <button
                onClick={() => setSelectedService(s)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#1A1A1A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Icon name="edit" size={12} color="#1A1A1A" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Service Modal */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="tag" size={20} color="#1A1A1A" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                  Create Service Vertical
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <Icon name="close" size={18} color="#6B7280" />
              </button>
            </div>

            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pet Dental Cleaning"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '13px',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of services included..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '13px',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '13px',
                      fontFamily: "'Poppins', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                    Take Rate (%)
                  </label>
                  <input
                    type="number"
                    value={newServiceCommission}
                    onChange={(e) => setNewServiceCommission(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '13px',
                      fontFamily: "'Poppins', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
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
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
