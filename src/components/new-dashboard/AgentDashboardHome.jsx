// src/components/new-dashboard/AgentDashboardHome.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axiosInstance";
import { listOffers } from "@/lib/sourcing/api";
import {
  Handshake,
  UploadCloud,
  CheckCircle,
  ClipboardList,
  CreditCard,
  UserCheck,
  Star,
  Clock,
  TrendingUp,
  Info,
  LinkIcon,
} from "lucide-react";

/* ------------ helpers ------------ */
const CTRY_TO_CURR = { gh: "GHS", ng: "NGN", uk: "GBP", gb: "GBP", ke: "KES", tz: "TZS", rw: "RWF", ug: "UGX" };
const parseNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const parseDate = (s) => (s ? new Date(s) : null);
const inLastNDays = (d, n) => (d ? Date.now() - d.getTime() <= n * 86400000 : false);
function fmtMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}
function normalizeOfferStatus(s = "") {
  const v = s.toLowerCase();
  if (v.includes("accept")) return "accepted";
  if (v.includes("reject")) return "rejected";
  return "open";
}
function normalizeOrderStatus(s = "") {
  const v = s.toLowerCase();
  if (/deliver|fulfil|close|complete|success|refund|cancel/.test(v)) return "closed";
  return "open";
}
async function fetchOrders(params = {}) {
  const candidates = ["/api/sourcing/orders/", "/api/orders/"];
  for (const path of candidates) {
    try {
      const { data, status } = await axios.get(path, {
        params: { page: 1, page_size: 200, ordering: "-created_at", ...params },
        withCredentials: true,
        validateStatus: () => true,
      });
      if (status >= 200 && status < 300) return data;
    } catch {}
  }
  return { results: [] };
}

export default function AgentDashboardHome() {
  const { user, hydrated } = useAuth();

  const ccSlug = (user?.country_fk?.code || user?.country || "gh").toString().toLowerCase();
  const currency = CTRY_TO_CURR[ccSlug] || "USD";

  const [period, setPeriod] = useState(30); // 7 | 30 | 90
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!hydrated) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const offerRes = await listOffers({ pageSize: 200 }).catch(() => ({ results: [] }));
        const orderRes = await fetchOrders();
        if (!alive) return;
        setOffers(Array.isArray(offerRes?.results) ? offerRes.results : offerRes || []);
        setOrders(Array.isArray(orderRes?.results) ? orderRes.results : orderRes || []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Could not load dashboard data.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [hydrated]);

  const kpis = useMemo(() => {
    const recentOffers = offers.filter((o) => inLastNDays(parseDate(o?.created_at), period));
    const recentOrders = orders.filter((o) => inLastNDays(parseDate(o?.created_at), period));

    const offersOpen = recentOffers.filter((o) => normalizeOfferStatus(o?.status) === "open").length;
    const offersAccepted = recentOffers.filter((o) => normalizeOfferStatus(o?.status) === "accepted").length;

    // distinct RFQs the agent touched in the window
    const rfqsTouched = new Set(recentOffers.map((o) => o?.request || o?.request_id)).size;

    const ordersOpen = recentOrders.filter((o) => normalizeOrderStatus(o?.status) === "open").length;
    const ordersClosed = recentOrders.filter((o) => normalizeOrderStatus(o?.status) === "closed").length;

    const moneyFields = ["commission_amount", "commission", "agent_commission", "commission_value", "payout_amount"];
    const commissionSum = (rows) =>
      rows.reduce((sum, r) => {
        const v = moneyFields.reduce((acc, f) => (acc ?? r?.[f]), null) ?? r?.commission?.amount ?? 0;
        return sum + parseNum(v);
      }, 0);
    const monthCommission = commissionSum(recentOrders);
    const totalCommission = commissionSum(orders);

    const durations = orders
      .map((o) => {
        const a = parseDate(o?.accepted_at || o?.created_at);
        const b = parseDate(o?.delivered_at || o?.fulfilled_at || o?.closed_at);
        return a && b ? (b - a) / 86400000 : null;
      })
      .filter((d) => d != null && isFinite(d) && d >= 0);
    const avgFulfillment = durations.length
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : null;

    const closedAllTime = orders.filter((o) => normalizeOrderStatus(o?.status) === "closed").length;
    const successRate = orders.length ? Math.round((closedAllTime / orders.length) * 100) : 0;

    const ratings = orders
      .map((o) => parseNum(o?.buyer_rating || o?.rating))
      .filter((n) => n > 0);
    const buyerRating = ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;

    // tiny activity feed (latest 5)
    const activity = [
      ...offers
        .map((o) => ({ when: parseDate(o?.created_at), kind: "offer", status: o?.status, ref: o?.id, title: o?.request_title || `Offer #${o?.id}` }))
        .filter((x) => x.when),
      ...orders
        .map((o) => ({ when: parseDate(o?.created_at), kind: "order", status: o?.status, ref: o?.id, title: o?.title || `Order #${o?.id}` }))
        .filter((x) => x.when),
    ]
      .sort((a, b) => b.when - a.when)
      .slice(0, 5);

    return {
      offersOpen,
      offersAccepted,
      rfqsTouched,
      ordersOpen,
      ordersClosed,
      totalCommission,
      monthCommission,
      avgFulfillment,
      successRate,
      buyerRating,
      activity,
    };
  }, [offers, orders, period]);

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading dashboard…</span>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined" ? `${location.origin}/${ccSlug}/sourcing?utm=agent_share` : `/${ccSlug}/sourcing`;

  return (
      <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Welcome back{user?.username ? `, ${user.username}` : ""}!</h1>

      {/* Actions */}
      <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap">
        <Link
          href="/agent/requests"
          className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition inline-flex items-center gap-1"
          title="Browse Find-for-me requests from buyers"
        >
          <Handshake className="w-4 h-4" /> Find-for-me queue
        </Link>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(shareUrl);
          }}
          className="min-h-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center gap-1"
          title="Copy a link you can share with buyers to start a Find-for-me request"
        >
          <LinkIcon className="w-4 h-4" /> Share “Find for me”
        </button>

        <Link
          href="/new-dashboard/agent/proof"
          className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition inline-flex items-center gap-1"
        >
          <UploadCloud className="w-4 h-4" /> Upload Proof of Purchase
        </Link>
        <Link
          href="/new-dashboard/agent/fulfill"
          className="min-h-10 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition inline-flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" /> Mark as Fulfilled
        </Link>

        {/* Period toggle */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">Window:</span>
          {[7, 30, 90].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 text-xs rounded border ${
                period === p
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-gray-900 dark:border-gray-100"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
              }`}
              title={`Show KPIs over the last ${p} days`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 p-3 text-sm">
          {err}
        </div>
      )}

      {/* Pipeline */}
       <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Pipeline</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBox icon={<ClipboardList />} label="Orders In Progress" value={loading ? "—" : kpis.ordersOpen} />
        <MetricBox icon={<UserCheck />} label="Offers Accepted" value={loading ? "—" : kpis.offersAccepted} />
        <MetricBox icon={<ClipboardList />} label="RFQs Touched" value={loading ? "—" : kpis.rfqsTouched} />
        <MetricBox icon={<UserCheck />} label="Offers Open" value={loading ? "—" : kpis.offersOpen} />
      </div>

      {/* Performance & Earnings */}
      <h2 className="text-lg font-bold mb-2  text-gray-800 dark:text-white">Performance & Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBox icon={<CheckCircle />} label="Orders Closed" value={loading ? "—" : kpis.ordersClosed} />
        <MetricBox
          icon={<Clock />}
          label="Avg Fulfillment Time"
          hint={`Based on all-time orders`}
          value={loading ? "—" : kpis.avgFulfillment != null ? `${kpis.avgFulfillment} days` : "n/a"}
        />
        <MetricBox
          icon={<CheckCircle />}
          label="Fulfillment Success Rate"
          value={
            loading ? "—" : (
              <span className={kpis.successRate >= 85 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                {kpis.successRate}%
              </span>
            )
          }
          hint="Closed / All orders"
        />
        <MetricBox icon={<Star />} label="Buyer Rating" value={loading ? "—" : kpis.buyerRating ? `${kpis.buyerRating} ★` : "n/a"} />
        <MetricBox icon={<CreditCard />} label={`This ${period}d Commission`} value={loading ? "—" : fmtMoney(kpis.monthCommission, currency)} />
        <MetricBox icon={<TrendingUp />} label="Total Commission (all-time)" value={loading ? "—" : fmtMoney(kpis.totalCommission, currency)} />
      </div>

      {/* Activity list to reduce blank space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-2  text-gray-800 dark:text-white">Recent activity</h3>
          {loading ? (
            <div className="h-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : kpis.activity.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet. Check the Find-for-me queue to get started.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {kpis.activity.map((a) => (
                <li key={`${a.kind}-${a.ref}-${a.when.toISOString()}`} className="flex items-center justify-between">
                  <span className="truncate">
                    <span className="uppercase text-[10px] tracking-wide px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 mr-2">
                      {a.kind}
                    </span>
                    {a.title}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {a.when.toLocaleDateString()} {a.when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold mb-2  text-gray-800 dark:text-white">Tips</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>Share your <strong>“Find for me”</strong> link to get buyers to describe what they need.</li>
            <li>Accept requests you can fulfill in &lt; 3 days to keep your average time down.</li>
            <li>Upload proof as soon as you purchase to avoid payout delays.</li>
          </ul>
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
        {icon && React.cloneElement(icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-300" })}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}