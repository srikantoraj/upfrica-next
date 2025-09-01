  // src/components/new-dashboard/SellerDashboardHome.jsx
  "use client";

  import React, { useEffect, useState, useRef } from "react";
 import { parsePhoneNumberFromString, getCountryCallingCode } from "libphonenumber-js/min";
  import Link from "next/link";
  import { useRouter, usePathname, useSearchParams } from "next/navigation";
  import toast from "react-hot-toast";

  import { useAuth } from "@/contexts/AuthContext";
  import useEntitlements from "@/hooks/useEntitlements";

  // NEW imports
  import { X, Loader2, BadgeCheck, Star } from "lucide-react";
  import PhoneInput from "@/components/input/phoneInput";

  import {
    ShoppingCart, BarChart2, Eye, Package, Clock, AlertCircle,
    TrendingUp, CircleCheck, Info,
  } from "lucide-react";
  import SellerReviewsSummaryCard from "@/components/new-dashboard/SellerReviewsSummaryCard";
  import PlanComparisonModal from "@/components/ui/PlanComparisonModal";
  import { BASE_API_URL } from "@/app/constants";



  // --- friendly labels for `uses` (module scope so all components can use) ---
const USE_LABELS = {
  shop_public: "Shop contact",
  whatsapp: "WhatsApp",
  delivery: "Delivery",
};
const USE_ORDER = { shop_public: 0, whatsapp: 1, delivery: 2 };

const startCase = (s = "") =>
  String(s)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());

export const humanizeUses = (uses) => {
  const arr = Array.isArray(uses)
    ? uses
    : typeof uses === "string"
      ? uses.split(",").map((x) => x.trim()).filter(Boolean)
      : [];

  if (arr.length === 0) return "";
  const sorted = [...arr].sort(
    (a, b) => (USE_ORDER[a] ?? 99) - (USE_ORDER[b] ?? 99)
  );
  return [...new Set(sorted.map((u) => USE_LABELS[u] ?? startCase(u)))].join(", ");
};



  const DEBUG = false;
  const isSellerRole = (r) =>
    r === "seller" || r === "seller_private" || r === "seller_business";

  export default function SellerDashboardHome() {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    // 🔐 Entitlements (feature flags) — used to gate UI actions
  const { has, stateOf, whyLocked, loading: entLoading, error: entError } = useEntitlements();

  const contactState = stateOf("allow_display_seller_contact");
  const contactWhy   = whyLocked("allow_display_seller_contact");


  // NEW: bottom sheet + phones state
const [phoneSheetOpen, setPhoneSheetOpen] = useState(false);
const [hasPrimaryContact, setHasPrimaryContact] = useState(false);



    const { user, token, hydrated } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [shop, setShop] = useState(null);
    const [loadingDash, setLoadingDash] = useState(true);
    const [loadingShop, setLoadingShop] = useState(true);
    const [errorDash, setErrorDash] = useState(null);
    const [errorShop, setErrorShop] = useState(null);
    const [planRequired, setPlanRequired] = useState(null); // { message, next }

    // upgrade modal + subscribe state
    const [showPlans, setShowPlans] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [plansOpen, setPlansOpen] = useState(false);

    // --- roles ---
    const roles = Array.isArray(user?.account_type)
      ? user.account_type
      : user?.account_type
      ? [user.account_type]
      : [];
    const isSeller = roles.some(isSellerRole);

    // --- plan presence (from /me and/or dashboard once loaded) ---
    const userHasPlan = !!(user?.seller_plan && (user?.seller_plan.id ?? user?.seller_plan));
    const dashHasPlan = !!(dashboard?.seller_plan && (dashboard?.seller_plan.id ?? dashboard?.seller_plan));
    const hasPlan = userHasPlan || dashHasPlan;

    useEffect(() => {
      if (!DEBUG) return;
      console.log("🧭 Auth state:", {
        hydrated,
        token,
        roles,
        isSeller,
        userHasPlan,
        dashHasPlan,
        hasPlan,
      });
    }, [hydrated, token, user, dashboard]); // eslint-disable-line

    // 🛒 Fetch dashboard — let backend enforce plan/role.
    useEffect(() => {
      if (!hydrated || !token) return;

      const controller = new AbortController();
      const run = async () => {
        setLoadingDash(true);
        setErrorDash(null);
        setPlanRequired(null);

        try {
          const authToken = token?.replace(/^"|"$/g, "");
          const res = await fetch(`${BASE_API_URL}/api/users/me/dashboard/`, {
            headers: {
              Authorization: `Token ${authToken}`,
              Accept: "application/json",
            },
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) {
            // Try JSON, fall back to text
            let body = null,
              text = "";
            try {
              body = await res.clone().json();
            } catch {}
            if (!body) {
              try {
                text = await res.text();
              } catch {}
            }

            if (res.status === 401) {
              setErrorDash("Session expired. Please log in again.");
              return;
            }

            if (res.status === 403) {
              const detail =
                body?.detail || body?.code || body?.error || text?.toLowerCase();
              if (detail && String(detail).includes("seller_plan_required")) {
                setPlanRequired({
                  message:
                    body?.message ||
                    "You need an active seller plan to access the seller dashboard.",
                  next: "/onboarding/account-type",
                });
                return;
              }
            }

            const compact = body
              ? JSON.stringify(body).slice(0, 300)
              : (text || "").slice(0, 300);
            setErrorDash(
              `${res.status} ${res.statusText}${compact ? ` — ${compact}` : ""}`,
            );
            if (DEBUG)
              console.error("❌ Dashboard fetch failed:", res.status, body || text);
            return;
          }

          const data = await res.json();
          setDashboard(data);
          if (DEBUG) console.log("✅ Dashboard data:", data);
        } catch (err) {
          if (err.name !== "AbortError") {
            setErrorDash(err.message || "Network error");
            if (DEBUG) console.error("💥 Dashboard error:", err);
          }
        } finally {
          setLoadingDash(false);
        }
      };

      run();
      return () => controller.abort();
    }, [hydrated, token]);

    // 🔁 Payment success: clear the query param and refresh lightweight state
    useEffect(() => {
      const paid = search?.get("payment");
      if (paid !== "success") return;

      toast.success("Payment confirmed. Updating your plan…");

      const params = new URLSearchParams(search);
      params.delete("payment");

      router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });

      // Optional light refresh to prompt re-fetch (backend should reflect new plan)
      setTimeout(() => setLoadingDash(true), 250);
    }, [search, pathname, router]);

    // ✅ Prefer backend role when it's present on the dashboard payload
    const backendIsSeller = Array.isArray(dashboard?.account_type)
      ? dashboard.account_type.some(isSellerRole)
      : undefined;
    const effectiveIsSeller =
      backendIsSeller === undefined ? isSeller : backendIsSeller;

    // 🏪 Fetch shop — only if seller and NOT plan-gated and has a plan
    useEffect(() => {
      if (!hydrated || !token || !effectiveIsSeller || planRequired || !hasPlan)
        return;

      const controller = new AbortController();
      const run = async () => {
        setLoadingShop(true);
        setErrorShop(null);
        try {
          const authToken = token?.replace(/^"|"$/g, "");
          const res = await fetch(`${BASE_API_URL}/api/shops/me/`, {
            headers: { Authorization: `Token ${authToken}` },
            signal: controller.signal,
            cache: "no-store",
          });

          if (!res.ok) {
            // 404/204 means no shop yet—treat as null
            if (res.status !== 404 && res.status !== 204) {
              if (res.status === 401)
                setErrorShop("Session expired. Please log in again.");
              else if (res.status === 403)
                setErrorShop("You don’t have permission to view shop data.");
              else {
                const text = await res.text();
                setErrorShop(
                  `${res.status} ${res.statusText} — ${text}`.slice(0, 300),
                );
                if (DEBUG)
                  console.warn("⚠️ Shop fetch failed:", res.status, text);
              }
            }
            setShop(null);
            return;
          }

          const data = await res.json();
          setShop(data || null);
          if (DEBUG) console.log("✅ Shop data:", data);
        } catch (err) {
          if (err.name !== "AbortError") {
            setErrorShop(err.message || "Network error");
            if (DEBUG) console.error("💥 Shop error:", err);
          }
        } finally {
          setLoadingShop(false);
        }
      };

      run();
      return () => controller.abort();
    }, [hydrated, token, effectiveIsSeller, planRequired, hasPlan]);


  // ----------- Shop gating helpers -----------
  const storefrontState = stateOf("storefront_unlock"); // 'active' | 'included_locked' | 'available'

  // Important: while entitlements are loading, DON'T assume locked
  const storefrontLocked = !entLoading && storefrontState === "available";
  const storefrontKyc    = !entLoading && storefrontState === "included_locked";

  // Interpret shop status safely (treat unknown/missing as ACTIVE)
  const shopStatus = String(shop?.status ?? "").toLowerCase();
  const subStatus  = String(
    shop?.subscription?.status ??
    shop?.subscription_status ??
    shop?.plan_status ??
    ""
  ).toLowerCase();

  const isExplicitInactive =
    shop?.is_enabled === false ||           // <-- add this
    shop?.is_active === false ||
    shop?.suspended === true ||
    ["inactive", "paused", "suspended", "disabled", "closed", "archived"].includes(shopStatus) ||
    Boolean(shop?.deleted_at);

  const isSubscriptionInactive =
    ["canceled", "past_due", "unpaid"].includes(subStatus);

  // Only mark inactive when we KNOW it’s inactive
  const shopInactive = isExplicitInactive || isSubscriptionInactive;





    // 🧮 Plan/Data (compute defensively)
    const planLabel = dashboard?.seller_plan?.label ?? "Unknown";
    const maxProductsNum = Number(dashboard?.seller_plan?.max_products ?? 0);
    const activeListingsNum = Number(dashboard?.active_listings ?? 0);
    const awaitingApproval = Number(dashboard?.awaiting_approval_listings ?? 0);
    const inactiveBySeller = Number(dashboard?.inactive_listings ?? 0);
    const slotsLeft =
      maxProductsNum > 0 ? Math.max(maxProductsNum - activeListingsNum, 0) : "—";
    const usagePercent =
      maxProductsNum > 0
        ? Math.min(Math.round((activeListingsNum / maxProductsNum) * 100), 100)
        : 0;

    // 🔔 subscribe handler (used by PlanComparisonModal)
    const handlePickPlan = async (planId) => {
      if (!token) return toast.error("Please log in again.");
      try {
        setSubscribing(true);
        const authToken = token?.replace(/^"|"$/g, "");
        const res = await fetch(`${BASE_API_URL}/api/seller/subscribe/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ plan_id: planId, billing_cycle: "monthly" }),
        });

        const data = await res.json().catch(() => ({}));








        if (!res.ok) {
          const msg = data?.error || data?.detail || "Subscription failed.";
          toast.error(`❌ ${msg}`);
          return;
        }

        

        // Free plan → message + redirect
        if (data?.message && !data?.checkout_url) {
          toast.success("✅ Free plan activated!");
          router.push("/new-dashboard/seller");
          return;
        }

        // Paid → Stripe
        if (data?.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }

        toast.success("✅ Plan updated.");
        router.push("/new-dashboard/seller");
      } catch (e) {
        console.error(e);
        toast.error("❌ Something went wrong starting checkout.");
      } finally {
        setSubscribing(false);
        setShowPlans(false);
      }
    };






    return (
      <div className="max-w-7xl mx-auto p-4 text-gray-800 dark:text-white transition">
        <h1 className="text-2xl font-semibold dark:text-gray-300 mb-3">
          Welcome back, {user?.username || user?.email || "Seller"}!
        </h1>

        {(errorDash || errorShop) && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
            {errorDash && <div>Dashboard: {errorDash}</div>}
            {errorShop && <div>Shop: {errorShop}</div>}
          </div>
        )}

        {/* Seller Actions (chips) */}

  {/* Seller Actions (chips) */}
  <div className="flex gap-2 mb-4 overflow-x-auto flex-nowrap [-webkit-overflow-scrolling:touch]">
    <button
      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
      onClick={() => setPlansOpen(true)}
    >
      Upgrade Plan
    </button>

    <button className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      Run Ad Boost
    </button>

    <button className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      Auto-Fix Listings
    </button>

 
{/* Gate: Add/Manage Seller Contact */}
{contactState === "active" && (
  <button
    className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800
               text-slate-900 dark:text-slate-100 border-gray-200 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700"
    onClick={() => setPhoneSheetOpen(true)}
  >
    {hasPrimaryContact ? "Manage Contacts" : "Add Seller Contact"}
  </button>
)}

{contactState === "included_locked" && (
  <button
    onClick={() => {
      toast("KYC verification required to unlock this feature.", { icon: "🔒" });
      router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`);
    }}
    title={contactWhy || "KYC required"}
    className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800
               text-gray-400 border-gray-200 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700"
  >
    🔒 {hasPrimaryContact ? "Manage Contacts" : "Add Seller Contact"}
  </button>
)}

{contactState === "available" && (
  <button
    onClick={() => setPlansOpen(true)}
    title="Upgrade your plan to enable seller contact"
    className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800
               text-slate-900 dark:text-slate-100 border-gray-200 dark:border-gray-700
               hover:bg-gray-50 dark:hover:bg-gray-700"
  >
    🔒 {hasPrimaryContact ? "Manage Contacts" : "Add Seller Contact"}
  </button>
)}



    <button className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      Update Stock
    </button>
  </div>




        {/* Near-limit upgrade hint */}
        {maxProductsNum > 0 && usagePercent >= 80 && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            You’ve used {usagePercent}% of your listing slots.{" "}
            <button
              className="underline font-medium"
              onClick={() => setPlansOpen(true)}
            >
              Upgrade your plan
            </button>{" "}
            to add more products.
          </div>
        )}











  {/* Shop controls (view/create/reactivate) */}
  {!loadingShop && (
    <>
      {shop ? (
        // User has a shop
        entLoading ? (
          <button
            disabled
            className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm cursor-not-allowed"
            title="Checking your plan…"
          >
            🛍️ View Your Shop
          </button>
        ) : storefrontLocked ? (
          // Plan doesn’t include storefront
          <button
            onClick={() => setPlansOpen(true)}
            className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
            title="Upgrade your plan to unlock your storefront"
          >
            🔒 View Your Shop
          </button>
        ) : storefrontKyc ? (
          // Storefront requires KYC
          <button
            onClick={() => router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)}
            className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
            title="KYC verification required"
          >
            🔒 View Your Shop
          </button>
        ) : shopInactive ? (
          // Shop exists but is paused/disabled
          <div className="flex gap-2 mb-4">
            <button
              disabled
              className="inline-block bg-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed"
              title="Your shop is paused. Reactivate to make it visible."
            >
              🔒 View Your Shop
            </button>
            <button
              onClick={() => router.push("/billing/reactivate")} // TODO: set your real path
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Reactivate
            </button>
          </div>
        ) : (
          // All good → show the live shop link
          <Link
            href={`/shops/${shop.slug}`}
            className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
          >
            🛍️ View Your Shop
          </Link>
        )
      ) : (
        // No shop yet → creation is gated by its own entitlement
        (() => {
          const createState = stateOf("allow_shop_creation"); // 'active'|'included_locked'|'available'
          const createLocked = !entLoading && createState === "available";
          const createKyc    = !entLoading && createState === "included_locked";

          if (entLoading) {
            return (
              <button
                disabled
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm cursor-not-allowed"
                title="Checking your plan…"
              >
                🛍️ Create Your Shop
              </button>
            );
          }
          if (createKyc) {
            return (
              <button
                onClick={() => router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)}
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
                title="KYC verification required"
              >
                🔒 Create Your Shop
              </button>
            );
          }
          if (createLocked) {
            return (
              <button
                onClick={() => setPlansOpen(true)}
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
                title="Upgrade your plan to create a shop"
              >
                🔒 Create Your Shop
              </button>
            );
          }
          return (
            <Link
              href="/shops/new"
              className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
            >
              🛍️ Create Your Shop
            </Link>
          );
        })()
      )}
    </>
  )}




        {contactState === "included_locked" && (
    <div className="mt-3 rounded-lg border border-sky-300 bg-sky-50 px-4 py-2 text-sm text-sky-900 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-200">
      {contactWhy || "KYC verification is required to enable “Add Seller Contact”."}
      <button
        onClick={() => router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)}
        className="ml-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-white hover:bg-sky-700"
      >
        Start KYC
      </button>
    </div>
  )}


  {/* Bottom Sheet: Add/Manage Seller Contacts */}
<AddSellerContactSheet
  open={phoneSheetOpen}
  onClose={() => setPhoneSheetOpen(false)}
  token={token}
  onHasPrimaryChange={setHasPrimaryContact}
/>



        {/* Plan Stats / Usage */}
        {loadingDash ? (
          <div className="mb-6 h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ) : (
          <>
            <div className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
              Plan: <span className="font-bold text-purple-600">{planLabel}</span> · Active{" "}
              <strong>{activeListingsNum}</strong> / <strong>{maxProductsNum || "—"}</strong> · Slots Left{" "}
              <strong>{slotsLeft}</strong> · Usage <strong>{usagePercent}%</strong> · 🕒 Awaiting Approval{" "}
              <strong>{awaitingApproval}</strong> · 💤 Inactive <strong>{inactiveBySeller}</strong>
            </div>

            <div
              className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-6"
              role="progressbar"
              aria-valuenow={usagePercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded bg-purple-600 dark:bg-purple-400"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </>
        )}

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricBox icon={<Package />} label="Awaiting Dispatch" value="5" />
          <MetricBox icon={<ShoppingCart />} label="Orders This Month" value="22" />
          <MetricBox icon={<BarChart2 />} label="Total Pending Value" value="₵1,200" />
          <SellerRatingBox />
          <MetricBox icon={<ShoppingCart />} label="Orders" value="12" />
          <MetricBox icon={<BarChart2 />} label="Revenue" value="₵4,200" />
          <MetricBox icon={<Clock />} label="Avg Fulfilment Time" value="1.5 days" hint="Last 30 days" />
          <MetricBox icon={<Eye />} label="Response Time" value="1.2 hrs" hint="Buyer response time" />
          <MetricBox icon={<CircleCheck />} label="On-Time Dispatch" value={<span className="font-bold">98%</span>} />
          <MetricBox icon={<AlertCircle />} label="Defect Rate" value={<span className="font-bold">1.5%</span>} hint="Target &lt; 2%" />
          <MetricBox icon={<TrendingUp />} label="Listing Quality" value="7 / 10" />
        </div>

        {/* Reviews */}
        <SellerReviewsSummaryCard />

        {/* Pricing / Compare Modal */}
  <PlanComparisonModal
    open={plansOpen}
    onOpenChange={setPlansOpen}
    hideTrigger
    onPick={handlePickPlan}   // your existing subscribe -> redirect logic
  />
        {/* We control it externally by toggling its `open` prop via wrapping if needed.
            Current PlanComparisonModal shows a button internally. To "force" open from here,
            you can expose an `open` prop in that component and wire it. For now, we
            trigger via our "Upgrade Plan" which opens the modal's own UI button.
        */}
        {showPlans && (
          <div className="fixed inset-0 z-[60]" onClick={() => setShowPlans(false)}>
            {/* Overlay click closes, but we still show the modal trigger button */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <PlanComparisonModal onPick={handlePickPlan} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function MetricBox({ icon, label, value, hint, trend }) {
    return (
      <button
        type="button"
        aria-label={label}
        className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring hover:scale-[1.01] transition w-full text-left"
      >
        <div className="flex items-center justify-between mb-2 pr-1">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
            {label} {hint && <Info className="w-3 h-3" title={hint} />}
          </span>
          {icon && React.cloneElement(icon, { className: "w-5 h-5 text-gray-400 dark:text-gray-300 ml-1" })}
        </div>
        <div className="text-2xl font-bold leading-7">{value}</div>
        {!!trend && (
          <div className={`mt-1 text-xs ${trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
          </div>
        )}
      </button>
    );
  }

  function SellerRatingBox() {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring hover:scale-[1.01] transition">
        <h2 className="text-sm font-bold mb-2">Seller Rating</h2>
        <p className="text-4xl font-bold mb-2">92</p>
        <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
          <span>Progress</span>
          <span>92%</span>
        </div>
        <div className="h-2 w-full bg-gray-300 rounded">
          <div className="h-2 bg-blue-600 rounded" style={{ width: "92%" }} />
        </div>
        <ul className="mt-3 text-xs space-y-1">
          <li>✅ On-Time Dispatch Excellent</li>
          <li>✅ Response Time Good</li>
          <li>⚠️ Defect Rate Improve ~1.5% (target &lt; 2%)</li>
          <li>❌ Listing Quality: 7 listings incomplete</li>
        </ul>
      </div>
    );
  }








  // -----------------------------------------------------------
  // BottomSheet — mobile-first, safe-area, swipe-to-close
  // -----------------------------------------------------------
  function BottomSheet({ open, onClose, title, children, footer }) {
    const sheetRef = React.useRef(null);
    const [dragY, setDragY] = useState(0);
    const startY = React.useRef(null);

    // lock body scroll when open
    useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }, [open]);

    // focus the sheet for keyboard/ESC
    useEffect(() => {
      if (open) sheetRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const onTouchStart = (e) => {
      startY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (startY.current == null) return;
      const delta = e.touches[0].clientY - startY.current;
      setDragY(Math.max(0, delta)); // only pull down
    };
    const onTouchEnd = () => {
      if (dragY > 80) onClose?.();
      setDragY(0);
      startY.current = null;
    };

    return (
      <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
        {/* overlay */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute inset-0 bg-black/40 dark:bg-black/60"
        />

        {/* sheet container (centered & narrower on desktop) */}
        <div
          ref={sheetRef}
          tabIndex={-1}
          onKeyDown={(e) => e.key === "Escape" && onClose?.()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="absolute inset-x-0 bottom-0 w-full sm:max-w-xl sm:mx-auto
                    rounded-t-2xl bg-white dark:bg-gray-900 shadow-2xl
                    border-t border-gray-200 dark:border-gray-800
                    overflow-hidden focus:outline-none
                    max-h-[88svh]" /* svh = better on iOS */
          style={{ transform: `translateY(${dragY}px)` }}
        >
          {/* grabber */}
          <div className="flex items-center justify-center py-3">
            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* header */}
          <div className="px-4 sm:px-6 pb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* body */}
          <div className="px-4 sm:px-6 pb-24 overflow-y-auto">
            {children}
          </div>

          {/* footer (sticky, safe-area aware) */}
          {footer && (
            <div
              className="absolute bottom-0 inset-x-0 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur
                        border-t border-gray-200 dark:border-gray-800"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

// -----------------------------------------------------------
// AddSellerContactSheet — libphonenumber validation + dedupe + delete
// -----------------------------------------------------------
function AddSellerContactSheet({ open, onClose, token, onHasPrimaryChange }) {
  const authToken = (token || "").replace(/^"|"$/g, "");

  // list + errors
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState(null);

  // form
  const [countries, setCountries] = useState([]);
  const [countryIso, setCountryIso] = useState("GH");
  const [phoneVal, setPhoneVal] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [asPrimary, setAsPrimary] = useState(true);
  const [asWhatsapp, setAsWhatsapp] = useState(false);
  const [asDelivery, setAsDelivery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const reqSeq = useRef(0); // race guard

  // --- validation helpers (libphonenumber-js) ---
  const SOFT_MIN_DIGITS = { GH: 7, NG: 7, KE: 7, ZA: 7, GB: 7, US: 7 };

  // normalize any list-ish API shape into an array
  function asList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.items)) return payload.items;
    if (payload && typeof payload === "object") {
      const looksLikePhone = payload.id || payload.e164 || payload.number;
      if (looksLikePhone) return [payload];
    }
    return [];
  }

  const normDigits = (s) => String(s || "").replace(/\D/g, "");

  function validatePhone(raw, iso) {
    const s0 = String(raw || "").trim();
    let digits = s0.replace(/\D/g, "");
    const ccISO = String(iso || "").toUpperCase();

    if (!digits) return { state: "empty" };

    // strip duplicated country calling code if user typed it without '+'
    try {
      const cc = getCountryCallingCode(ccISO); // e.g. "233"
      if (!s0.startsWith("+") && digits.startsWith(cc)) {
        digits = digits.slice(cc.length);
      }
    } catch {}

    const min = SOFT_MIN_DIGITS[ccISO] ?? 7;
    if (digits.length < min) return { state: "typing" };

    try {
      const pn = parsePhoneNumberFromString(digits, ccISO); // parse as national
      if (!pn) return { state: "typing" };
      if (pn.isValid()) {
        return {
          state: "valid",
          e164: pn.format("E.164"),
          national: pn.formatNational(),
        };
      }
      return pn.isPossible() ? { state: "typing" } : { state: "invalid" };
    } catch {
      return { state: "typing" };
    }
  }

  const v = validatePhone(phoneVal, countryIso);
  const digits = (phoneVal || "").replace(/\D/g, "");
  const minLen = SOFT_MIN_DIGITS[countryIso] ?? 7;

  // UI states
  const showError =
    !hasFocus && (touched || submitted) && digits.length >= minLen && v.state === "invalid";
  const showHint = hasFocus && digits.length > 0 && digits.length < minLen;
  const canSave = v.state === "valid" && !saving;


    useEffect(() => {
    onHasPrimaryChange?.(phones.some(p => p.is_primary));
  }, [phones, onHasPrimaryChange]);

  // Fetch phones when opened
  useEffect(() => {
    if (!open || !authToken) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_API_URL}/api/users/me/phones/`, {
          headers: { Authorization: `Token ${authToken}` },
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        if (alive) setPhones(asList(data));
      } catch (e) {
        if (alive) setError(e.message || "Failed to load phones");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open, authToken]);

  // Re-fetch helper with race guard
  const refresh = async () => {
    const my = ++reqSeq.current;
    try {
      const res = await fetch(`${BASE_API_URL}/api/users/me/phones/`, {
        headers: { Authorization: `Token ${authToken}` },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (reqSeq.current !== my) return null; // stale
      const list = asList(data);
      setPhones(list);
      return list;
    } catch {
      return null; // do not clear UI
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSubmitted(true);
    if (!canSave) return;

    const uses = ["shop_public"];
    if (asWhatsapp) uses.push("whatsapp");
    if (asDelivery) uses.push("delivery");

    // 🔎 duplicate protection (normalize to digits only)
// 🔎 duplicate protection (normalize to digits only)
const newNorm = normDigits(v.e164 || phoneVal);
const existing = phones.find((p) => normDigits(p.e164 || p.number) === newNorm);

if (existing) {
  // merge uses if user ticked new ones
  const want = new Set(["shop_public", asWhatsapp && "whatsapp", asDelivery && "delivery"].filter(Boolean));
  const have = new Set(Array.isArray(existing.uses) ? existing.uses : []);
  const needsUpdate = [...want].some(u => !have.has(u));

  if (needsUpdate) {
    try {
      await fetch(`${BASE_API_URL}/api/users/me/phones/${existing.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({ uses: [...new Set([...have, ...want])] }),
      });
    } catch {}
  }

  // ensure primary if requested
  if (asPrimary && !existing.is_primary) {
    try {
      await fetch(`${BASE_API_URL}/api/users/me/phones/${existing.id}/set_primary/`, {
        method: "POST",
        headers: { Authorization: `Token ${authToken}` },
      });
      toast.success("Primary updated for that existing contact.");
    } catch {
      toast.error("Couldn’t set primary. Please try again.");
    }
  } else if (!needsUpdate) {
    toast("That number is already in your contacts.", { icon: "ℹ️" });
  }

  await refresh();

  // reset form
  setPhoneVal("");
  setTouched(false);
  setSubmitted(false);
  setAsWhatsapp(false);
  setAsDelivery(false);
  setAsPrimary(!phones.some(p => p.is_primary));
  return;
}

    try {
      setSaving(true);
      const res = await fetch(`${BASE_API_URL}/api/users/me/phones/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({
          number: v.e164 || phoneVal,
          region: countryIso,
          uses,
          is_primary: asPrimary,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = String(data?.detail || data?.error || "").toLowerCase();
        if (msg.includes("already") || msg.includes("exist")) {
          toast("That number is already in your contacts.", { icon: "ℹ️" });
        } else {
          toast.error(data?.detail || data?.error || "Unable to save phone.");
        }
        return;
      }

      // ensure single primary if requested
      if (asPrimary && data?.id) {
        await fetch(`${BASE_API_URL}/api/users/me/phones/${data.id}/set_primary/`, {
          method: "POST",
          headers: { Authorization: `Token ${authToken}` },
        }).catch(() => {});
      }

      toast.success("Contact added.");

      // reset form
      setPhoneVal("");
      setTouched(false);
      setSubmitted(false);
      setAsWhatsapp(false);
      setAsDelivery(false);

      // refresh and compute default checkbox
      const list = await refresh();
      const source = Array.isArray(list) ? list : phones;
      setAsPrimary(!source.some((p) => p.is_primary));
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  // default the "Set as default contact" checkbox sensibly
  useEffect(() => {
    if (open) setAsPrimary(!phones.some((p) => p.is_primary));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phones.length]);

  // Optimistic Set Primary
  const setPrimary = async (id) => {
    setPhones((prev) => prev.map((p) => ({ ...p, is_primary: p.id === id })));
    try {
      const res = await fetch(`${BASE_API_URL}/api/users/me/phones/${id}/set_primary/`, {
        method: "POST",
        headers: { Authorization: `Token ${authToken}` },
      });
      if (!res.ok) throw new Error();
      await refresh();
      toast.success("Primary updated.");
    } catch {
      toast.error("Could not set primary.");
      await refresh();
    }
  };

  // ❌ Remove phone (auto-promote another number if needed, prefer verified)
  const removePhone = async (id) => {
    const victim = phones.find((p) => p.id === id);
    const remaining = phones.filter((p) => p.id !== id);

    // don't let the last contact be removed
    if (phones.length === 1) {
      toast("You must keep at least one contact.", { icon: "ℹ️" });
      return;
    }

    setDeletingId(id);
    // optimistic remove
    setPhones(remaining);

    try {
      const res = await fetch(`${BASE_API_URL}/api/users/me/phones/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${authToken}` },
      });
      if (!res.ok) throw new Error();

      // If we removed the primary and there are others, ensure one is primary
      if (victim?.is_primary && remaining.length > 0 && !remaining.some((p) => p.is_primary)) {
        const promoteTarget = remaining.find((p) => p.is_verified) || remaining[0];
        const promoteId = promoteTarget?.id;
        if (promoteId) {
          // optimistic promote
          setPhones((prev) => prev.map((p) => ({ ...p, is_primary: p.id === promoteId })));
          try {
            await fetch(`${BASE_API_URL}/api/users/me/phones/${promoteId}/set_primary/`, {
              method: "POST",
              headers: { Authorization: `Token ${authToken}` },
            });
            toast("Primary moved to the next contact.", { icon: "⭐" });
          } catch {}
        }
      }

      await refresh();
      toast.success("Contact removed.");
    } catch {
      toast.error("Couldn’t remove contact.");
      await refresh(); // revert to server truth
    } finally {
      setDeletingId(null);
    }
  };

  // Mobile-friendly footer (stack) — brand accents & a11y
  const footer = (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
      <button
        onClick={onClose}
        className="w-full md:w-auto px-4 py-3 md:py-2 rounded-md border
                   border-neutral-300 dark:border-neutral-700
                   bg-white dark:bg-neutral-900
                   text-neutral-900 dark:text-neutral-100
                   hover:bg-neutral-50 dark:hover:bg-neutral-800
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
      >
        Close
      </button>
      <button
        onClick={handleSave}
        disabled={!canSave}
        aria-busy={saving || undefined}
className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-md bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 disabled:opacity-60
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 transition-colors"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Contact
      </button>
    </div>
  );

  const onlyOne = phones.length === 1;

  return (
    <BottomSheet open={open} onClose={onClose} title="Add Seller Contact" footer={footer}>
      {/* Existing contacts */}
      <section className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Your Contacts</h4>

        {loading ? (
          <div className="space-y-2">
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
        ) : phones.length === 0 ? (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">No contacts yet.</div>
        ) : (
          <ul className="space-y-2">
            {phones.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate text-neutral-900 dark:text-neutral-100">
                    {p.display || p.e164}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {humanizeUses(p.uses)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  {p.is_verified && (
                    <BadgeCheck className="w-4 h-4 text-emerald-500" title="Verified" />
                  )}

                  {p.is_primary ? (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full
                                      bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      <Star className="w-3 h-3" /> Primary
                    </span>
                  ) : (
                    <button
                      onClick={() => setPrimary(p.id)}
                      className="text-[11px] px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700
                                 hover:bg-neutral-50 dark:hover:bg-neutral-800
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                    >
                      Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => removePhone(p.id)}
                    disabled={deletingId === p.id || onlyOne}
                    className="text-[11px] px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700
                               hover:bg-rose-50 dark:hover:bg-rose-900/20
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50
                               disabled:opacity-60"
                    title={onlyOne ? "Keep at least one contact" : "Remove contact"}
                  >
                    {deletingId === p.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Add new */}
      <section className="mt-5">
        <h4 className="text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
          Add a new contact
        </h4>

        <form onSubmit={handleSave} className="space-y-2">
          <PhoneInput
    selectedCountry={countryIso}
    value={phoneVal}
            onCountryChange={(iso) => {
              setCountryIso(iso);
              setTouched(false);
              setSubmitted(false);
            }}
            onChange={(val) => {
              setPhoneVal(val);
              setTouched(false);
              setSubmitted(false);
            }}
            onFocus={() => {
              setHasFocus(true);
              setTouched(false);
            }}
            onBlur={() => {
              setHasFocus(false);
              setTouched(true);
            }}
            invalid={showError}
          />

          {showError ? (
            <p className="text-xs text-red-700 dark:text-red-400" aria-live="polite">
              Number doesn’t look valid for this country.
            </p>
          ) : showHint ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400" aria-live="polite">
              Keep typing… we’ll validate when you’re done.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-red-600"
                checked={asPrimary}
                onChange={(e) => setAsPrimary(e.target.checked)}
              />
              Set as default contact
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-600"
                checked={asWhatsapp}
                onChange={(e) => setAsWhatsapp(e.target.checked)}
              />
              WhatsApp
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-indigo-600"
                checked={asDelivery}
                onChange={(e) => setAsDelivery(e.target.checked)}
              />
              Delivery
            </label>
          </div>

          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            We’ll store your number in E.164 and show it in local format. You can verify and manage contacts later.
          </p>

          {/* Hidden submit for mobile “Go/Done” */}
          <button type="submit" className="hidden" />
        </form>
      </section>
    </BottomSheet>
  );
}