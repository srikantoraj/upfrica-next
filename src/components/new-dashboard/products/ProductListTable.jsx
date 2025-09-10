//src/components/new-dashboard/products/ProductListTable.jsx
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/constants";
import { getCardImage } from "@/app/constants";
import axiosInstance from "@/lib/axiosInstance";

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
} from "lucide-react";

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
  // default to product_quantity if none present
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
  s === 1 ? "Published" : s === 0 ? "Draft" : s === 2 ? "Under review" : "—";

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
            <div className="text-[12px] opacity-90 leading-snug mt-0.5">
              {message}
            </div>
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
  const push = ({ type = "info", title, message, ttl = 4500, actionLabel, onAction }) => {
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

  const isCap = ctx.server?.code === "cap_reached" || ctx.mode === "publish";
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
                    style={{ width: `${Math.round((done / Math.max(1,totalTargets)) * 100)}%` }}
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
export default function ProductListTable() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [capOpen, setCapOpen] = useState(false);
  const [capCtx, setCapCtx] = useState(null);

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

  // search + URL + prefs
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = React.useDeferredValue(query);

  const searchRef = useRef(null);

  // hydrate from URL/localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    const q = u.searchParams.get("q") || localStorage.getItem("prod.q") || "";
    const tab = u.searchParams.get("tab") || localStorage.getItem("prod.tab") || "all";
    setSearchInput(q);
    setQuery(q.trim());
    setFilter(tab);
  }, []);

  // persist to URL + prefs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams();
    if (filter && filter !== "all") qs.set("tab", filter);
    if (searchInput.trim()) qs.set("q", searchInput.trim());
    const str = qs.toString();
    router.replace(str ? `?${str}` : "?", { scroll: false });
    localStorage.setItem("prod.tab", filter);
    localStorage.setItem("prod.q", searchInput.trim());
  }, [filter, searchInput, router]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setQuery(searchInput.trim()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Cmd/Ctrl+K focus
  useEffect(() => {
    const onK = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onK);
    return () => window.removeEventListener("keydown", onK);
  }, []);

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

  async function fetchProducts(pageNum = 1) {
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

      if (pageNum === 1) {
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
        push({ type: "error", title: "Couldn’t load listings", message: tidyError(e) });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    fetchProducts(next);
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

      // show undo only for a subset of actions
      const allowUndo = ["pause", "draft", "publish"].includes(mode) || "is_paused" in patch || "status" in patch;
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
        push({ type: "success", title: "Saved", message: "Your changes have been applied.", ttl: 2000 });
      }
    } catch (e) {
      const payload = tidyAxiosPayload(e);
      await fetchProducts(1);
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
      push({ type: "info", title: "Archived (demo)", message: "This is demo mode." });
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
    await patchProduct(
      p.id,
      { status: 1, is_paused: false, autofix: true },
      "publish"
    );
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

  // selection helpers
  const toggleSelect = (id, checked) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };
  const allIdsInView = filtered.map((p) => p.id);
  const allChecked =
    selected.size > 0 && allIdsInView.every((id) => selected.has(id));

  const clearSelection = () => setSelected(new Set());

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
        }
      });
      push({ type: "success", title: "Batch complete", message: `${ids.length} item(s) updated.` });
    } finally {
      clearSelection();
      setBatchBusy(false);
    }
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="sticky top-0 z-20 p-6 bg-white/85 dark:bg-gray-800/85 backdrop-blur border-b border-gray-100 dark:border-gray-700 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Product Listings
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
            {[
              { key: "all", label: "All" },
              { key: "live", label: "Live" },
              { key: "paused", label: "Paused" },
              { key: "draft", label: "Drafts" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  filter === f.key
                    ? "bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* smart search */}
          <div className="relative">
            <input
              id="prod-search"
              ref={searchRef}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search: text or tokens (e.g. status:live minviews:100 country:gh id:42)'
              className="w-[420px] max-w-[92vw] pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-gray-900/20"
              aria-label="Search listings"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {!!searchInput && (
              <button
                aria-label="Clear search"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
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
          <button
            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSearchInput("")}
          >
            Clear
          </button>
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

      <div className="overflow-x-auto p-6">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="sticky top-[68px] z-10 bg-gray-50 dark:bg-gray-900/60 backdrop-blur text-gray-800 dark:text-gray-100 text-sm font-semibold">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allChecked}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? new Set(allIdsInView) : new Set()
                    )
                  }
                />
              </th>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Visibility</th>
              <th className="p-3">Availability</th>
              <th className="p-3">Price</th>
              <th className="p-3">Views</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Contacts</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const img = thumbOf(p);
              const price = toMajor(p.price_cents, 2);
              const ccy = (p.price_currency || "").toUpperCase();
              const href = viewHrefAbsolute(p);
              const isOpen = expandedRows.includes(p.id);

              const v = Number(viewsOf(p));
              const c = Number(clicksOf(p));
              const w = Number(whatsappClicksOf(p));
              const ph = Number(phoneClicksOf(p));
              const cc = Number(contactClicksOf(p));
              const pct = v ? (c / v) * 100 : 0;

              const visText =
                p.visibility_label ||
                (p.status === 1 ? (p.is_paused ? "Paused" : "Published") : "Hidden");
              const visClass = p.is_live
                ? "text-emerald-600"
                : p.status === 1 && p.is_paused
                ? "text-amber-600"
                : "text-gray-500";

              const canPublish = p?.can_publish !== false;
              const canPause = p?.can_resume !== false;

              const qty = qtyOfSafe(p);
              const qtyClass =
                qty === 0
                  ? "text-rose-600"
                  : qty < 5
                  ? "text-amber-600"
                  : "text-emerald-600";

              return (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-gray-200 dark:border-gray-700 align-top">
                    <td className="p-3 align-middle">
                      <input
                        type="checkbox"
                        aria-label={`Select ${p.title || `#${p.id}`}`}
                        checked={selected.has(p.id)}
                        onChange={(e) => toggleSelect(p.id, e.target.checked)}
                      />
                    </td>

                    <td className="p-3">
                      <Link href={href} className="block w-fit" target="_blank">
                        <SafeImage
                          src={img}
                          alt={p.title || "Product"}
                          width={56}
                          height={56}
                          className="rounded object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                        />
                      </Link>
                    </td>

                    <td className="p-3 font-medium text-gray-900 dark:text-white">
                      <div className="flex flex-col">
                        <Link href={href} target="_blank" className="hover:underline">
                          {p.title || "—"}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <Chip icon={Eye} label="Views" value={nfmt(v)} muted />
                          <Chip icon={MousePointerClick} label="Clicks" value={nfmt(c)} muted />
                          <Chip icon={MessageCircle} label="Contacts" value={nfmt(cc)} muted />
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          p.status === 1 ? "text-emerald-600" : "text-gray-500"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {statusLabel(p.status)}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 ${visClass}`}>
                          <Eye className="w-4 h-4" />
                          {visText} {p.is_live ? "(live)" : ""}
                        </span>
                        {(p.publish_at_friendly || p.unpublish_at_friendly) && (
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">
                            {p.publish_at_friendly ? `Publishes: ${p.publish_at_friendly}` : ""}
                            {p.publish_at_friendly && p.unpublish_at_friendly ? " · " : ""}
                            {p.unpublish_at_friendly ? `Unpublishes: ${p.unpublish_at_friendly}` : ""}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => setQtyTarget(p)}
                        className={`${qtyClass} font-semibold underline decoration-dotted underline-offset-2 hover:opacity-90`}
                        title="Quick edit stock"
                      >
                        {qty > 0 ? "In Stock" : "Out of Stock"} ({qty})
                      </button>
                    </td>

                    <td className="p-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      <button
                        onClick={() => setPriceTarget(p)}
                        className="underline decoration-dotted underline-offset-2 hover:opacity-90"
                        title="Quick edit price"
                      >
                        {ccy ? `${ccy} ${price}` : price}
                      </button>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <Eye className="w-4 h-4" />
                          {nfmt(v)}
                        </span>
                        <ProgressMini valuePct={pct} />
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">CTR {ctrOf(p)}</div>
                    </td>

                    <td className="p-3">
                      <div className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <MousePointerClick className="w-4 h-4" />
                        {nfmt(c)}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1" title="WhatsApp clicks">
                            <MessageCircle className="w-4 h-4" />
                            {nfmt(w)}
                          </span>
                          <span className="inline-flex items-center gap-1" title="Phone clicks">
                            <Phone className="w-4 h-4" />
                            {nfmt(ph)}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500">Contact CTR {contactCtrOf(p)}</div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => router.push(`/new-dashboard/products/editor?id=${p.id}`)}
                          className="px-2 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => tryPublish(p)}
                          className={`px-2 py-1 rounded border ${canPublish ? "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "opacity-70 hover:bg-white/0"}`}
                          title={canPublish ? "Publish" : "Publish (limit reached)"}
                        >
                          <Rocket className={`w-4 h-4 ${canPublish ? "text-emerald-600" : "text-gray-400"}`} />
                        </button>

                        <button
                          onClick={() => patchProduct(p.id, { status: 0 }, "draft")}
                          className="px-2 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Move to Draft"
                          disabled={!!actionLoading[p.id]}
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>

                        {p.status === 1 && (
                          <button
                            onClick={() => tryTogglePause(p)}
                            className={`px-2 py-1 rounded border ${canPause ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-60"}`}
                            title={p.is_paused ? "Resume" : "Pause"}
                          >
                            {p.is_paused ? (
                              <Play className={`w-4 h-4 ${canPause ? "text-emerald-600" : "text-gray-400"}`} />
                            ) : (
                              <Pause className={`w-4 h-4 ${canPause ? "text-amber-600" : "text-gray-400"}`} />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => toggleRow(p.id)}
                          title={isOpen ? "Hide details" : "Schedule / Details"}
                          className="px-2 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleArchive(p.id)}
                          className="px-2 py-1 rounded border hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Archive"
                          disabled={!!actionLoading[p.id]}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>

                        {actionLoading[p.id] && (
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            {actionLoading[p.id]}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="bg-gray-50 dark:bg-gray-900/40">
                      <td colSpan={11} className="p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 md:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                Scheduling
                              </h4>
                              <div className="text-[11px] text-gray-500">Times saved in your local timezone.</div>
                            </div>

                            <ScheduleEditor
                              product={p}
                              canSchedule={p?.can_schedule !== false}
                              onBlocked={() => {
                                setCapCtx({
                                  product: p,
                                  mode: "schedule",
                                  cap: { max: p?.publish_cap, used: p?.published_count },
                                  reason: "plan_no_schedule",
                                });
                                setCapOpen(true);
                              }}
                              onSave={(payload) => patchProduct(p.id, payload, "schedule")}
                            />
                          </div>

                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Details</h4>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                              <div><span className="font-semibold">Date Added:</span> {fmtFriendly(p.created_at_friendly || p.created_at)}</div>
                              <div><span className="font-semibold">Last Updated:</span> {fmtFriendly(p.updated_at_friendly || p.updated_at)}</div>
                              <div><span className="font-semibold">Product ID:</span> #{p.id}</div>
                              {p.slug && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">URL:</span>{" "}
                                  <code className="text-[11px] break-all">
                                    /{(p.listing_country_code || p.seller_country || "gh").toLowerCase()}/{p.slug}
                                  </code>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="p-10 text-center text-gray-500">No products match this view.</td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <p className="text-center mt-4 text-gray-400 dark:text-gray-500">
            <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
            Loading…
          </p>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-6">
            <button onClick={handleLoadMore} disabled={demoMode} className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black disabled:opacity-60">
              {demoMode ? "Demo: Pagination Off" : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Batch action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] rounded-xl bg-gray-900 text-white px-3 py-2 shadow-lg flex items-center gap-2">
          <span className="text-sm opacity-80">{selected.size} selected</span>
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
            onClick={clearSelection}
            className="ml-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-sm"
            title="Clear selection"
          >
            Clear
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
      <CapBottomSheet open={capOpen} onClose={() => setCapOpen(false)} ctx={capCtx} onAutofix={handleAutofix} />

      {/* Auto-Fix sheet */}
      <AutoFixSheet
        open={autoFixOpen}
        onClose={() => setAutoFixOpen(false)}
        products={products}
        patchProduct={patchProduct}
        openCapFor={(p, server) => setCapCtx({ product: p, mode: "publish", server })}
        push={push}
      />

      {/* Quick Qty modal */}
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

      {/* Quick Price modal */}
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