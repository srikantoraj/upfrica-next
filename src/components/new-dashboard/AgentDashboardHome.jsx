//src/components/new-dashboard/AgentDashboardHome.jsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  FilePlus2,
  Handshake,
  UploadCloud,
  CheckCircle,
  ClipboardList,
  ShoppingCart,
  CreditCard,
  UserCheck,
  Star,
  Clock,
  TrendingUp,
  Info,
} from "lucide-react";

export default function AgentDashboardHome() {
  const { user, hydrated } = useAuth(); // ✅ hydration guard

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Welcome back{user?.username ? `, ${user.username}` : ""}!
      </h1>

      {/* Action Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap">
        <button className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <FilePlus2 className="w-4 h-4" /> Add New Local Listing
        </button>
        <button className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <Handshake className="w-4 h-4" /> Accept New RFQ
        </button>
        <button className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <UploadCloud className="w-4 h-4" /> Upload Proof of Purchase
        </button>
        <button className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1">
          <CheckCircle className="w-4 h-4" /> Mark as Fulfilled
        </button>
      </div>

      {/* Headings */}
      <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
        Local Listings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBox
          icon={<ClipboardList />}
          label="Listings Active"
          value="25"
        />
        <MetricBox icon={<ShoppingCart />} label="Orders Received" value="9" />
        <MetricBox icon={<CheckCircle />} label="Orders Fulfilled" value="8" />
        <MetricBox
          icon={<CreditCard />}
          label="Order Value"
          value="₵4,700"
        />
        <MetricBox
          icon={<CheckCircle />}
          label="Fulfillment Success Rate"
          value={<span className="text-green-600 font-bold">89%</span>}
        />
        <MetricBox
          icon={<Star />}
          label="Buyer Trust Rating"
          value="4.8 ⭐⭐⭐⭐⭐"
        />
        <MetricBox
          icon={<Clock />}
          label="Avg Fulfillment Time"
          value="1.6 days"
        />
      </div>

      <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
        Sourcing Requests
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox icon={<ClipboardList />} label="RFQs Received" value="12" />
        <MetricBox icon={<UserCheck />} label="RFQs Accepted" value="6" />
        <MetricBox icon={<CheckCircle />} label="RFQs Closed" value="5" />
        <MetricBox icon={<CreditCard />} label="Commission" value="€1,900" />
        <MetricBox
          icon={<TrendingUp />}
          label="Total Commission"
          value="€6,600"
        />
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value, hint }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600 hover:scale-[1.01] transition duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
          {label}
          {hint && (
            <Info
              className="w-3 h-3 text-gray-400 dark:text-gray-500"
              title={hint}
            />
          )}
        </span>
        {icon &&
          React.cloneElement(icon, {
            className: "w-5 h-5 text-gray-400 dark:text-gray-300",
          })}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}