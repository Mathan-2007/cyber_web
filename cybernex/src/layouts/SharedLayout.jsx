import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopNav from '../components/common/TopNav';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SharedLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsSidebarCollapsed(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-300">Loading CyberNEX…</div>;
  }

  // This guards shared pages as well as role-specific layouts. Navigation is
  // never treated as the security boundary: direct URLs require a session.
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'app-shell--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <TopNav
        onMenuClick={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <main className="app-shell__main">
        <div className="app-shell__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SharedLayout;
