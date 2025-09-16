"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

// ---- helpers ---------------------------------------------------------------
const PAGE_SIZE = 12;
const sym = (c) =>
  ({
    GHS: "₵",
    NGN: "₦",
    KES: "KSh",
    TZS: "TSh",
    UGX: "USh",
    RWF: "FRw",
    GBP: "£",
    USD: "$",
    EUR: "€",
  }[String(c).toUpperCase()] || "");

const fmtMoney = (n, c) =>
  n == null || n === ""
    ? null
    : (() => {
        try {
          return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: c,
          }).format(Number(n));
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

// Tries multiple “mine” endpoints; returns {results, next}
async function fetchMine(params, { signal } = {}) {
  const search = new URLSearchParams({
    page_size: String(PAGE_SIZE),
    ordering: "-created_at",
    ...params,
  }).toString();

  const candidates = [
    `/api/sourcing/my/requests/?${search}`,
    `/api/sourcing/requests/?mine=1&${search}`,
    `/api/sourcing/requests/?buyer=me&${search}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { signal, credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data?.results) || Array.isArray(data)) {
        return {
          results: Array.isArray(data?.results) ? data.results : data,
          next: data?.next || null,
        };
      }
    } catch (e) {
      if (e?.name === "AbortError") throw e;
      // try next candidate
    }
  }
  return { results: [], next: null };
}

// ---- component -------------------------------------------------------------
export default function MyRequests() {
  const { hydrated, user } = useAuth();
  const authed = hydrated && !!user;

  const [q, setQ] = useState("");
  const [status, setStatus] = useState(""); // "", "open", "closed", "awarded"
  const [sort, setSort] = useState("new"); // "new" | "ending" | "budget_hi"

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [nextParams, setNextParams] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const inFlight = useRef(null);
  const sentinelRef = useRef(null);

  // build params for our fetcher
  const buildParams = () => {
    const p = {};
    if (q) p.q = q;
    if (status) p.status = status;
    if (sort === "budget_hi") p.ordering = "-budget_max";
    else if (sort === "ending") p.ordering = "deadline";
    // default ordering is set in fetchMine
    return p;
  };

  // page 1
  useEffect(() => {
    let alive = true;

    if (inFlight.current) inFlight.current.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;

    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!authed) {
          setRows([]);
          setHasMore(false);
          return;
        }

        const { results, next } = await fetchMine(
          { page: 1, ...buildParams() },
          { signal: ctrl.signal }
        );

        if (!alive) return;
        setRows(results);
        setPage(1);
        setHasMore(Boolean(next) || results.length === PAGE_SIZE);
        setNextParams(parseNextParams(next));
      } catch (e) {
        if (e?.name !== "AbortError") setError("Failed to load your requests.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, sort, authed]);

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const params =
        nextParams ??
        { page: page + 1, ...buildParams() };

      const { results, next } = await fetchMine(params);

      setRows((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        return [...prev, ...results.filter((x) => !seen.has(x.id))];
      });
      setPage((p) => p + 1);
      setHasMore(Boolean(next) || results.length === PAGE_SIZE);
      setNextParams(parseNextParams(next));
    } finally {
      setLoadingMore(false);
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

  const totalActive = useMemo(
    () => rows.filter((r) => (daysLeft(r?.deadline) ?? 1) >= 0).length,
    [rows]
  );

  // ---- UI ------------------------------------------------------------------

  const skeletons = Array.from({ length: 6 });

  return (
    <section className="space-y-3">
      {/* Brand bar (purple → blue) */}
      <div
        className="rounded-xl p-3 sm:p-4 text-sm text-neutral-800 dark:text-neutral-100 border border-[#8710D8]/20 dark:border-[#8710D8]/30"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #8710D880, #8710D8CC 55%, #1E5BFF 100%)",
        }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search my requests…"
            className="h-10 w-full md:flex-1 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          >
            <option value="">All status</option>
            <option value="open">Open</option>
            <option value="awarded">Awarded</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-lg bg-white/90 dark:bg-neutral-900/80 backdrop-blur px-3 text-sm border border-white/50 dark:border-neutral-700"
          >
            <option value="new">Newest</option>
            <option value="ending">Ending soon</option>
            <option value="budget_hi">Budget (high → low)</option>
          </select>
        </div>
        <div className="mt-1 text-xs text-neutral-700/90 dark:text-neutral-300">
          {(rows.length || 0)} shown • {totalActive} active
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={`sk-${i}`}
              className="h-40 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-neutral-200/60 dark:via-neutral-700/30 to-transparent" />
            </div>
          ))}

        {!loading &&
          rows.map((r) => {
            const dleft = daysLeft(r?.deadline);
            const late = dleft != null && dleft < 0;
            const code = codeOf(r);
            const cur = (r?.currency || "GHS").toUpperCase();
            const offersCount = r?.offers_count ?? 0;

            const detailHref = `/new-dashboard/requests/${r.id}`;

            return (
              <article
                key={r.id}
                className={clsx(
                  "group relative overflow-hidden rounded-2xl border p-4",
                  "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
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
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {r.title}
                  </h3>

                  <Link
                    href={detailHref}
                    className={clsx(
                      "shrink-0 rounded-lg px-3 py-1.5 text-sm",
                      "bg-[#1E5BFF] text-white hover:bg-[#1246CA]"
                    )}
                    title="View offers"
                  >
                    Offers ({offersCount})
                  </Link>
                </div>

                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {r.deliver_to_city ? `${r.deliver_to_city}, ` : ""}
                  {(r.deliver_to_country || "").toUpperCase()} •{" "}
                  {(r.currency || "").toUpperCase()}
                </div>

                <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                  {fmtRange(r.budget_min, r.budget_max, cur)}
                </div>

                {r.specs?.details && (
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {r.specs.details}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                    {code}
                  </span>

                  <Link
                    href={detailHref}
                    className="text-sm text-[#1E5BFF] hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </article>
            );
          })}

        {!loading && !rows.length && !error && (
          <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center text-neutral-600 dark:text-neutral-400">
            You haven’t posted any requests yet.
            <div className="mt-3">
              <Link
                href="/new-dashboard/sourcing"
                className="inline-flex items-center rounded-lg bg-[#8710D8] text-white px-4 py-2 text-sm hover:bg-[#6b0db1]"
              >
                Post a Request
              </Link>
            </div>
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
              "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-60"
            )}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}