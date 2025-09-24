// src/components/new-dashboard/products/ProductsHeader.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  Table as TableIcon,
  LayoutGrid,
  MonitorSmartphone,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import axios from "@/lib/axiosInstance";

/** Compact segmented control (scrolls horizontally when needed) */
function Segmented({ value, onChange, options, ariaLabel, className = "" }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto no-scrollbar whitespace-nowrap ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`px-2.5 py-1.5 text-sm rounded-md transition mr-1 last:mr-0 ${
              active
                ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function useClickAway(onAway) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onAway?.();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [onAway]);
  return ref;
}

function timeAgo(d) {
  if (!d) return "—";
  try {
    const t = typeof d === "string" ? new Date(d) : d;
    const s = Math.max(0, Math.floor((Date.now() - t.getTime()) / 1000));
    if (s < 10) return "just now";
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
  } catch {
    return "—";
  }
}

export default function ProductsHeader({
  filter,
  setFilter,
  searchInput,
  setSearchInput,
  dateWindow,
  setDateWindow,
  density,
  setDensity,
  view,
  setView,
  meta, // { count, updatedAt, statsBusy } (optional)
  onColumnsClick,
  onAutoFix,
  onAdd,
}) {
  const [dash, setDash] = useState(null);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: d }, sRes] = await Promise.all([
        axios.get("/api/users/me/dashboard/"),
        axios.get("/api/shops/me/").catch(() => ({ data: null })),
      ]);
      if (!alive) return;
      setDash(d || null);
      setShop(sRes?.data || null);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const planLabel = dash?.seller_plan?.label ?? "—";
  const maxProducts = Number(dash?.seller_plan?.max_products ?? 0);
  const active = Number(dash?.active_listings ?? 0);
  const slotsLeft = maxProducts ? Math.max(0, maxProducts - active) : 0;
  const usage = maxProducts
    ? Math.min(100, Math.round((active / maxProducts) * 100))
    : 0;

  const counts = {
    all: dash?.products_total,
    live: dash?.products_live ?? dash?.active_listings,
    paused: dash?.products_paused,
    draft: dash?.products_draft,
  };

  // Tools (mobile) menu
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useClickAway(() => setToolsOpen(false));

  return (
    <div className="sticky top-0 z-30 border bg-white/90 backdrop-blur dark:bg-gray-950/90 dark:border-gray-800">
      {/* Row 1 — plan + CTAs */}
      <div className="px-4 sm:px-5 pt-3 pb-2 flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
          <span className="font-medium">Plan:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            {planLabel}
          </span>
          <span className="opacity-70 text-xs">
            Active {active}
            {maxProducts ? `/${maxProducts}` : ""}
          </span>
          {maxProducts ? (
            <span className="opacity-70 text-xs">· Slots left {slotsLeft}</span>
          ) : null}
        </div>
        <div className="hidden sm:block w-40 h-1.5 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-1.5 bg-purple-600 dark:bg-purple-400"
            style={{ width: `${usage}%` }}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {shop?.slug && (
            <Link
              href={`/shops/${shop.slug}`}
              className="hidden sm:inline-flex px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
            >
              View Shop
            </Link>
          )}
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-black text-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Row 2 — tabs + search + date */}
      <div className="px-4 sm:px-5 pb-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Segmented
          ariaLabel="Listing filter"
          value={filter}
          onChange={setFilter}
          options={[
            {
              label: `All${counts.all != null ? ` (${counts.all})` : ""}`,
              value: "all",
            },
            {
              label: `Live${counts.live != null ? ` (${counts.live})` : ""}`,
              value: "live",
            },
            {
              label: `Paused${
                counts.paused != null ? ` (${counts.paused})` : ""
              }`,
              value: "paused",
            },
            {
              label: `Drafts${
                counts.draft != null ? ` (${counts.draft})` : ""
              }`,
              value: "draft",
            },
          ]}
        />

        <div className="relative flex-1 min-w-[220px]">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search text or tokens (e.g. status:live minviews:100)"
            aria-label="Search products"
            className="w-full pl-9 pr-8 py-2 rounded-lg border bg-white dark:bg-gray-900"
          />
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchInput ? (
            <button
              aria-label="Clear search"
              onClick={() => setSearchInput("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        <Segmented
          ariaLabel="Date window"
          value={dateWindow}
          onChange={setDateWindow}
          options={[
            { label: "Last 7 days", value: "7d" },
            { label: "30 days", value: "30d" },
            { label: "All time", value: "all" },
          ]}
        />
      </div>

      {/* Row 3 — density + view (hidden on mobile) + tools */}
      <div className="px-4 sm:px-5 pb-3 flex flex-wrap items-center gap-2">
        {/* Hide density + view on mobile; they’ll appear under More */}
        <Segmented
          ariaLabel="Density"
          value={density}
          onChange={setDensity}
          className="hidden sm:inline-flex"
          options={[
            { label: "Comfortable", value: "comfortable" },
            { label: "Cozy", value: "cozy" },
            { label: "Compact", value: "compact" },
          ]}
        />
        <Segmented
          ariaLabel="View mode"
          value={view}
          onChange={setView}
          className="hidden sm:inline-flex"
          options={[
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <MonitorSmartphone className="w-4 h-4" />
                  Auto
                </span>
              ),
              value: "auto",
            },
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <TableIcon className="w-4 h-4" />
                  Table
                </span>
              ),
              value: "table",
            },
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <LayoutGrid className="w-4 h-4" />
                  Card
                </span>
              ),
              value: "card",
            },
          ]}
        />

        {/* Tools / More: mobile menu */}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative sm:hidden" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              More
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-[270px] rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-lg overflow-hidden z-10">
                {/* View group */}
                <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  View
                </div>
                <div className="px-3 pb-3">
                  <Segmented
                    ariaLabel="View mode (mobile)"
                    value={view}
                    onChange={(v) => {
                      setView(v);
                      setToolsOpen(false);
                    }}
                    options={[
                      {
                        label: (
                          <span className="inline-flex items-center gap-1">
                            <MonitorSmartphone className="w-4 h-4" />
                            Auto
                          </span>
                        ),
                        value: "auto",
                      },
                      {
                        label: (
                          <span className="inline-flex items-center gap-1">
                            <TableIcon className="w-4 h-4" />
                            Table
                          </span>
                        ),
                        value: "table",
                      },
                      {
                        label: (
                          <span className="inline-flex items-center gap-1">
                            <LayoutGrid className="w-4 h-4" />
                            Card
                          </span>
                        ),
                        value: "card",
                      },
                    ]}
                  />
                </div>

                {/* Density group */}
                <div className="px-3 pt-1 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Density
                </div>
                <div className="px-3 pb-3">
                  <Segmented
                    ariaLabel="Density (mobile)"
                    value={density}
                    onChange={(d) => {
                      setDensity(d);
                      setToolsOpen(false);
                    }}
                    options={[
                      { label: "Comfortable", value: "comfortable" },
                      { label: "Cozy", value: "cozy" },
                      { label: "Compact", value: "compact" },
                    ]}
                  />
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Actions */}
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setToolsOpen(false);
                    onColumnsClick?.();
                  }}
                >
                  Columns
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setToolsOpen(false);
                    onAutoFix?.();
                  }}
                >
                  Auto-Fix
                </button>
              </div>
            )}
          </div>

          {/* Desktop: plain buttons */}
          <button
            type="button"
            onClick={onColumnsClick}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Columns
          </button>
          <button
            type="button"
            onClick={onAutoFix}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Auto-Fix
          </button>
        </div>
      </div>

      {/* Meta line on mobile */}
      <div
        className="sm:hidden px-4 sm:px-5 pb-3 text-xs text-gray-600 dark:text-gray-300"
        aria-live="polite"
      >
        <span>{meta?.count ?? 0} in view</span>
        <span className="mx-1.5">•</span>
        <span className="inline-flex items-center gap-1">
          Metrics{" "}
          {meta?.statsBusy ? (
            <>
              updating… <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </>
          ) : (
            <>updated {timeAgo(meta?.updatedAt)}</>
          )}
        </span>
      </div>
    </div>
  );
}