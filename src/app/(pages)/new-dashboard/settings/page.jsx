"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaUserCog, FaLock, FaWallet, FaMapMarkerAlt, FaStore, FaCogs } from "react-icons/fa";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

/* helpers */
const API_ROOT = (BASE_API_URL || "").replace(/\/+$/, "");
const API = (p) => `${API_ROOT}/api/${String(p).replace(/^\/+/, "")}`;
const absolutize = (u) => (!u ? null : /^https?:\/\//i.test(u) ? u : `${API_ROOT}${u.startsWith("/") ? "" : "/"}${u}`);
const safelyExtractArray = (p) => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  if (Array.isArray(p.results)) return p.results;
  if (Array.isArray(p.data?.results)) return p.data.results;
  if (Array.isArray(p.data)) return p.data;
  for (const v of Object.values(p)) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object" && Array.isArray(v.results)) return v.results;
  }
  return [];
};
const StatusPill = ({ tone = "idle", children }) => {
  const map = {
    ok: "bg-green-600/90 text-white dark:bg-green-500",
    warn: "bg-yellow-500 text-white",
    error: "bg-red-600 text-white",
    idle: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
    info: "bg-blue-600 text-white",
  };
  return <span className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>;
};

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // payout probe
  const [payoutChecked, setPayoutChecked] = useState(false);
  const [hasPayout, setHasPayout] = useState(null);

  // new: addresses + shipping probes
  const [addrCount, setAddrCount] = useState(null);
  const [zonesCount, setZonesCount] = useState(null);
  const [methodsCount, setMethodsCount] = useState(null);
  const [shipCfg, setShipCfg] = useState(null);

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

  useEffect(() => {
    const token = getCleanToken();
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/me/dashboard/`, { headers: { Authorization: `Token ${token}` } });
        const data = await res.json();
        setUser(data);
      } catch { setUser(null); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const token = getCleanToken();
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/payout-info/`, { headers: { Authorization: `Token ${token}` } });
        if (!res.ok) setHasPayout(false);
        else { const data = await res.json(); setHasPayout(Boolean(data?.account_number || data?.momo_number)); }
      } catch { setHasPayout(user?.has_payout_info ?? false); }
      finally { setPayoutChecked(true); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* -------- probes (addresses + new core/shipping endpoints) -------- */
  const fetchAllPages = async (url, token) => {
    const out = []; let next = url;
    while (next) {
      const res = await fetch(next, { headers: { Authorization: `Token ${token}`, Accept: "application/json" }, cache: "no-store" });
      if (!res.ok) break;
      const json = await res.json().catch(() => null);
      out.push(...safelyExtractArray(json));
      const n = absolutize(json?.next); if (!n || n === next) break; next = n;
    }
    return out;
  };
  const tryGetJson = async (paths, token) => {
    for (const p of paths) {
      try {
        const res = await fetch(`${API(p)}`, { headers: { Authorization: `Token ${token}`, Accept: "application/json" }, cache: "no-store" });
        if (res.ok) return await res.json();
      } catch {}
    }
    return null;
  };

  useEffect(() => {
    const token = getCleanToken();
    if (!token) return;
    (async () => {
      try {
        const addrs = await fetchAllPages(API("addresses/"), token);
        setAddrCount(addrs.filter((a) => a && a.is_deleted !== true).length);

        // use new core routes first, then fallbacks
        const zonesJson = (await tryGetJson(["core/shipping/zones/", "shipping/zones/", "shipping-zones/", "zones/"], token)) || {};
        setZonesCount(safelyExtractArray(zonesJson).length);

        const methodsJson = (await tryGetJson(["core/shipping/methods/", "shipping/methods/", "shipping-methods/", "methods/"], token)) || {};
        setMethodsCount(safelyExtractArray(methodsJson).length);

        const cfgJson = await tryGetJson(
          ["core/shipping/config/", "shipping/config/", "shipping-config/", "shipping/settings/", "shipping/configuration/"],
          token
        );
        setShipCfg(cfgJson || null);
      } catch {}
    })();
  }, []);

  const showEditPayout = useMemo(() => (hasPayout ?? user?.has_payout_info) === true, [hasPayout, user?.has_payout_info]);
  const isSeller = Array.isArray(user?.account_type) ? user.account_type.some((t) => String(t).startsWith("seller")) : !!user?.is_seller;
  const entitlements = Array.isArray(user?.entitlements) ? user.entitlements : [];
  const canManageFaqs =
    entitlements.includes("storefront_unlock") || entitlements.includes("faq_customization") || entitlements.includes("allow_display_seller_contact");

  const cfgOk = !!(shipCfg && (shipCfg.origin_country || shipCfg.origin_country_code || shipCfg.default_zone || shipCfg.currency || shipCfg.enabled === true));

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!user) return <div className="p-6 text-red-500">Failed to load settings.</div>;

  const PayoutBadge = () => (showEditPayout ? <StatusPill tone="idle">Edit</StatusPill> : <StatusPill tone="error">Setup Required</StatusPill>);
  const payoutDescription = showEditPayout
    ? "Update your bank account or mobile money payout details."
    : "Set up your bank account or mobile money payout details to receive payments.";

  const formatAccountTypes = (types) => {
    if (!types || !Array.isArray(types)) return "—";
    const labelMap = { buyer: "Buyer", seller_private: "Seller (Private)", seller_business: "Seller (Business)", agent: "Sourcing Agent" };
    return types.map((t) => labelMap[t] || t).join(", ");
  };

  const AccountOverview = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold dark:text-white">Account Overview</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Account Type</span><span className="font-medium dark:text-white">{formatAccountTypes(user.account_type)}</span></li>
        <li className="flex items-center justify-between"><span className="text-gray-600 dark:text-gray-400">Verification</span><span className={`font-medium ${user.is_verified ? "text-green-500" : "text-red-500"}`}>{user.is_verified ? "Verified" : "Not Verified"}</span></li>
        <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Last Login</span><span className="font-medium dark:text-white">{formatTimeAgo(user.last_login)}</span></li>
        <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Current Plan</span><span className="font-medium dark:text-white">{user.seller_plan_name || "None"}</span></li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {!user.is_verified && <a href="/new-dashboard/settings/security" className="rounded-full bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">Verify Now</a>}
        {!showEditPayout && <a href="/new-dashboard/settings/payout" className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Set Up Payouts</a>}
      </div>
    </div>
  );

  /* tiles */
  const baseTiles = [
    {
      title: "Profile Settings",
      description: "Update your name, email, and profile picture.",
      icon: <FaUserCog className="text-blue-500 text-2xl" />,
      href: "/new-dashboard/settings/profile",
      badge: !user.profile_complete ? <StatusPill tone="warn">Incomplete</StatusPill> : null,
    },
    {
      title: "Security Settings",
      description: "Change your password and manage two-factor authentication.",
      icon: <FaLock className="text-green-500 text-2xl" />,
      href: "/new-dashboard/settings/security",
      badge: !user.is_verified ? <StatusPill tone="error">Verify</StatusPill> : null,
    },
    {
      title: "Payout Settings",
      description: payoutDescription,
      icon: <FaWallet className="text-purple-500 text-2xl" />,
      href: "/new-dashboard/settings/payout",
      badge: payoutChecked ? <PayoutBadge /> : null,
    },
  ];

  const buyerTiles = (user.account_type?.includes?.("buyer")
    ? [{
        title: "Addresses",
        description: typeof addrCount === "number" ? `Manage your saved addresses for faster checkout (${addrCount} saved).` : "Manage your saved delivery addresses for faster checkout.",
        icon: <FaMapMarkerAlt className="text-orange-500 text-2xl" />,
        href: "/new-dashboard/settings/addresses",
        badge:
          typeof addrCount === "number"
            ? addrCount > 0 ? <StatusPill tone="idle">{addrCount} saved</StatusPill> : <StatusPill tone="info">Add one</StatusPill>
            : null,
      }]
    : []);

  const sellerTiles = isSeller
    ? [
        {
          title: "Store Settings",
          description: canManageFaqs ? "Edit shop profile, banner & FAQs that boost your shop SEO." : "Edit shop profile & banner. Upgrade to unlock custom FAQs.",
          icon: <FaStore className="text-indigo-500 text-2xl" />,
          href: "/new-dashboard/settings/shop",
          badge: canManageFaqs ? null : <StatusPill tone="idle">Limited</StatusPill>,
        },
        {
          title: "Shipping",
          description:
            typeof zonesCount === "number" && typeof methodsCount === "number"
              ? `Configure zones & methods in one place — ${zonesCount} zone${zonesCount === 1 ? "" : "s"}, ${methodsCount} method${methodsCount === 1 ? "" : "s"} • Currency: ${shipCfg?.currency || "—"}`
              : "Configure zones, methods & defaults in one place.",
          icon: <FaCogs className="text-yellow-600 text-2xl" />,
          href: "/new-dashboard/settings/shipping",
          badge: <StatusPill tone={cfgOk && zonesCount > 0 && methodsCount > 0 ? "ok" : "error"}>{cfgOk && zonesCount > 0 && methodsCount > 0 ? "Ready" : "Setup Required"}</StatusPill>,
    },
      ]
    : [];

  const settingsLinks = [...baseTiles, ...buyerTiles, ...sellerTiles];

  return (
    <div className="p-2 sm:p-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        {/* Main */}
        <div className="flex-1">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Settings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account, security, payouts, addresses & shipping in one place.</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Account */}
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Account</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {settingsLinks.slice(0, 3).map((item, i) => (
                  <a key={`base-${i}`} href={item.href} className="group flex h-full items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-100">{item.icon}</div>
                      <div>
                        <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">{item.title}{item.badge}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 transition-colors group-hover:text-blue-500">→</span>
                  </a>
                ))}
              </div>
            </section>

            {/* Buyer */}
            {buyerTiles.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Buyer Preferences</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {buyerTiles.map((item, i) => (
                    <a key={`buyer-${i}`} href={item.href} className="group flex h-full items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-100">{item.icon}</div>
                        <div>
                          <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">{item.title}{item.badge}</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 transition-colors group-hover:text-blue-500">→</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Seller / Shipping */}
            {sellerTiles.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Seller & Shipping</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sellerTiles.map((item, i) => (
                    <a key={`seller-${i}`} href={item.href} className="group flex h-full items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-100">{item.icon}</div>
                        <div>
                          <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">{item.title}{item.badge}</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 transition-colors group-hover:text-blue-500">→</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar Overview */}
        <aside className="lg:w-72 lg:flex-shrink-0">
          <div className="sticky top-6">
            <AccountOverview />
            {isSeller && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Shipping Snapshot</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Zones</span><span className="font-medium dark:text-white">{typeof zonesCount === "number" ? zonesCount : "—"}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Methods</span><span className="font-medium dark:text-white">{typeof methodsCount === "number" ? methodsCount : "—"}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Origin</span><span className="font-medium dark:text-white">{shipCfg?.origin_country_code || shipCfg?.origin_country || shipCfg?.warehouse_country || "—"}</span></li>
                  <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Currency</span><span className="font-medium dark:text-white">{shipCfg?.currency || "—"}</span></li>
                </ul>
                <div className="mt-3 flex gap-2">
                  <a href="/new-dashboard/settings/shipping" className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white hover:opacity-90 dark:bg-gray-100 dark:text-gray-900">Open Shipping</a>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}