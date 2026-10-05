// ─────────────────────────────────────────────
// PAWWS Admin — Reports & Analytics Page
// Financial breakdown, GMV, partner disbursements, city revenue
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React from 'react';
import {
  BarChart,
  Bar,
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
import { toast } from 'react-toastify';
import { Icon } from '../components/ui/Icon';

const MONTHLY_FINANCIALS = [
  { month: 'Apr', gmv: 180000, commission: 27000 },
  { month: 'May', gmv: 240000, commission: 36000 },
  { month: 'Jun', gmv: 290000, commission: 43500 },
  { month: 'Jul', gmv: 350000, commission: 52500 },
  { month: 'Aug', gmv: 310000, commission: 46500 },
  { month: 'Sep', gmv: 420000, commission: 63000 },
];

const CITY_DISTRIBUTION = [
  { city: 'Bengaluru', value: 45, color: '#FFC0CB' },
  { city: 'Mumbai', value: 25, color: '#3B82F6' },
  { city: 'Delhi NCR', value: 15, color: '#10B981' },
  { city: 'Hyderabad', value: 10, color: '#F59E0B' },
  { city: 'Chennai', value: 5, color: '#8B5CF6' },
];

const TOP_PARTNERS = [
  { name: 'Pawsome Vet & Surgery Hospital', city: 'Bengaluru', bookings: 210, revenue: '₹2,45,000', rating: 4.9 },
  { name: 'Fur & Fluff Luxury Pet Spa', city: 'Mumbai', bookings: 165, revenue: '₹1,82,000', rating: 4.8 },
  { name: 'Canine Academy Training & Boarding', city: 'Delhi NCR', bookings: 98, revenue: '₹1,15,000', rating: 4.7 },
  { name: 'Happy Tails Daycare', city: 'Chennai', bookings: 74, revenue: '₹84,000', rating: 4.6 },
];

export const ReportsPage: React.FC = () => {
  const handleExportCSV = () => {
    toast.success('Marketplace GMV & Payout report downloaded (PAWWS_Q3_Financials.csv)');
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Financial Reports & Analytics
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
            Audited marketplace GMV, take-rate realization, partner payouts, and city distribution
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            padding: '10px 18px',
            borderRadius: '9999px',
            border: '1px solid #1A1A1A',
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="fileText" size={16} color="#FFFFFF" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: 'Q3 Total GMV', value: '₹10,80,000', change: '+24% YoY', icon: 'creditCard' as const },
          { label: 'Platform Commission (15%)', value: '₹1,62,000', change: '+24% YoY', icon: 'activity' as const },
          { label: 'Partner Payouts Disbursed', value: '₹9,18,000', change: '100% On-time', icon: 'building' as const },
          { label: 'Average Order Value (AOV)', value: '₹1,240', change: '+₹140 vs Q2', icon: 'tag' as const },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
                marginBottom: '12px',
              }}
            >
              <Icon name={card.icon} size={20} color="#1A1A1A" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>{card.value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', marginTop: '8px' }}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* GMV vs Net Revenue Bar Chart */}
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
              Gross Merchandise Value (INR)
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_FINANCIALS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#6B7280' }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'Poppins',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Bar dataKey="gmv" fill="#FFC0CB" radius={[6, 6, 0, 0]} name="Gross GMV" />
              <Bar dataKey="commission" fill="#1A1A1A" radius={[6, 6, 0, 0]} name="Platform Take" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* City Revenue Distribution */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="location" size={18} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Revenue by Metro Market (%)
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={CITY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {CITY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontFamily: 'Poppins',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
                formatter={(v: number) => [`${v}%`, 'Market Share']}
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

      {/* Top Performing Partners */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Icon name="star" size={18} color="#1A1A1A" />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
            Top Performing Provider Partners
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Partner</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>City</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Completed</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Total Revenue</th>
                <th style={{ padding: '10px 14px', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PARTNERS.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                    {p.name}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6B7280' }}>{p.city}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: '#1A1A1A' }}>{p.bookings} visits</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{p.revenue}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#F59E0B' }}>
                    ⭐ {p.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
