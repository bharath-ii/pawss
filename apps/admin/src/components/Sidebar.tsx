// ─────────────────────────────────────────────
// PAWWS Admin — Responsive Sidebar Navigation
// Unified design system, Poppins typography, vector icons
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './ui/Icon';
import { IconName } from '@pawws/shared';

interface NavItem {
  path: string;
  icon: IconName;
  label: string;
  badge?: string;
  section?: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { path: '/', icon: 'home', label: 'Dashboard' },
  { path: '/users', icon: 'users', label: 'Pet Owners / Users' },
  { path: '/pets', icon: 'pets', label: 'Pets Registry' },
  { path: '/partners', icon: 'building', label: 'Partners & Clinics', badge: 'New' },
  { path: '/bookings', icon: 'bookings', label: 'Bookings & Visits' },
  { path: '/services', icon: 'tag', label: 'Services Catalog' },
];

const ANALYTICS_NAV_ITEMS: NavItem[] = [
  { path: '/notifications', icon: 'notifications', label: 'Notifications' },
  { path: '/reports', icon: 'activity', label: 'Reports & Analytics' },
];

const SETTINGS_NAV_ITEMS: NavItem[] = [
  { path: '/settings', icon: 'settings', label: 'Platform Settings' },
  { path: '/profile', icon: 'profile', label: 'Admin Profile' },
];

interface SidebarProps {
  onLogout?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          minWidth: '260px',
          height: '100vh',
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #2D2D2D',
          zIndex: 50,
          fontFamily: "'Poppins', sans-serif",
          boxSizing: 'border-box',
          position: isOpenMobile ? 'fixed' : 'relative',
          left: 0,
          top: 0,
        }}
      >
        {/* Logo / Brand Header */}
        <div
          style={{
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #2D2D2D',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: '#FFC0CB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A1A1A',
            }}
          >
            <Icon name="pets" size={24} color="#1A1A1A" />
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '1.5px',
                color: '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              PAWWS
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: '10px',
                color: '#FFC0CB',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Admin Control Panel
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Main Marketplace */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                padding: '0 10px 6px',
              }}
            >
              Marketplace
            </div>
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1A1A1A' : '#D1D5DB',
                  backgroundColor: isActive ? '#FFC0CB' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px',
                })}
              >
                <Icon name={item.icon} size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Operations & Analytics */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                padding: '0 10px 6px',
              }}
            >
              Operations & Reports
            </div>
            {ANALYTICS_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1A1A1A' : '#D1D5DB',
                  backgroundColor: isActive ? '#FFC0CB' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px',
                })}
              >
                <Icon name={item.icon} size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Settings & Admin Profile */}
          <div style={{ marginTop: 'auto' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                padding: '0 10px 6px',
              }}
            >
              System
            </div>
            {SETTINGS_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1A1A1A' : '#D1D5DB',
                  backgroundColor: isActive ? '#FFC0CB' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px',
                })}
              >
                <Icon name={item.icon} size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#F87171',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginTop: '4px',
                fontFamily: "'Poppins', sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Icon name="logout" size={18} color="#F87171" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
