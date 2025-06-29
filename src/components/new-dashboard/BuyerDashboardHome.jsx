//src/components/new-dashboard/BuyerDashboardHome.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingBag, CreditCard, Clock, Star, MessageSquare, Heart, Info
} from 'lucide-react';

export default function BuyerDashboardHome() {
  const { user, token } = useAuth();
  const [showWelcome, setShowWelcome] = useState(user?.is_new_user);

  useEffect(() => {
    const markSeen = async () => {
      if (user?.is_new_user) {
        try {
          await fetch('/api/users/mark-dashboard-seen/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          });
          // Immediately hide the banner once marked
          setShowWelcome(false);
        } catch (error) {
          console.error('Failed to mark dashboard seen:', error);
        }
      }
    };

    markSeen();
  }, [user, token]);

  return (
    <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
      <h1 className="text-2xl font-semibold  text-gray-800 dark:text-white  mb-4">
        Welcome back{user?.username ? `, ${user.username}` : ''}!
      </h1>

      {/* ✅ Onboarding Banner */}
      {showWelcome && (
        <div className="bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-white border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">👋 Welcome to Upfrica!</h2>
          <p className="text-sm mb-4">
            Your account is set up as a <strong>Buyer</strong> by default.
            You can now start placing orders, saving items to your wishlist,
            or upgrade to our VIP Buyer program.<br />
            Want to sell products or become a local sourcing agent?
            You can add a Seller or Agent profile anytime.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <button className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700">Explore Products</button>
            </Link>
            <Link href="/wishlist">
              <button className="bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">View Wishlist</button>
            </Link>
            <Link href="/onboarding/account-type">
              <button className="bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">Switch to Seller or Agent</button>
            </Link>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap">
        <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">Claim €5 Reward</button>
        <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">Leave Review</button>
        <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">View Wishlist Deals</button>
        <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">Upgrade to 1P</button>
        <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">Pay / BNPL</button>

        {/* Always present: switch CTA */}
        <Link href="/onboarding/account-type">
          <button className="min-h-10 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Switch to Seller or Agent
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBox icon={<ShoppingBag />} label="Orders" value="12" />
        <MetricBox icon={<CreditCard />} label="Total Spend" value="€4,500" />
        <MetricBox icon={<Clock />} label="Avg. Delivery" value="2.1 days" />
        <MetricBox icon={<Star />} label="Buyer Rating" value="Excellent" />
        <MetricBox icon={<MessageSquare />} label="Reviews" value="8" />
        <MetricBox icon={<Heart />} label="Wishlist Items" value="5" />
      </div>

      {/* Rewards + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
          <h2 className="text-sm font-bold  text-gray-800 dark:text-white mb-1">Milestone Rewards</h2>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">Spend €5,000 to become a VIP Buyer</p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>90%</span>
          </div>
          <div className="h-2 w-full bg-gray-300 rounded">
            <div className="h-2 bg-blue-600 rounded" style={{ width: '90%' }}></div>
          </div>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">€500 to go</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
          <h2 className="text-sm font-bold  text-gray-800 dark:text-white mb-1">Wishlist</h2>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">3 items have price drops!</p>
          <Link href="/wishlist">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer">View Items &rarr;</span>
          </Link>
        </div>
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
          {hint && <Info className="w-3 h-3 text-gray-400 dark:text-gray-500" title={hint} />}
        </span>
        {icon && React.cloneElement(icon, { className: 'w-5 h-5 text-gray-400 dark:text-gray-300' })}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}