// ─────────────────────────────────────────────
// PAWWS Admin — Stub Pages
// ─────────────────────────────────────────────

import React from 'react';

export const UsersPage: React.FC = () => (
  <div className="page-content">
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">👥 User Management</div>
        <div className="search-input">
          <span>🔍</span>
          <input placeholder="Search users..." />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Pets</th>
            <th>Bookings</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              Connect to Firebase to load real user data
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const BookingsPage: React.FC = () => (
  <div className="page-content">
    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
      {['All', 'Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'].map(s => (
        <button key={s} className="btn btn-outline btn-sm">{s}</button>
      ))}
    </div>
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">📅 All Bookings</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Partner</th>
            <th>Service</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              Connect to Firebase to load booking data
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const PaymentsPage: React.FC = () => (
  <div className="page-content">
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {[
        { icon: '💰', value: '—', label: 'Total Revenue' },
        { icon: '⏳', value: '—', label: 'Pending Payouts' },
        { icon: '✅', value: '—', label: 'Completed Payouts' },
        { icon: '💸', value: '—', label: 'Refunds Issued' },
      ].map((card, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-card-icon">{card.icon}</div>
          <div className="stat-card-value">{card.value}</div>
          <div className="stat-card-label">{card.label}</div>
        </div>
      ))}
    </div>
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">💳 Payment Transactions</div>
      </div>
      <table>
        <thead>
          <tr><th>Payment ID</th><th>Booking</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>Connect Firebase to view payments</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const CouponsPage: React.FC = () => (
  <div className="page-content">
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
      <button className="btn btn-primary">+ Create Coupon</button>
    </div>
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">🎟️ Coupons & Offers</div>
      </div>
      <table>
        <thead>
          <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Used</th><th>Limit</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No coupons created yet</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const SettingsPage: React.FC = () => (
  <div className="page-content">
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {[
        { title: 'Platform Fee', desc: 'Percentage taken from each completed booking', value: '15%' },
        { title: 'Travel Fee', desc: 'Default travel fee for home services', value: '₹50' },
        { title: 'Partner Approval', desc: 'Require manual admin approval for new partners', value: 'Enabled' },
        { title: 'App Check', desc: 'Firebase App Check enforcement', value: 'Enabled' },
      ].map((setting) => (
        <div key={setting.title} className="chart-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{setting.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{setting.desc}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 700 }}>{setting.value}</span>
            <button className="btn btn-outline btn-sm">Edit</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
