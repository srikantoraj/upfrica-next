'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ClipboardList, Package, MessageCircle, ShoppingCart, BarChart2, Eye, Star,
  PackageCheck, Zap, AlertCircle, TrendingUp, CircleCheck
} from 'lucide-react';
import Link from 'next/link';
import { BASE_API_URL } from '@/app/constants';

export default function DashboardContent() {

  const { user, token, isLoggedIn, hydrated } = useAuth();
  const [shop, setShop] = useState(null);
  const [shopLoading, setShopLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/shops/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setShop(data);
        } else {
          setShop(null);
        }
      } catch (error) {
        console.error('Failed to fetch shop info:', error);
        setShop(null);
      } finally {
        setShopLoading(false);
      }
    };

    if (token) fetchShop();
  }, [token]);


  return (
    <div className="max-w-7xl mx-auto text-gray-800 dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Welcome back, {user?.username}!</h1>

      {/* Shop Info */}
      {!shopLoading && (
        <div className="mb-4">
          {shop ? (
            <Link
              href={`/shops/${shop.slug}`}
              className="inline-block bg-green-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-green-700 transition-shadow hover:shadow-md"
            >
              🛍️ View Your Shop
            </Link>
          ) : (
            <Link
              href="/shops/new"
              className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-shadow hover:shadow-md"
            >
              ➕ Create Your Shop
            </Link>
          )}
        </div>
      )}

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Plan: <span className="font-bold text-purple-600 dark:text-purple-300">Growth</span> | Active Listings: <strong>8 / 50</strong>
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
        <div className="bg-purple-600 dark:bg-purple-400 h-full rounded-full" style={{ width: '16%' }}></div>
      </div>
      <div className="flex gap-2 mb-6">
        <button className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-700">Upgrade Plan</button>
        <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600">Auto-fix Listings</button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card icon={<ShoppingCart />} label="Orders" value="12" iconBg="bg-purple-100 dark:bg-purple-950" iconColor="text-purple-700 dark:text-purple-300" />
        <Card icon={<BarChart2 />} label="Revenue" value="₵4,200" iconBg="bg-blue-100 dark:bg-blue-900" iconColor="text-blue-700 dark:text-blue-300" />
        <Card icon={<Eye />} label="Views" value="1,230" iconBg="bg-green-100 dark:bg-green-900" iconColor="text-green-700 dark:text-green-300" />
        <Card icon={<Star />} label="Reviews" value="32" iconBg="bg-yellow-100 dark:bg-yellow-900" iconColor="text-yellow-700 dark:text-yellow-300" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap mb-6">
        <ActionButton icon={PackageCheck} label="+ Add Product" />
        <ActionButton icon={ShoppingCart} label="View Orders" />
        <ActionButton icon={Zap} label="Run Ad Boost" />
      </div>

      {/* Visibility + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card title="Visibility Status">
          <ul className="text-sm space-y-1">
            <li><CircleCheck className="inline w-4 h-4 text-green-500 mr-2" /> Storefront: <strong>Active</strong></li>
            <li><Star className="inline w-4 h-4 text-yellow-500 mr-2" /> Featured Products: <strong>2 / 3</strong></li>
            <li><AlertCircle className="inline w-4 h-4 text-red-500 mr-2" /> Locked Products: <strong>5</strong></li>
          </ul>
          <div className="mt-3 flex gap-2">
            <button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Manage Products</button>
            <button className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Select Featured</button>
          </div>
        </Card>

        <Card title="Performance Snapshot">
          <div className="h-[100px] flex items-center justify-center text-sm text-gray-400">
            [Chart Placeholder: Orders vs Views]
          </div>
          <div className="text-xs mt-2 flex justify-between text-gray-500 dark:text-gray-400">
            <span>CTR: 4.3%</span>
            <span>Conversion: 2.1%</span>
          </div>
        </Card>
      </div>

      {/* Activity & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Recent Activity">
          <ul className="text-sm space-y-1">
            <li>🔔 Product 'Samsung TV 40"' was flagged – action required</li>
            <li>🟢 12 users viewed your shop today – Try boosting visibility</li>
            <li>⚙️ Update your store banner for better trust</li>
          </ul>
        </Card>
        <Card title="AI Suggestions">
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Add keywords to top product titles</li>
            <li>Lower price on slow-moving item</li>
            <li>Add shipping method for Kumasi zone</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ icon, label, value, iconBg, iconColor, title, children }) {
  if (title) {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.01] transition duration-300">
        <h2 className="text-sm font-semibold mb-3 text-gray-700 dark:text-white">{title}</h2>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-center gap-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.01] transition duration-300">
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

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-all hover:scale-[1.01]">
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}