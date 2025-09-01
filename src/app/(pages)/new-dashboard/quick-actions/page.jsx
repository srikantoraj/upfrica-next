"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Placeholder counts & permissions—replace with real data/fetches
const pendingCount = 12;
const newMessagesCount = 3;
const userPermissions = ["basic", "premium"]; // e.g. ['basic'] or ['premium']

const GROUPS = [
  {
    title: "Dashboard",
    actions: [
      {
        id: "add-product",
        label: "Add New Product",
        icon: "➕",
        href: "/products/new",
      },
      {
        id: "message-admin",
        label: "Message Admin",
        icon: "💬",
        href: "/messages/admin",
        count: newMessagesCount,
      },
    ],
  },
  {
    title: "Orders",
    actions: [
      {
        id: "pending-fulfillment",
        label: "Pending Fulfillment",
        icon: "🚚",
        href: "/orders/pending",
        count: pendingCount,
      },
      { id: "all-orders", label: "All Orders", icon: "📋", href: "/orders" },
    ],
  },
  {
    title: "Products",
    actions: [
      {
        id: "bulk-import",
        label: "Bulk Import / Export",
        icon: "📥",
        href: "/products/import",
      },
      { id: "drafts", label: "Drafts", icon: "📝", href: "/products/drafts" },
    ],
  },
  {
    title: "Promotions",
    actions: [
      {
        id: "create-coupon",
        label: "Create Coupon",
        icon: "🏷️",
        href: "/promotions/coupons/new",
      },
      {
        id: "start-flash-sale",
        label: "Start Flash Sale",
        icon: "⚡",
        href: "/promotions/flash-sales/new",
      },
    ],
  },
  {
    title: "Reports",
    requires: "premium",
    actions: [
      {
        id: "view-reports",
        label: "View Reports",
        icon: "📊",
        href: "/reports",
      },
    ],
  },
  {
    title: "Payments",
    actions: [
      {
        id: "payout-settings",
        label: "Payout Settings",
        icon: "💰",
        href: "/payments/settings",
      },
      {
        id: "transaction-logs",
        label: "Transaction Logs",
        icon: "📑",
        href: "/payments/logs",
      },
    ],
  },
];

export default function QuickActionsPage() {
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    GROUPS.forEach((g) => {
      init[g.title] = true;
    });
    return init;
  });

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Profile Header */}
      <header className="sticky top-0 bg-white shadow p-4 flex items-center justify-between z-10">
        <div className="flex items-center">
          <Image src="/logo.png" width={40} height={40} alt="Store Logo" />
          <span className="ml-2 font-bold text-xl">My Store</span>
        </div>
        <div className="space-x-4">
          <Link href="/profile" className="hover:underline">
            My Profile
          </Link>
          <button
            onClick={() => {
              /* logout logic */
            }}
            className="hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Quick Actions Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Quick Actions</h1>
        <div className="space-y-6">
          {GROUPS.map((group) => {
            // permission-aware: skip if requires not met
            if (group.requires && !userPermissions.includes(group.requires))
              return null;

            return (
              <section key={group.title} className="border rounded-lg">
                <button
                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleGroup(group.title)}
                >
                  <span className="font-medium">{group.title}</span>
                  <span>{openGroups[group.title] ? "−" : "+"}</span>
                </button>

                {openGroups[group.title] && (
                  <div className="grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {group.actions.map((action) => (
                      <Link
                        key={action.id}
                        href={action.href}
                        className="flex flex-col items-center justify-center p-3 bg-white rounded-lg hover:shadow cursor-pointer"
                      >
                        <span className="text-3xl">{action.icon}</span>
                        <span className="mt-2 text-sm text-center hidden sm:block">
                          {action.label}
                          {action.count !== undefined && (
                            <span className="ml-1 inline-block bg-red-500 text-white rounded-full px-2 text-xs">
                              {action.count}
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
