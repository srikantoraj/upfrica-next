// app/(pages)/new-dashboard/products/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import ProductsHeader from "@/components/new-dashboard/products/ProductsHeader";
import ProductListResponsive from "@/components/new-dashboard/products/ProductListResponsive";

// SSR-safe helper for localStorage reads
const fromLS = (key, fallback) =>
  typeof window === "undefined" ? fallback : localStorage.getItem(key) || fallback;

// SSR-safe media query
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

export default function ProductsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URL-driven pieces
  const [filter, setFilter] = useState(sp.get("tab") || "all"); // all|live|paused|draft
  const [searchInput, setSearchInput] = useState(sp.get("q") || "");

  // local prefs
  const [dateWindow, setDateWindow] = useState(() => fromLS("prod.window", "7d")); // 7d|30d|all
  const [density, setDensity]     = useState(() => fromLS("prod.density", "cozy")); // comfortable|cozy|compact
  const [view, setView]           = useState(() => fromLS("prod.view", "auto"));    // auto|table|card

  // meta bubble (optional)
  const [meta, setMeta] = useState({ count: 0, statsBusy: false, updatedAt: null });

  // persist prefs
  useEffect(() => localStorage.setItem("prod.density", density), [density]);
  useEffect(() => localStorage.setItem("prod.view", view), [view]);
  useEffect(() => localStorage.setItem("prod.window", dateWindow), [dateWindow]);

  // reflect in URL (shareable state)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter && filter !== "all") params.set("tab", filter);
    if (searchInput.trim()) params.set("q", searchInput.trim());
    router.replace(params.toString() ? `?${params}` : "?", { scroll: false });
  }, [filter, searchInput, router]);

  // === Auto-switch to cards on small screens unless user picked a view this session ===
  const isSmall = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    // If a previous session saved "table", override to "auto" on mobile
    if (isSmall && view === "table") {
      setView("auto"); // this also updates localStorage via the effect above
    }
  }, [isSmall, view]);

  return (
    <RoleGuard allowed={["seller"]} requirePlan>
      <div className="space-y-6 py-0">
        <ProductsHeader
          filter={filter}
          setFilter={setFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          dateWindow={dateWindow}
          setDateWindow={setDateWindow}
          density={density}
          setDensity={setDensity}
          view={view}
          setView={setView}
          meta={meta}
          onColumnsClick={() =>
            window.dispatchEvent(new CustomEvent("upfrica:columns-open"))
          }
          onAutoFix={() =>
            window.dispatchEvent(new CustomEvent("upfrica:autofix-open"))
          }
          onAdd={() => router.push("/new-dashboard/products/new")}
        />

        {/* Auto = cards on mobile, table on desktop (manual override still respected) */}
        <ProductListResponsive
          view={view}
          filter={filter}
          query={searchInput}
          metricWindow={dateWindow}
          density={density}
          onMeta={setMeta}
        />
      </div>
    </RoleGuard>
  );
}