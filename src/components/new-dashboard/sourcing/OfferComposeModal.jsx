// src/components/new-dashboard/sourcing/OfferComposeModal.jsx
// src/components/new-dashboard/sourcing/OfferComposeModal.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { createOffer } from "@/lib/sourcing/api";

/* ---------------- helpers ---------------- */

const CURRENCY_SYM = {
  GHS: "₵",
  NGN: "₦",
  ZAR: "R",
  KES: "KSh",
  GBP: "£",
  USD: "$",
  EUR: "€",
};
const currencyToSymbol = (code) => CURRENCY_SYM[(code || "").toUpperCase()] || (code || "");
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
function formatCurrency(n, c) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c,
    }).format(toNumber(n, 0));
  } catch {
    return `${toNumber(n, 0).toLocaleString()} ${c}`;
  }
}
function prettyDate(d) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return d?.toDateString?.() || "";
  }
}
function prettyCode(req) {
  const raw = req?.public_id || req?.uid || req?.id;
  if (!raw) return "RQ-??????";
  const s = String(raw);
  const base = /^\d+$/.test(s)
    ? Number(s).toString(36).toUpperCase()
    : s.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `RQ-${base.padStart(6, "0").slice(-6)}`;
}
function safeUrl(u) {
  try {
    const url = new URL(u);
    return /^(https?):$/.test(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
function hostOf(u) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}
function flattenApiErrors(err) {
  // DRF error shapes → one string
  const data = err?.response?.data;
  if (!data) return "Could not create offer.";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(", ");
  const parts = [];
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) parts.push(`${k}: ${v.join(", ")}`);
    else parts.push(`${k}: ${String(v)}`);
  }
  return parts.join(" • ");
}

/* ---------------- component ---------------- */

export default function OfferComposeModal({ request, onClose, onCreated }) {
  const cur = (request?.currency || "GHS").toUpperCase();

  // stepper
  const [step, setStep] = useState(1);

  // fields
  const [item, setItem] = useState("");
  const [service, setService] = useState("");
  const [delivery, setDelivery] = useState("");
  const [eta, setEta] = useState(2);
  const [notes, setNotes] = useState("");
  const [noAlts, setNoAlts] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const overlayRef = useRef(null);
  const titleId = "offer-compose-title";

  // ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // click overlay to close
  function onOverlayClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  // totals & arrival
  const total = toNumber(item) + toNumber(service) + toNumber(delivery);
  const arrivalDate = useMemo(() => {
    const d = new Date();
    const add = Math.max(0, toNumber(eta, 0));
    d.setDate(d.getDate() + add);
    return d;
  }, [eta]);

  // media links
  const mediaLinks = useMemo(() => {
    const fromSpecs = Array.isArray(request?.specs?.media_links) ? request.specs.media_links : [];
    const fromTop = Array.isArray(request?.media) ? request.media : [];
    return Array.from(new Set([...fromSpecs, ...fromTop].map(safeUrl).filter(Boolean)));
  }, [request]);
  const imageLinks = mediaLinks.filter((u) => /\.(png|jpe?g|webp|gif|bmp)(\?.*)?$/i.test(u));
  const otherLinks = mediaLinks.filter((u) => !imageLinks.includes(u));

  const canSubmit = toNumber(item) > 0 && toNumber(eta) >= 1 && !submitting;

  async function onSubmit(e) {
    e.preventDefault();
    if (step !== 2) {
      setStep(2);
      return;
    }
    if (!canSubmit) return;

    setError("");
    setSubmitting(true);
    try {
      await createOffer({
        request: request.id,
        quoted_item_cost: toNumber(item, 0),
        agent_fee: toNumber(service, 0),
        delivery_fee: toNumber(delivery, 0),
        eta_days: toNumber(eta, 2),
        notes,
        no_alternatives: !!noAlts,
      });

      // success toast
      toast.success(
        `Offer sent for “${request?.title || "request"}”. Buyer sees ${formatCurrency(
          total,
          cur
        )} · ETA ${toNumber(eta)} day${toNumber(eta) === 1 ? "" : "s"} (${prettyDate(arrivalDate)}).`,
        { duration: 4500 }
      );

      // let parent update / close
      onCreated?.();
      onClose?.();
    } catch (err) {
      const msg = flattenApiErrors(err);
      setError(msg);
      toast.error(msg || "Could not create offer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 p-3"
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white p-0 shadow-xl dark:bg-neutral-900"
      >
        {/* Header */}
        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id={titleId} className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {step === 1 ? "Review request" : `Quote: ${request?.title}`}
              </h3>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-mono border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                {prettyCode(request)}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Stepper */}
          <ol className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <li
              className={clsx(
                "rounded-full px-3 py-1 text-center",
                step >= 1
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              )}
            >
              1 · Overview
            </li>
            <li
              className={clsx(
                "rounded-full px-3 py-1 text-center",
                step >= 2
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              )}
            >
              2 · Quote
            </li>
          </ol>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 pt-4">
          {step === 1 ? (
            <Overview request={request} imageLinks={imageLinks} otherLinks={otherLinks} />
          ) : (
            <QuoteForm
              cur={cur}
              item={item}
              setItem={setItem}
              service={service}
              setService={setService}
              delivery={delivery}
              setDelivery={setDelivery}
              eta={eta}
              setEta={setEta}
              notes={notes}
              setNotes={setNotes}
              noAlts={noAlts}
              setNoAlts={setNoAlts}
            />
          )}

          {!!error && (
            <div className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Footer / Actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <div className="text-neutral-500 dark:text-neutral-400">Buyer sees</div>
              <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(total, cur)}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatCurrency(item || 0, cur)} item · {formatCurrency(delivery || 0, cur)} delivery
                {step === 2 && (
                  <>
                    {" "}
                    · Arrives by <span className="font-medium">{prettyDate(arrivalDate)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Back
                </button>
              )}
              <button
                type={step === 2 ? "submit" : "button"}
                onClick={step === 1 ? () => setStep(2) : undefined}
                disabled={step === 2 && !canSubmit}
                className={clsx(
                  "rounded-lg px-4 py-2 text-sm font-medium text-white",
                  "bg-gradient-to-r from-[#8710D880] via-[#8710D8CC] to-[#2563eb]",
                  "hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8710D8CC]",
                  "disabled:opacity-60 dark:ring-offset-neutral-900"
                )}
              >
                {step === 1 ? "Next" : submitting ? "Submitting…" : "Send quote"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function Overview({ request, imageLinks, otherLinks }) {
  const spec = request?.specs || {};
  const cur = (request?.currency || "GHS").toUpperCase();

  const range = useMemo(() => {
    try {
      const f = new Intl.NumberFormat(undefined, { style: "currency", currency: cur });
      const a = request?.budget_min != null ? f.format(request.budget_min) : null;
      const b = request?.budget_max != null ? f.format(request.budget_max) : null;
      return a && b ? `${a} – ${b}` : a || b || "—";
    } catch {
      return "—";
    }
  }, [cur, request?.budget_min, request?.budget_max]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        <div className="font-medium text-neutral-900 dark:text-neutral-100">{request?.title}</div>
        {spec?.details && <p className="mt-1 whitespace-pre-wrap">{spec.details}</p>}
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <dt className="text-neutral-500 dark:text-neutral-400">Location</dt>
          <dd>
            {request?.deliver_to_city ? `${request.deliver_to_city}, ` : ""}
            {(request?.deliver_to_country || "").toUpperCase()}
          </dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Budget</dt>
          <dd>
            {range} {(request?.currency || "").toUpperCase()}
          </dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Brands</dt>
          <dd>{spec?.preferred_brands || "—"}</dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Quantity</dt>
          <dd>{spec?.quantity || 1}</dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Allow alternatives</dt>
          <dd>{spec?.allow_alternatives ? "Yes" : "No"}</dd>

          <dt className="text-neutral-500 dark:text-neutral-400">Needed by</dt>
          <dd>{spec?.needed_by || "—"}</dd>
        </dl>
      </div>

      {(imageLinks.length > 0 || otherLinks.length > 0) && (
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">Media</div>
          <div className="flex flex-wrap gap-2">
            {imageLinks.slice(0, 8).map((src, i) => (
              <a
                key={`${src}-${i}`}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                title="Open image in new tab"
                className="group relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="reference"
                  className="h-16 w-16 rounded-md border object-cover ring-0 transition group-hover:ring-2 border-neutral-200 dark:border-neutral-700 group-hover:ring-neutral-400 dark:group-hover:ring-neutral-500"
                />
                <span className="sr-only">Open image</span>
              </a>
            ))}

            {otherLinks.map((u, i) => (
              <a
                key={`o-${i}`}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                title={u}
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                {hostOf(u)} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuoteForm({
  cur,
  item,
  setItem,
  service,
  setService,
  delivery,
  setDelivery,
  eta,
  setEta,
  notes,
  setNotes,
  noAlts,
  setNoAlts,
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LabeledMoney label="Item price" currency={cur} value={item} onChange={setItem} />
        <LabeledMoney label="Service fee" currency={cur} value={service} onChange={setService} />
        <LabeledMoney label="Delivery fee" currency={cur} value={delivery} onChange={setDelivery} />
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
            ETA (days)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
          />
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Minimum 1 day. Include sourcing & delivery time.
          </p>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Notes to buyer
        </label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          placeholder="Condition, color/variant, photos available on request…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
        <input type="checkbox" checked={noAlts} onChange={(e) => setNoAlts(e.target.checked)} />
        Offer is an exact match (no alternatives)
      </label>
    </>
  );
}

function LabeledMoney({ label, currency, value, onChange }) {
  const symbol = currencyToSymbol(currency);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
          {symbol}
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 pl-7 pr-3 py-2 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{currency}</div>
    </div>
  );
}