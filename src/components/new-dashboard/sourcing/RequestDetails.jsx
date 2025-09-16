//src/components/new-dashboard/sourcing/RequestDetails.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

/* --- tiny fetcher (cookies/JWT included) -------------------------------- */
async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = await res.json();
      msg = j?.detail || JSON.stringify(j);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* --- money + misc utils -------------------------------------------------- */
const sym = (c) => ({ GHS:"₵", NGN:"₦", KES:"KSh", TZS:"TSh", UGX:"USh", RWF:"FRw", GBP:"£", USD:"$", EUR:"€" }[String(c).toUpperCase()] || "");
const fmtMoney = (n, c) => (n==null||n==="") ? null : (()=>{try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c}).format(Number(n));}catch{return `${sym(c)}${Number(n).toLocaleString()}`;}})();
const fmtRange = (a,b,c) => { const x=fmtMoney(a,c), y=fmtMoney(b,c); return x&&y?`${x} – ${y}`:x||y||"—"; };
const daysLeft = (d) => { if(!d) return null; const e=new Date(d); e.setHours(23,59,59,999); return Math.ceil((e-new Date())/86400000); };
const codeOf = (r) => { const raw=r?.public_id||r?.uid||r?.id; if(!raw) return "RQ-??????"; const s=String(raw); const base=/^\d+$/.test(s)?Number(s).toString(36).toUpperCase():s.replace(/[^a-zA-Z0-9]/g,"").slice(-6).toUpperCase(); return `RQ-${base.padStart(6,"0").slice(-6)}`; };

/* --- API helpers (endpoints match your DRF ViewSets) --------------------- */
const getRequest = (id) => api(`/api/sourcing/requests/${id}/`);
const listOffersForRequest = (id) => api(`/api/sourcing/offers/?request=${id}&ordering=-created_at`);
const acceptOffer = (offerId) => api(`/api/sourcing/offers/${offerId}/accept/`, { method: "POST" });

/* --- brand helpers (purple/blue) ---------------------------------------- */
const brand = {
  purple50:  "#F5F3FF",
  purple80A: "#8710D8CC",
  purple50A: "#8710D880",
  blue:      "var(--brand-600, #1E5BFF)",
};

/* --- UI ------------------------------------------------------------------ */
export default function RequestDetails({ requestId }) {
  const [req, setReq] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [accepting, setAccepting] = useState(null); // offer id being accepted

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const [r, os] = await Promise.all([getRequest(requestId), listOffersForRequest(requestId)]);
        if (!alive) return;
        setReq(r);
        setOffers(Array.isArray(os?.results) ? os.results : Array.isArray(os) ? os : []);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [requestId]);

  const dleft = useMemo(() => daysLeft(req?.deadline), [req?.deadline]);
  const late  = dleft != null && dleft < 0;
  const cur   = (req?.currency || "").toUpperCase();

  async function onAccept(id) {
    try {
      setAccepting(id);
      const order = await acceptOffer(id);
      // optimistic: mark this offer accepted & others rejected
      setOffers((prev) => prev.map(o => o.id === id ? { ...o, status: "accepted" } : { ...o, status: "rejected" }));
      // request becomes awarded
      setReq((r) => ({ ...r, status: "awarded" }));
      // optional: route to order page if you have one
      // router.push(`/new-dashboard/orders/${order.id}`);
    } catch (e) {
      alert(e.message || "Failed to accept offer");
    } finally {
      setAccepting(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-7 w-48 rounded bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
        <div className="h-28 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 animate-pulse" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
        {err}
      </div>
    );
  }

  if (!req) return null;

  const badge = dleft == null
    ? <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300">No deadline</span>
    : late
      ? <span className="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 text-xs text-rose-700 dark:text-rose-300">Deadline passed</span>
      : <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">{dleft}d left</span>;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {req.title}
          </h1>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {req.deliver_to_city ? `${req.deliver_to_city}, ` : ""}
            {(req.deliver_to_country || "").toUpperCase()} • {cur} • <span className="uppercase">{req.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-mono border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
            {codeOf(req)}
          </span>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div
          className="px-4 py-3 text-sm rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${brand.purple50A}, ${brand.purple80A}, ${brand.blue})`,
            color:"#fff"
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium">Budget</div>
            <div className="font-semibold">{fmtRange(req.budget_min, req.budget_max, cur)}</div>
          </div>
        </div>
        <div className="p-4">
          {req?.specs?.details && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{req.specs.details}</p>
          )}
          {!!(req?.media?.length) && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {req.media.map((url, i) => (
                <img key={i} src={url} alt="" className="h-24 w-24 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offers */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Offers <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">({offers.length})</span>
        </h2>
        <Link href="/dashboard/requests" className="text-sm underline text-[color:var(--brand-600,#1E5BFF)]">
          Back to My Requests
        </Link>
      </div>

      {!offers.length && (
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center text-neutral-600 dark:text-neutral-400">
          No offers yet.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((o) => {
          const canAccept = o.status === "submitted" && req.status === "open" && !late;
          const totalBuyer = (() => {
            const a = Number(o?.quoted_item_cost || 0);
            const b = Number(o?.agent_fee || 0);
            const c = Number(o?.delivery_fee || 0);
            return a + b + c;
          })();

          return (
            <article key={o.id} className="rounded-2xl border p-4 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {o.submitter_type ? o.submitter_type.toUpperCase() : "OFFER"}
                  </div>
                  <h3 className="mt-0.5 font-semibold text-neutral-900 dark:text-neutral-100">
                    {o.brand || o.model ? `${o.brand || ""} ${o.model || ""}`.trim() : "Quoted total"}
                  </h3>
                </div>

                <span
                  className={clsx(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                    o.status === "accepted" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                    o.status === "rejected" && "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
                    o.status === "submitted" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  )}
                >
                  {o.status}
                </span>
              </div>

              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Item: {fmtMoney(o.quoted_item_cost, o.currency)} • Service: {fmtMoney(o.agent_fee, o.currency)} • Delivery: {fmtMoney(o.delivery_fee, o.currency)}
              </div>
              <div className="mt-2 font-semibold text-neutral-900 dark:text-neutral-100">
                Buyer total: {fmtMoney(totalBuyer, o.currency)}
              </div>
              {o.notes && (
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">{o.notes}</p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">ETA: {o.eta_days ? `${o.eta_days} days` : "—"}</div>
                <button
                  disabled={!canAccept || accepting === o.id}
                  onClick={() => onAccept(o.id)}
                  className={clsx(
                    "rounded-lg px-3 py-1.5 text-sm font-medium",
                    canAccept
                      ? "text-white bg-[color:var(--brand-600,#1E5BFF)] hover:brightness-110"
                      : "bg-neutral-300 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                  )}
                >
                  {accepting === o.id ? "Accepting…" : "Accept"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}