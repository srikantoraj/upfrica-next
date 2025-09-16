"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AgentShell from "@/components/new-dashboard/AgentShell";
import axios from "@/lib/axiosInstance";
import {
  Handshake, Globe, Filter, Coins, ExternalLink, BookmarkPlus, BookmarkCheck,
  EyeOff, Calendar, MapPin, Images, ChevronLeft, ChevronRight, Clock
} from "lucide-react";

/* ---------- helpers ---------- */
const CTRY_LABEL = {
  gh: "Ghana", ng: "Nigeria", ke: "Kenya", tz: "Tanzania", ug: "Uganda",
  rw: "Rwanda", uk: "United Kingdom", gb: "United Kingdom"
};
const CTRY_CURR  = { gh: "GHS", ng: "NGN", ke: "KES", tz: "TZS", ug: "UGX", rw: "RWF", uk: "GBP", gb: "GBP" };
const CURR_SYMBOL = { USD:"$", EUR:"€", GBP:"£", GHS:"₵", NGN:"₦", KES:"KSh", TZS:"TSh", UGX:"USh", RWF:"FRw", ZAR:"R" };

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const toInt = (v, d=1) => Number.isFinite(+v) ? +v : d;
const fmt = (n) => (n ?? n === 0) ? new Intl.NumberFormat().format(n) : "—";
const sym = (ccy) => CURR_SYMBOL[(ccy || "").toUpperCase()] || (ccy || "").toUpperCase();

function ageLabel(iso) {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60*60*1000) return `${Math.max(1, Math.floor(ms/60000))}m`;
  if (ms < 24*60*60*1000) return `${Math.floor(ms/3600000)}h`;
  return `${Math.floor(ms/86400000)}d`;
}
const isNew = (iso) => iso && (Date.now() - new Date(iso).getTime() < 24*3600*1000);

function deadlineInfo(iso) {
  if (!iso) return null;
  const now = Date.now();
  const due = new Date(iso).getTime();
  const diffMs = due - now;
  const dayMs = 24*3600*1000;

  if (diffMs < -dayMs) {
    const days = Math.abs(Math.floor(diffMs / dayMs));
    return { label: `Overdue ${days}d`, tone: "danger" };
  }
  if (diffMs < 0) return { label: "Due today", tone: "warn" };

  const days = Math.ceil(diffMs / dayMs);
  if (days <= 1) return { label: "Due tomorrow", tone: "warn" };
  if (days <= 3) return { label: `Due in ${days}d`, tone: "warn" };
  return { label: `Due in ${days}d`, tone: "neutral" };
}

function detailsFrom(r) {
  // Prefer top-level description
  if (r?.description && String(r.description).trim()) return String(r.description).trim();

  // specs can be an object or a string (legacy)
  const s = r?.specs;
  if (!s) return "";

  if (typeof s === "string") return s.trim();

  if (typeof s === "object") {
    const candidates = [
      s.details, s.notes, s.note, s.description, s.desc,
      // sometimes users put everything in a single field:
      s.extra, s.summary,
    ].filter(Boolean);
    const first = String(candidates[0] || "").trim();
    if (first) return first;

    // fallback: join a few meaningful key/value pairs
    try {
      const pairs = Object.entries(s)
        .filter(([k, v]) => v && typeof v !== "object" && String(v).trim())
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${v}`);
      return pairs.join(" · ");
    } catch { /* noop */ }
  }
  return "";
}

/* ---------- API (robust to shapes) ---------- */
async function fetchRequests({ page, country, status, q, media, budget }) {
  const params = {
    page,
    page_size: 12,
    ordering: "-created_at",
    country,
    status,                              // ok if backend ignores unknown
    search: q || undefined,
    has_media: media === "has" ? 1 : media === "none" ? 0 : undefined,
    budget: budget || undefined,         // "min-max"
  };

  for (const url of ["/api/sourcing/requests/", "/api/requests/"]) {
    try {
      const { data, status: st } = await axios.get(url, { params, validateStatus: () => true });
      if (st >= 200 && st < 300) return data;
    } catch {}
  }
  return { count: 0, results: [] };
}

/* ---------- localStorage helpers ---------- */
const LS_SAVED  = "ffm_saved";
const LS_HIDDEN = "ffm_hidden";
const lsGet = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || "[]" )); } catch { return new Set(); } };
const lsPut = (k, set) => { try { localStorage.setItem(k, JSON.stringify(Array.from(set))); } catch {} };

/* ---------- main page ---------- */
export default function AgentRequestsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // URL state
  const country = (sp.get("country") || "gh").toLowerCase();
  const status  = (sp.get("status")  || "open").toLowerCase(); // open|mine|closed
  const q       = sp.get("q") || "";
  const media   = sp.get("media") || "any"; // any|has|none
  const budget  = sp.get("budget") || "";   // "min-max"
  const page    = clamp(toInt(sp.get("page"), 1), 1, 9999);
  const density = sp.get("density") === "compact" ? "compact" : "comfortable";

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(new Set());
  const [hidden, setHidden] = useState(new Set());
  const [tick, setTick] = useState(0);

  // load LS on mount
  useEffect(() => {
    setSaved(lsGet(LS_SAVED));
    setHidden(lsGet(LS_HIDDEN));
  }, []);

  // data fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const data = await fetchRequests({ page, country, status, q, media, budget });
      if (!alive) return;
      const list = Array.isArray(data?.results) ? data.results : [];
      const hiddenSet = lsGet(LS_HIDDEN);
      setRequests(list.filter(r => !hiddenSet.has(r.id)));
      setCount(data?.count || list.length);
      setLoading(false);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, status, q, media, budget, page, tick]);

  // update URL
  const setParam = (patch) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === "" || v === "any") next.delete(k);
      else next.set(k, String(v));
    });
    next.set("page", "1");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const setPage = (p) => {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const copyBuyerLink = async () => {
    const url = `${location.origin}/${country}/sourcing`;
    try { await navigator.clipboard.writeText(url); } catch {}
  };

  const currencyFallback = CTRY_CURR[country] || "USD";

  const actions = (
    <div className="flex gap-2">
      <Link
        href={`/${country}/sourcing`}
        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        title="Open buyer form"
      >
        <Handshake className="w-4 h-4" /> Open buyer form
      </Link>
      <button
        onClick={copyBuyerLink}
        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        title="Copy Find-for-me link"
      >
        Copy link
      </button>
    </div>
  );

  const onToggleSave = (id) => {
    const next = new Set(saved);
    next.has(id) ? next.delete(id) : next.add(id);
    setSaved(next);
    lsPut(LS_SAVED, next);
  };
  const onHide = (id) => {
    const next = new Set(hidden);
    next.add(id);
    setHidden(next);
    lsPut(LS_HIDDEN, next);
    setTick((t) => t + 1);
  };

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(count / perPage));

  return (
    <AgentShell title="Find-for-me Requests" actions={actions}>
      {/* Sticky filters */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="px-4 py-3 flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
            {[
              { key: "open",   label: "Open",   title: "Requests you haven't acted on" },
              { key: "mine",   label: "Mine",   title: "Requests where you proposed an offer" },
              { key: "closed", label: "Closed", title: "Closed or fulfilled" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setParam({ status: t.key })}
                className={`px-3 py-1.5 text-sm ${
                  status === t.key
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
                title={t.title}
                aria-pressed={status === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="search"
            placeholder="Search requests…"
            className="flex-1 min-w-[200px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm"
            defaultValue={q}
            onKeyDown={(e) => { if (e.key === "Enter") setParam({ q: e.currentTarget.value }); }}
            aria-label="Search requests"
          />

          {/* Country */}
          <button
            onClick={() => {
              const order = Object.keys(CTRY_LABEL);
              const i = Math.max(0, order.indexOf(country));
              const next = order[(i + 1) % order.length];
              setParam({ country: next });
            }}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm"
            title="Cycle country"
          >
            <Globe className="w-4 h-4" /> {CTRY_LABEL[country] ?? country.toUpperCase()}
          </button>

          {/* Media filter */}
          <div className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm">
            <Filter className="w-4 h-4" />
            <select
              value={media}
              onChange={(e) => setParam({ media: e.target.value })}
              className="bg-transparent outline-none"
              aria-label="Media filter"
            >
              <option value="any">Media</option>
              <option value="has">Has media</option>
              <option value="none">No media</option>
            </select>
          </div>

          {/* Budget filter (free text "200-500") */}
          <div className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1.5 text-sm">
            <Coins className="w-4 h-4" />
            <input
              className="bg-transparent outline-none w-28"
              placeholder="min-max"
              defaultValue={budget}
              onBlur={(e) => setParam({ budget: e.target.value })}
              aria-label="Budget range"
            />
          </div>

          {/* Density */}
          <div className="ml-auto inline-flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
            {["comfortable", "compact"].map(d => (
              <button
                key={d}
                onClick={() => setParam({ density: d })}
                className={`px-3 py-1.5 text-sm ${
                  density === d
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                }`}
                title={`Grid density: ${d}`}
              >
                {d === "comfortable" ? "Comfort" : "Compact"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result header */}
      <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {loading ? "Loading…" : `${fmt(count)} request${count === 1 ? "" : "s"} found`}
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 px-4 pb-4 ${
          density === "compact"
            ? "grid-cols-1 md:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                country={country}
                currencyFallback={currencyFallback}
                saved={saved.has(r.id)}
                onToggleSave={() => onToggleSave(r.id)}
                onHide={() => onHide(r.id)}
              />
            ))
        }
      </div>

      {/* Pagination */}
      <div className="px-4 pb-5 flex items-center justify-end gap-2">
        <button
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={loading || page <= 1}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} / {fmt(Math.max(1, Math.ceil(count / 12)))}
        </span>
        <button
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={loading || page >= Math.max(1, Math.ceil(count / 12))}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </AgentShell>
  );
}

/* ---------- card ---------- */
function RequestCard({ request: r, country, currencyFallback, saved, onToggleSave, onHide }) {
  const min = r.budget_min ?? r.min_budget ?? null;
  const max = r.budget_max ?? r.max_budget ?? null;

  const city    = r.deliver_to_city || r.city || "";
  const ccSlug  = (r.deliver_to_country || r.country || country || "gh").toLowerCase();
  const currency = (r.currency || currencyFallback || "USD").toUpperCase();

  const offersCount = r.offers_count ?? r.offers ?? 0;

  const title = r.title || r.name || "Request";
  const createdAt = r.created_at || r.created || null;

  const details = detailsFrom(r);
  const deadline = r.deadline || (r.specs && r.specs.needed_by) || null;
  const due = deadlineInfo(deadline);

  const mediaCount =
    (Array.isArray(r.media) ? r.media.length : 0) ||
    (r.specs && Array.isArray(r.specs.media_links) ? r.specs.media_links.length : 0) ||
    0;

  const viewHref    = `/agent/requests/${r.id}`;
  const proposeHref = `/${ccSlug}/sourcing?request=${r.id}`;

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); window.location.href = viewHref;
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault(); window.location.href = proposeHref;
    }
  };

  return (
    <article
      tabIndex={0}
      onKeyDown={onKey}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600 transition"
      aria-labelledby={`rq-${r.id}-title`}
    >
      <header className="flex items-start justify-between gap-2">
<div className="min-w-0 max-w-[75%]">
  <h2
    id={`rq-${r.id}-title`}
    title={title}
    className="truncate text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
  >
    {title}
    {isNew(createdAt) && (
      <span className="ml-2 align-middle text-[10px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
        New
      </span>
    )}
    {due && (
      <span
        className={`ml-2 inline-flex items-center gap-1 align-middle text-[10px] font-medium px-1.5 py-0.5 rounded ${
          due.tone === "danger"
            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700"
            : due.tone === "warn"
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
        }`}
        title={deadline ? new Date(deadline).toLocaleDateString() : undefined}
      >
        {/* <Clock className="w-3.5 h-3.5" /> */}{due.label}
      </span>
    )}
  </h2>
</div>
        <div className="flex items-center gap-1">
          <Link href={viewHref} className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1" title="Open details">
            View <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
        {details?.trim() || "No details provided."}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Location</dt>
            <dd className="font-medium">
              {city || "—"}, {(ccSlug || "").toUpperCase()}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-gray-400" />
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Budget</dt>
            <dd className="font-medium">
              {min != null || max != null ? (
                <>
                  {sym(currency)} {min != null ? fmt(min) : "—"} – {max != null ? fmt(max) : "—"}{" "}
                  <span className="text-xs text-gray-500">{currency}</span>
                </>
              ) : "—"}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Needed by</dt>
            <dd className="font-medium">{deadline ? new Date(deadline).toLocaleDateString() : "—"}</dd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-gray-400" />
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Media</dt>
            <dd className="font-medium">{mediaCount > 0 ? "Yes" : "—"}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
          <span title="Time since created">Age: {ageLabel(createdAt)}</span>
          <span>Offers: <strong>{fmt(offersCount)}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSave}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 inline-flex items-center gap-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            title={saved ? "Saved" : "Save"}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={onHide}
            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 inline-flex items-center gap-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Hide this request"
          >
            <EyeOff className="w-4 h-4" />
            <span className="hidden sm:inline">Hide</span>
          </button>

          <Link
            href={proposeHref}
            className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
            aria-label={`Propose offer for '${title}'`}
          >
            Propose offer →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ---------- skeleton ---------- */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-9 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}