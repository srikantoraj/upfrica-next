'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { createRequest } from '@/lib/sourcing/api';
import OffersPanel from '@/components/sourcing/OffersPanel';
import { Info, Loader2 } from 'lucide-react';

/** Small helper for numbers */
const toNum = (v) => (v === '' || v == null ? null : Number(v));

export default function SourcingWorkbench() {
  const router = useRouter();
  const sp = useSearchParams();

  // if there’s already a ?request=123 in the URL we’ll show its offers
  const requestFromUrl = sp.get('request');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState(requestFromUrl || null);

  // form state
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [qty, setQty] = useState('');
  const [allowAlt, setAllowAlt] = useState(false);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [deadline, setDeadline] = useState('');
  const [currency, setCurrency] = useState('GHS'); // simple default; adjust if you have a user/country context
  const [cc, setCc] = useState('gh');

  useEffect(() => {
    if (requestFromUrl) setSuccessId(requestFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestFromUrl]);

  const disabled =
    submitting ||
    !title.trim() ||
    (budgetMin !== '' && isNaN(Number(budgetMin))) ||
    (budgetMax !== '' && isNaN(Number(budgetMax))) ||
    (qty !== '' && isNaN(Number(qty)));

  async function onSubmit(e) {
    e.preventDefault();
    if (disabled) return;

    setSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      specs: details?.trim() || '',
      currency,
      budget_min: toNum(budgetMin),
      budget_max: toNum(budgetMax),
      quantity: toNum(qty),
      allow_alternatives: !!allowAlt,
      deliver_to_city: city || null,
      area: area || null,
      deadline: deadline || null,
      deliver_to_country: cc,
    };

    try {
      const data = await createRequest(payload);
      const id = data?.id ?? data?.request_id;
      if (id) {
        setSuccessId(String(id));
        // reflect in URL so the right pane can fetch offers
        const next = new URLSearchParams(sp.toString());
        next.set('request', String(id));
        router.replace(`/new-dashboard/sourcing?${next.toString()}`, { scroll: false });
      }
      // small reset but keep a few fields for convenience
      setDetails('');
      setQty('');
      setAllowAlt(false);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Sorry, your request could not be created.';
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={clsx(
        'grid gap-6',
        // 1 col on small, 2 cols on md+
        'grid-cols-1 md:grid-cols-3'
      )}
    >
      {/* LEFT: form (2 columns on md+) */}
      <section className="md:col-span-2">
        {/* Tip */}
        <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
          <strong>Tip:</strong> Pay only via Upfrica to stay protected. Accurate{' '}
          <span className="underline">delivery city</span> helps sellers quote the right fees.
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            What do you need?
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            We connect you with vetted sellers and negotiate the best prices.
          </p>

          {error && (
            <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Product name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., HP EliteBook 840 G8"
                className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                           placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10
                           dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                placeholder="Specs, preferred color, links to references/photos, timeline…"
                className="mt-1 w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                           placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/10
                           dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Paste links to product references or images if you have them.
              </p>
            </div>

            {/* Money / qty row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Budget (min)
                </label>
                <input
                  inputMode="decimal"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Budget (max)
                </label>
                <input
                  inputMode="decimal"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option>GHS</option>
                  <option>NGN</option>
                  <option>USD</option>
                  <option>GBP</option>
                  <option>KES</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Quantity
                </label>
                <input
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="1"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex select-none items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm
                                    dark:border-neutral-700 dark:text-neutral-200">
                  <input
                    type="checkbox"
                    checked={allowAlt}
                    onChange={(e) => setAllowAlt(e.target.checked)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  Allow similar alternatives
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Needed by
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* location row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Delivery city
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Accra"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Area / neighborhood
                </label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., East Legon"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Country
                </label>
                <select
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  <option value="gh">Ghana</option>
                  <option value="ng">Nigeria</option>
                  <option value="ke">Kenya</option>
                  <option value="tz">Tanzania</option>
                  <option value="ug">Uganda</option>
                  <option value="rw">Rwanda</option>
                  <option value="gb">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={disabled}
              className={clsx(
                'inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition',
                disabled ? 'bg-neutral-400 dark:bg-neutral-600' : 'bg-black hover:bg-black/90 dark:bg-white dark:text-black'
              )}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit request
            </button>

            {successId && (
              <div className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">✓</span>
                Request posted. Live offers will appear on the right.
              </div>
            )}
          </div>
        </form>
      </section>

      {/* RIGHT: aside (sticky on larger screens) */}
      <aside className="md:col-span-1">
        <div className="md:sticky md:top-20 space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">How it works</h3>
            <ol className="mt-2 list-decimal pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
              <li>Tell us what you need (specs, budget, timeline).</li>
              <li>We verify sellers and collect quotes.</li>
              <li>You review offers, then accept the best one.</li>
            </ol>
            <p className="mt-3 flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <Info className="mt-0.5 h-4 w-4" /> We’ll notify you by email and in-app when offers arrive.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-neutral-50">
              Live offers
            </div>
            {/* Reuse your robust offers reader */}
            <div className="p-4">
              <OffersPanel cc={cc} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}