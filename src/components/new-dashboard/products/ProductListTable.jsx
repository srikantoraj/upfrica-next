// src/components/new-dashboard/products/ProductListTable.jsx
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import { getCardImage } from "@/app/constants";
import axiosInstance from "@/lib/axiosInstance";
import { hasFeature, featureEnabled } from "@/lib/plan-features-checker";


import {
  Eye,
  CheckCircle,
  Trash2,
  Pencil,
  ChevronUp,
  Loader2,
  Plus,
  MousePointerClick,
  Phone,
  MessageCircle,
  Pause,
  Play,
  Calendar,
  X,
  Rocket,
  FileEdit,
  Search,
  XCircle,
  Info,
  AlertTriangle,
  Wrench,
  ChevronDown,
  ArrowUpDown,
  Download,
  ListFilter,
  Clock,
  DollarSign,
  Lock,
} from "lucide-react";

/* ---- metrics batch refresh (uses /api/metrics/summary/) ---- */
const METRIC_FIELDS =
  "views,clicks,whatsapp_clicks,phone_clicks,contact_clicks";

async function fetchMetricsSummary(ids = [], opts = {}) {
  if (!ids.length) return {};
  const { window = "all" } = opts; // '7d' | '28d' | '90d' | 'all'
  const { data } = await axiosInstance.get("metrics/summary/", {
    params: { ids: ids.join(","), fields: METRIC_FIELDS, window },
    headers: { Accept: "application/json" },
    withCredentials: true,
  });

  // Accept array or map; normalize to { [id]: metrics }
  if (Array.isArray(data)) {
    const map = {};
    for (const row of data) {
      const pid = Number(row.product_id ?? row.id);
      if (pid) map[pid] = row;
    }
    return map;
  }
  return data || {};
}

// bulk price update (gated to price plan)
const BulkPriceModal = dynamic(
  () => import("@/components/products/BulkPriceModal"),
  { ssr: false }
);

// plan comparison (upsell)
const PlanComparisonModal = dynamic(
  () => import("@/components/ui/PlanComparisonModal"),
  { ssr: false }
);

// header sort button (shows active state)
function SortBtn({ label, k, alignRight = false, sort, setSort }) {
  const active = sort.key === k;
  const dir = active ? sort.dir : "asc";
  const Icon = active ? (dir === "asc" ? ChevronUp : ChevronDown) : ArrowUpDown;
  return (
    <button
      className={`inline-flex items-center gap-1 hover:underline ${
        active ? "font-semibold text-gray-900 dark:text-white" : ""
      } ${alignRight ? "ml-auto" : ""}`}
      onClick={() =>
        setSort((s) => ({
          key: k,
          dir: s.key === k && s.dir === "asc" ? "desc" : "asc",
        }))
      }
      title={`Sort by ${label}`}
      aria-sort={
        active ? (dir === "asc" ? "ascending" : "descending") : "none"
      }
    >
      {label}
      <Icon className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
    </button>
  );
}




// tiny mq hook for Auto/Table/Card switching
// SSR-safe media query hook (single subscription)
function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    // sync on mount and when query changes
    setMatches(mql.matches);

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, [query]);

  return matches;
}







/* ----------------------- image helpers ----------------------- */
const API_ROOT = (BASE_API_URL || "").replace(/\/+$/, "");
const CDN_BASE = (() => {
  const raw = (process.env.NEXT_PUBLIC_CDN_HOST || "").replace(/\/+$/, "");
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
})();
const isAbs = (u) => !!u && /^https?:\/\//i.test(u);
const isData = (u) => !!u && /^data:/i.test(u);
const first = (...vals) =>
  vals.find((v) => (typeof v === "string" ? v.trim() : v)) ?? null;

function preferCDN(u) {
  const v = u || "";
  if (!CDN_BASE || !v) return v || null;
  if (/\.s3[.-][a-z0-9-]+\.amazonaws\.com/i.test(v)) {
    try {
      const url = new URL(v);
      const path = url.pathname.replace(/^\/+/, "");
      return `${CDN_BASE}/${path}`;
    } catch {
      return v;
    }
  }
  return v;
}

function absolutize(u) {
  if (!u) return null;
  if (isAbs(u) || isData(u)) return preferCDN(u);
  if (u.startsWith("//")) return `${location.protocol}${u}`;
  return `${API_ROOT}${u.startsWith("/") ? "" : "/"}${u}`;
}

function pickImageObject(p) {
  const arr = Array.isArray(p?.image_objects) ? p.image_objects : [];
  return arr.find((o) => o?.url || o?.image_url || o?.image) || null;
}
function hasAnyImage(p) {
  const obj = pickImageObject(p);
  return !!(
    obj?.url ||
    obj?.image_url ||
    obj?.image ||
    p?.image_url ||
    p?.image ||
    p?.thumbnail
  );
}
function thumbOf(p) {
  const imgObj = pickImageObject(p);
  const candidate = first(
    getCardImage?.(p),
    p.card_image,
    p.card_image_url,
    p.thumbnail,
    p.image_url,
    p.image,
    imgObj?.url,
    imgObj?.image_url,
    imgObj?.image
  );
  const fixed = absolutize(candidate);
  return fixed || "/placeholder.png";
}

/* -------- qty helpers -------- */
function qtyFieldFor(p) {
  if (Object.prototype.hasOwnProperty.call(p || {}, "product_quantity"))
    return "product_quantity";
  if (Object.prototype.hasOwnProperty.call(p || {}, "quantity")) return "quantity";
  if (Object.prototype.hasOwnProperty.call(p || {}, "stock")) return "stock";
  return "product_quantity";
}
function qtyOfSafe(p) {
  return Number(p?.product_quantity ?? p?.quantity ?? p?.stock ?? 0);
}

/* ----------------------- links ----------------------- */
const envOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL || ""
).replace(/\/+$/, "");
const getOrigin = () =>
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : envOrigin || "";
const isAbsUrl = (u) => !!u && /^https?:\/\//i.test(u || "");
const toPath = (u) => {
  if (!u) return null;
  if (isAbsUrl(u)) {
    try {
      const url = new URL(u);
      return url.pathname + (url.search || "");
    } catch {
      return u;
    }
  }
  return u;
};
function viewHrefAbsolute(p) {
  const raw =
    first(p.frontend_url_full, p.frontend_url, p.canonical_url) ||
    (p.slug
      ? `/${(p.listing_country_code || p.seller_country || "gh").toLowerCase()}/${p.slug}`
      : "#");
  const path = toPath(raw) || "#";
  if (path === "#") return "#";
  const origin = getOrigin();
  return origin ? `${origin}${path.startsWith("/") ? "" : "/"}${path}` : path;
}

/* ----------------------- misc helpers ----------------------- */
const toMajor = (cents = 0, exp = 2) =>
  (Number(cents || 0) / Math.pow(10, exp)).toFixed(exp);

const statusLabel = (s) =>
  s === 1 ? "Published"
: s === 0 ? "Draft"
: s === 2 ? "Under review"
: s === 5 ? "Archived"
: "—";

function fmtFriendly(val) {
  if (!val) return "—";
  if (typeof val === "string" && !val.includes("T")) return val;
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

const nfmt = (n) => new Intl.NumberFormat().format(Number(n || 0));
const viewsOf = (p) =>
  p.views ??
  p.impressions ??
  p.impressions_count ??
  p.view_count ??
  p.metrics?.views ??
  0;
const clicksOf = (p) =>
  p.clicks ?? p.clicks_count ?? p.outbound_clicks ?? p.metrics?.clicks ?? 0;

const ctrOf = (p) => {
  if (typeof p?.ctr === "string") return p.ctr;
  const v = Number(viewsOf(p));
  const c = Number(clicksOf(p));
  if (!v) return "—";
  const pct = (c / v) * 100;
  return pct >= 10 ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`;
};

const whatsappClicksOf = (p) =>
  p.whatsapp_clicks ??
  p.whatsapp_click_count ??
  p.contact_whatsapp_clicks ??
  p.metrics?.whatsapp_clicks ??
  0;
const phoneClicksOf = (p) =>
  p.phone_clicks ??
  p.call_clicks ??
  p.phone_call_clicks ??
  p.metrics?.phone_clicks ??
  0;
const contactClicksOf = (p) =>
  p.contact_clicks ?? Number(whatsappClicksOf(p)) + Number(phoneClicksOf(p));
const contactCtrOf = (p) => {
  if (typeof p?.contact_ctr === "string") return p.contact_ctr;
  const v = Number(viewsOf(p));
  const c = Number(contactClicksOf(p));
  if (!v) return "—";
  const pct = (c / v) * 100;
  return pct >= 10 ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`;
};

/* ----------------------- smart search ----------------------- */
function parseSmartQuery(q) {
  const out = {
    text: [],
    status: null,
    paused: null,
    country: null,
    ccy: null,
    id: null,
    minviews: null,
    minclicks: null,
  };
  const toks = (q || "").trim().split(/\s+/).filter(Boolean);
  toks.forEach((t) => {
    const [k, vRaw] = t.split(":", 2);
    const v = (vRaw || "").toLowerCase();
    switch ((k || "").toLowerCase()) {
      case "status":
        if (["live", "paused", "draft", "hidden", "published"].includes(v))
          out.status = v;
        else out.text.push(t);
        break;
      case "paused":
        if (v === "true" || v === "false") out.paused = v === "true";
        else out.text.push(t);
        break;
      case "country":
        out.country = v.slice(0, 2);
        break;
      case "ccy":
        out.ccy = v.slice(0, 3);
        break;
      case "id":
        out.id = Number(vRaw);
        break;
      case "minviews":
        out.minviews = Number(vRaw);
        break;
      case "minclicks":
        out.minclicks = Number(vRaw);
        break;
      default:
        out.text.push(t);
    }
  });
  return out;
}

function smartFilterRows(rows, q) {
  if (!q) return rows;
  const spec = parseSmartQuery(q);
  const norm = (s) => String(s || "").toLowerCase();

  return rows.filter((p) => {
    if (spec.id && Number(p.id) !== Number(spec.id)) return false;

    if (spec.status) {
      const live = !!p.is_live;
      const paused = p.status === 1 && !!p.is_paused;
      const published = p.status === 1;
      const hidden = !published;
      const draft = p.status === 0;

      const ok =
        (spec.status === "live" && live) ||
        (spec.status === "paused" && paused) ||
        (spec.status === "published" && published) ||
        (spec.status === "hidden" && hidden) ||
        (spec.status === "draft" && draft);

      if (!ok) return false;
    }

    if (spec.paused !== null) {
      if (!!p.is_paused !== spec.paused) return false;
    }

    if (spec.country) {
      const c =
        (p.listing_country_code ||
          p.seller_country ||
          p.cached_country_code ||
          ""
        ).toLowerCase();
      if (c.slice(0, 2) !== spec.country) return false;
    }

    if (spec.ccy) {
      const ccy = (p.price_currency || "").toLowerCase();
      if (!ccy || !ccy.startsWith(spec.ccy)) return false;
    }

    if (spec.minviews && Number(viewsOf(p)) < spec.minviews) return false;
    if (spec.minclicks && Number(clicksOf(p)) < spec.minclicks) return false;

    if (spec.text.length) {
      const hay = `${norm(p.title)} ${norm(p.slug)}`;
      const allFound = spec.text.every((t) => hay.includes(norm(t)));
      if (!allFound) return false;
    }

    return true;
  });
}









/* ----------------------- toast system ----------------------- */
function Toast({ type = "info", title, message, onClose, actionLabel, onAction }) {
  const styles =
    {
      success: "bg-emerald-600/90 text-white border-emerald-400/40",
      error: "bg-red-600/90 text-white border-red-400/40",
      info: "bg-gray-900/90 text-white border-white/10",
    }[type] || "bg-gray-900/90 text-white border-white/10";

  const Icon =
    type === "success" ? CheckCircle : type === "error" ? AlertTriangle : Info;

  return (
    <div
      className={`pointer-events-auto w-[340px] rounded-xl border shadow-lg backdrop-blur px-3 py-2.5 ${styles}`}
      role="status"
    >
      <div className="flex items-start gap-2">
        <Icon className="w-4.5 h-4.5 shrink-0 mt-0.5" />
        <div className="flex-1">
          {title ? (
            <div className="text-sm font-semibold leading-tight">{title}</div>
          ) : null}
          {message ? (
            <div className="text-[12px] opacity-90 leading-snug mt-0.5">{message}</div>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {onAction && actionLabel ? (
            <button
              onClick={onAction}
              className="text-xs px-2 py-1 rounded-md bg-white/15 hover:bg-white/25"
            >
              {actionLabel}
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
function useToasts() {
  const [toasts, setToasts] = React.useState([]);
  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const push = ({
    type = "info",
    title,
    message,
    ttl = 4500,
    actionLabel,
    onAction,
  }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, title, message, actionLabel, onAction }]);
    if (ttl) window.setTimeout(() => dismiss(id), ttl);
  };
  return { toasts, push, dismiss };
}
const tidyError = (err) =>
  String(err?.message || err || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

/* ----------------------- tiny UI helpers ----------------------- */
function Chip({ icon: Icon, label, value, muted }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
        muted
          ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          : "bg-gray-900 text-white"
      }`}
    >
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}
function ProgressMini({ valuePct }) {
  const val = Math.max(0, Math.min(100, Number(valuePct || 0)));
  return (
    <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded">
      <div
        className="h-1.5 rounded bg-gradient-to-r from-emerald-400 to-emerald-600"
        style={{ width: `${val}%` }}
      />
    </div>
  );
}

/* ----------------------- image component ----------------------- */
function SafeImage({ src, alt, width, height, className }) {
  const [s, setS] = useState(src);
  useEffect(() => setS(src), [src]);
  return (
    <Image
      src={s}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setS("/placeholder.png")}
    />
  );
}

/* ----------------------- Cap Bottom Sheet ----------------------- */
function CapBottomSheet({ open, onClose, ctx, onAutofix }) {
  if (!open || !ctx) return null;

  const cap = (ctx.server && ctx.server.meta) || ctx.cap || {};
  const max = cap?.max ?? null;
  const used = cap?.used ?? null;
const remaining =
  cap?.remaining ?? (max != null && used != null ? Math.max(0, max - used) : null);
  const pct =
    max && used != null ? Math.min(100, Math.round((used / max) * 100)) : null;

const isCap =
  ctx.server?.code === "cap_reached" ||
  (typeof remaining === "number" && remaining <= 0);
  const isPlanNoSchedule =
    ctx.server?.code === "plan_no_schedule" || ctx.reason === "plan_no_schedule";

  return (
    <div className="fixed inset-0 z-[1100]" role="dialog" aria-modal="true" aria-labelledby="cap-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 id="cap-title" className="text-base font-semibold">Action blocked</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
          {isCap && (
            <>
              <p>
                You’ve reached your plan’s live listing limit{" "}
                {max != null && used != null ? (
                  <strong>
                    ({used} / {max} used)
                  </strong>
                ) : (
                  ""
                )}
                .
              </p>
              {pct != null && (
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded">
                  <div
                    className="h-2 rounded bg-gradient-to-r from-amber-400 to-rose-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              <ul className="list-disc ml-5">
                <li>Pause one of your live listings, then publish this one.</li>
                <li>
                  Or{" "}
                  <button
                    className="text-emerald-700 dark:text-emerald-400 underline decoration-dotted underline-offset-2"
                    onClick={onAutofix}
                  >
                    auto-pause the oldest live listing now
                  </button>
                  .
                </li>
              </ul>
            </>
          )}

          {isPlanNoSchedule && (
            <>
              <p>Your current plan doesn’t include scheduling.</p>
              <p className="opacity-80">
                You can still publish manually, or upgrade to enable scheduling.
              </p>
            </>
          )}

          {ctx.server?.detail && (
            <p className="text-xs text-gray-500">{ctx.server.detail}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              View Plans
            </Link>
            <Link
              href="/account/billing"
              className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Manage Billing
            </Link>
          </div>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- BottomSheet primitive ----------------------- */
function BottomSheet({ open, onClose, title, children, footer }) {
  const [dragY, setDragY] = useState(0);
  const startRef = React.useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="absolute inset-x-0 bottom-0 sm:max-w-2xl sm:mx-auto rounded-t-2xl bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-800 max-h-[88svh] overflow-hidden"
        style={{ transform: `translateY(${dragY}px)` }}
        onTouchStart={(e) => (startRef.current = e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (startRef.current == null) return;
          const delta = e.touches[0].clientY - startRef.current;
          setDragY(Math.max(0, delta));
        }}
        onTouchEnd={() => {
          if (dragY > 80) onClose();
          setDragY(0);
          startRef.current = null;
        }}
      >
        <div className="py-3 flex justify-center">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="px-5 pb-3 flex items-center justify-between">
          <h3 id="sheet-title" className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 pb-24 overflow-y-auto">{children}</div>
        {footer ? (
          <div
            className="absolute bottom-0 inset-x-0 p-3 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}












/* ----------------------- Auto-Fix Bottom Sheet ----------------------- */
function computeAutoFixPreview(products) {
  const now = Date.now();

  const pause_zero_stock = products.filter(
    (p) => p.status === 1 && !p.is_paused && Number(p.product_quantity ?? 0) === 0
  );

  const draft_no_image = products.filter((p) => p.status === 1 && !hasAnyImage(p));
  const draft_bad_price = products.filter(
    (p) => p.status === 1 && Number(p.price_cents ?? 0) <= 0
  );

  const clear_stale_schedule = products.filter((p) => {
    const pub = p.publish_at ? new Date(p.publish_at).getTime() : null;
    const unpub = p.unpublish_at ? new Date(p.unpublish_at).getTime() : null;
    if ((pub && pub < now) || (unpub && unpub < now)) return true;
    return false;
  });

  const publish_ready_drafts = products.filter(
    (p) =>
      p.status === 0 &&
      Number(p.product_quantity ?? 0) > 0 &&
      Number(p.price_cents ?? 0) > 0 &&
      hasAnyImage(p) &&
      p?.can_publish !== false
  );

  return {
    pause_zero_stock,
    draft_no_image,
    draft_bad_price,
    clear_stale_schedule,
    publish_ready_drafts,
  };
}

async function runWithLimit(items, limit, worker) {
  const queue = [...items];
  const inFlight = [];
  let i = 0;
  async function next() {
    const item = queue.shift();
    if (item === undefined) return;
    const p = worker(item, i++);
    inFlight.push(
      p.finally(() => {
        inFlight.splice(inFlight.indexOf(p), 1);
      })
    );
    if (inFlight.length >= limit) await Promise.race(inFlight);
    return next();
  }
  await next();
  await Promise.allSettled(inFlight);
}

function AutoFixSheet({ open, onClose, products, patchProduct, openCapFor, push }) {
  const preview = useMemo(() => computeAutoFixPreview(products), [products]);

  const [tPauseZero, setTPauseZero] = useState(true);
  const [tDraftNoImg, setTDraftNoImg] = useState(true);
  const [tDraftBadPrice, setTDraftBadPrice] = useState(true);
  const [tClearStale, setTClearStale] = useState(true);
  const [tPublishDrafts, setTPublishDrafts] = useState(false);
  const [tAutoPauseForCap, setTAutoPauseForCap] = useState(true);

  const totalTargets =
    (tPauseZero ? preview.pause_zero_stock.length : 0) +
    (tDraftNoImg ? preview.draft_no_image.length : 0) +
    (tDraftBadPrice ? preview.draft_bad_price.length : 0) +
    (tClearStale ? preview.clear_stale_schedule.length : 0) +
    (tPublishDrafts ? preview.publish_ready_drafts.length : 0);

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!open) {
      setRunning(false);
      setDone(0);
    }
  }, [open]);

  async function run() {
    if (running || totalTargets === 0) return;
    setRunning(true);
    setDone(0);

    const workItems = [];

    if (tPauseZero)
      preview.pause_zero_stock.forEach((p) =>
        workItems.push({ p, type: "pause_zero_stock" })
      );
    if (tDraftNoImg)
      preview.draft_no_image.forEach((p) =>
        workItems.push({ p, type: "draft_no_image" })
      );
    if (tDraftBadPrice)
      preview.draft_bad_price.forEach((p) =>
        workItems.push({ p, type: "draft_bad_price" })
      );
    if (tClearStale)
      preview.clear_stale_schedule.forEach((p) =>
        workItems.push({ p, type: "clear_stale_schedule" })
      );
    if (tPublishDrafts)
      preview.publish_ready_drafts.forEach((p) =>
        workItems.push({ p, type: "publish_ready_drafts" })
      );

    await runWithLimit(workItems, 4, async ({ p, type }) => {
      if (type === "pause_zero_stock") {
        await patchProduct(p.id, { is_paused: true }, "pause");
      } else if (type === "draft_no_image") {
        await patchProduct(p.id, { status: 0 }, "draft");
      } else if (type === "draft_bad_price") {
        await patchProduct(p.id, { status: 0 }, "draft");
      } else if (type === "clear_stale_schedule") {
        await patchProduct(p.id, { publish_at: null, unpublish_at: null }, "schedule");
      } else if (type === "publish_ready_drafts") {
        const payload = { status: 1, is_paused: false };
        if (tAutoPauseForCap) payload.autofix = true;
        try {
          await patchProduct(p.id, payload, "publish");
        } catch (e) {
          const data = e?.response?.data || e?.data;
          if (data?.code === "cap_reached") {
            openCapFor(p, data);
          }
          throw e;
        }
      }
      setDone((d) => d + 1);
    });

    onClose();
  }

  function Row({ title, count, checked, onChange, hint, examples }) {
    const [openRow, setOpenRow] = useState(false);
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium text-sm">{title}</div>
            <div className="text-xs text-gray-500">{hint}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-500">{count}</span>
            {examples?.length ? (
              <button
                onClick={() => setOpenRow((v) => !v)}
                className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {openRow ? (
                  <span className="inline-flex items-center gap-1">
                    Hide <ChevronUp className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    View <ChevronDown className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            ) : null}
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 accent-black"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
              />
            </label>
          </div>
        </div>
        {openRow && examples?.length ? (
          <ul className="mt-2 text-[12px] text-gray-600 dark:text-gray-300 space-y-1 max-h-28 overflow-auto">
            {examples.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                  <SafeImage src={thumbOf(p)} alt="i" width={20} height={20} />
                </div>
                <span className="truncate">{p.title || `#${p.id}`}</span>
              </li>
            ))}
            {examples.length > 6 ? (
              <li className="opacity-70">+ {examples.length - 6} more…</li>
            ) : null}
          </ul>
        ) : null}
      </div>
    );
  }

  const footer = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
      <div className="text-xs text-gray-600 dark:text-gray-300">
        {done < totalTargets ? (
          <div className="flex items-center gap-2">
            {totalTargets ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Fixing… {done} / {totalTargets}
                <div className="w-28 h-1.5 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                  <div
                    className="h-1.5 bg-gray-900 dark:bg-white"
                    style={{ width: `${Math.round((done / Math.max(1, totalTargets)) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <span>Nothing to fix right now</span>
            )}
          </div>
        ) : (
          <span>Done</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Close
        </button>
        <button
          onClick={run}
          disabled={totalTargets === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60"
        >
          <Wrench className="w-4 h-4" />
          Run Auto-Fix
        </button>
      </div>
    </div>
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="Auto-Fix Listings" footer={footer}>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        We’ll apply safe fixes to common problems. Toggle any you don’t want.
      </p>

      <div className="grid gap-3">
        <Row
          title="Pause live items that are out of stock"
          hint="Live listings with stock = 0 will be paused."
          count={preview.pause_zero_stock.length}
          checked={tPauseZero}
          onChange={setTPauseZero}
          examples={preview.pause_zero_stock}
        />
        <Row
          title="Move live items with no images to Draft"
          hint="Listings must include at least one image."
          count={preview.draft_no_image.length}
          checked={tDraftNoImg}
          onChange={setTDraftNoImg}
          examples={preview.draft_no_image}
        />
        <Row
          title="Move live items with zero/invalid price to Draft"
          hint="Price must be greater than 0."
          count={preview.draft_bad_price.length}
          checked={tDraftBadPrice}
          onChange={setTDraftBadPrice}
          examples={preview.draft_bad_price}
        />
        <Row
          title="Clear stale schedules in the past"
          hint="Removes publish/unpublish times that are already in the past."
          count={preview.clear_stale_schedule.length}
          checked={tClearStale}
          onChange={setTClearStale}
          examples={preview.clear_stale_schedule}
        />

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm">Publish completed Drafts (optional)</div>
              <div className="text-xs text-gray-500">Drafts with valid price, stock & image.</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-gray-500">
                {preview.publish_ready_drafts.length}
              </span>
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-black"
                  checked={tPublishDrafts}
                  onChange={(e) => setTPublishDrafts(e.target.checked)}
                />
              </label>
            </div>
          </div>

          {tPublishDrafts ? (
            <div className="mt-2 pl-1">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-600"
                  checked={tAutoPauseForCap}
                  onChange={(e) => setTAutoPauseForCap(e.target.checked)}
                />
                Auto-pause oldest live listing if cap is reached
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </BottomSheet>
  );
}










/* ----------------------- main component ----------------------- */
export default function ProductListTable({
  filter,
  query,
  metricWindow,
  density,
  view = "auto", // "auto" | "table" | "card"
  onMeta,
}) {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const [lastStatsAt, setLastStatsAt] = useState(null);
  const [statsBusy, setStatsBusy] = useState(false);

  const [capOpen, setCapOpen] = useState(false);
  const [capCtx, setCapCtx] = useState(null);






// bulk price update
const [bulkPriceOpen, setBulkPriceOpen] = useState(false);

// plan/features + gating
const [features, setFeatures] = useState(null);      // account-level features
const [planModalOpen, setPlanModalOpen] = useState(false);
const [planIntent, setPlanIntent] = useState(null);  // "bulk_price" | "schedule" | null
const accountCanSchedule = hasFeature(features, "schedule");

// Fetch features once (works with either api/users/me/entitlements):
useEffect(() => {
  let alive = true;
  (async () => {
    try {
      // preferred: entitlements endpoint
      const { data } = await axiosInstance.get("/api/users/me/entitlements", {
        params: { full: 1 },
      });

      // normalize a few possible shapes -> { bulk_price_update: true, schedule: true, ... }
      const map =
        data?.features ??
        data?.plan_features ??
        (Array.isArray(data?.entitlements)
          ? Object.fromEntries(
              data.entitlements.map((x) => [x?.code ?? x, true])
            )
          : null);

      if (alive) setFeatures(map);
    } catch {
      try {
        // fallback: users/me
        const { data } = await axiosInstance.get("/api/users/me/");
        if (alive) setFeatures(data?.features ?? data?.plan_features ?? null);
      } catch {
        if (alive) setFeatures(null); // will fall back to per-product flags
      }
    }
  })();
  return () => { alive = false; };
}, []);





// Compute permission for Bulk Price via plan-features-checker
const canBulkPrice = useMemo(() => {
  const v = hasFeature(features, "bulk_price_update");
  if (v !== undefined) return v;
  return products.some(p => featureEnabled(p, "bulk_price_update", false));
}, [features, products]);






// helpers
function openPlanCompare(intent) {
  setPlanIntent(intent ?? null);
  setPlanModalOpen(true);
}
function openBulkPrice() {
  if (!selected.size) return;
  if (canBulkPrice) setBulkPriceOpen(true);
  else openPlanCompare("bulk_price");
}

// listen for a backend hard-gate signal from the BulkPrice modal (optional)
useEffect(() => {
  const handlePlanGate = (e) => {
    openPlanCompare(e?.detail?.feature ?? "bulk_price");
  };
  window.addEventListener("upfrica:plan-gate", handlePlanGate);
  return () => window.removeEventListener("upfrica:plan-gate", handlePlanGate);
}, []);





  // Column visibility manager
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const colMenuRef = useRef(null);
  const [visibleCols, setVisibleCols] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("prod.visibleCols") || "{}");
      return {
        image: true,
        title: true,
        status: true,
        visibility: true,
        availability: true,
        price: true,
        views: true,
        clicks: true,
        contacts: true,
        actions: true,
        ...saved,
      };
    } catch {
      return {
        image: true,
        title: true,
        status: true,
        visibility: true,
        availability: true,
        price: true,
        views: true,
        clicks: true,
        contacts: true,
        actions: true,
      };
    }
  });
  useEffect(() => {
    localStorage.setItem("prod.visibleCols", JSON.stringify(visibleCols));
  }, [visibleCols]);

  useEffect(() => {
    function onDocClick(e) {
      if (!colMenuRef.current) return;
      if (!colMenuRef.current.contains(e.target)) setColMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setColMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // batch selection
  const [selected, setSelected] = useState(new Set());
  const [batchBusy, setBatchBusy] = useState(false);

  // quick editors
  const [qtyTarget, setQtyTarget] = useState(null);
  const [priceTarget, setPriceTarget] = useState(null);

  // AutoFix
  const [autoFixOpen, setAutoFixOpen] = useState(false);
  useEffect(() => {
    const open = () => setAutoFixOpen(true);
    if (typeof window !== "undefined") {
      window.addEventListener("upfrica:autofix-open", open);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("upfrica:autofix-open", open);
      }
    };
  }, []);

  const { toasts, push, dismiss } = useToasts();

  // query from props (defer heavy filtering)
  const deferredQuery = React.useDeferredValue(query);

  // StrictMode: prevent double initial toast/fetch
  const loadedOnceRef = useRef(false);

  // metrics refresher (polling + window)
  async function refreshStats() {
    const ids = products.map((p) => p.id).filter(Boolean);
    if (!ids.length) return;
    setStatsBusy(true);
    try {
      const summary = await fetchMetricsSummary(ids, { window: metricWindow });
      setProducts((prev) =>
        prev.map((p) => {
          const s = summary[p.id];
          if (!s) return p;
          const next = { ...p };
          next.metrics = { ...(p.metrics || {}), ...s };
          if (s.views != null) next.impressions = s.views;
          if (s.impressions != null) next.impressions = s.impressions;
          if (s.clicks != null) next.clicks = s.clicks;
          if (s.whatsapp_clicks != null) next.whatsapp_clicks = s.whatsapp_clicks;
          if (s.phone_clicks != null) next.phone_clicks = s.phone_clicks;
          if (s.contact_clicks != null) next.contact_clicks = s.contact_clicks;
          return next;
        })
      );
      setLastStatsAt(new Date());
    } finally {
      setStatsBusy(false);
    }
  }

  useEffect(() => {
    if (products.length) refreshStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length, metricWindow]);

  useEffect(() => {
    let t;
    const loop = () => {
      if (document.visibilityState === "visible") refreshStats();
      t = setTimeout(loop, 20000);
    };
    loop();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.map((p) => p.id).join(","), metricWindow]);

  const capInfo = useMemo(() => {
    for (const p of products) {
      const max = p?.publish_cap;
      const used = p?.published_count;
      if (max != null && used != null) {
        return {
          max: Number(max),
          used: Number(used),
          remaining: Math.max(0, Number(max) - Number(used)),
          pct: Math.round((Number(used) / Math.max(1, Number(max))) * 100),
        };
      }
    }
    return null;
  }, [products]);

  function tidyAxiosPayload(e) {
    return e?.response?.data || e?.data || null;
  }

  async function loadDummy() {
    setDemoMode(true);
    setProducts([]);
    setHasMore(false);
    setError(null);
  }

  async function fetchProducts(pageNum = 1, opts = {}) {
    const { silent = false } = opts;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    if (!hasMore && pageNum > 1) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/products/mine/", {
        params: { page: pageNum, page_size: 24, tz },
      });

      const rows = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];
      setProducts((prev) => (pageNum === 1 ? rows : [...prev, ...rows]));
      setHasMore(Boolean(data?.next));
      setError(null);
      setDemoMode(false);

      if (pageNum === 1 && !silent) {
        push({
          type: "success",
          title: "Listings loaded",
          message: `${rows.length} product${rows.length === 1 ? "" : "s"} loaded.`,
          ttl: 2200,
        });
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        await loadDummy();
      } else {
        setError("Failed to load products");
        push({
          type: "error",
          title: "Couldn’t load listings",
          message: tidyError(e),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loadedOnceRef.current) return;
    loadedOnceRef.current = true;
    fetchProducts(1, { silent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    fetchProducts(next, { silent: true });
  }

  function toggleRow(id) {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  function setRowLoading(id, label) {
    setActionLoading((prev) => ({ ...prev, [id]: label }));
  }

  function maybeOpenSheetFromError(id, errPayload, mode) {
    const code = errPayload?.code;
    if (code === "cap_reached" || code === "plan_no_schedule") {
      const prod = products.find((p) => p.id === id) || null;
      const cap = prod
        ? { max: prod.publish_cap ?? null, used: prod.published_count ?? null }
        : null;
      setCapCtx({ product: prod, mode, server: errPayload, cap });
      setCapOpen(true);
      return true;
    }
    return false;
  }

  // wrapper to provide Undo
  async function patchProduct(id, patch, mode) {
    if (demoMode) return;
    const prev = products.find((p) => p.id === id);
    setRowLoading(id, "Saving…");
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    try {
      const { data } = await axiosInstance.patch(`/api/products/${id}/`, patch);
      setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));

      const allowUndo =
        ["pause", "draft", "publish"].includes(mode) ||
        "is_paused" in patch ||
        "status" in patch;
      if (allowUndo && prev) {
        push({
          type: "success",
          title: "Saved",
          message: "Your changes have been applied.",
          actionLabel: "Undo",
          onAction: async () => {
            const undoPayload = Object.fromEntries(
              Object.keys(patch).map((k) => [k, prev[k]])
            );
            await patchProduct(id, undoPayload);
          },
          ttl: 6000,
        });
      } else {
        push({
          type: "success",
          title: "Saved",
          message: "Your changes have been applied.",
          ttl: 2000,
        });
      }
    } catch (e) {
      const payload = tidyAxiosPayload(e);
      await fetchProducts(1, { silent: true });
      if (payload && maybeOpenSheetFromError(id, payload, mode || "publish")) return;

      push({ type: "error", title: "Update failed", message: tidyError(e) });
      throw e;
    } finally {
      setRowLoading(id, null);
    }
  }

  async function handleArchive(id) {
    if (demoMode) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      push({
        type: "info",
        title: "Archived (demo)",
        message: "This is demo mode.",
      });
      return;
    }
    if (!confirm("Archive this product?")) return;
    await patchProduct(id, { status: 5 });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    push({ type: "success", title: "Archived", message: "Product moved to archive." });
  }

  function tryPublish(p) {
    const can = p?.can_publish !== false;
    if (!can) {
      const cap = { max: p?.publish_cap ?? null, used: p?.published_count ?? null };
      setCapCtx({ product: p, mode: "publish", cap });
      setCapOpen(true);
      return;
    }
    patchProduct(p.id, { status: 1, is_paused: false }, "publish");
  }

  function tryTogglePause(p) {
    const can = p?.can_resume !== false;
    if (!can) {
      push({
        type: "error",
        title: "Action not allowed",
        message: "Your current plan doesn’t allow pausing/resuming.",
      });
      return;
    }
    patchProduct(p.id, { is_paused: !p.is_paused }, "pause");
  }

  async function topBannerAutofix() {
    const p = products.find((x) => !x.is_live) || products[0];
    if (!p) return;
    setCapCtx({
      product: p,
      mode: "publish",
      cap: { max: p?.publish_cap, used: p?.published_count },
    });
    setCapOpen(true);
  }

  async function handleAutofix() {
    const p = capCtx?.product;
    if (!p) return;
    setCapOpen(false);
    await patchProduct(p.id, { status: 1, is_paused: false, autofix: true }, "publish");
  }

  const filteredByTab = useMemo(() => {
    switch (filter) {
      case "live":
        return products.filter((p) => p.is_live);
      case "paused":
        return products.filter((p) => p.status === 1 && p.is_paused);
      case "draft":
        return products.filter((p) => p.status === 0);
      default:
        return products;
    }
  }, [products, filter]);


  const filtered = useMemo(
    () => smartFilterRows(filteredByTab, deferredQuery),
    [filteredByTab, deferredQuery]
  );
  const smartTokens = useMemo(() => parseSmartQuery(deferredQuery), [deferredQuery]);

  // sorting
  const [sort, setSort] = useState({ key: "updated", dir: "desc" }); // 'views'|'clicks'|'contacts'|'price'|'title'|'status'|'updated'
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const get = (p) => {
      switch (sort.key) {
        case "views":
          return Number(viewsOf(p));
        case "clicks":
          return Number(clicksOf(p));
        case "contacts":
          return Number(contactClicksOf(p));
        case "price":
          return Number(p.price_cents || 0);
        case "title":
          return (p.title || "").toLowerCase();
        case "status":
          return Number(p.status || 0) + (p.is_paused ? -0.5 : 0);
        case "updated":
        default:
          return new Date(p.updated_at || p.created_at || 0).getTime();
      }
    };
    arr.sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      if (va === vb) return 0;
      return sort.dir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return arr;
  }, [filtered, sort]);

  // selection helpers
  const toggleSelect = (id, checked) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };
  const allIdsInView = sorted.map((p) => p.id);
  const allChecked = selected.size > 0 && allIdsInView.every((id) => selected.has(id));
  const clearSelection = () => setSelected(new Set());

  // master checkbox: indeterminate
  const masterRef = useRef(null);
  useEffect(() => {
    if (!masterRef.current) return;
    masterRef.current.indeterminate =
      selected.size > 0 && !allChecked && allIdsInView.length > 0;
  }, [selected, allChecked, allIdsInView.length]);

  async function runBatch(action) {
    setBatchBusy(true);
    const ids = Array.from(selected);
    try {
      await runWithLimit(ids, 4, async (id) => {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        if (action === "pause") {
          await patchProduct(id, { is_paused: true }, "pause");
        } else if (action === "draft") {
          await patchProduct(id, { status: 0 }, "draft");
        } else if (action === "stock0") {
          const field = qtyFieldFor(p);
          await patchProduct(id, { [field]: 0 }, "qty");
        } else if (action === "publish") {
          await patchProduct(id, { status: 1, is_paused: false }, "publish");
        }
      });
      push({
        type: "success",
        title: "Batch complete",
        message: `${ids.length} item(s) updated.`,
      });
    } finally {
      clearSelection();
      setBatchBusy(false);
    }
  }

  // density is a prop now
  const imgSize = density === "compact" ? 40 : density === "comfortable" ? 64 : 56;
  const tableText = density === "compact" ? "text-xs" : "text-sm";

  const lastUpdatedLabel = useMemo(() => {
    if (!lastStatsAt) return "—";
    const s = Math.floor((Date.now() - lastStatsAt.getTime()) / 1000);
    if (s < 10) return "just now";
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
  }, [lastStatsAt]);


function exportCSV() {
  const rows = sorted;
  const header = [
    "id","title","status","is_live","is_paused","qty","price_cents","currency",
    "views","clicks","whatsapp_clicks","phone_clicks","contacts","ctr","contact_ctr","url",
  ];
  const lines = [header.join(",")];
  for (const p of rows) {
    const qty = qtyOfSafe(p);
    const v = viewsOf(p);
    const c = clicksOf(p);
    const w = whatsappClicksOf(p);
    const ph = phoneClicksOf(p);
    const cc = contactClicksOf(p);

    const line = [
      p.id,
      // ⬇️ replace your existing title cell with this one
      `"${(p.title || "").replace(/\r?\n/g, " ").replace(/"/g, '""')}"`,
      statusLabel(p.status),
      p.is_live ? 1 : 0,
      p.is_paused ? 1 : 0,
      qty,
      Number(p.price_cents || 0),
      p.price_currency || "",
      v,
      c,
      w,
      ph,
      cc,
      typeof ctrOf(p) === "string" ? ctrOf(p) : "",
      typeof contactCtrOf(p) === "string" ? contactCtrOf(p) : "",
      viewHrefAbsolute(p),
    ].join(",");

    lines.push(line);
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.csv";
  a.click();
  URL.revokeObjectURL(url);
}

//optional onMeta prop and report whenever things change
  useEffect(() => {
    onMeta?.({
      count: filtered.length,
      statsBusy,
      updatedAt: lastStatsAt, // pass the Date; parent formats "X ago"
    });
  }, [filtered.length, statsBusy, lastStatsAt, onMeta]);


  // view mode decision (Card on small screens if "auto")
// Decide view mode (avoid hydration flicker on first paint)
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

const isSmall = useMediaQuery("(max-width: 1023px)");

const useCards = useMemo(() => {
  if (view === "card") return true;
  if (view === "table") return false;
  // "auto": only switch to cards after mount so SSR/CSR match
  return mounted && isSmall;
}, [view, mounted, isSmall]);




  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      {/* Header / Toolbar */}
      <div className="sticky top-0 z-20 p-6 bg-white/85 dark:bg-gray-800/85 backdrop-blur border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Product Listings
          </h2>

        </div>

        <div className="flex flex-wrap gap-2 items-center">
          
          {/* columns */}
          <div className="relative" ref={colMenuRef}>
            <button
              onClick={() => setColMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Columns"
            >
              <ListFilter className="w-4 h-4" /> Columns
            </button>
            {colMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-xl border bg-white dark:bg-gray-900 shadow-lg p-2 text-sm z-20">
                {Object.entries(visibleCols).map(([k, v]) => (
                  <label key={k} className="flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                    <span className="capitalize">{k}</span>
                    <input
                      type="checkbox"
                      checked={v}
                      onChange={(e) => setVisibleCols((c) => ({ ...c, [k]: e.target.checked }))}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setAutoFixOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Auto-Fix Listings"
          >
            <Wrench className="w-4 h-4" />
            Auto-Fix
          </button>


<button
  onClick={openBulkPrice}
  disabled={selected.size === 0}
  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
  title={
    selected.size === 0
      ? "Select products first"
      : canBulkPrice
      ? "Bulk price update"
      : "Available on Growth and Pro plans"
  }
>
  {canBulkPrice ? (
    <>
      <DollarSign className="w-4 h-4" /> Bulk Price
    </>
  ) : (
    <>
      <Lock className="w-4 h-4" /> Bulk Price
    </>
  )}
</button>



          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Export CSV"
          >
            <Download className="w-4 h-4" /> Export
          </button>

          <button
            onClick={() => router.push("/new-dashboard/products/new")}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Active smart token chips */}
      {!!deferredQuery && (
        <div className="px-6 pt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Filters:</span>
          {smartTokens.status && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              status:{smartTokens.status}
            </span>
          )}
          {smartTokens.paused !== null && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              paused:{String(smartTokens.paused)}
            </span>
          )}
          {smartTokens.country && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              country:{smartTokens.country}
            </span>
          )}
          {smartTokens.ccy && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              ccy:{smartTokens.ccy}
            </span>
          )}
          {smartTokens.id && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              id:{smartTokens.id}
            </span>
          )}
          {smartTokens.minviews && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              minviews:{smartTokens.minviews}
            </span>
          )}
          {smartTokens.minclicks && (
            <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              minclicks:{smartTokens.minclicks}
            </span>
          )}
          {smartTokens.text?.length
            ? smartTokens.text.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  “{t}”
                </span>
              ))
            : null}
        </div>
      )}

      {/* Top cap banner */}
      {!!capInfo && (
        <div
          className={`mx-6 mt-4 rounded-lg border px-3 py-2 flex items-center gap-2 ${
            capInfo.remaining === 0
              ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200"
              : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
          }`}
        >
          <Info className="w-4 h-4" />
          <div className="flex-1">
            <div className="text-sm">
              Live cap:{" "}
              <strong>
                {capInfo.used} / {capInfo.max}
              </strong>{" "}
              {capInfo.remaining === 0
                ? "— limit reached"
                : `(${capInfo.remaining} remaining)`}
            </div>
            <div className="w-48 h-1.5 bg-black/10 rounded mt-1">
              <div
                className="h-1.5 rounded bg-gradient-to-r from-amber-400 to-rose-500"
                style={{ width: `${Math.min(100, capInfo.pct)}%` }}
              />
            </div>
          </div>
          <button
            className="text-sm px-3 py-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/10"
            onClick={topBannerAutofix}
          >
            See options
          </button>
        </div>
      )}

      {demoMode && (
        <div className="mx-6 mt-4 mb-0 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Showing sample data (demo). Sign in to see live stats and controls.
        </div>
      )}

      {/* BODY: Card or Table */}
      <div className="p-6">
        {/* error */}
        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        {/* empty state */}
        {!loading && sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500 dark:border-gray-700">
            No listings matched your filters.
            <div className="mt-2">
              Try clearing search, switching tabs, or{" "}
              <button
                onClick={() => router.push("/new-dashboard/products/new")}
                className="underline decoration-dotted underline-offset-4"
              >
                add a product
              </button>
              .
            </div>
          </div>
        ) : null}

        {/* skeleton (initial load) */}
        {loading && products.length === 0 ? (
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : null}

        {/* CARD GRID */}
        {useCards && sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((p) => (
<div
  key={p.id}
  role="button"
  tabIndex={0}
  aria-label={`Open ${p.title || `product #${p.id}`}`}
  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 flex gap-3 hover:shadow transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
  onClick={() => router.push(`/new-dashboard/products/${p.id}`)}
  onKeyDown={(e) => {
    // Activate with Enter/Space, ignore when using modifiers
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const k = e.key;
    if (k === "Enter" || k === " " || k === "Spacebar") {
      e.preventDefault();
      router.push(`/new-dashboard/products/${p.id}`);
    }
  }}
>
                <div className="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 shrink-0">
                  <SafeImage
                    src={thumbOf(p)}
                    alt=""
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium line-clamp-2">
                    {p.title || `#${p.id}`}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {nfmt(viewsOf(p))}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MousePointerClick className="w-3.5 h-3.5" /> {nfmt(clicksOf(p))}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {nfmt(contactClicksOf(p))}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px]">
                    {p.is_live ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                        Live
                      </span>
                    ) : p.status === 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-gray-500/15 text-gray-700 dark:text-gray-300">
                        Draft
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-amber-600/15 text-amber-700 dark:text-amber-300">
                        {statusLabel(p.status)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 self-start">
                  <a
                    href={viewHrefAbsolute(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 text-xs rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* TABLE */}
        {!useCards && sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`min-w-[900px] w-full ${tableText}`}>
              <thead className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="w-10 px-2 py-2">
                    <input
                      ref={masterRef}
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelected(checked ? new Set(allIdsInView) : new Set());
                      }}
                      aria-label="Select all in view"
                    />
                  </th>

                  {visibleCols.image && <th className="w-16 px-2 py-2">Image</th>}

                  {visibleCols.title && (
                    <th className="px-2 py-2">
                      <SortBtn label="Title" k="title" sort={sort} setSort={setSort} />
                    </th>
                  )}

                  {visibleCols.status && (
                    <th className="px-2 py-2">
                      <SortBtn label="Status" k="status" sort={sort} setSort={setSort} />
                    </th>
                  )}

                  {visibleCols.visibility && <th className="px-2 py-2">Visibility</th>}
                  {visibleCols.availability && <th className="px-2 py-2">Qty</th>}

                  {visibleCols.price && (
                    <th className="px-2 py-2">
                      <SortBtn label="Price" k="price" sort={sort} setSort={setSort} />
                    </th>
                  )}

                  {visibleCols.views && (
                    <th className="px-2 py-2 text-right">
                      <SortBtn label="Views" k="views" sort={sort} setSort={setSort} alignRight />
                    </th>
                  )}

                  {visibleCols.clicks && (
                    <th className="px-2 py-2 text-right">
                      <SortBtn label="Clicks" k="clicks" sort={sort} setSort={setSort} alignRight />
                    </th>
                  )}

                  {visibleCols.contacts && (
                    <th className="px-2 py-2 text-right">
                      <SortBtn label="Contacts" k="contacts" sort={sort} setSort={setSort} alignRight />
                    </th>
                  )}

                  {visibleCols.actions && <th className="w-[280px] px-2 py-2">Actions</th>}
                </tr>
              </thead>

              <tbody className="align-top">
                {sorted.map((p) => {
                  const isExpanded = expandedRows.includes(p.id);
                  const isChecked = selected.has(p.id);
                  const qty = qtyOfSafe(p);
                  const priceMajor = toMajor(p.price_cents, 2);
                  const ccy = p.price_currency || "";
                  const isLive = !!p.is_live;
                  const isPub = p.status === 1;

                  return (
                    <React.Fragment key={p.id}>
                      <tr className="border-t border-gray-100 dark:border-gray-700">
                        {/* select */}
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleSelect(p.id, e.target.checked)}
                          />
                        </td>

                        {/* image */}
                        {visibleCols.image && (
                          <td className="px-2 py-2">
                            <div className="h-full flex items-center">
                              <div className="rounded-md overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                                <SafeImage
                                  src={thumbOf(p)}
                                  alt={p.title || "image"}
                                  width={imgSize}
                                  height={imgSize}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          </td>
                        )}

                        {/* title */}
                        {visibleCols.title && (
                          <td className="px-2 py-2">
                            <div className="flex items-start gap-2">
                              <button
                                className="mt-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 p-1"
                                onClick={() => toggleRow(p.id)}
                                aria-label={isExpanded ? "Collapse" : "Expand"}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <div className="min-w-0">
                                <div className="font-medium line-clamp-2">
                                  {p.title || `#${p.id}`}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  Updated {fmtFriendly(p.updated_at || p.created_at)}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  <Chip label="CTR" value={ctrOf(p)} muted />
                                  <Chip label="Contact CTR" value={contactCtrOf(p)} muted />
                                </div>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* status */}
                        {visibleCols.status && (
                          <td className="px-2 py-2">
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] ${
                                isPub
                                  ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
                                  : "bg-gray-200/60 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {statusLabel(p.status)}
                            </span>
                          </td>
                        )}

                        {/* visibility */}
                        {visibleCols.visibility && (
                          <td className="px-2 py-2">
                            {isLive ? (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Live
                              </span>
                            ) : p.is_paused ? (
                              <span className="text-amber-600 dark:text-amber-400">
                                Paused
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        )}

                        {/* qty */}
                        {visibleCols.availability && (
                          <td className="px-2 py-2">
                            <button
                              onClick={() => setQtyTarget(p)}
                              className="inline-flex items-center gap-1 rounded border px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                              title="Quick edit quantity"
                            >
                              {qty}
                            </button>
                          </td>
                        )}

                        {/* price */}
                        {visibleCols.price && (
                          <td className="px-2 py-2">
                            <button
                              onClick={() => setPriceTarget(p)}
                              className="inline-flex items-center gap-1 rounded border px-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                              title="Quick edit price"
                            >
                              {priceMajor} {ccy}
                            </button>
                          </td>
                        )}

                        {/* views */}
                        {visibleCols.views && (
                          <td className="px-2 py-2 text-right">{nfmt(viewsOf(p))}</td>
                        )}
                        {/* clicks */}
                        {visibleCols.clicks && (
                          <td className="px-2 py-2 text-right">{nfmt(clicksOf(p))}</td>
                        )}
                        {/* contacts */}
                        {visibleCols.contacts && (
                          <td className="px-2 py-2 text-right">
                            {nfmt(contactClicksOf(p))}
                          </td>
                        )}

                        {/* actions */}
                        {visibleCols.actions && (
                          <td className="px-2 py-2">
                            <div className="flex flex-wrap gap-1.5">
                              {isPub ? (
                                p.is_paused ? (
                                  <button
                                    onClick={() => tryTogglePause(p)}
                                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    disabled={!!actionLoading[p.id]}
                                    title="Resume"
                                  >
                                    <Play className="w-3.5 h-3.5" /> Resume
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => tryTogglePause(p)}
                                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    disabled={!!actionLoading[p.id]}
                                    title="Pause"
                                  >
                                    <Pause className="w-3.5 h-3.5" /> Pause
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={() => tryPublish(p)}
                                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  disabled={!!actionLoading[p.id]}
                                  title="Publish"
                                >
                                  <Rocket className="w-3.5 h-3.5" /> Publish
                                </button>
                              )}

                              <button
                                onClick={() => router.push(`/new-dashboard/products/editor?id=${p.id}`)}
                                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title="Edit"
                              >
                                <FileEdit className="w-3.5 h-3.5" /> Edit
                              </button>

                              <a
                                href={viewHrefAbsolute(p)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </a>

                              <button
                                onClick={() => handleArchive(p.id)}
                                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title="Archive"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Archive
                              </button>

                              {actionLoading[p.id] ? (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 ml-1">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  {actionLoading[p.id]}
                                </span>
                              ) : null}
                            </div>
                          </td>
                        )}
                      </tr>

                      {/* expanded row */}
                      {isExpanded ? (
                        <tr className="border-t border-gray-100 dark:border-gray-700">
                          <td />
                          <td colSpan={999} className="px-2 py-3">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="rounded-lg border p-3 dark:border-gray-700">
                                <div className="text-xs font-semibold mb-2">
                                  Schedule
                                </div>

<ScheduleEditor
  product={p}
  canSchedule={
    accountCanSchedule ??
    featureEnabled(p, "schedule", p?.can_schedule !== false)
  }
  onBlocked={() => openPlanCompare("schedule")}
  onSave={(payload) => patchProduct(p.id, payload, "schedule")}
/>
                              </div>

                              <div className="rounded-lg border p-3 dark:border-gray-700">
                                <div className="text-xs font-semibold mb-2">
                                  Engagement (last {metricWindow})
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <MousePointerClick className="w-4 h-4" />
                                  Clicks: <strong>{nfmt(clicksOf(p))}</strong>
                                  <Phone className="w-4 h-4 ml-3" />
                                  Calls: <strong>{nfmt(phoneClicksOf(p))}</strong>
                                  <MessageCircle className="w-4 h-4 ml-3" />
                                  WhatsApp: <strong>{nfmt(whatsappClicksOf(p))}</strong>
                                </div>
                                <div className="mt-2">
                                  <ProgressMini
                                    valuePct={Number(
                                      String(ctrOf(p)).replace("%", "") || 0
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="rounded-lg border p-3 dark:border-gray-700">
                                <div className="text-xs font-semibold mb-2">
                                  Quick edits
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => setQtyTarget(p)}
                                    className="px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Change Qty
                                  </button>
                                  <button
                                    onClick={() => setPriceTarget(p)}
                                    className="px-2 py-1 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    Change Price
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* pagination / load more */}
        {hasMore ? (
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Load more
            </button>
          </div>
        ) : null}

        {/* loading spinner when appending */}
        {loading && products.length > 0 ? (
          <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading…
          </div>
        ) : null}
      </div>

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] rounded-xl bg-gray-900 text-white px-3 py-2 shadow-lg flex items-center gap-2">
          <span className="text-sm opacity-80">{selected.size} selected</span>
          <button
            onClick={() => runBatch("publish")}
            disabled={batchBusy}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-sm"
            title="Publish selected"
          >
            Publish
          </button>
          <button
            onClick={() => runBatch("pause")}
            disabled={batchBusy}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-sm"
            title="Pause selected"
          >
            Pause
          </button>
          <button
            onClick={() => runBatch("draft")}
            disabled={batchBusy}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-sm"
            title="Move selected to Draft"
          >
            Draft
          </button>
          <button
            onClick={() => runBatch("stock0")}
            disabled={batchBusy}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-sm"
            title="Set stock to 0"
          >
            Stock 0
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-sm"
            title="Clear selection"
          >
            Clear
          </button>

<button
  onClick={openBulkPrice}
  disabled={batchBusy}
  className="px-2 py-1 rounded text-sm
             border border-black/10 hover:bg-black/15
             dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
  title={canBulkPrice ? "Bulk price update" : "Available on Growth and Pro plans"}
>
  <span className="inline-flex items-center gap-1">
    {canBulkPrice ? (
      <DollarSign className="w-3.5 h-3.5" />
    ) : (
      <Lock className="w-3.5 h-3.5" />
    )}
    Price Update
  </span>
</button>

        </div>
      )}

      {/* Toast stack */}
      <div className="fixed bottom-4 right-4 z-[1000] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            actionLabel={t.actionLabel}
            onAction={t.onAction}
            onClose={() => dismiss(t.id)}
          />
        ))}
      </div>

      {/* Cap sheet */}
      <CapBottomSheet
        open={capOpen}
        onClose={() => setCapOpen(false)}
        ctx={capCtx}
        onAutofix={handleAutofix}
      />

      {/* Auto-Fix sheet */}
      <AutoFixSheet
        open={autoFixOpen}
        onClose={() => setAutoFixOpen(false)}
        products={products}
        patchProduct={patchProduct}
        openCapFor={(p, server) => setCapCtx({ product: p, mode: "publish", server })}
        push={push}
      />

{/* Bulk Price Update modal */}
{bulkPriceOpen && (
  <BulkPriceModal
    productIds={Array.from(selected)}
    onClose={() => setBulkPriceOpen(false)}
    onDone={async () => {
      setBulkPriceOpen(false);
      await fetchProducts(1, { silent: true }); // refresh prices
      push({
        type: "success",
        title: "Prices updated",
        message: `${selected.size} item${selected.size === 1 ? "" : "s"} updated.`,
      });
      setSelected(new Set());
    }}
  />
)}

{/* Plan comparison (upsell) */}
<PlanComparisonModal
  open={planModalOpen}
  onOpenChange={setPlanModalOpen}
  hideTrigger
  onPick={async (planId) => {
    try {
      // or call your upgrade API here
      router.push(
        `/account/billing?plan=${encodeURIComponent(planId)}&intent=${encodeURIComponent(planIntent ?? "")}`
      );
    } finally {
      setPlanModalOpen(false);
    }
  }}
/>



      {/* Quick modals */}
      {qtyTarget && (
        <QuickQtyModal
          product={qtyTarget}
          onClose={() => setQtyTarget(null)}
          onSave={async (newQty) => {
            const field = qtyFieldFor(qtyTarget);
            await patchProduct(qtyTarget.id, { [field]: newQty }, "qty");
          }}
        />
      )}
      {priceTarget && (
        <QuickPriceModal
          product={priceTarget}
          onClose={() => setPriceTarget(null)}
          onSave={async (newPriceMajor) => {
            const cents = Math.max(0, Math.round(Number(newPriceMajor) * 100));
            await patchProduct(priceTarget.id, { price_cents: cents }, "price");
          }}
        />
      )}
    </div>
  );
}








/* ----------------------- Quick Qty modal ----------------------- */
function QuickQtyModal({ product, onClose, onSave }) {
  const [val, setVal] = useState(() => qtyOfSafe(product));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const [recent, setRecent] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const r = JSON.parse(localStorage.getItem("recentQtys") || "[]");
      return Array.isArray(r) ? r.slice(0, 3) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e) { if (e.key === "Escape") onClose?.(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const clamp = (n) => Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
  const dec = () => setVal((v) => clamp(v - 1));
  const inc = () => setVal((v) => clamp(v + 1));

  async function save(n = val) {
    setBusy(true);
    try {
      const final = clamp(n);
      await onSave(final);
      // store recent
      const base = [1, 5, 10];
      if (!base.includes(final) && final > 0) {
        const next = [final, ...recent.filter((x) => x !== final)].slice(0, 3);
        setRecent(next);
        localStorage.setItem("recentQtys", JSON.stringify(next));
      }
      onClose?.();
    } finally {
      setBusy(false);
    }
  }

  async function markOutOfStock() {
    await save(0);
  }

  const presets = Array.from(new Set([1, 5, 10, ...recent])).slice(0, 6);

  return (
    <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal="true" aria-labelledby="qty-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[15%] sm:top-[20%] mx-auto w-[92vw] max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 id="qty-title" className="text-base font-semibold">Update Stock</h3>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {product?.title ? <span className="line-clamp-1">{product.title}</span> : "Product"}
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          <button
            onClick={dec}
            className="w-9 h-9 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Decrease"
          >−</button>

          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={0}
            value={val}
            onChange={(e) => setVal(clamp(Number(e.target.value)))}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") { e.preventDefault(); inc(); }
              if (e.key === "ArrowDown") { e.preventDefault(); dec(); }
              if (e.key === "Enter") { e.preventDefault(); save(); }
            }}
            className="w-24 text-center text-lg font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
          />

          <button
            onClick={inc}
            className="w-9 h-9 rounded-lg border bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Increase"
          >+</button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <button
            onClick={markOutOfStock}
            disabled={busy}
            className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
            title="Set quantity to 0 and save"
          >
            Out of stock
          </button>

          {presets.map((n) => (
            <button
              key={n}
              onClick={() => setVal(n)}
              disabled={busy}
              className="px-2.5 py-1 rounded-full border text-xs hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
              title={`Set quantity to ${n}`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
          <button
            onClick={() => save()}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Quick Price modal ----------------------- */
function QuickPriceModal({ product, onClose, onSave }) {
  const [val, setVal] = useState(() => {
    const major = Number(product?.price_cents || 0) / 100;
    return Number.isFinite(major) ? major.toFixed(2) : "0.00";
  });
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save() {
    setBusy(true);
    try {
      const num = Math.max(0, Number(val));
      await onSave(num);
      onClose?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal="true" aria-labelledby="price-title">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[18%] mx-auto w-[92vw] max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 id="price-title" className="text-base font-semibold">Update Price</h3>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">✕</button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {product?.title ? <span className="line-clamp-1">{product.title}</span> : "Product"}
        </div>
        <div className="flex items-center justify-center gap-2">
          <input
            ref={inputRef}
            type="number"
            min={0}
            step="0.01"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), save())}
            className="w-40 text-center text-lg font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
          />
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
          <button
            onClick={save}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- schedule editor ----------------------- */
function ScheduleEditor({ product, canSchedule, onBlocked, onSave }) {
  const [publishAt, setPublishAt] = useState(null);
  const [unpublishAt, setUnpublishAt] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const toLocalInput = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setPublishAt(product.publish_at ? toLocalInput(product.publish_at) : "");
    setUnpublishAt(product.unpublish_at ? toLocalInput(product.unpublish_at) : "");
  }, [product.publish_at, product.unpublish_at]);

  const toISOFromLocal = (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  async function save() {
    if (!canSchedule) return onBlocked();
    setSaving(true);
    try {
      const payload = {
        publish_at: toISOFromLocal(publishAt || ""),
        unpublish_at: toISOFromLocal(unpublishAt || ""),
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  }

  async function clearBoth() {
    if (!canSchedule) return onBlocked();
    setSaving(true);
    try {
      setPublishAt("");
      setUnpublishAt("");
      await onSave({ publish_at: null, unpublish_at: null });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 dark:text-gray-300">Publish at</label>
        <input
          type="datetime-local"
          value={publishAt ?? ""}
          onChange={(e) => setPublishAt(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
        />
        <div className="text-[11px] text-gray-500">{product.publish_at_friendly ? `Current: ${product.publish_at_friendly}` : "—"}</div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 dark:text-gray-300">Unpublish at</label>
        <input
          type="datetime-local"
          value={unpublishAt ?? ""}
          onChange={(e) => setUnpublishAt(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
        />
        <div className="text-[11px] text-gray-500">{product.unpublish_at_friendly ? `Current: ${product.unpublish_at_friendly}` : "—"}</div>
      </div>

      <div className="sm:col-span-2 flex items-center gap-2 pt-1">
        <button
          onClick={save}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${canSchedule ? "bg-gray-900 text-white hover:bg-black" : "bg-gray-300/60 text-gray-600 cursor-not-allowed"}`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
          Save Schedule
        </button>
        <button onClick={clearBoth} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700">
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}