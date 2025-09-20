// src/components/new-dashboard/products/ProductListCards.jsx
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  MousePointerClick,
  Phone,
  MessageCircle,
  CheckCircle,
  Pause,
  Rocket,
  Pencil,
  Trash2,
  MoreVertical,
  X,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

/* ---------- tiny helpers ---------- */
const nfmt = (n) => new Intl.NumberFormat().format(Number(n || 0));
const major = (cents = 0) => (Number(cents || 0) / 100).toFixed(2);
const toCents = (num) => Math.max(0, Math.round(Number(num || 0) * 100));

function firstTruthy(...a) {
  for (const v of a) if (typeof v === "string" && v.trim()) return v;
  return null;
}
function thumbOf(p) {
  return (
    firstTruthy(
      p.card_image,
      p.card_image_url,
      p.thumbnail,
      p.image_url,
      p.image,
      p.image_objects?.[0]?.image_url,
      p.image_objects?.[0]?.url
    ) || "/placeholder.png"
  );
}
function qtyFieldFor(p) {
  if (Object.prototype.hasOwnProperty.call(p || {}, "product_quantity"))
    return "product_quantity";
  if (Object.prototype.hasOwnProperty.call(p || {}, "quantity")) return "quantity";
  if (Object.prototype.hasOwnProperty.call(p || {}, "stock")) return "stock";
  return "product_quantity";
}
function textMatch(p, terms) {
  if (!terms.length) return true;
  const hay = `${(p.title || "").toLowerCase()} ${(p.slug || "").toLowerCase()}`;
  return terms.every((t) => hay.includes(t));
}

function StatusPill({ status }) {
  const isPublished = status === 1;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
        isPublished
          ? "bg-emerald-600/15 text-emerald-600 dark:text-emerald-300"
          : "bg-gray-500/15 text-gray-600 dark:text-gray-300"
      }`}
      title={isPublished ? "Published" : "Draft"}
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
function LivePill({ is_live, is_paused }) {
  const label = is_live ? "Live" : is_paused ? "Paused" : "Hidden";
  const style = is_live
    ? "text-emerald-600 dark:text-emerald-400"
    : is_paused
    ? "text-amber-600 dark:text-amber-400"
    : "text-gray-500 dark:text-gray-400";
  const Icon = is_live ? Rocket : is_paused ? Pause : Eye;
  return (
    <span className={`inline-flex items-center gap-1 ${style}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

/* ---------- skeleton ---------- */
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
          <div className="h-3 w-2/4 rounded bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
      <div className="mt-4 h-6 w-28 rounded bg-gray-200/70 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

/* ---------- quick modals ---------- */
function QuickQtyModal({ product, onClose, onSave }) {
  const [val, setVal] = useState(0);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const start =
      Number(product?.product_quantity ?? product?.quantity ?? product?.stock ?? 0) || 0;
    setVal(start);
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  const clamp = (n) => Math.max(0, Math.floor(Number.isFinite(n) ? n : 0));
  const dec = () => setVal((v) => clamp(v - 1));
  const inc = () => setVal((v) => clamp(v + 1));

  async function save(n = val) {
    setBusy(true);
    try {
      await onSave(clamp(n));
      onClose?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1200]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[18%] mx-auto w-[92vw] max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium line-clamp-1">{product?.title}</div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          <button onClick={dec} className="w-9 h-9 rounded-lg border">−</button>
          <input
            ref={inputRef}
            type="number"
            min={0}
            value={val}
            onChange={(e) => setVal(clamp(Number(e.target.value)))}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), save())}
            className="w-24 text-center text-lg font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
          />
          <button onClick={inc} className="w-9 h-9 rounded-lg border">+</button>
        </div>

        <div className="flex items-center justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">Cancel</button>
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

function QuickPriceModal({ product, onClose, onSave }) {
  const [val, setVal] = useState("0.00");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setVal(major(product?.price_cents || 0));
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

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
    <div className="fixed inset-0 z-[1200]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[18%] mx-auto w-[92vw] max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium line-clamp-1">{product?.title}</div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center">
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

        <div className="flex items-center justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">Cancel</button>
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

/* ---------- main ---------- */
export default function ProductListCards({ filter, query, onMeta }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // last successful load time (for header meta)
  const [loadedAt, setLoadedAt] = useState(null);

  // quick editors
  const [qtyTarget, setQtyTarget] = useState(null);
  const [priceTarget, setPriceTarget] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const { data } = await axiosInstance.get("/api/products/mine/", {
          params: { page_size: 60 },
          withCredentials: true,
          headers: { Accept: "application/json" },
        });
        const rows = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : [];
        if (alive) {
          setProducts(rows);
          setLoadedAt(new Date());
        }
      } catch (e) {
        if (alive) setErr("Failed to load products.");
        // eslint-disable-next-line no-console
        console.error("❌ products fetch", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const terms = q ? q.split(/\s+/).filter(Boolean) : [];
    return (products || []).filter((p) => {
      const statusOk =
        filter === "all"
          ? true
          : filter === "live"
          ? !!p.is_live
          : filter === "paused"
          ? p.status === 1 && !!p.is_paused
          : filter === "draft"
          ? p.status === 0
          : true;
      return statusOk && textMatch(p, terms);
    });
  }, [products, filter, query]);

  // Report meta up whenever count or loadedAt changes.
  useEffect(() => {
    onMeta?.({
      count: filtered.length,
      statsBusy: false,
      updatedAt: loadedAt, // "updated just now" after load; no extra requests
    });
  }, [filtered.length, loadedAt, onMeta]);

  async function patchProduct(id, payload) {
    setSavingId(id);
    const prev = products.find((x) => x.id === id) || null;

    // optimistic UI
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...payload } : x)));

    try {
      const { data } = await axiosInstance.patch(`/api/products/${id}/`, payload, {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
      setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
      setLoadedAt(new Date()); // reflect quick edit in header meta
    } catch (e) {
      // revert
      if (prev) setProducts((p) => p.map((x) => (x.id === id ? prev : x)));
      throw e;
    } finally {
      setSavingId(null);
    }
  }

  if (err) {
    return <p className="text-red-500 dark:text-red-400 text-center mt-4">{err}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {loading && products.length === 0
        ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        : null}

      {filtered.map((p) => {
        const img = thumbOf(p);
        const qty = Number(p.product_quantity ?? p.quantity ?? p.stock ?? 0);
        const out = qty <= 0;
        const priceStr = `${(p.price_currency || "").toUpperCase()} ${major(
          p.price_cents
        )}`;
        const busy = savingId === p.id;

        return (
          <div
            key={p.id}
            className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm hover:shadow-md transition"
          >
            {/* top row */}
            <div className="flex items-start gap-3">
              {/* image */}
              <Link
                href={p.frontend_url || `/product/${p.slug || p.id}`}
                className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700"
                aria-label={`Open ${p.title || `product #${p.id}`}`}
              >
                <Image
                  src={img}
                  alt={p.title || "image"}
                  fill
                  sizes="(max-width: 640px) 80px, 100px"
                  className="object-cover"
                />
              </Link>

              {/* title + badges */}
              <div className="min-w-0 flex-1">
                <Link
                  href={p.frontend_url || `/product/${p.slug || p.id}`}
                  className="block font-semibold text-[15px] leading-snug text-gray-900 dark:text-white hover:underline line-clamp-2"
                >
                  {p.title || `#${p.id}`}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusPill status={p.status} />
                  <LivePill is_live={p.is_live} is_paused={p.is_paused} />

                  {/* qty is clickable -> opens qty modal */}
                  <button
                    type="button"
                    onClick={() => setQtyTarget(p)}
                    className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 border ${
                      out
                        ? "border-rose-300 text-rose-600 dark:text-rose-400"
                        : "border-emerald-300 text-emerald-700 dark:text-emerald-400"
                    }`}
                    title="Quick edit quantity"
                  >
                    {out ? "Out of stock" : `In stock (${qty})`}
                  </button>
                </div>
              </div>

              {/* quick actions */}
              <div className="flex gap-1 self-start sm:opacity-0 sm:group-hover:opacity-100 transition">
                <Link
                  href={{
                    pathname: "/new-dashboard/products/editor",
                    query: { id: p.id, step: "basics" },
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  prefetch
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  type="button"
                  className="p-1.5 rounded-md border hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  title="Archive / Delete"
                >
                  <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800"
                  title="More"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* price (click to quick edit) */}
            <button
              type="button"
              onClick={() => setPriceTarget(p)}
              className="mt-3 w-full text-left text-lg font-bold text-gray-900 dark:text-white rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 px-2 py-1 inline-flex items-center gap-2"
              title="Quick edit price"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{priceStr}</span>
            </button>

            {/* metrics */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {nfmt(p.views ?? p.impressions ?? 0)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MousePointerClick className="w-4 h-4" />
                {nfmt(p.clicks ?? p.clicks_count ?? p.outbound_clicks ?? 0)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {nfmt(p.phone_clicks ?? p.call_clicks ?? 0)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {nfmt(p.whatsapp_clicks ?? p.contact_whatsapp_clicks ?? 0)}
              </span>
            </div>

            {/* footer buttons (touch) */}
            <div className="mt-3 sm:hidden flex gap-2">
              <Link
                href={{ pathname: "/new-dashboard/products/editor", query: { id: p.id, step: "basics" } }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                prefetch
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Link>
              <a
                href={p.frontend_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </a>
            </div>
          </div>
        );
      })}

      {!loading && filtered.length === 0 ? (
        <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-gray-500 dark:border-gray-700">
          No listings matched your filters.
        </div>
      ) : null}

      {/* Quick modals */}
      {qtyTarget && (
        <QuickQtyModal
          product={qtyTarget}
          onClose={() => setQtyTarget(null)}
          onSave={async (newQty) => {
            const field = qtyFieldFor(qtyTarget);
            await patchProduct(qtyTarget.id, { [field]: newQty });
          }}
        />
      )}
      {priceTarget && (
        <QuickPriceModal
          product={priceTarget}
          onClose={() => setPriceTarget(null)}
          onSave={async (newPriceMajor) => {
            await patchProduct(priceTarget.id, { price_cents: toCents(newPriceMajor) });
          }}
        />
      )}
    </div>
  );
}