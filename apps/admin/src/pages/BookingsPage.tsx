// ─────────────────────────────────────────────
// PAWWS Admin — Bookings & Visits Management
// Live appointment monitoring, status transitions, and payment status
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../config/firebase';
import { Icon } from '../components/ui/Icon';

type BookingStatusFilter =
  | 'all'
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'service_completed'
  | 'cancelled';

interface BookingRecord {
  id: string;
  serviceName: string;
  category?: string;
  customerName: string;
  customerPhone?: string;
  partnerBusinessName: string;
  partnerPhone?: string;
  bookingDate: string;
  startTime: string;
  finalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingStatus:
    | 'pending'
    | 'confirmed'
    | 'in_progress'
    | 'service_completed'
    | 'cancelled';
  petName?: string;
  address?: string;
  createdAt?: any;
}

export const BookingsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery<BookingRecord[]>({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: async () => {
      try {
        const q = statusFilter === 'all'
          ? query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100))
          : query(
              collection(db, 'bookings'),
              where('bookingStatus', '==', statusFilter),
              orderBy('createdAt', 'desc'),
              limit(100)
            );
        const snap = await getDocs(q);
        if (snap.empty) {
          return [
            {
              id: 'bk_101',
              serviceName: 'Full Grooming & Bath Spa',
              category: 'grooming',
              customerName: 'Aarav Sharma',
              customerPhone: '+91 98765 43210',
              partnerBusinessName: 'Fur & Fluff Luxury Pet Spa',
              partnerPhone: '+91 98450 67890',
              bookingDate: '2026-09-26',
              startTime: '11:00 AM',
              finalAmount: 1299,
              paymentStatus: 'paid',
              bookingStatus: 'confirmed',
              petName: 'Bruno (Golden Retriever)',
              address: 'Indiranagar 12th Main, Bengaluru',
              createdAt: { seconds: Date.now() / 1000 - 3600 * 2 },
            },
            {
              id: 'bk_102',
              serviceName: 'Comprehensive Health Checkup',
              category: 'veterinary',
              customerName: 'Priya Patel',
              customerPhone: '+91 98123 45678',
              partnerBusinessName: 'Pawsome Vet & Surgery Hospital',
              partnerPhone: '+91 98220 12345',
              bookingDate: '2026-09-26',
              startTime: '02:30 PM',
              finalAmount: 799,
              paymentStatus: 'paid',
              bookingStatus: 'in_progress',
              petName: 'Bella (Persian Cat)',
              address: 'Koramangala 4th Block, Bengaluru',
              createdAt: { seconds: Date.now() / 1000 - 3600 * 5 },
            },
            {
              id: 'bk_103',
              serviceName: 'Dog Walking - 45 Min Evening Slot',
              category: 'dog_walking',
              customerName: 'Vikram Joshi',
              customerPhone: '+91 98456 78901',
              partnerBusinessName: 'Canine Academy Training & Boarding',
              partnerPhone: '+91 99100 45678',
              bookingDate: '2026-09-25',
              startTime: '05:30 PM',
              finalAmount: 399,
              paymentStatus: 'paid',
              bookingStatus: 'service_completed',
              petName: 'Max (German Shepherd)',
              address: 'Whitefield, Bengaluru',
              createdAt: { seconds: Date.now() / 1000 - 86400 },
            },
            {
              id: 'bk_104',
              serviceName: 'Emergency Home Vet Consultation',
              category: 'veterinary',
              customerName: 'Sneha Rao',
              customerPhone: '+91 97890 12345',
              partnerBusinessName: 'Pawsome Vet & Surgery Hospital',
              partnerPhone: '+91 98220 12345',
              bookingDate: '2026-09-24',
              startTime: '08:00 PM',
              finalAmount: 1499,
              paymentStatus: 'refunded',
              bookingStatus: 'cancelled',
              petName: 'Coco (Shih Tzu)',
              address: 'HSR Layout Sector 1, Bengaluru',
              createdAt: { seconds: Date.now() / 1000 - 86400 * 2 },
            },
          ];
        }
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingRecord));
      } catch (e) {
        console.error('Error fetching bookings:', e);
        return [];
      }
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingRecord['bookingStatus'];
    }) => {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { bookingStatus: status, updatedAt: new Date() });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(`Booking status changed to ${vars.status.replace(/_/g, ' ')}`);
      if (selectedBooking) setSelectedBooking(null);
    },
    onError: () => toast.error('Failed to update booking status'),
  });

  const filtered = bookings?.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.partnerBusinessName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const FILTERS: BookingStatusFilter[] = [
    'all',
    'pending',
    'confirmed',
    'in_progress',
    'service_completed',
    'cancelled',
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Booking Management
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
            Monitor real-time appointments, dispatch statuses, and order payments
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: statusFilter === f ? '#FFC0CB' : '#E5E7EB',
                backgroundColor: statusFilter === f ? '#FFC0CB' : '#FFFFFF',
                color: '#1A1A1A',
                fontSize: '13px',
                fontWeight: statusFilter === f ? 600 : 500,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

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
            placeholder="Search by ID, customer, clinic..."
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

      {/* Bookings Table */}
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
          <Icon name="bookings" size={18} color="#1A1A1A" />
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>
            Bookings Directory ({filtered?.length ?? 0})
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
                    Service & ID
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Customer / Pet
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Partner
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Schedule
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Amount
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered && filtered.length > 0 ? (
                  filtered.map((b) => (
                    <tr
                      key={b.id}
                      style={{
                        borderBottom: '1px solid #F3F4F6',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Service & ID */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                          {b.serviceName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>ID: #{b.id}</div>
                      </td>

                      {/* Customer & Pet */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1A1A1A' }}>
                          {b.customerName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>
                          {b.petName || 'Pet'}
                        </div>
                      </td>

                      {/* Partner */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', color: '#1A1A1A' }}>{b.partnerBusinessName}</div>
                      </td>

                      {/* Schedule */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', color: '#1A1A1A' }}>{b.bookingDate}</div>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{b.startTime}</div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>
                          ₹{b.finalAmount}
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: b.paymentStatus === 'paid' ? '#15803D' : '#DC2626',
                            textTransform: 'uppercase',
                          }}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            textTransform: 'capitalize',
                            backgroundColor:
                              b.bookingStatus === 'service_completed'
                                ? '#DCFCE7'
                                : b.bookingStatus === 'confirmed'
                                ? '#DBEAFE'
                                : b.bookingStatus === 'in_progress'
                                ? '#FEF3C7'
                                : '#FEE2E2',
                            color:
                              b.bookingStatus === 'service_completed'
                                ? '#15803D'
                                : b.bookingStatus === 'confirmed'
                                ? '#1D4ED8'
                                : b.bookingStatus === 'in_progress'
                                ? '#B45309'
                                : '#DC2626',
                          }}
                        >
                          {b.bookingStatus.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedBooking(b)}
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
                          <Icon name="bookings" size={12} color="#1A1A1A" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
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
          onClick={() => setSelectedBooking(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="bookings" size={20} color="#1A1A1A" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>
                  Booking #{selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
              >
                <Icon name="close" size={18} color="#6B7280" />
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>
                {selectedBooking.serviceName}
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                Customer: {selectedBooking.customerName} ({selectedBooking.customerPhone || '—'})
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
                <span style={{ color: '#6B7280' }}>Provider:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedBooking.partnerBusinessName}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Amount:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>₹{selectedBooking.finalAmount}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Scheduled:</span>{' '}
                <strong style={{ color: '#1A1A1A' }}>{selectedBooking.bookingDate} {selectedBooking.startTime}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Payment:</span>{' '}
                <strong style={{ color: selectedBooking.paymentStatus === 'paid' ? '#15803D' : '#DC2626' }}>
                  {selectedBooking.paymentStatus.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
                Update Booking State:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() =>
                    updateBookingStatusMutation.mutate({
                      bookingId: selectedBooking.id,
                      status: 'confirmed',
                    })
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #DBEAFE',
                    backgroundColor: '#DBEAFE',
                    color: '#1D4ED8',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Mark Confirmed
                </button>

                <button
                  onClick={() =>
                    updateBookingStatusMutation.mutate({
                      bookingId: selectedBooking.id,
                      status: 'service_completed',
                    })
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #DCFCE7',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Mark Completed
                </button>

                <button
                  onClick={() =>
                    updateBookingStatusMutation.mutate({
                      bookingId: selectedBooking.id,
                      status: 'cancelled',
                    })
                  }
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #FEE2E2',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
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
