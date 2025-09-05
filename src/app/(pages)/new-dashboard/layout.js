//app/(pages)/new-dashboard/layout.js
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import TopBar from "@/components/new-dashboard/TopBar";
import Footer from "@/components/new-dashboard/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { RoleViewProvider } from "@/contexts/RoleViewContext";
import DynamicSidebarLayout from "@/components/new-dashboard/DynamicSidebarLayout";
import { useOnboardingGate } from "@/hooks/useOnboardingGate";
import { deriveRawRoles } from "@/app/utils/roles";

export default function LayoutWrapper({ children }) {
  return (
    <EnsureHydrated>
      <Layout>{children}</Layout>
    </EnsureHydrated>
  );
}

function EnsureHydrated({ children }) {
  const { hydrated, user } = useAuth();
  useOnboardingGate();

  // <- 🔑 derive defensively from the actual /me payload
  const roles = useMemo(() => deriveRawRoles(user), [user]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600 dark:text-gray-300">Loading...</span>
      </div>
    );
  }

  return <RoleViewProvider roles={roles}>{children}</RoleViewProvider>;
}

function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <TopBar
        toggleMobileSidebar={() => setMobileOpen((p) => !p)}
        toggleDesktopSidebar={() => setSidebarVisible((p) => !p)}
        sidebarVisible={sidebarVisible}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {mobileOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" />}
        <DynamicSidebarLayout
          sidebarVisible={sidebarVisible}
          mobileOpen={mobileOpen}
          toggleMobile={setMobileOpen}
          sidebarRef={sidebarRef}
        />
        <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)] w-full overflow-hidden dark:bg-gray-950">
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}