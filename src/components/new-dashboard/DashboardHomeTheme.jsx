// src/components/new-dashboard/DashboardHome.jsx
'use client';
import React from 'react';
import { ClipboardList, Package, MessageCircle } from 'lucide-react';

export default function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto text-gray-800 dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
        Welcome to Your Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Here's a quick overview of your activity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card
          icon={<ClipboardList />}
          label="Total Orders"
          value="124"
          iconBg="bg-purple-100 dark:bg-purple-950"
          iconColor="text-purple-700 dark:text-purple-300"
        />
        <Card
          icon={<Package />}
          label="Pending Products"
          value="7"
          iconBg="bg-yellow-100 dark:bg-yellow-900"
          iconColor="text-yellow-600 dark:text-yellow-300"
        />
        <Card
          icon={<MessageCircle />}
          label="Messages"
          value="18"
          iconBg="bg-green-100 dark:bg-green-900"
          iconColor="text-green-600 dark:text-green-300"
        />
      </div>
    </div>
  );
}

function Card({ icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-gray-700 flex items-center gap-4 group transition-all hover:shadow-lg dark:hover:shadow-[0_6px_30px_rgba(0,0,0,0.5)] hover:scale-[1.02] duration-300">
      <div className={`${iconBg} p-2.5 rounded-full`}>
        {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor}` })}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}