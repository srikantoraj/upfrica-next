// src/components/new-dashboard/BuyerDashboardHome.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifSummary } from "@/lib/notifications";
import RecentReviews from "./RecentReviews";
import {
  ShoppingBag, CreditCard, Clock, Star, MessageSquare, Heart, Info,
  ClipboardList, Inbox, CheckCircle2, ShieldCheck
} from "lucide-react";

export default function BuyerDashboardHome() {
  const { user, hydrated } = useAuth(); // ⬅️ no token needed for proxy

  // ---- roles ---------------------------------------------------------------
  const roles = useMemo(() => (
    Array.isArray(user?.account_type)
      ? user.account_type
      : user?.account_type
        ? [user.account_type]
        : []
  ), [user?.account_type]);

  const hasSeller = roles.includes("seller_private") || roles.includes("seller_business");
  const hasAgent  = roles.includes("agent");
  const isBuyer   = roles.includes("buyer") || (!hasAgent && !hasSeller);

  // ---- local state ---------------------------------------------------------
  const [showWelcome, setShowWelcome] = useState(Boolean(user?.is_new_user));
  const [pendingReviews, setPendingReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  // Finance overview
  const [finance, setFinance] = useState(null);
  const [financeLoading, setFinanceLoading] = useState(true);

  // Global notifications summary (polls; light-weight)
  const { summary } = useNotifSummary({ enabled: hydrated });
  const { total, buyer_quotes = 0, agent_approvals = 0, hrefs = {} } = summary || {};
  const quotesHref   = hrefs.buyer_quotes    || "/new-dashboard/offers";
  const approvalsHref= hrefs.agent_approvals || "/new-dashboard/offers?view=sent";

  // helpers
  const prettyMoney = (amt, currency) => {
    if (amt === null || amt === undefined) return "-";
    const n = Number(amt);
    const val = Number.isFinite(n) ? n.toLocaleString() : String(amt);
    return currency ? `${currency} ${val}` : val;
  };

  // ---- effects -------------------------------------------------------------
  useEffect(() => {
    if (!hydrated || !user) return;

    const markSeen = async () => {
      if (user?.is_new_user) {
        try {
          // ✅ via proxy, cookie -> Authorization handled server-side
          await fetch("/api/users/mark-dashboard-seen/", { method: "POST" });
          setShowWelcome(false);
        } catch (error) {
          console.error("❌ Failed to mark dashboard seen:", error);
        }
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews/my-reviews/?limit=100", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        const list = Array.isArray(data?.results) ? data.results : [];
        setMyReviews(list.filter((r) => r.status === 1));
        setPendingReviews(list.filter((r) => r.status === 0));
      } catch (err) {
        console.error("❌ Failed to fetch my reviews:", err);
      }
    };

    const fetchOrderCount = async () => {
      try {
        const res = await fetch("/api/buyer/order-summary/", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch order count");
        const data = await res.json();
        setOrderCount(Number(data?.order_count || 0));
      } catch (err) {
        console.error("❌ Failed to fetch order count:", err);
      }
    };

    const fetchFinance = async () => {
      setFinanceLoading(true);
      try {
        const res = await fetch("/api/dashboard/finance/", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch finance overview");
        const data = await res.json();
        setFinance(data || {});
      } catch (err) {
        console.error("❌ Failed to fetch finance overview:", err);
        setFinance(null);
      } finally {
        setFinanceLoading(false);
      }
    };

    markSeen();
    fetchReviews();
    fetchOrderCount();
    fetchFinance();
  }, [hydrated, user]);

  // ---- loading guard -------------------------------------------------------
  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-gray-500 dark:text-gray-300">
        <span className="animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  const score     = finance?.credit_score?.score ?? null;
  const band      = finance?.credit_score?.band ?? null;
  const currency  = finance?.bnpl?.currency || finance?.currency || "";
  const avail     = finance?.bnpl?.available_limit ?? finance?.available_credit ?? null;
  const balance   = finance?.bnpl?.total_balance ?? null;
  const kycOk     = !!finance?.kyc_verified;

  // ---- UI ------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Welcome back{user?.username ? `, ${user.username}` : ""}!
      </h1>

      {/* Role upsell (pure buyer only) */}
      {roles.length === 1 && isBuyer && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 text-sm p-3 rounded-md mb-4 border border-amber-200 dark:border-amber-800 shadow-sm">
          🎯 Want to earn on Upfrica?
          <Link href="/onboarding/account-type" className="ml-2 font-semibold text-purple-600 dark:text-purple-300 hover:underline">
            Become a Seller or Agent
          </Link>
        </div>
      )}

      {/* Welcome block (first-time) */}
      {showWelcome && (
        <div className="bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-white border border-purple-200 dark:border-purple-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">👋 Welcome to Upfrica!</h2>
          <p className="text-sm mb-4">
            Your account is set up as a <strong>Buyer</strong> by default. You can start placing orders, saving items to your wishlist, or
            upgrade to our VIP Buyer program. You can add a Seller or Agent profile anytime.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <button className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700">Explore Products</button>
            </Link>
            <Link href="/wishlist">
              <button className="bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">View Wishlist</button>
            </Link>

            {(!hasSeller || !hasAgent) && (
              <Link
                href="/onboarding/account-type"
                className={clsx(
                  "px-3 py-1.5 rounded text-sm transition",
                  "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {hasSeller && !hasAgent
                  ? "Become an Agent"
                  : !hasSeller && hasAgent
                  ? "Sell on Upfrica"
                  : "Switch to Seller or Agent"}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Sourcing action strip (uses global notif summary) */}
      {(buyer_quotes > 0 || agent_approvals > 0) && (
        <div
          className="rounded-xl p-3 sm:p-4 mb-6 text-sm text-neutral-900 dark:text-neutral-100 border border-[#8710D8]/20 dark:border-[#8710D8]/30"
          style={{ backgroundImage: "linear-gradient(90deg, #8710D880, #8710D8CC 55%, #1E5BFF 100%)" }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-medium flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Sourcing updates • {total} item{total === 1 ? "" : "s"} need attention
            </div>
            <div className="flex gap-2 flex-wrap">
              {buyer_quotes > 0 && (
                <Link
                  href={quotesHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/90 dark:bg-neutral-900/80 border border-white/50 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-white dark:hover:bg-neutral-800"
                >
                  <Inbox className="w-4 h-4" /> Review quotes
                  <span className="ml-1 rounded-full border border-neutral-300 dark:border-neutral-700 px-2 text-xs">
                    {buyer_quotes}
                  </span>
                </Link>
              )}
              {agent_approvals > 0 && (
                <Link
                  href={approvalsHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/90 dark:bg-neutral-900/80 border border-white/50 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-white dark:hover:bg-neutral-800"
                >
                  <CheckCircle2 className="w-4 h-4" /> Awaiting buyer approval
                  <span className="ml-1 rounded-full border border-neutral-300 dark:border-neutral-700 px-2 text-xs">
                    {agent_approvals}
                  </span>
                </Link>
              )}
              <Link
                href="/new-dashboard/requests"
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 dark:bg-neutral-900/80 border border-white/50 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-white dark:hover:bg-neutral-800"
              >
                View my requests →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap">
        <ActionBtn>Claim €5 Reward</ActionBtn>
        <ActionBtn>Leave Review</ActionBtn>
        <ActionBtn>View Wishlist Deals</ActionBtn>
        <ActionBtn>Upgrade to 1P</ActionBtn>
        <ActionBtn>Pay / BNPL</ActionBtn>

        {(!hasSeller || !hasAgent) && (
          <Link href="/onboarding/account-type">
            <button className="min-h-10 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              {hasSeller && !hasAgent ? "Become an Agent" : !hasSeller && hasAgent ? "Sell on Upfrica" : "Switch to Seller or Agent"}
            </button>
          </Link>
        )}
      </div>

      {/* Finance strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricBox
          icon={<CreditCard />}
          label="Available Credit"
          value={financeLoading ? "Loading..." : prettyMoney(avail, currency)}
          hint="Usable BNPL limit"
        />
        <MetricBox
          icon={<CreditCard />}
          label="BNPL Balance"
          value={financeLoading ? "Loading..." : prettyMoney(balance, currency)}
          hint="Outstanding amount"
        />
        <MetricBox
          icon={<ShieldCheck />}
          label="Credit Score"
          value={
            financeLoading
              ? "Loading..."
              : (score != null ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{score}</span>
                    {band && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">{band}</span>}
                  </div>
                ) : "—")
          }
          renderValueAs="node"
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link href="/new-dashboard/orders">
          <MetricBox icon={<ShoppingBag />} label="Orders" value={orderCount} />
        </Link>
        <MetricBox icon={<CreditCard />} label="Total Spend" value="€4,500" />
        <MetricBox icon={<Clock />} label="Avg. Delivery" value="2.1 days" />
        <MetricBox icon={<Star />} label="Buyer Rating" value="Excellent" />

        <Link href="/new-dashboard/reviews">
          <MetricBox
            icon={<MessageSquare />}
            label="Reviews"
            hint="Approved vs Pending Reviews"
            value={
              <div className="flex items-center gap-1">
                <span className="text-green-600 dark:text-green-400">{myReviews.length} ✅</span>
                <span className="text-gray-500 dark:text-gray-400">/</span>
                <span className="text-amber-500 dark:text-amber-400">{pendingReviews.length} ⏳</span>
              </div>
            }
            renderValueAs="node"
          />
        </Link>

        <MetricBox icon={<Heart />} label="Wishlist Items" value="5" />

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
          <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Wishlist</h2>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">3 items have price drops!</p>
          <Link href="/wishlist" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View Items →
          </Link>
        </div>
      </div>

      {/* Rewards + Recent Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
          <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Milestone Rewards</h2>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">Spend €5,000 to become a VIP Buyer</p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>90%</span>
          </div>
          <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded">
            <div className="h-2 bg-blue-600 rounded" style={{ width: "90%" }} />
          </div>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">€500 to go</p>
        </div>

        {/* RecentReviews can keep its own fetching; proxy will attach cookie */}
        <RecentReviews />
      </div>
    </div>
  );
}

function ActionBtn({ children }) {
  return (
    <button className="min-h-10 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
      {children}
    </button>
  );
}

// NOTE: renderValueAs fixes the hydration warning by avoiding <div> inside <p>
function MetricBox({ icon, label, value, hint, renderValueAs = "text" }) {
  const Value =
    renderValueAs === "node"
      ? <div className="text-2xl font-bold">{value}</div>
      : <p className="text-2xl font-bold">{value}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600 hover:scale-[1.01] transition duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
          {label}
          {hint && <Info className="w-3 h-3 text-gray-400 dark:text-gray-500" title={hint} />}
        </span>
        {icon && React.cloneElement(icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-300" })}
      </div>
      {Value}
    </div>
  );
}