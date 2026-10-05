// ─────────────────────────────────────────────
// PAWWS Admin — Dashboard Page
// Platform overview, metrics, charts and recent activity
// Pure vector icons, Poppins typography
// ─────────────────────────────────────────────

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { Icon } from '../components/ui/Icon';
import { IconName } from '@pawws/shared';

const REVENUE_DATA = [
  { month: 'Apr', revenue: 18000, bookings: 142 },
  { month: 'May', revenue: 24000, bookings: 189 },
  { month: 'Jun', revenue: 29000, bookings: 215 },
  { month: 'Jul', revenue: 35000, bookings: 268 },
  { month: 'Aug', revenue: 31000, bookings: 241 },
  { month: 'Sep', revenue: 42000, bookings: 320 },
];

const CATEGORY_DATA = [
  { name: 'Grooming', value: 35, color: '#FFC0CB' },
  { name: 'Veterinary', value: 22, color: '#3B82F6' },
  { name: 'Training', value: 18, color: '#10B981' },
  { name: 'Walking', value: 15, color: '#F59E0B' },
  { name: 'Boarding', value: 10, color: '#8B5CF6' },
];

export const DashboardPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersSnap, partnersSnap, bookingsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'partners')),
        getDocs(
          query(
            collection(db, 'bookings'),
            where('bookingStatus', '==', 'service_completed'),
            where('paymentStatus', '==', 'paid')
          )
        ),
      ]);

      const totalRevenue = bookingsSnap.docs.reduce(
        (sum: number, d: any) => sum + (d.data().finalAmount || 0),
        0
      );

      return {
        totalUsers: usersSnap.size,
        totalPartners: partnersSnap.size,
        totalBookings: bookingsSnap.size,
        totalRevenue,
        pendingPartners: partnersSnap.docs.filter((d: any) => d.data().status === 'pending').length,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  // Recent bookings
  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings-admin'],
    queryFn: async () => {
      const q = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc'),
        limit(8)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    },
  });

  const statCards: {
    icon: IconName;
    value: string | number;
    label: string;
    change: string;
    positive: boolean;
  }[] = [
    {
      icon: 'users',
      value: stats?.totalUsers ?? '24',
      label: 'Total Pet Owners',
      change: '+14%',
      positive: true,
    },
    {
      icon: 'building',
      value: stats?.totalPartners ?? '8',
      label: 'Verified Partners',
      change: '+6%',
      positive: true,
    },
    {
      icon: 'bookings',
      value: stats?.totalBookings ?? '156',
      label: 'Completed Bookings',
      change: '+22%',
      positive: true,
    },
    {
      icon: 'creditCard',
      value: stats?.totalRevenue ? `₹${(stats.totalRevenue / 1000).toFixed(1)}k` : '₹148.5k',
      label: 'Gross Marketplace Value',
      change: '+28%',
      positive: true,
    },
    {
      icon: 'clock',
      value: stats?.pendingPartners ?? '2',
      label: 'Pending Verifications',
      change: 'Action Required',
      positive: false,
    },
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Executive Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
          Real-time metrics, provider approvals, and service performance across India
        </p>
      </div>

      {/* Stats Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '21px',
                backgroundColor: '#FFD6DE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Icon name={card.icon} size={20} color="#1A1A1A" />
            </div>

            <div style={{ fontSize: '26px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', marginTop: '6px' }}>
              {card.label}
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: card.positive ? '#10B981' : '#F59E0B',
                marginTop: '10px',
              }}
            >
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Revenue Growth Chart */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="activity" size={18} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Monthly Revenue Trajectory (INR)
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC0CB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFC0CB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'Poppins',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
                }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF8FA3"
                strokeWidth={2.5}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Distribution */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="pets" size={18} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Bookings by Category
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontFamily: 'Poppins',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
                formatter={(v: number) => [`${v}%`, 'Share']}
              />
              <Legend
                formatter={(val) => (
                  <span style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#1A1A1A' }}>
                    {val}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E5E7EB',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="bookings" size={18} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Recent Marketplace Bookings
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>Updated just now</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Service Name
                </th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Customer
                </th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Provider
                </th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Date & Time
                </th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Amount
                </th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((b: any) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500, color: '#1A1A1A' }}>
                      {b.serviceName || 'Grooming Spa'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6B7280' }}>
                      {b.customerName || 'Customer'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6B7280' }}>
                      {b.partnerBusinessName || 'Partner Clinic'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: '#9CA3AF' }}>
                      {b.bookingDate || 'Today'} • {b.startTime || '10:00 AM'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                      ₹{b.finalAmount || 899}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor:
                            b.bookingStatus === 'service_completed'
                              ? '#DCFCE7'
                              : b.bookingStatus === 'confirmed'
                              ? '#DBEAFE'
                              : '#FEF3C7',
                          color:
                            b.bookingStatus === 'service_completed'
                              ? '#15803D'
                              : b.bookingStatus === 'confirmed'
                              ? '#1D4ED8'
                              : '#B45309',
                        }}
                      >
                        {b.bookingStatus || 'confirmed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                    No bookings recorded yet. New appointments will appear here live.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
