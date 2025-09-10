"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import axios from "@/lib/axiosInstance";

export default function ProductsHeader() {
  const [dash, setDash] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // dashboard (plan + counts)
        const { data: d } = await axios.get("/api/users/me/dashboard/");
        if (!alive) return;
        setDash(d || null);

        // shop (for “View your shop”)
        try {
          const { data: s } = await axios.get("/api/shops/me/");
          if (alive) setShop(s || null);
        } catch {
          if (alive) setShop(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const planLabel = dash?.seller_plan?.label ?? "—";
  const maxProducts = Number(dash?.seller_plan?.max_products ?? 0);
  const active = Number(dash?.active_listings ?? 0);
  const awaiting = Number(dash?.awaiting_approval_listings ?? 0);
  const inactive = Number(dash?.inactive_listings ?? 0);
  const slotsLeft = maxProducts ? Math.max(0, maxProducts - active) : 0;
  const usage = maxProducts
    ? Math.min(100, Math.round((active / maxProducts) * 100))
    : 0;

  // 🔔 Fire a global event so ProductListTable can open the Auto-Fix modal.
  function openAutoFixSheet() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("upfrica:autofix-open"));
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-9 w-56 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* near-limit banner */}
      {maxProducts > 0 && usage >= 100 && (
        <div className="rounded-lg border border-amber-400 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 px-4 py-3 text-sm flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" />
          <div>
            You’ve used 100% of your listing slots.{" "}
            <Link href="/pricing" className="underline font-medium">
              Upgrade your plan
            </Link>{" "}
            to add more products.
          </div>
        </div>
      )}

      {/* actions */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/pricing"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          Upgrade Plan
        </Link>

        <button
          className="px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => alert("Ad Boost coming soon")}
        >
          Run Ad Boost
        </button>

        {/* ✅ Triggers the Auto-Fix bottom sheet in ProductListTable */}
        <button
          className="px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={openAutoFixSheet}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="autofix-bottom-sheet"
        >
          Auto-Fix Listings
        </button>

        {shop?.slug ? (
          <Link
            href={`/shops/${shop.slug}`}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            🛍️ View Your Shop
          </Link>
        ) : null}
      </div>

      {/* plan stats + progress */}
      <div className="text-gray-600 dark:text-gray-300 text-sm">
        Plan: <span className="font-bold text-purple-600">{planLabel}</span> ·
        Active <strong>{active}</strong> /{" "}
        <strong>{maxProducts || "—"}</strong> · Slots Left{" "}
        <strong>{slotsLeft}</strong> · Usage <strong>{usage}%</strong> · 🕒
        Awaiting Approval <strong>{awaiting}</strong> · 💤 Inactive{" "}
        <strong>{inactive}</strong>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
        <div
          className="h-2 rounded bg-purple-600 dark:bg-purple-400"
          style={{ width: `${usage}%` }}
        />
      </div>
    </div>
  );
}