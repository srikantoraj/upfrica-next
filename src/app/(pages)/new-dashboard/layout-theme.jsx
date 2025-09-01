"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import HeaderControls from "@/components/HeaderControls";
import DynamicSidebar from "@/components/new-dashboard/DynamicSidebar";
import { useAuth } from "@/contexts/AuthContext";

const Layout = ({ children }) => {
  const { user, hydrated, requiresOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (requiresOnboarding) {
      router.push("/onboarding/account-type");
    }
  }, [hydrated, user, requiresOnboarding, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex relative w-full bg-upfricaGray2 text-gray-900">
      {/* Sidebar */}
      <div>
        <DynamicSidebar />
      </div>

      {/* Main Content */}
      <div className={clsx("flex-1 transition-all duration-300 lg:px-4 py-5")}>
        <HeaderControls />
        {children}
      </div>
    </div>
  );
};

export default Layout;
