// ─────────────────────────────────────────────
// PAWWS Admin — Notifications & Announcements
// Broadcast push notifications, in-app updates, and promotional alerts
// Poppins typography & pure vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from '../components/ui/Icon';

interface BroadcastRecord {
  id: string;
  title: string;
  message: string;
  audience: 'all' | 'customers' | 'partners';
  sentAt: string;
  deliveredCount: number;
  openRate: string;
}

const PAST_BROADCASTS: BroadcastRecord[] = [
  {
    id: 'notif_1',
    title: 'Monsoon Fur Care Discount Week!',
    message: 'Get flat 20% off all grooming spas across Bengaluru & Mumbai this weekend.',
    audience: 'customers',
    sentAt: '2026-09-24 10:30 AM',
    deliveredCount: 1420,
    openRate: '42.8%',
  },
  {
    id: 'notif_2',
    title: 'Partner App v2.4 Update Live',
    message: 'Partners can now set custom emergency slot pricing directly from the dashboard.',
    audience: 'partners',
    sentAt: '2026-09-20 04:15 PM',
    deliveredCount: 184,
    openRate: '78.2%',
  },
  {
    id: 'notif_3',
    title: 'World Rabies Day Awareness',
    message: 'Free rabies vaccination checkup camp available at partner clinics this Friday.',
    audience: 'all',
    sentAt: '2026-09-15 09:00 AM',
    deliveredCount: 1604,
    openRate: '51.4%',
  },
];

export const NotificationsPage: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>(PAST_BROADCASTS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'customers' | 'partners'>('all');
  const [isSending, setIsSending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Please provide both title and notification message');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newBroadcast: BroadcastRecord = {
        id: `notif_${Date.now()}`,
        title,
        message,
        audience,
        sentAt: 'Just now',
        deliveredCount: audience === 'all' ? 1650 : audience === 'customers' ? 1450 : 200,
        openRate: 'Pending',
      };
      setBroadcasts([newBroadcast, ...broadcasts]);
      setTitle('');
      setMessage('');
      setIsSending(false);
      toast.success('Broadcast notification queued and dispatched successfully!');
    }, 600);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          Broadcast Notifications
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
          Dispatch push notifications and platform bulletins to mobile app users and partners
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Broadcast Composer */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Icon name="notifications" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Compose Notification
            </h2>
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Target Audience
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['all', 'customers', 'partners'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAudience(a)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: audience === a ? '#FFC0CB' : '#E5E7EB',
                      backgroundColor: audience === a ? '#FFC0CB' : '#FFFFFF',
                      color: '#1A1A1A',
                      fontSize: '12px',
                      fontWeight: audience === a ? 600 : 500,
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                      textTransform: 'capitalize',
                    }}
                  >
                    {a === 'all' ? 'Everyone' : a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: 'block', marginBottom: '6px' }}>
                Notification Title
              </label>
              <input
                type="text"
                placeholder="e.g. Flash Grooming Special!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                Message Body
              </label>
              <textarea
                rows={4}
                placeholder="Enter alert message (will display on mobile lock screen & in-app center)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              disabled={isSending}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Icon name="notifications" size={16} color="#FFFFFF" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
            </button>
          </form>
        </div>

        {/* History Log */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Icon name="clock" size={20} color="#1A1A1A" />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Recent Broadcast Dispatches
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {broadcasts.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{b.title}</div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: '#FFD6DE',
                      color: '#1A1A1A',
                      textTransform: 'capitalize',
                    }}
                  >
                    {b.audience}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 10px' }}>
                  {b.message}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF' }}>
                  <span>Dispatched: {b.sentAt}</span>
                  <span>
                    Delivered: {b.deliveredCount} | Open Rate: {b.openRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
