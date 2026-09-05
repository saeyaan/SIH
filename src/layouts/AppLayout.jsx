import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from './BottomNav';
import StudentSidebar from './StudentSidebar';
import { useMediaQuery } from '../hooks/useMediaQuery';

const AppLayout = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  
  // Don't show header/bottom nav on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="app-container">
        <main className="main-content" style={{ padding: 0, display: 'flex' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout-grid">
      
      <div className="teacher-sidebar">
        <StudentSidebar />
      </div>

      <div className="teacher-main-content" style={{ padding: 0 }}>
        <Header />
        <main style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(80px + var(--spacing-md))', flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      {!isDesktop && <BottomNav />}
      
    </div>
  );
};

export default AppLayout;
