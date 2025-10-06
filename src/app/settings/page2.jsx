"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Box,
  Package,
  Megaphone,
  LineChart,
  Layers,
  Settings,
  MessageCircle,
  Banknote,
  Bell,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dummyChartData = [
  { name: "Mon", orders: 5, views: 200 },
  { name: "Tue", orders: 2, views: 180 },
  { name: "Wed", orders: 4, views: 220 },
  { name: "Thu", orders: 1, views: 150 },
  { name: "Fri", orders: 6, views: 300 },
  { name: "Sat", orders: 3, views: 190 },
  { name: "Sun", orders: 7, views: 250 },
];

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "My Products", icon: <Box size={16} /> },
  { label: "Orders", icon: <Package size={16} /> },
  { label: "Marketing Tools", icon: <Megaphone size={16} /> },
  { label: "Analytics", icon: <LineChart size={16} /> },
  { label: "My Plan & Add-ons", icon: <Layers size={16} /> },
  { label: "Store Settings", icon: <Settings size={16} /> },
  { label: "Messages", icon: <MessageCircle size={16} /> },
  { label: "Payouts & Finances", icon: <Banknote size={16} /> },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F3F4]">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-900 text-white p-4 space-y-4">
        <div className="text-2xl font-bold">upfrica</div>
        <nav className="space-y-2">
          {navItems.map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 hover:bg-gray-700 rounded p-2 cursor-pointer"
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F1F3F4] p-4">
        {/* TopBar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex gap-4">
            <Bell className="cursor-pointer" size={20} />
            <User className="cursor-pointer" size={20} />
          </div>
        </div>

        {/* Welcome Header */}
        <Card className="mb-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Welcome back, Kofi!</h2>
            <p>
              Your current plan: <strong>Growth</strong> | Active Listings:{" "}
              <strong>8/50</strong>
            </p>
            <div className="mt-2 space-x-2">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">Auto-fix Listings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Orders", value: 12 },
            { label: "Revenue", value: "₵4,200" },
            { label: "Views", value: 1230 },
            { label: "Reviews", value: 32 },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="text-center">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-lg font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button>+ Add Product</Button>
          <Button variant="outline">View Orders</Button>
          <Button variant="outline">Run Ad Boost</Button>
        </div>

        {/* Visibility Status */}
        <Card className="mb-4">
          <CardContent>
            <p>📍 Storefront Visibility: ✅ Active</p>
            <p>📍 Featured Products: 2 (of 3 allowed)</p>
            <p>📍 Locked Products: 5 (exceeds plan limit)</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline">Manage Products</Button>
              <Button variant="outline">Select Featured</Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Snapshot */}
        <Card className="mb-4">
          <CardContent>
            <h3 className="text-md font-medium mb-2">
              📈 Sales Trend (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <ReLineChart data={dummyChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" />
                <Line type="monotone" dataKey="views" stroke="#6366f1" />
              </ReLineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-gray-600">
              🟢 CTR: 4.3% | 🟡 Conversion Rate: 2.1%
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mb-4">
          <CardContent className="space-y-2">
            <p>🔔 “Product ‘Samsung TV 40"’ was flagged – action required”</p>
            <p>
              🟢 “Try boosting your visibility – 12 users viewed your shop
              today.”
            </p>
            <p>⚙️ “Update your store banner for more trust.”</p>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardContent className="space-y-2">
            <p>✅ Add keywords to top product titles</p>
            <p>✅ Lower price slightly on slow-moving item</p>
            <p>✅ Add shipping method for Kumasi zone</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-6 text-sm text-gray-500 text-center">
          Need Help?{" "}
          <a href="/help" className="underline">
            Visit Help Center
          </a>{" "}
          |{" "}
          <a href="/contact" className="underline">
            Contact Support
          </a>
        </footer>
      </main>
    </div>
  );
}
