"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  EyeOff,
  PackageSearch,
  DollarSign,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

/* ---------- lightweight helpers (no big arrays) ---------- */
const viewsOf = (p) =>
  p?.views ??
  p?.impressions ??
  p?.impressions_count ??
  p?.view_count ??
  p?.metrics?.views ??
  0;

const qtyOf = (p) => p?.product_quantity ?? p?.quantity ?? p?.stock ?? 0;

const hasImages = (p) =>
  Array.isArray(p?.image_objects) ? p.image_objects.length > 0 : !!p?.image_url;

const cents = (p) => Number(p?.price_cents ?? 0);
const ccy = (p) => (p?.price_currency || "").toUpperCase();

/** Reducer-style aggregator so we never store all products */
function makeAgg() {
  return {
    total: 0,
    approved: 0,
    draft: 0,
    out_of_stock: 0,
    low_stock: 0,
    needs_attention: 0,
    views_this_month: 0,
    byCcy: new Map(), // key: "GHS", value: { cents: number, count: number }
  };
}
function addToAgg(agg, p) {
  agg.total += 1;

  const status = Number(p?.status);
  if (status === 1) agg.approved += 1;
  else if (status === 0) agg.draft += 1;

  const q = qtyOf(p);
  if (q === 0) agg.out_of_stock += 1;
  else if (q > 0 && q < 5) agg.low_stock += 1;

  // needs attention: hidden/draft OR zero stock OR no images OR zero/negative price
  if (status !== 1 || q === 0 || !hasImages(p) || cents(p) <= 0) {
    agg.needs_attention += 1;
  }

  agg.views_this_month += Number(viewsOf(p) || 0);

  const k = ccy(p) || "—";
  const slot = agg.byCcy.get(k) || { cents: 0, count: 0 };
  slot.cents += cents(p);
  slot.count += 1;
  agg.byCcy.set(k, slot);
}
function finalizeAgg(agg) {
  let average_price_label = "—";
  if (agg.byCcy.size) {
    const [topCcy, s] = [...agg.byCcy.entries()].sort((a, b) => b[1].count - a[1].count)[0];
    const avg = s.count ? s.cents / s.count / 100 : 0;
    average_price_label = `${topCcy} ${avg.toFixed(2)}`;
  }
  return {
    total: agg.total,
    approved: agg.approved,
    draft: agg.draft,
    out_of_stock: agg.out_of_stock,
    low_stock: agg.low_stock,
    needs_attention: agg.needs_attention,
    views_this_month: agg.views_this_month,
    average_price_label,
  };
}

/* ---------- component ---------- */
export default function ProductSummaryPills({ onSelect, activeKey }) {
  const { hydrated, user } = useAuth();

  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    draft: 0,
    out_of_stock: 0,
    low_stock: 0,
    needs_attention: 0,
    views_this_month: 0,
    average_price_label: "—",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // cache: instant paint, then revalidate in background
  const CACHE_KEY = "up_products_summary_v1";
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && typeof cached === "object") setSummary(cached);
      }
    } catch {}
  }, []);

  // Fetch minimal data fast: first page (quick render) → then a few more in background
  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    const controller = new AbortController();

    const tz =
      (typeof Intl !== "undefined" &&
        Intl.DateTimeFormat().resolvedOptions().timeZone) ||
      undefined;

    // ask for minimal fields if API supports it (ignored otherwise)
    const FIELDS =
      "id,status,product_quantity,price_cents,price_currency,views,impressions,impressions_count,view_count,metrics,image_url,image_objects";

    // limits
    const FIRST_PAGE_SIZE = 48;   // small & quick
    const BG_PAGE_SIZE = 200;     // reduce #requests in background
    const MAX_BG_PAGES = 3;       // keep it snappy
    const CONCURRENCY = 3;        // polite parallelism

    async function fetchPage(page, pageSize) {
      const { data } = await axiosInstance.get("/api/products/mine/", {
        params: { page, page_size: pageSize, tz, fields: FIELDS },
        signal: controller.signal,
        withCredentials: true,
      });

      const rows = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

      return {
        rows,
        count: typeof data?.count === "number" ? data.count : null,
        hasNext: Boolean(data?.next),
      };
    }

    async function run() {
      setLoading(true);
      setErr(null);

      const agg = makeAgg();

      try {
        // Stage 1: FIRST page → render ASAP
        const first = await fetchPage(1, FIRST_PAGE_SIZE);
        first.rows.forEach((p) => addToAgg(agg, p));
        if (!cancelled) {
          const s = finalizeAgg(agg);
          setSummary(s);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(s));
          } catch {}
        }

        // Stage 2: background pages (limited)
        // Work out how many to fetch
        let totalPages = null;
        if (first.count != null) {
          totalPages = Math.ceil(first.count / BG_PAGE_SIZE);
        }

        // Build the list of pages to fetch
        const pages = [];
        // If we know total, start from page 2 with big page size
        // If not, still try a few pages optimistically
        const bgStart = 2;
        const bgEnd = totalPages ? Math.min(MAX_BG_PAGES + 1, totalPages) : MAX_BG_PAGES + 1;
        for (let p = bgStart; p <= bgEnd; p += 1) pages.push(p);

        // Simple concurrency control
        let idx = 0;
        async function worker() {
          while (idx < pages.length && !cancelled) {
            const page = pages[idx++];
            const { rows } = await fetchPage(page, BG_PAGE_SIZE);
            rows.forEach((r) => addToAgg(agg, r));
            if (!cancelled) {
              const s = finalizeAgg(agg);
              setSummary(s);
              try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(s));
              } catch {}
            }
            if (!rows.length) break; // stop early if page empty
          }
        }

        const workers = Array.from({ length: Math.min(CONCURRENCY, pages.length) }, worker);
        await Promise.race([
          Promise.all(workers),
          // hard cap background work to ~2.5s so it never drags page
          new Promise((resolve) => setTimeout(resolve, 2500)),
        ]);
      } catch (e) {
        if (!cancelled) setErr("Failed to load products");
        // eslint-disable-next-line no-console
        console.error("❌ ProductSummaryPills error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [hydrated, user]);

  const items = useMemo(
    () => [
      { label: "Total Products", key: null, value: summary.total, icon: PackageSearch },
      { label: "Approved", key: "approved", value: summary.approved, icon: CheckCircle },
      { label: "Drafts", key: "draft", value: summary.draft, icon: EyeOff },
      { label: "Out of Stock", key: "out_of_stock", value: summary.out_of_stock, icon: AlertTriangle },
      { label: "Low Stock", key: "low_stock", value: summary.low_stock, icon: Star },
      { label: "Views This Month", key: null, value: summary.views_this_month, icon: Eye },
      { label: "Needs Attention", key: "needs_attention", value: summary.needs_attention, icon: AlertTriangle },
      { label: "Avg Price", key: null, value: summary.average_price_label, icon: DollarSign },
    ],
    [summary]
  );

  if (err) return <p className="text-center text-red-500 py-4">{err}</p>;

  return (
    <div className="flex overflow-x-auto gap-3 py-4 scrollbar-hide">
      {(loading ? Array.from({ length: 8 }) : items).map((item, idx) => {
        if (loading) {
          return (
            <div
              key={`skeleton-${idx}`}
              className="min-w-[120px] px-4 py-2 rounded-3xl border text-sm shadow-sm bg-gray-50 dark:bg-gray-800 animate-pulse"
            >
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
              <div className="h-5 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          );
        }

        const isActive = item.key && item.key === activeKey;
        const isClickable = !!item.key;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => isClickable && onSelect?.(item.key)}
            className={classNames(
              "flex flex-col justify-center items-center min-w-[120px] px-4 py-2 rounded-3xl border text-sm shadow-sm",
              {
                "bg-purple-100 text-purple-800 border-purple-300": isActive,
                "bg-white dark:bg-gray-900 text-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800":
                  !isActive && isClickable,
                "cursor-default text-gray-400 bg-white dark:bg-gray-900 border-gray-200":
                  !isClickable,
              }
            )}
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="text-[13px] font-medium text-center leading-snug">
              {item.label}
            </span>
            <span className="text-lg font-bold mt-0.5">{item.value}</span>
          </button>
        );
      })}
    </div>
  );
}