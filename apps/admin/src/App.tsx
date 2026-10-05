// ─────────────────────────────────────────────
// PAWWS Admin — App Root + Router + Unified Layout
// Poppins typography, pure vector icons, responsive drawer
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { Sidebar } from './components/Sidebar';
import { Icon } from './components/ui/Icon';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PetsPage } from './pages/PetsPage';
import { PartnersPage } from './pages/PartnersPage';
import { BookingsPage } from './pages/BookingsPage';
import { ServicesPage } from './pages/ServicesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 2 * 60 * 1000, retry: 2 },
  },
});

function TopBar({
  title,
  onOpenMobile,
}: {
  title: string;
  onOpenMobile: () => void;
}) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobile}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: '#1A1A1A',
          }}
          className="mobile-hamburger-btn"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={22} color="#1A1A1A" />
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick Global Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '9999px',
            padding: '6px 14px',
            width: '240px',
          }}
          className="topbar-search"
        >
          <Icon name="search" size={15} color="#9CA3AF" />
          <input
            placeholder="Global search..."
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontFamily: "'Poppins', sans-serif",
              color: '#1A1A1A',
              width: '100%',
            }}
          />
        </div>

        {/* Notifications Shortcut */}
        <button
          onClick={() => navigate('/notifications')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          aria-label="Notifications"
        >
          <Icon name="notifications" size={20} color="#1A1A1A" />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              border: '1.5px solid #FFFFFF',
            }}
          />
        </button>

        {/* Admin Avatar & Profile Shortcut */}
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '17px',
              backgroundColor: '#FFD6DE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A1A1A',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            A
          </div>
          <div style={{ textAlign: 'left' }} className="topbar-admin-label">
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
              Admin
            </div>
            <div style={{ fontSize: '10px', color: '#6B7280' }}>bharathi@pawws.in</div>
          </div>
        </button>
      </div>
    </header>
  );
}

function AppLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleLogout = () => {
    toast.info('Admin session signed out');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F8F8F8',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onLogout={handleLogout}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        <TopBar title={title} onOpenMobile={() => setIsOpenMobile(true)} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout title="Executive Overview">
                <DashboardPage />
              </AppLayout>
            }
          />
          <Route
            path="/users"
            element={
              <AppLayout title="Pet Parents & Users">
                <UsersPage />
              </AppLayout>
            }
          />
          <Route
            path="/pets"
            element={
              <AppLayout title="Global Pets Registry">
                <PetsPage />
              </AppLayout>
            }
          />
          <Route
            path="/partners"
            element={
              <AppLayout title="Partner Clinics & Pros">
                <PartnersPage />
              </AppLayout>
            }
          />
          <Route
            path="/bookings"
            element={
              <AppLayout title="Bookings & Appointments">
                <BookingsPage />
              </AppLayout>
            }
          />
          <Route
            path="/services"
            element={
              <AppLayout title="Services & Catalog">
                <ServicesPage />
              </AppLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <AppLayout title="Broadcast Center">
                <NotificationsPage />
              </AppLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <AppLayout title="Reports & Financials">
                <ReportsPage />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout title="Platform Configuration">
                <SettingsPage />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout title="Administrator Profile">
                <ProfilePage />
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" theme="light" autoClose={3000} />
    </QueryClientProvider>
  );
}
