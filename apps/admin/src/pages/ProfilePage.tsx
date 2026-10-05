// ─────────────────────────────────────────────
// PAWWS Admin — Profile & Security Page
// Administrator identity, security credentials, active sessions
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from '../components/ui/Icon';

export const ProfilePage: React.FC = () => {
  const [adminName, setAdminName] = useState('Bharathi Admin');
  const [adminEmail, setAdminEmail] = useState('bharathi@pawws.in');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Admin password updated successfully!');
    }, 600);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '900px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Admin Profile & Security
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
          Manage your administrator credentials, access permissions, and session security
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '32px',
              backgroundColor: '#FFD6DE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A1A1A',
            }}
          >
            <Icon name="profile" size={32} color="#1A1A1A" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>{adminName}</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>{adminEmail}</div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                Super Administrator
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                Root Privileges
              </span>
            </div>
          </div>
        </div>

        {/* Permissions Scope Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Icon name="shieldCheck" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              RBAC Permissions Matrix
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              'User Suspension & Deletion',
              'Partner KYC Verification',
              'Dispute & Refund Approval',
              'Commission Rate Adjustment',
              'Push Notification Broadcasting',
              'Audit Logs Inspection',
            ].map((perm) => (
              <div
                key={perm}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="check" size={14} color="#10B981" />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Icon name="edit" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Update Admin Password
            </h2>
          </div>

          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '450px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '4px' }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={isChangingPass}
              style={{
                alignSelf: 'flex-start',
                marginTop: '6px',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {isChangingPass ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
