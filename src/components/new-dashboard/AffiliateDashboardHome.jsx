//src/components/new-dashboard/AffiliateDashboardHome.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import {
  Link2,
  Gift,
  TrendingUp,
  ClipboardList,
  CreditCard,
  Users,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";
import CreateReferralDrawer from "@/components/affiliate/CreateReferralDrawer";

export default function AffiliateDashboardHome() {
  const { user, token, hydrated } = useAuth(); // ✅ Hydration guard
  const [stats, setStats] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/affiliate/dashboard/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch affiliate stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading affiliate dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome back{user?.username ? `, ${user.username}` : ", Affiliate Pro"} 👋
      </h1>

      {/* Action Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap">
        <button
          onClick={() => setOpenDrawer(true)}
          className="min-h-10 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
        >
          <Link2 className="w-4 h-4" /> Create Referral Link
        </button>
        <button className="min-h-10 bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition flex items-center gap-1">
          <Gift className="w-4 h-4" /> Share & Earn Now
        </button>
        <button className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <TrendingUp className="w-4 h-4" /> View Performance
        </button>
      </div>

      {/* Metrics */}
      <h2 className="text-lg font-bold mb-2">Affiliate Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <MetricBox icon={<Users />} label="Total Clicks" value={stats?.clicks ?? "–"} />
        <MetricBox icon={<ClipboardList />} label="Total Conversions" value={stats?.conversions ?? "–"} />
        <MetricBox icon={<CreditCard />} label="Pending Commissions" value={`₵${stats?.pending_commissions ?? 0}`} />
        <MetricBox icon={<Zap />} label="Paid Commissions" value={`₵${stats?.paid_commissions ?? 0}`} />
        <MetricBox icon={<CheckCircle />} label="Conversion Rate" value={`${stats?.conversion_rate ?? 0}%`} />
        <MetricBox icon={<Star />} label="Affiliate Tier" value={stats?.tier ?? "Tier 1"} />
      </div>

      {/* Milestone Progress */}
      <h2 className="text-lg font-bold mb-2">Milestone Rewards</h2>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Earn ₵{stats?.milestone_goal ?? 5000} to unlock VIP Affiliate Badge
        </p>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 h-full rounded-full transition-all duration-500"
            style={{
              width: `${((stats?.milestone_progress ?? 0) / (stats?.milestone_goal ?? 5000)) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ₵{(stats?.milestone_goal ?? 5000) - (stats?.milestone_progress ?? 0)} to go
        </p>
      </div>

      {/* Drawer for Referral Link */}
      <CreateReferralDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </div>
  );
}

function MetricBox({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600 hover:scale-[1.01] transition duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {label}
        </span>
        {icon && React.cloneElement(icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-300" })}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}