// src/components/new-dashboard/products/ProductListResponsive.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import ProductListTable from "./ProductListTable";
import ProductListCards from "./ProductListCards";

// SSR-safe media query hook (unchanged)
function useMediaQuery(query) {
  const get = () =>
    typeof window !== "undefined" && "matchMedia" in window
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(get);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

// tiny util for "updated X ago"
const timeAgo = (d) => {
  if (!d) return "";
  const ts = typeof d === "string" ? new Date(d).getTime() : d.getTime?.() ?? d;
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

export default function ProductListResponsive(props) {
  const { view = "auto", metricWindow } = props; // "auto" | "table" | "card"

  // meta reported by the active child
  const [meta, setMeta] = useState(null);
  // wipe any stale meta when filters/search change
  useEffect(() => setMeta(null), [props.filter, props.query]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isSmall = useMediaQuery("(max-width: 1023px)");
  const showCards = view === "card" || (view === "auto" && mounted && isSmall);
  const showTable = view === "table" || !showCards;

  return (
    <>
      {/* shared meta bar – only shows when the child reports something */}
      {meta ? (
        <div className="px-6 pt-3 text-[13px] text-gray-500 dark:text-gray-400">
          <span className="whitespace-nowrap">{meta.count ?? 0} in view</span>
          <span className="mx-1.5">•</span>
          <span className="whitespace-nowrap">
            Metrics window: <strong>{metricWindow}</strong>
          </span>
          {meta.statsBusy ? (
            <>
              <span className="mx-1.5">•</span>
              <span>updating…</span>
            </>
          ) : meta.updatedAt ? (
            <>
              <span className="mx-1.5">•</span>
              <span>updated {timeAgo(meta.updatedAt)}</span>
            </>
          ) : null}
        </div>
      ) : null}

      {showTable ? (
        <ProductListTable {...props} onMeta={setMeta} />
      ) : (
        <ProductListCards {...props} onMeta={setMeta} />
      )}
    </>
  );
}