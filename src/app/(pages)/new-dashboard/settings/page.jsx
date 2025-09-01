// src/app/(pages)/new-dashboard/settings/page.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaUserCog, FaLock, FaWallet, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [payoutChecked, setPayoutChecked] = useState(false);
  const [hasPayout, setHasPayout] = useState(null); // null until probed

  // Format "time ago"
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (seconds < 60) return rtf.format(-seconds, "second");
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return rtf.format(-minutes, "minute");
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return rtf.format(-hours, "hour");
    const days = Math.floor(hours / 24);
    if (days < 30) return rtf.format(-days, "day");
    return date.toLocaleString();
  };

  // Load dashboard payload
  useEffect(() => {
    const token = getCleanToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/me/dashboard/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Probe payout info directly (more reliable than a flag)
  useEffect(() => {
    const token = getCleanToken();
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/payout-info/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) setHasPayout(false);
        else {
          const data = await res.json();
          setHasPayout(Boolean(data?.account_number));
        }
      } catch {
        setHasPayout(user?.has_payout_info ?? false);
      } finally {
        setPayoutChecked(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick “now” every second for relative time
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const showEditPayout = useMemo(() => {
    return (hasPayout ?? user?.has_payout_info) === true;
  }, [hasPayout, user?.has_payout_info]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">Failed to load settings.</div>;

  const PayoutBadge = () =>
    showEditPayout ? (
      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">Edit</span>
    ) : (
      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-500 text-white">Setup Required</span>
    );

  const payoutDescription = showEditPayout
    ? "Update your bank account or mobile money payout details."
    : "Set up your bank account or mobile money payout details to receive payments.";

  // Seller / entitlement helpers
  const isSeller = Array.isArray(user?.account_type)
    ? user.account_type.some((t) => String(t).startsWith("seller"))
    : !!user?.is_seller;

  const entitlements = Array.isArray(user?.entitlements) ? user.entitlements : [];
  const canManageFaqs =
    entitlements.includes("storefront_unlock") ||
    entitlements.includes("faq_customization") ||
    entitlements.includes("allow_display_seller_contact");

  // Settings tiles
  const settingsLinks = [
    {
      title: "Profile Settings",
      description: "Update your name, email, and profile picture.",
      icon: <FaUserCog className="text-blue-500 text-2xl" />,
      href: "/new-dashboard/settings/profile",
      badge: !user.profile_complete ? (
        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-500 text-white">Incomplete</span>
      ) : null,
    },
    {
      title: "Security Settings",
      description: "Change your password and manage two-factor authentication.",
      icon: <FaLock className="text-green-500 text-2xl" />,
      href: "/new-dashboard/settings/security",
      badge: !user.is_verified ? (
        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-500 text-white">Verify</span>
      ) : null,
    },
    {
      title: "Payout Settings",
      description: payoutDescription,
      icon: <FaWallet className="text-purple-500 text-2xl" />,
      href: "/new-dashboard/settings/payout",
      badge: payoutChecked ? <PayoutBadge /> : null,
    },
    ...(user.account_type?.includes?.("buyer")
      ? [
          {
            title: "Delivery Addresses",
            description: "Manage your saved delivery addresses for faster checkout.",
            icon: <FaMapMarkerAlt className="text-orange-500 text-2xl" />,
            href: "/new-dashboard/settings/addresses",
          },
        ]
      : []),
    ...(isSeller
      ? [
          {
            title: "Store Settings",
            description: canManageFaqs
              ? "Edit shop profile, banner & FAQs that boost your shop SEO."
              : "Edit shop profile & banner. Upgrade to unlock custom FAQs.",
            icon: <FaStore className="text-indigo-500 text-2xl" />,
            href: "/new-dashboard/settings/shop",
            badge: canManageFaqs ? null : (
              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700">
                Limited
              </span>
            ),
          },
        ]
      : []),
  ];

  const formatAccountTypes = (types) => {
    if (!types || !Array.isArray(types)) return "—";
    const labelMap = {
      buyer: "Buyer",
      seller_private: "Seller (Private)",
      seller_business: "Seller (Business)",
      agent: "Sourcing Agent",
    };
    return types.map((t) => labelMap[t] || t).join(", ");
  };

  const AccountOverview = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-5">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Account Overview</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Account Type</span>
          <span className="font-medium dark:text-white">{formatAccountTypes(user.account_type)}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Verification</span>
          <span className={`font-medium ${user.is_verified ? "text-green-500" : "text-red-500"}`}>
            {user.is_verified ? "Verified" : "Not Verified"}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last Login</span>
          <span className="font-medium dark:text-white">{formatTimeAgo(user.last_login)}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Current Plan</span>
          <span className="font-medium dark:text-white">{user.seller_plan_name || "None"}</span>
        </li>
      </ul>

      <div className="mt-4 flex gap-2 flex-wrap">
        {!user.is_verified && (
          <a
            href="/new-dashboard/settings/security"
            className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Verify Now
          </a>
        )}
        {!showEditPayout && (
          <a
            href="/new-dashboard/settings/payout"
            className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Set Up Payouts
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-2">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Main Settings */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage your account, security, and payout preferences all in one place.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settingsLinks.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="h-full group rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex justify-between items-start"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">{item.icon}</div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      {item.title}
                      {item.badge}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Sidebar Overview */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-6">
            <AccountOverview />
          </div>
        </aside>
      </div>
    </div>
  );
}