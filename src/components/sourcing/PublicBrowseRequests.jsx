// src/components/sourcing/PublicBrowseRequests.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import clsx from "clsx";
import { listOpenRequests, listPublicOpenRequests } from "@/lib/sourcing/api";
import OfferComposeModal from "@/components/new-dashboard/sourcing/OfferComposeModal";
import { useAuth } from "@/contexts/AuthContext";

/* Bottom sheet editor (client-only) */
const OfferEditSheet = dynamic(
  () => import("@/components/new-dashboard/sourcing/OfferEditSheet"),
  { ssr: false }
);

/* Brand colors (hex with alpha) */
const BRAND_PURPLE = "#8710D8";
const BRAND_PURPLE_50 = "#8710D880";

/* utils */
const CC_LABELS = {
  gh: "Ghana",
  ng: "Nigeria",
  ke: "Kenya",
  tz: "Tanzania",
  ug: "Uganda",
  rw: "Rwanda",
  uk: "United Kingdom",
  us: "United States",
};
const ALL_CC = ["gh", "ng", "ke", "tz", "ug", "rw", "uk", "us"];
const CURRENCIES = ["GHS", "NGN", "KES", "TZS", "UGX", "RWF", "USD", "GBP", "EUR"];
const PAGE_SIZE = 12;

const sym = (c) =>
  (
    {
      GHS: "₵",
      NGN: "₦",
      KES: "KSh",
      TZS: "TSh",
      UGX: "USh",
      RWF: "FRw",
      GBP: "£",
      USD: "$",
      EUR: "€",
    }[String(c).toUpperCase()] || ""
  );
const fmtMoney = (n, c) =>
  n == null || n === ""
    ? null
    : (() => {
        try {
          return new Intl.NumberFormat(undefined, { style: "currency", currency: c }).format(Number(n));
        } catch {
          return `${sym(c)}${Number(n).toLocaleString()}`;
        }
      })();
const fmtRange = (a, b, c) => {
  const x = fmtMoney(a, c),
    y = fmtMoney(b, c);
  return x && y ? `${x} – ${y}` : x || y || "—";
};
const daysLeft = (d) => {
  if (!d) return null;
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return Math.ceil((e - new Date()) / 86400000);
};
const codeOf = (r) => {
  const raw = r?.public_id || r?.uid || r?.id;
  if (!raw) return "RQ-??????";
  const s = String(raw);
  const base = /^\d+$/.test(s)
    ? Number(s).toString(36).toUpperCase()
    : s.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `RQ-${base.padStart(6, "0").slice(-6)}`;
};

/* params builder */
function truthy(v) {
  return ["1", "true", "yes", "on"].includes(String(v || "").toLowerCase());
}
function buildParams({ page, q, country, sort, city, currency, cat, minBudget, maxBudget, hasMedia, maxDays }) {
  const p = {
    page,
    page_size: PAGE_SIZE,
    status: "open",
    ordering: sort === "budget_hi" ? "-budget_max" : sort === "ending" ? "deadline" : "-created_at",
    public: "1", // guest-safe; we will strip it for authed calls
  };
  if (q) p.q = q;
  if (country) p.deliver_to_country = String(country).trim().toLowerCase();
  if (city) p.city = city;
  if (currency) p.currency = currency;
  if (cat) p.category = cat; // accepts slug or id, comma-separated
  if (minBudget) p.min_budget = String(minBudget);
  if (maxBudget) p.max_budget = String(maxBudget);
  if (truthy(hasMedia)) p.has_media = "1";
  if (maxDays) p.max_days = String(maxDays);
  return p;
}

/* remove the `public` flag when authed */
function stripPublic(params) {
  if (!params) return params;
  const p = { ...params };
  delete p.public;
  return p;
}

/* parse DRF `next` into params we can pass back to our proxy */
function parseNextParams(nextUrl) {
  try {
    if (!nextUrl) return null;
    const u = new URL(nextUrl);
    const sp = new URLSearchParams(u.search);
    const out = {};
    for (const k of [
      "page",
      "page_size",
      "status",
      "ordering",
      "q",
      "search",
      "deliver_to_country",
      "city",
      "currency",
      "category",
      "min_budget",
      "max_budget",
      "has_media",
      "max_days",
      "public",
    ]) {
      if (sp.has(k)) out[k] = sp.get(k);
    }
    return out;
  } catch {
    return null;
  }
}

/* simple numeric input */
function NumberInput(props) {
  return (
    <input
      {...props}
      inputMode="numeric"
      pattern="[0-9]*"
      className={clsx(
        "h-9 w-full rounded-md border px-2 text-sm bg-white dark:bg-neutral-900",
        "border-neutral-300 dark:border-neutral-700",
        "focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF]"
      )}
    />
  );
}

function FacetPanel({
  q,
  setQ,
  country,
  setCountry,
  city,
  setCity,
  currency,
  setCurrency,
  cat,
  setCat,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  hasMedia,
  setHasMedia,
  maxDays,
  setMaxDays,
  onClose,
}) {
  const inputClass =
    "h-9 w-full rounded-md border bg-white dark:bg-neutral-900 px-2 text-sm " +
    "border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF]";

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      <div>
        <label className="block text-xs font-medium mb-1">Search</label>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter requests…"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
            <option value="">All</option>
            {ALL_CC.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()} · {CC_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
            <option value="">Any</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Accra, Lagos…" className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Category (slug or id)</label>
        <input
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          placeholder="phones, laptops or 81"
          className={inputClass}
        />
        <p className="mt-1 text-[11px] text-neutral-500">Use commas for multiple.</p>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Budget range</label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput placeholder="Min" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} />
          <NumberInput placeholder="Max" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#1E5BFF]"
            checked={hasMedia}
            onChange={(e) => setHasMedia(e.target.checked)}
          />
          With images only
        </label>

        <div>
          <label className="block text-xs font-medium mb-1">Ending within</label>
          <select value={maxDays} onChange={(e) => setMaxDays(e.target.value)} className={inputClass}>
            <option value="">Any time</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-1 h-9 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] bg-[#1E5BFF] hover:bg-[#1246CA]"
        >
          Apply filters
        </button>
      )}
    </div>
  );
}

/* ---------- viewer-offer meta (robust) ---------- */
/* Returns { mine: boolean, offerId: number|null } */
function viewerOfferMeta(r, userId) {
  if (!r) return { mine: false, offerId: null };

  // Direct fields commonly used
  const directId =
    r.viewer_offer_id ?? r.my_offer_id ?? r.offer_id_by_viewer ?? r.viewer_offer?.id ?? null;
  if (directId != null) return { mine: true, offerId: Number(directId) || null };

  // Booleans indicating presence
  const hasBool =
    r.viewer_has_offered || r.viewer_has_offer || r.has_my_offer || r.has_offer_by_me;
  if (hasBool) return { mine: true, offerId: null };

  // Count fields
  if (typeof r.offers_by_me_count === "number" && r.offers_by_me_count > 0) {
    return { mine: true, offerId: null };
  }

  // Inline offers array in various shapes
  const arr = r.my_offers || r.offers_by_viewer || r.viewer_offers || r.offers || [];
  if (Array.isArray(arr) && arr.length) {
    const mineOffer =
      arr.find((o) =>
        [o.submitter_id, o.user_id, o.agent_id, o.owner_id].some(
          (k) => Number(k) === Number(userId)
        )
      ) || arr.find((o) => o.is_mine || o.by_viewer);
    if (mineOffer) return { mine: true, offerId: Number(mineOffer.id) || null };
  }

  return { mine: false, offerId: null };
}

export default function PublicBrowseRequests({ cc = "gh", initialCount = null }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { hydrated, user } = useAuth();
  const authed = hydrated && !!user;

  // guard to prevent re-open while URL param is being cleared
  const closingRef = useRef(false);

  // top bar filters
  const [q, setQ] = useState(sp.get("q") || "");
  const [country, setCountry] = useState(sp.get("country") || cc);
  const [sort, setSort] = useState(sp.get("sort") || "new"); // new | budget_hi | ending

  // advanced facets
  const [city, setCity] = useState(sp.get("city") || "");
  const [currency, setCurrency] = useState(sp.get("currency") || "");
  const [cat, setCat] = useState(sp.get("category") || "");
  const [minBudget, setMinBudget] = useState(sp.get("min_budget") || "");
  const [maxBudget, setMaxBudget] = useState(sp.get("max_budget") || "");
  const [hasMedia, setHasMedia] = useState(
    ["1", "true", "yes", "on"].includes((sp.get("has_media") || "").toLowerCase())
  );
  const [maxDays, setMaxDays] = useState(sp.get("max_days") || "");

  // data
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // pagination helpers
  const [nextParams, setNextParams] = useState(null);
  const inFlight = useRef(null); // AbortController for filter changes
  const loadingMoreRef = useRef(false); // de-dupe

  // compose (new) modal
  const [picked, setPicked] = useState(null);

  // edit (bottom sheet) modal
  const [editOfferId, setEditOfferId] = useState(null);
  const [editRequest, setEditRequest] = useState(null);

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sentinelRef = useRef(null);

  // when auth flips (guest → authed), clear stale public rows
  useEffect(() => {
    setRows([]);
    setPage(1);
    setHasMore(false);
    setNextParams(null);
  }, [authed]);

  // sync URL
// sync URL
useEffect(() => {
  // Start from current URL to preserve unrelated params like ?quote and ?edit_offer
  const params = new URLSearchParams(sp?.toString() || "");
  const setOrDel = (k, v) => {
    if (v != null && String(v) !== "") params.set(k, String(v));
    else params.delete(k);
  };

  setOrDel("q", q);
  setOrDel("country", country);
  setOrDel("sort", sort && sort !== "new" ? sort : "");
  setOrDel("city", city);
  setOrDel("currency", currency);
  setOrDel("category", cat);
  setOrDel("min_budget", minBudget);
  setOrDel("max_budget", maxBudget);
  hasMedia ? params.set("has_media", "1") : params.delete("has_media");
  setOrDel("max_days", maxDays);

  // IMPORTANT: do NOT touch 'quote' or 'edit_offer' here
  router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [q, country, sort, city, currency, cat, minBudget, maxBudget, hasMedia, maxDays]);

  // fetch page 1 (abortable & sets next cursor)
  useEffect(() => {
    let alive = true;

    if (inFlight.current) inFlight.current.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const baseParams = buildParams({
          page: 1,
          q,
          country,
          sort,
          city,
          currency,
          cat,
          minBudget,
          maxBudget,
          hasMedia,
          maxDays,
        });

        const params = authed ? stripPublic(baseParams) : baseParams;

        const data = authed
          ? await listOpenRequests(params, { signal: ctrl.signal })
          : await listPublicOpenRequests(params, { signal: ctrl.signal });

        const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        if (!alive) return;

        setRows(items);
        setPage(1);

        const np = parseNextParams(data?.next);
        setNextParams(authed ? stripPublic(np) : np);

        setHasMore(Boolean(data?.next) || items.length === PAGE_SIZE);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (alive) setError("Failed to load requests.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, country, sort, city, currency, cat, minBudget, maxBudget, hasMedia, maxDays, authed]);

  // load more (uses DRF next when available)
  async function loadMore() {
    if (!hasMore || loadingMoreRef.current || loadingMore) return;
    setLoadingMore(true);
    loadingMoreRef.current = true;

    try {
      const nextBase =
        nextParams ||
        buildParams({
          page: page + 1,
          q,
          country,
          sort,
          city,
          currency,
          cat,
          minBudget,
          maxBudget,
          hasMedia,
          maxDays,
        });

      const params = authed ? stripPublic(nextBase) : nextBase;

      const data = authed ? await listOpenRequests(params) : await listPublicOpenRequests(params);

      const items = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

      setRows((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        return [...prev, ...items.filter((x) => !seen.has(x.id))];
      });

      setPage((p) => p + 1);

      const np = parseNextParams(data?.next);
      setNextParams(authed ? stripPublic(np) : np);

      setHasMore(Boolean(data?.next) || items.length === PAGE_SIZE);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }

  // infinite scroll
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, page, rows.length]);

  // deep-link: compose modal (?quote=)
  const spHook = useSearchParams(); // stable ref for modal params
  useEffect(() => {
    if (closingRef.current) return; // ignore while we’re updating the URL

    // Quote deep-link
    const qid = spHook.get("quote");
    if (!qid) {
      if (picked) setPicked(null);
    } else if (!picked || String(picked.id) !== qid) {
      const found = rows.find(
        (r) => String(r.id) === qid || String(r.public_id) === qid || String(r.uid) === qid
      );
      if (found) setPicked(found);
    }

    // Edit deep-link
    const eid = spHook.get("edit_offer");
    if (!eid) {
      if (editOfferId) setEditOfferId(null);
    } else if (!editOfferId || String(editOfferId) !== eid) {
      // Try to attach the matching request row (optional)
      const rowForEdit =
        rows.find((r) => Number(r.viewer_offer_id) === Number(eid)) ||
        rows.find((r) => (r.my_offers || []).some((o) => Number(o.id) === Number(eid)));
      setEditRequest(rowForEdit || null);
      setEditOfferId(Number(eid));
    }
  }, [spHook, rows, picked, editOfferId]);

  function openQuote(r) {
    const params = new URLSearchParams(sp?.toString() || "");
    params.set("quote", String(r.id));
    const nextUrl = `${pathname}?${params.toString()}`;
    if (!authed) return router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    setPicked(r);
    router.replace(nextUrl, { scroll: false });
  }

  function openEditOffer(r, offerId) {
    if (!authed) {
      const params = new URLSearchParams(sp?.toString() || "");
      const nextUrl = `${pathname}${params.size ? `?${params.toString()}` : ""}`;
      return router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    }

    // If we don't have a concrete ID, fallback to the page route
    if (!offerId) {
      return router.push(`/new-dashboard/offers?request=${r.id}`);
    }

    const params = new URLSearchParams(sp?.toString() || "");
    params.set("edit_offer", String(offerId));
    setEditRequest(r);
    setEditOfferId(offerId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function goToMyOffer(r, offerId) {
    // Fallback helper (kept for reuse)
    if (offerId) return router.push(`/new-dashboard/offers/${offerId}`);
    return router.push(`/new-dashboard/offers?request=${r.id}`);
  }

  function closeQuote() {
    closingRef.current = true;
    setPicked(null);

    const params = new URLSearchParams(sp?.toString() || "");
    params.delete("quote");
    router.replace(params.size ? `?${params.toString()}` : "", { scroll: false });

    setTimeout(() => {
      closingRef.current = false;
    }, 120);
  }

  function closeEditSheet() {
    closingRef.current = true;
    setEditOfferId(null);
    setEditRequest(null);

    const params = new URLSearchParams(sp?.toString() || "");
    params.delete("edit_offer");
    router.replace(params.size ? `?${params.toString()}` : "", { scroll: false });

    setTimeout(() => {
      closingRef.current = false;
    }, 120);
  }

  // after creating a new offer, flip the row locally and bump counts
  function handleOfferCreated(newOffer) {
    const reqId =
      newOffer?.request_id || newOffer?.request || newOffer?.requestId || picked?.id;

    setRows((prev) =>
      prev.map((row) =>
        String(row.id) === String(reqId)
          ? {
              ...row,
              viewer_offer_id: newOffer?.id ?? row.viewer_offer_id,
              has_my_offer: true,
              offers_by_me_count: Math.max(1, row.offers_by_me_count || 0),
              offers_count: (row.offers_count || 0) + 1,
            }
          : row
      )
    );

    closeQuote();
  }

  const totalActive = useMemo(
    () => rows.filter((r) => (daysLeft(r?.deadline) ?? 1) >= 0).length,
    [rows]
  );

  return (
    <section className="space-y-3">
      {/* Top bar */}
      <div
        className={clsx(
          "sticky top-[var(--sticky-top,0px)] z-10 rounded-xl border bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-2",
          "border-[#8710D8CC] shadow-[0_1px_0_0_rgba(135,16,216,0.10)]"
        )}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search requests…"
            className="h-10 w-full md:flex-1 rounded-lg border bg-white dark:bg-neutral-900 px-3 text-sm
                       border-neutral-300 dark:border-neutral-700
                       focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF]"
          />
          {/* mobile filter trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden h-10 rounded-lg border px-3 text-sm bg-white dark:bg-neutral-900
                       border-[#8710D8CC] text-[color:#8710D8] hover:bg-[color:#8710D880]
                       focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]"
          >
            Filters
          </button>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="hidden md:block h-10 rounded-lg border bg-white dark:bg-neutral-900 px-3 text-sm
                       border-neutral-300 dark:border-neutral-700
                       focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF]"
          >
            {[country, ...ALL_CC.filter((x) => x !== country)].map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()} · {CC_LABELS[c] || c.toUpperCase()}
              </option>
            ))}
            <option value="">All countries</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg border bg-white dark:bg-neutral-900 px-3 text-sm
                       border-neutral-300 dark:border-neutral-700
                       focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF]"
          >
            <option value="new">Newest</option>
            <option value="budget_hi">Budget (high → low)</option>
            <option value="ending">Ending soon</option>
          </select>
        </div>
        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {(rows.length || initialCount || 0)} total • {totalActive} active
        </div>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <FacetPanel
              q={q}
              setQ={setQ}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              currency={currency}
              setCurrency={setCurrency}
              cat={cat}
              setCat={setCat}
              minBudget={minBudget}
              setMinBudget={setMinBudget}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              hasMedia={hasMedia}
              setHasMedia={setHasMedia}
              maxDays={maxDays}
              setMaxDays={setMaxDays}
            />
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9">
          {error && (
            <div className="mb-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {loading &&
              Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden ring-1 ring-[rgba(135,16,216,0.10)]"
                >
                  <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-neutral-700/30 to-transparent" />
                </div>
              ))}

            {!loading &&
              rows.map((r) => {
                const dleft = daysLeft(r?.deadline);
                const late = dleft != null && dleft < 0;
                const code = codeOf(r);
                const cur = (r?.currency || "GHS").toUpperCase();
                const offersCount = r?.offers_count ?? 0;

                const { mine, offerId } = authed ? viewerOfferMeta(r, user?.id) : { mine: false, offerId: null };

                return (
                  <article
                    key={r.id}
                    className={clsx(
                      "group relative overflow-hidden rounded-2xl border p-4 bg-white dark:bg-neutral-900",
                      "border-neutral-200 dark:border-neutral-800",
                      "hover:ring-1 hover:ring-[rgba(135,16,216,0.25)] transition-shadow"
                    )}
                  >
                    <div className="mb-3">
                      {dleft == null ? (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                          No deadline
                        </span>
                      ) : late ? (
                        <span className="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-xs text-rose-700 dark:text-rose-300">
                          Deadline passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                          {dleft}d left
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">{r.title}</h3>

                      {/* CTA: Quote vs Edit */}
                      <button
                        type="button"
                        onClick={() => (mine ? openEditOffer(r, offerId) : openQuote(r))}
                        disabled={late}
                        className={clsx(
                          "shrink-0 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2",
                          late
                            ? "bg-neutral-300 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                            : mine
                            ? "text-neutral-700 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600 focus:ring-neutral-400"
                            : "text-white bg-[#1E5BFF] hover:bg-[#1246CA] focus:ring-[#1E5BFF] dark:text-neutral-900 dark:bg-white dark:hover:bg-neutral-200"
                        )}
                        title={late ? "Deadline passed" : mine ? "Edit your offer" : "Send quote"}
                      >
                        {mine ? "Edit offer" : "Quote"}
                      </button>
                    </div>

                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {r.deliver_to_city ? `${r.deliver_to_city}, ` : ""}
                      {(r.deliver_to_country || "").toUpperCase()} • {(r.currency || "").toUpperCase()}
                    </div>

                    <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                      {fmtRange(r.budget_min, r.budget_max, cur)}
                    </div>

                    {r.specs?.details && (
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{r.specs.details}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                          {code}
                        </span>
                        {mine && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                            You offered
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                        {offersCount} {offersCount === 1 ? "offer" : "offers"}
                      </span>
                    </div>
                  </article>
                );
              })}

            {!loading && !rows.length && !error && (
              <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-neutral-600 dark:text-neutral-400">
                No open requests match your filters.
              </div>
            )}
          </div>

          <div ref={sentinelRef} />

          {!loading && hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={clsx(
                  "rounded-lg border px-4 py-2 text-sm",
                  "bg-white dark:bg-neutral-900",
                  "border-[#8710D8CC] text-[color:#8710D8] hover:bg-[color:#8710D880]",
                  "focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] disabled:opacity-60"
                )}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            onClick={() => setDrawerOpen(false)}
            style={{ background: BRAND_PURPLE_50 }}
          />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-white dark:bg-neutral-900 shadow-xl border-l border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between px-4 h-12 border-b border-neutral-200 dark:border-neutral-800">
              <div className="font-medium">Filters</div>
              <button onClick={() => setDrawerOpen(false)} className="text-sm opacity-70 hover:opacity-100">
                Close
              </button>
            </div>
            <FacetPanel
              q={q}
              setQ={setQ}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              currency={currency}
              setCurrency={setCurrency}
              cat={cat}
              setCat={setCat}
              minBudget={minBudget}
              setMinBudget={setMinBudget}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              hasMedia={hasMedia}
              setHasMedia={setHasMedia}
              maxDays={maxDays}
              setMaxDays={setMaxDays}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Compose (new) modal */}
      {picked && authed && (
        <OfferComposeModal
          request={picked}
          onClose={closeQuote}
          onCreated={handleOfferCreated}
        />
      )}

      {/* Edit (bottom sheet) modal */}
      {editOfferId && authed && (
        <OfferEditSheet
          offerId={editOfferId}
          request={editRequest || undefined}
          onClose={closeEditSheet}
          // optional callbacks:
          onUpdated={() => {
            // No list fields depend on offer body right now; keep simple.
            closeEditSheet();
          }}
          onWithdrawn={() => {
            // If you want: mark row as not mine anymore.
            setRows((prev) =>
              prev.map((row) =>
                editRequest && String(row.id) === String(editRequest.id)
                  ? { ...row, viewer_offer_id: null, has_my_offer: false, offers_by_me_count: 0 }
                  : row
              )
            );
            closeEditSheet();
          }}
        />
      )}
    </section>
  );
}