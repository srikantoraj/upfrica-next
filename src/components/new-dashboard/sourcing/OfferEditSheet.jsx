// src/components/new-dashboard/sourcing/OfferEditSheet.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import toast from "react-hot-toast";
import { getOffer, updateOffer, withdrawOffer } from "@/lib/sourcing/api";

/* ---------------- helpers ---------------- */
const CURRENCY_SYM = { GHS:"₵", NGN:"₦", ZAR:"R", KES:"KSh", GBP:"£", USD:"$", EUR:"€" };
const EDITABLE_STATUSES = new Set(["pending", "submitted", "counter"]);

const currencyToSymbol = (code) => CURRENCY_SYM[(code || "").toUpperCase()] || (code || "");
const toNumber = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const fmtCurrency = (n, c) => {
  try { return new Intl.NumberFormat(undefined,{style:"currency",currency:c}).format(toNumber(n,0)); }
  catch { return `${toNumber(n,0).toLocaleString()} ${c}`; }
};
const flattenApiErrors = (err) => {
  const d = err?.response?.data;
  if (!d) return "Request failed.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.join(", ");
  return Object.entries(d).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`).join(" • ");
};

/* ---------------- component ---------------- */
/**
 * Props:
 * - offerId?: number
 * - offer?: object (if already loaded)
 * - request?: object (for currency fallback)
 * - onUpdated?: (updatedOffer) => void
 * - onWithdrawn?: () => void
 * - onClose?: () => void
 */
export default function OfferEditSheet({ offerId, offer: initialOffer, request, onUpdated, onWithdrawn, onClose }) {
  const router = useRouter();

  /* ---------- load offer if needed ---------- */
  const [offer, setOffer] = useState(initialOffer || null);
  const [loading, setLoading] = useState(!initialOffer);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (initialOffer) return;
      if (!offerId) return;
      setLoading(true);
      setLoadErr("");
      try {
        const o = await getOffer(offerId);
        if (!cancelled) setOffer(o);
      } catch (e) {
        if (!cancelled) setLoadErr("Failed to load offer.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [offerId, initialOffer]);

  // currency & status
  const cur = (offer?.currency || request?.currency || "GHS").toUpperCase();
  const editable = !offer?.status || EDITABLE_STATUSES.has(String(offer.status).toLowerCase());

  /* ---------- form state (seed from offer once loaded) ---------- */
  const [item, setItem] = useState(0);
  const [service, setService] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [eta, setEta] = useState(2);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (!offer) return;
    setItem(offer.quoted_item_cost ?? 0);
    setService(offer.agent_fee ?? 0);
    setDelivery(offer.delivery_fee ?? 0);
    setEta(offer.eta_days ?? 2);
    setNotes(offer.notes ?? "");
    dirtyRef.current = false;
  }, [offer]);

  const total = useMemo(() => toNumber(item) + toNumber(service) + toNumber(delivery), [item, service, delivery]);

  /* ---------- unsaved changes guard ---------- */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dirtyRef = useRef(false);
  useEffect(() => { dirtyRef.current = true; }, [item, service, delivery, eta, notes]);
  useEffect(() => {
    const beforeUnload = (e) => {
      if (dirtyRef.current && !saving) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [saving]);

  function handleCancel() {
    if (dirtyRef.current && !saving && !confirm("Discard changes?")) return;
    onClose?.();
  }

  async function handleSave(e) {
    e?.preventDefault?.();
    if (!offer?.id || !editable) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        quoted_item_cost: toNumber(item, 0),
        agent_fee: toNumber(service, 0),
        delivery_fee: toNumber(delivery, 0),
        eta_days: Math.max(1, toNumber(eta, 1)),
        notes,
      };
      const updated = await updateOffer(offer.id, payload);
      dirtyRef.current = false;
      setOffer(updated);
      toast.success("Offer updated.");
      onUpdated ? onUpdated(updated) : router.refresh();
    } catch (err) {
      const msg = flattenApiErrors(err);
      setError(msg);
      toast.error(msg || "Could not update offer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleWithdraw() {
    if (!offer?.id) return;
    if (!confirm("Withdraw this offer? The buyer will no longer see it.")) return;
    try {
      await withdrawOffer(offer.id);
      toast.success("Offer withdrawn.");
      onWithdrawn ? onWithdrawn() : onClose?.();
    } catch (err) {
      toast.error(flattenApiErrors(err));
    }
  }

  const symbol = currencyToSymbol(cur);

  return (
    <div
      data-testid="offer-edit-sheet"
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-edit-title"
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "w-full md:max-w-lg rounded-t-2xl md:rounded-2xl bg-white dark:bg-neutral-900 shadow-xl p-4 md:p-5"
        )}
      >
        {/* Handle (mobile) */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300 md:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="offer-edit-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Edit offer #{offer?.id ?? offerId ?? "—"}
            </h2>
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Request: {offer?.request_id ?? request?.id ?? "—"} · Status: {String(offer?.status || "—").toUpperCase()}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Loading / error */}
        {loading && (
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">Loading offer…</div>
        )}
        {loadErr && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            {loadErr}
          </div>
        )}

        {/* Form */}
        {!loading && (
          <>
            {!editable && (
              <div className="mt-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                This offer can no longer be edited (status: {String(offer?.status).toUpperCase()}).
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MoneyInput label="Item price"  currency={cur} value={item}     onChange={setItem}     disabled={!editable || saving} symbol={symbol} />
              <MoneyInput label="Service fee" currency={cur} value={service}  onChange={setService}  disabled={!editable || saving} symbol={symbol} />
              <MoneyInput label="Delivery fee" currency={cur} value={delivery} onChange={setDelivery} disabled={!editable || saving} symbol={symbol} />
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">ETA (days)</label>
                <input
                  type="number" min="1" step="1" inputMode="numeric"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  value={eta} onChange={(e) => setEta(e.target.value)} disabled={!editable || saving}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Minimum 1 day. Includes sourcing &amp; delivery time.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">Notes to buyer</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  placeholder="Condition, color/variant, pickup options…"
                  value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!editable || saving}
                />
              </div>
            </div>

            {/* Summary & actions */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <div className="text-neutral-500 dark:text-neutral-400">Buyer sees</div>
                <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{fmtCurrency(total, cur)}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {fmtCurrency(item || 0, cur)} item · {fmtCurrency(delivery || 0, cur)} delivery
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editable || saving}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium text-white",
                    "bg-gradient-to-r from-[#8710D880] via-[#8710D8CC] to-[#2563eb]",
                    "hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8710D8CC]",
                    "disabled:opacity-60 dark:ring-offset-neutral-900"
                  )}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                {editable && (
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>

            {!!error && (
              <div className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
                {error}
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}

/* ---------------- subcomponent ---------------- */
function MoneyInput({ label, currency, value, onChange, disabled, symbol }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">{symbol}</span>
        <input
          type="number" min="0" step="0.01" inputMode="decimal"
          value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className="w-full rounded-lg border border-neutral-300 pl-7 pr-3 py-2 text-neutral-900 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{currency}</div>
    </div>
  );
}