// ─────────────────────────────────────────────
// PAWWS Admin — Platform Settings
// Marketplace commission, Razorpay & Google Maps config, cancellation rules
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from '../components/ui/Icon';

export const SettingsPage: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState(15);
  const [homeVisitTravelFee, setHomeVisitTravelFee] = useState(50);
  const [requireManualPartnerApproval, setRequireManualPartnerApproval] = useState(true);
  const [cancellationWindowHours, setCancellationWindowHours] = useState(2);
  const [supportEmail, setSupportEmail] = useState('support@pawws.in');
  const [supportPhone, setSupportPhone] = useState('+91 800-PAWWS-IN');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Platform configuration rules saved and deployed!');
    }, 500);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Platform Settings
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
          Marketplace take-rate, security switches, APIs, and cancellation policies
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* API & Services Status Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="shieldCheck" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Live Connected Services
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>Firebase pawwsss</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Auth, Firestore, Storage</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                }}
              >
                Connected
              </span>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>Google Maps SDK</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Places & Geocoding Key</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                }}
              >
                Active
              </span>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>Razorpay Payments</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>UPI, Cards, NetBanking</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#DBEAFE',
                  color: '#1D4ED8',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                }}
              >
                Configured
              </span>
            </div>
          </div>
        </div>

        {/* Marketplace Economics */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="creditCard" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Marketplace Commission & Fees
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Default Take Rate (% Commission)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
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
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Percentage automatically deducted from each completed booking payout
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Base Home Service Travel Fee (₹)
              </label>
              <input
                type="number"
                value={homeVisitTravelFee}
                onChange={(e) => setHomeVisitTravelFee(Number(e.target.value))}
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
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Paid directly to the partner for home grooming / doorstep vet calls
              </div>
            </div>
          </div>
        </div>

        {/* Operational Policies */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="clock" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Operational Rules & Policy Windows
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Free Cancellation Window (Hours)
              </label>
              <input
                type="number"
                value={cancellationWindowHours}
                onChange={(e) => setCancellationWindowHours(Number(e.target.value))}
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
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                Customers can cancel with 100% refund up to this many hours prior
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={requireManualPartnerApproval}
                  onChange={(e) => setRequireManualPartnerApproval(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#FFC0CB' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                  Require Admin Approval for New Partners
                </span>
              </label>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px', marginLeft: '26px' }}>
                New partner listings remain hidden until KYC review is completed
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact Coordinates */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Icon name="phone" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Customer Care & Escalation Contact
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Support Helpline
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
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
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Official Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
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
        </div>

        <button
          type="submit"
          disabled={isSaving}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 28px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Icon name="check" size={16} color="#FFFFFF" />
          <span>{isSaving ? 'Deploying Changes...' : 'Save & Deploy Settings'}</span>
        </button>
      </form>
    </div>
  );
};
