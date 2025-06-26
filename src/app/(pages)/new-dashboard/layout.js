//app/(pages)/new-dasboard/layout.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopBar from '@/components/new-dashboard/TopBar';
import Footer from '@/components/new-dashboard/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { RoleViewProvider } from '@/contexts/RoleViewContext';
import DynamicSidebarLayout from '@/components/new-dashboard/DynamicSidebarLayout';

export default function LayoutWrapper({ children }) {
  const auth = useAuth();

  if (!auth || typeof auth !== 'object') {
    console.warn('⚠️ useAuth() returned undefined or invalid. Is AuthProvider missing?');
    return null;
  }

  const { hydrated, user } = auth;

  if (!hydrated) return null;

  const roles = Array.isArray(user?.account_type)
    ? user.account_type
    : user?.account_type
    ? [user.account_type]
    : [];

  return (
    <RoleViewProvider roles={roles}>
      <Layout>{children}</Layout>
    </RoleViewProvider>
  );
}

export function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0f0f] transition-colors duration-300">
      <TopBar
        toggleMobileSidebar={toggleMobile}
        toggleDesktopSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
      />

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {mobileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" />
        )}

        {/* Sidebar */}
        <DynamicSidebarLayout
          sidebarVisible={sidebarVisible}
          mobileOpen={mobileOpen}
          toggleMobile={setMobileOpen}
          sidebarRef={sidebarRef}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)] w-full overflow-hidden">
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a0f0f] text-black dark:text-white transition-colors duration-300">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}