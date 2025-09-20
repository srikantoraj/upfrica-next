// src/components/new-dashboard/SellerDashboardHome.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import useEntitlements from "@/hooks/useEntitlements";
import { api, apiJSON } from "@/lib/api";

import {
  X, Loader2, BadgeCheck, Star, ShoppingCart, BarChart2, Eye,
  Package, Clock, AlertCircle, TrendingUp, CircleCheck, Info,
} from "lucide-react";
import { parsePhoneNumberFromString, getCountryCallingCode } from "libphonenumber-js/min";
import PhoneInput from "@/components/input/phoneInput";
import SellerReviewsSummaryCard from "@/components/new-dashboard/SellerReviewsSummaryCard";
import PlanComparisonModal from "@/components/ui/PlanComparisonModal";

/* -------------------------------- labels/helpers -------------------------------- */
const USE_LABELS = { shop_public: "Shop contact", whatsapp: "WhatsApp", delivery: "Delivery" };
const USE_ORDER = { shop_public: 0, whatsapp: 1, delivery: 2 };
const startCase = (s = "") =>
  String(s).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (m) => m.toUpperCase());
export const humanizeUses = (uses) => {
  const arr = Array.isArray(uses)
    ? uses
    : typeof uses === "string"
    ? uses.split(",").map((x) => x.trim()).filter(Boolean)
    : [];
  if (!arr.length) return "";
  const sorted = [...arr].sort((a, b) => (USE_ORDER[a] ?? 99) - (USE_ORDER[b] ?? 99));
  return [...new Set(sorted.map((u) => USE_LABELS[u] ?? startCase(u)))].join(", ");
};
const isSellerRole = (r) => r === "seller" || r === "seller_private" || r === "seller_business";

/* ================================================================================== */
export default function SellerDashboardHome() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { stateOf, whyLocked, loading: entLoading } = useEntitlements();
  const contactState = stateOf("allow_display_seller_contact");
  const contactWhy = whyLocked("allow_display_seller_contact");

  const [phoneSheetOpen, setPhoneSheetOpen] = useState(false);
  const [hasPrimaryContact, setHasPrimaryContact] = useState(false);

  const { user, hydrated } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [shop, setShop] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);
  const [loadingShop, setLoadingShop] = useState(true);
  const [errorDash, setErrorDash] = useState(null);
  const [errorShop, setErrorShop] = useState(null);
  const [planRequired, setPlanRequired] = useState(null); // { message, next }
  const [plansOpen, setPlansOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const roles = Array.isArray(user?.account_type)
    ? user.account_type
    : user?.account_type
    ? [user.account_type]
    : [];
  const isSeller = roles.some(isSellerRole);

  const userHasPlan = !!(user?.seller_plan && (user?.seller_plan.id ?? user?.seller_plan));
  const dashHasPlan = !!(dashboard?.seller_plan && (dashboard?.seller_plan.id ?? dashboard?.seller_plan));
  const hasPlan = userHasPlan || dashHasPlan;

  /* ---------------- dashboard ---------------- */
  useEffect(() => {
    if (!hydrated) return;
    let alive = true;

    (async () => {
      setLoadingDash(true);
      setErrorDash(null);
      setPlanRequired(null);
      try {
        const data = await api("users/me/dashboard");
        if (!alive) return;
        setDashboard(data);
      } catch (err) {
        if (!alive) return;
        const msg = String(err?.message || "").toLowerCase();
        if (msg.includes("seller_plan_required")) {
          setPlanRequired({
            message: "You need an active seller plan to access the seller dashboard.",
            next: "/onboarding/account-type",
          });
        } else if (msg.includes("401")) {
          setErrorDash("Session expired. Please log in again.");
        } else if (msg.includes("403")) {
          setErrorDash("You don’t have permission to access the seller dashboard.");
        } else {
          setErrorDash(err?.message || "Failed to load dashboard.");
        }
      } finally {
        if (alive) setLoadingDash(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [hydrated]);

  /* ---------------- payment success param ---------------- */
  useEffect(() => {
    const paid = search?.get("payment");
    if (paid !== "success") return;

    toast.success("Payment confirmed. Updating your plan…");

    const params = new URLSearchParams(search);
    params.delete("payment");
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });

    // prompt a refresh
    setTimeout(() => setLoadingDash(true), 250);
  }, [search, pathname, router]);

  /* ---------------- shop ---------------- */
  const backendIsSeller = Array.isArray(dashboard?.account_type)
    ? dashboard.account_type.some(isSellerRole)
    : undefined;
  const effectiveIsSeller = backendIsSeller === undefined ? isSeller : backendIsSeller;

  useEffect(() => {
    if (!hydrated || !effectiveIsSeller || planRequired || !hasPlan) return;
    let alive = true;

    (async () => {
      setLoadingShop(true);
      setErrorShop(null);
      try {
        const data = await api("shops/me");
        if (!alive) return;
        setShop(data || null);
      } catch (err) {
        if (!alive) return;
        const msg = String(err?.message || "");
        // 404/204 → treat as no shop
        if (msg.startsWith("404") || msg.startsWith("204")) {
          setShop(null);
        } else if (msg.startsWith("401")) {
          setErrorShop("Session expired. Please log in again.");
        } else if (msg.startsWith("403")) {
          setErrorShop("You don’t have permission to view shop data.");
        } else {
          setErrorShop(msg.slice(0, 300));
        }
      } finally {
        if (alive) setLoadingShop(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [hydrated, effectiveIsSeller, planRequired, hasPlan]);

  /* ---------------- storefront gating ---------------- */
  const storefrontState = stateOf("storefront_unlock"); // 'active' | 'included_locked' | 'available'
  const storefrontLocked = !entLoading && storefrontState === "available";
  const storefrontKyc = !entLoading && storefrontState === "included_locked";

  const shopStatus = String(shop?.status ?? "").toLowerCase();
  const subStatus = String(
    shop?.subscription?.status ?? shop?.subscription_status ?? shop?.plan_status ?? ""
  ).toLowerCase();

  const isExplicitInactive =
    shop?.is_enabled === false ||
    shop?.is_active === false ||
    shop?.suspended === true ||
    ["inactive", "paused", "suspended", "disabled", "closed", "archived"].includes(shopStatus) ||
    Boolean(shop?.deleted_at);

  const isSubscriptionInactive = ["canceled", "past_due", "unpaid"].includes(subStatus);
  const shopInactive = isExplicitInactive || isSubscriptionInactive;

  /* ---------------- plan usage ---------------- */
  const planLabel = dashboard?.seller_plan?.label ?? "Unknown";
  const maxProductsNum = Number(dashboard?.seller_plan?.max_products ?? 0);
  const activeListingsNum = Number(dashboard?.active_listings ?? 0);
  const awaitingApproval = Number(dashboard?.awaiting_approval_listings ?? 0);
  const inactiveBySeller = Number(dashboard?.inactive_listings ?? 0);
  const slotsLeft = maxProductsNum > 0 ? Math.max(maxProductsNum - activeListingsNum, 0) : "—";
  const usagePercent =
    maxProductsNum > 0 ? Math.min(Math.round((activeListingsNum / maxProductsNum) * 100), 100) : 0;

  /* ---------------- subscribe ---------------- */
  const handlePickPlan = async (planId) => {
    try {
      setSubscribing(true);
      const data = await apiJSON("seller/subscribe", {
        plan_id: planId,
        billing_cycle: "monthly",
      });

      if (data?.message && !data?.checkout_url) {
        toast.success("✅ Free plan activated!");
        router.push("/new-dashboard/seller");
        return;
      }
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      toast.success("✅ Plan updated.");
      router.push("/new-dashboard/seller");
    } catch (e) {
      toast.error(`❌ ${e?.message || "Subscription failed."}`);
    } finally {
      setSubscribing(false);
      setPlansOpen(false);
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

      {/* Seller actions */}
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

        {contactState === "active" && (
          <button
            className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
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
            className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            🔒 {hasPrimaryContact ? "Manage Contacts" : "Add Seller Contact"}
          </button>
        )}

        {contactState === "available" && (
          <button
            onClick={() => setPlansOpen(true)}
            title="Upgrade your plan to enable seller contact"
            className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            🔒 {hasPrimaryContact ? "Manage Contacts" : "Add Seller Contact"}
          </button>
        )}

        <button className="shrink-0 px-3 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
          Update Stock
        </button>
      </div>

      {maxProductsNum > 0 && usagePercent >= 80 && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          You’ve used {usagePercent}% of your listing slots.{" "}
          <button className="underline font-medium" onClick={() => setPlansOpen(true)}>
            Upgrade your plan
          </button>{" "}
          to add more products.
        </div>
      )}

      {/* Shop controls */}
      {!loadingShop && (
        <>
          {shop ? (
            // has a shop
            entLoading ? (
              <button
                disabled
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm cursor-not-allowed"
                title="Checking your plan…"
              >
                🛍️ View Your Shop
              </button>
            ) : storefrontLocked ? (
              <button
                onClick={() => setPlansOpen(true)}
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
                title="Upgrade your plan to unlock your storefront"
              >
                🔒 View Your Shop
              </button>
            ) : storefrontKyc ? (
              <button
                onClick={() =>
                  router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)
                }
                className="inline-block mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200"
                title="KYC verification required"
              >
                🔒 View Your Shop
              </button>
            ) : shopInactive ? (
              <div className="flex gap-2 mb-4">
                <button
                  disabled
                  className="inline-block bg-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm cursor-not-allowed"
                  title="Your shop is paused. Reactivate to make it visible."
                >
                  🔒 View Your Shop
                </button>
                <button
                  onClick={() => router.push("/billing/reactivate")}
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Reactivate
                </button>
              </div>
            ) : (
              <Link
                href={`/shops/${shop.slug}`}
                className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition"
              >
                🛍️ View Your Shop
              </Link>
            )
          ) : (
            // no shop yet
            (() => {
              const createState = stateOf("allow_shop_creation");
              const createLocked = !entLoading && createState === "available";
              const createKyc = !entLoading && createState === "included_locked";

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
                    onClick={() =>
                      router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)
                    }
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
            onClick={() =>
              router.push(`/settings/verify?redirect=${encodeURIComponent(pathname)}`)
            }
            className="ml-2 inline-flex items-center rounded-md bg-sky-600 px-2.5 py-1 text-white hover:bg-sky-700"
          >
            Start KYC
          </button>
        </div>
      )}

      {/* Bottom sheet: contacts */}
      <AddSellerContactSheet
        open={phoneSheetOpen}
        onClose={() => setPhoneSheetOpen(false)}
        onHasPrimaryChange={setHasPrimaryContact}
      />

      {/* Plan usage */}
      {loadingDash ? (
        <div className="mb-6 h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      ) : (
        <>
          <div className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
            Plan: <span className="font-bold text-purple-600">{planLabel}</span> · Active{" "}
            <strong>{activeListingsNum}</strong> / <strong>{maxProductsNum || "—"}</strong> ·
            Slots Left <strong>{slotsLeft}</strong> · Usage <strong>{usagePercent}%</strong> · 🕒
            Awaiting Approval <strong>{awaitingApproval}</strong> · 💤 Inactive{" "}
            <strong>{inactiveBySeller}</strong>
          </div>

          <div
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-6 "
            role="progressbar"
            aria-valuenow={usagePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded bg-purple-600 dark:bg-purple-400" style={{ width: `${usagePercent}%` }} />
          </div>
        </>
      )}

      {/* Metrics */}
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

      <SellerReviewsSummaryCard />

      <PlanComparisonModal
        open={plansOpen}
        onOpenChange={setPlansOpen}
        hideTrigger
        onPick={handlePickPlan}
      />
    </div>
  );
}

/* -------------------------------- small components -------------------------------- */
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

/* -------------------------------- BottomSheet -------------------------------- */
function BottomSheet({ open, onClose, title, children, footer }) {
  const sheetRef = React.useRef(null);
  const [dragY, setDragY] = useState(0);
  const startY = React.useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (open) sheetRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    setDragY(Math.max(0, delta));
  };
  const onTouchEnd = () => {
    if (dragY > 80) onClose?.();
    setDragY(0);
    startY.current = null;
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      <div
        ref={sheetRef}
        tabIndex={-1}
        onKeyDown={(e) => e.key === "Escape" && onClose?.()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="absolute inset-x-0 bottom-0 w-full sm:max-w-xl sm:mx-auto rounded-t-2xl bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800 overflow-hidden focus:outline-none max-h-[88svh]"
        style={{ transform: `translateY(${dragY}px)` }}
      >
        <div className="flex items-center justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="px-4 sm:px-6 pb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 sm:px-6 pb-24 overflow-y-auto">{children}</div>
        {footer && (
          <div
            className="absolute bottom-0 inset-x-0 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Contacts sheet -------------------------------- */
function AddSellerContactSheet({ open, onClose, onHasPrimaryChange }) {
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState([]);
  const [error, setError] = useState(null);

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
  const reqSeq = useRef(0);

  const SOFT_MIN_DIGITS = { GH: 7, NG: 7, KE: 7, ZA: 7, GB: 7, US: 7 };
  const asList = (payload) =>
    Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : Array.isArray(payload?.items) ? payload.items : payload && typeof payload === "object" && (payload.id || payload.e164 || payload.number) ? [payload] : [];

  const normDigits = (s) => String(s || "").replace(/\D/g, "");

  function validatePhone(raw, iso) {
    const s0 = String(raw || "").trim();
    let digits = s0.replace(/\D/g, "");
    const ccISO = String(iso || "").toUpperCase();

    if (!digits) return { state: "empty" };

    try {
      const cc = getCountryCallingCode(ccISO);
      if (!s0.startsWith("+") && digits.startsWith(cc)) digits = digits.slice(cc.length);
    } catch {}

    const min = SOFT_MIN_DIGITS[ccISO] ?? 7;
    if (digits.length < min) return { state: "typing" };

    try {
      const pn = parsePhoneNumberFromString(digits, ccISO);
      if (!pn) return { state: "typing" };
      if (pn.isValid()) return { state: "valid", e164: pn.format("E.164"), national: pn.formatNational() };
      return pn.isPossible() ? { state: "typing" } : { state: "invalid" };
    } catch {
      return { state: "typing" };
    }
  }

  const v = validatePhone(phoneVal, countryIso);
  const digits = (phoneVal || "").replace(/\D/g, "");
  const minLen = SOFT_MIN_DIGITS[countryIso] ?? 7;
  const showError = !hasFocus && (touched || submitted) && digits.length >= minLen && v.state === "invalid";
  const showHint = hasFocus && digits.length > 0 && digits.length < minLen;
  const canSave = v.state === "valid" && !saving;

  useEffect(() => {
    onHasPrimaryChange?.(phones.some((p) => p.is_primary));
  }, [phones, onHasPrimaryChange]);

  // list
  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api("users/me/phones");
        if (alive) setPhones(asList(data));
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load phones");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [open]);

  const refresh = async () => {
    const my = ++reqSeq.current;
    try {
      const data = await api("users/me/phones");
      if (reqSeq.current !== my) return null;
      const list = asList(data);
      setPhones(list);
      return list;
    } catch {
      return null;
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault?.();
    setSubmitted(true);
    if (!canSave) return;

    const uses = ["shop_public"];
    if (asWhatsapp) uses.push("whatsapp");
    if (asDelivery) uses.push("delivery");

    const newNorm = normDigits(v.e164 || phoneVal);
    const existing = phones.find((p) => normDigits(p.e164 || p.number) === newNorm);

    // merge with existing
    if (existing) {
      const want = new Set(["shop_public", asWhatsapp && "whatsapp", asDelivery && "delivery"].filter(Boolean));
      const have = new Set(Array.isArray(existing.uses) ? existing.uses : []);
      const needsUpdate = [...want].some((u) => !have.has(u));

      if (needsUpdate) {
        await apiJSON(`users/me/phones/${existing.id}`, { uses: [...new Set([...have, ...want])] }, { method: "PATCH" }).catch(() => {});
      }

      if (asPrimary && !existing.is_primary) {
        await api(`users/me/phones/${existing.id}/set_primary`, { method: "POST" })
          .then(() => toast.success("Primary updated for that existing contact."))
          .catch(() => toast.error("Couldn’t set primary. Please try again."));
      } else if (!needsUpdate) {
        toast("That number is already in your contacts.", { icon: "ℹ️" });
      }

      await refresh();
      setPhoneVal(""); setTouched(false); setSubmitted(false);
      setAsWhatsapp(false); setAsDelivery(false);
      setAsPrimary(!phones.some((p) => p.is_primary));
      return;
    }

    // create
    try {
      setSaving(true);
      const created = await apiJSON("users/me/phones", {
        number: v.e164 || phoneVal,
        region: countryIso,
        uses,
        is_primary: asPrimary,
      });

      if (asPrimary && created?.id) {
        await api(`users/me/phones/${created.id}/set_primary`, { method: "POST" }).catch(() => {});
      }

      toast.success("Contact added.");

      setPhoneVal(""); setTouched(false); setSubmitted(false);
      setAsWhatsapp(false); setAsDelivery(false);

      const list = await refresh();
      const source = Array.isArray(list) ? list : phones;
      setAsPrimary(!source.some((p) => p.is_primary));
    } catch (err) {
      toast.error(err?.message || "Unable to save phone.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (open) setAsPrimary(!phones.some((p) => p.is_primary));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phones.length]);

  const setPrimary = async (id) => {
    setPhones((prev) => prev.map((p) => ({ ...p, is_primary: p.id === id })));
    try {
      await api(`users/me/phones/${id}/set_primary`, { method: "POST" });
      await refresh();
      toast.success("Primary updated.");
    } catch {
      toast.error("Could not set primary.");
      await refresh();
    }
  };

  const removePhone = async (id) => {
    const victim = phones.find((p) => p.id === id);
    const remaining = phones.filter((p) => p.id !== id);
    if (phones.length === 1) {
      toast("You must keep at least one contact.", { icon: "ℹ️" });
      return;
    }

    setDeletingId(id);
    setPhones(remaining);

    try {
      await api(`users/me/phones/${id}`, { method: "DELETE" });

      if (victim?.is_primary && remaining.length > 0 && !remaining.some((p) => p.is_primary)) {
        const promoteTarget = remaining.find((p) => p.is_verified) || remaining[0];
        const promoteId = promoteTarget?.id;
        if (promoteId) {
          setPhones((prev) => prev.map((p) => ({ ...p, is_primary: p.id === promoteId })));
          await api(`users/me/phones/${promoteId}/set_primary`, { method: "POST" }).catch(() => {});
          toast("Primary moved to the next contact.", { icon: "⭐" });
        }
      }

      await refresh();
      toast.success("Contact removed.");
    } catch {
      toast.error("Couldn’t remove contact.");
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const footer = (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
      <button
        onClick={onClose}
        className="w-full md:w-auto px-4 py-3 md:py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
      >
        Close
      </button>
      <button
        onClick={handleSave}
        disabled={!canSave}
        aria-busy={saving || undefined}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 md:py-2 rounded-md bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 transition-colors"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Contact
      </button>
    </div>
  );

  const onlyOne = phones.length === 1;

  return (
    <BottomSheet open={open} onClose={onClose} title="Add Seller Contact" footer={footer}>
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
                  {p.is_verified && <BadgeCheck className="w-4 h-4 text-emerald-500" title="Verified" />}

                  {p.is_primary ? (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      <Star className="w-3 h-3" /> Primary
                    </span>
                  ) : (
                    <button
                      onClick={() => setPrimary(p.id)}
                      className="text-[11px] px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
                    >
                      Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => removePhone(p.id)}
                    disabled={deletingId === p.id || onlyOne}
                    className="text-[11px] px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:opacity-60"
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

      <section className="mt-5">
        <h4 className="text-sm font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Add a new contact</h4>
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
            onFocus={() => { setHasFocus(true); setTouched(false); }}
            onBlur={() => { setHasFocus(false); setTouched(true); }}
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
            We’ll store your number in E.164 and show it in local format. You can verify and manage
            contacts later.
          </p>

          <button type="submit" className="hidden" />
        </form>
      </section>
    </BottomSheet>
  );
}