// app/fx-test/page.jsx (or wherever this page lives)
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocalization } from '@/contexts/LocalizationProvider';
import { convert as fxConvert, withMargin, fetchFx } from '@/lib/fx';

function codeFrom(item) {
  if (!item) return '';
  if (typeof item === 'string') return item.toUpperCase();
  return (item.code || item.currency || '').toUpperCase();
}

function asOfToString(x) {
  if (!x) return '—';
  if (typeof x === 'string') return x;
  if (x instanceof Date) return x.toISOString();
  try { return String(x); } catch { return '—'; }
}

export default function FxTestPage() {
  const pathname = usePathname() || '/';
  const loc = useLocalization();

  /* -------------------------------- UI state -------------------------------- */
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('GBP');
  const [to, setTo] = useState(''); // blank => use UI currency

  const uiCurrency = (loc?.currency || 'USD').toUpperCase();
  const target = (to || uiCurrency).toUpperCase();

  // Options for selects
  const supportedCodes = useMemo(() => {
    const list = (loc?.supported?.currencies || []).map(codeFrom).filter(Boolean);
    const uniq = Array.from(new Set(list));
    return uniq.length ? uniq : ['USD', 'GBP', 'EUR', 'GHS', 'NGN', 'KES', 'ZAR', 'CAD'];
  }, [loc?.supported?.currencies]);

  /* ------------------------------ Provider FX view ------------------------------ */
  const providerFx = {
    base: (loc?.fx?.base || 'USD').toUpperCase(),
    rates: loc?.fx?.rates || {},
    asOf: loc?.fx?.asOf || null,
    margin_bps: Number(loc?.fx?.margin_bps || 0),
  };
  const providerAsOfStr = asOfToString(providerFx.asOf);

  const providerRateKeys = useMemo(
    () => Object.keys(providerFx.rates || {}).map((k) => k.toUpperCase()).sort(),
    [providerFx.rates]
  );

  const providerHas = (ccy) => {
    const C = (ccy || '').toUpperCase();
    if (!C) return false;
    return C === providerFx.base || providerRateKeys.includes(C);
  };

  const canProviderConvert = useMemo(() => {
    const src = from.toUpperCase();
    const dst = target.toUpperCase();
    if (src === dst) return true;
    return providerHas(src) && providerHas(dst);
  }, [from, target, providerRateKeys]);

  /* --------------------------- Provider-based results --------------------------- */
  // What the app would show today (obeys loc.noMargin)
  const convertedViaProvider = useMemo(() => {
    if (!loc?.convert) return Number(amount) || 0;
    return Number(to ? loc.convert(amount, from, to) : loc.convert(amount, from)) || 0;
  }, [amount, from, to, loc?.convert, uiCurrency]);

  // Compute explicit mid & with-margin for transparency
  const midViaProvider = useMemo(() => {
    if (!loc?.fx) return null;
    const src = (from || '').toUpperCase();
    const dst = (target || '').toUpperCase();
    if (!src || !dst) return null;
    if (src === dst) return Number(amount) || 0;
    try {
      return fxConvert(Number(amount) || 0, src, dst, loc.fx);
    } catch {
      return null;
    }
  }, [amount, from, target, loc?.fx]);

  const withMarginViaProvider = useMemo(() => {
    if (midViaProvider == null) return null;
    return withMargin(midViaProvider, providerFx.margin_bps);
  }, [midViaProvider, providerFx.margin_bps]);

  /* ------------------------------ Fresh FX (on-demand) ------------------------- */
  const [freshFx, setFreshFx] = useState(null);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState(null);

  const fetchFresh = async () => {
    try {
      setFxLoading(true);
      setFxError(null);
      const base = providerFx.base || 'USD';
      const fx = await fetchFx({ base });
      setFreshFx({
        base: (fx?.base || base).toUpperCase(),
        rates: fx?.rates || {},
        asOf: fx?.asOf || null,
      });
    } catch (e) {
      setFxError(e?.message || 'Failed to fetch FX.');
      setFreshFx(null);
    } finally {
      setFxLoading(false);
    }
  };

  useEffect(() => {
    if (!freshFx) fetchFresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const freshAsOfStr = asOfToString(freshFx?.asOf);

  const freshRateKeys = useMemo(
    () => Object.keys(freshFx?.rates || {}).map((k) => k.toUpperCase()).sort(),
    [freshFx]
  );

  const freshHas = (ccy) => {
    const C = (ccy || '').toUpperCase();
    if (!C) return false;
    return C === (freshFx?.base || '').toUpperCase() || freshRateKeys.includes(C);
  };

  const canFreshConvert = useMemo(() => {
    if (!freshFx) return false;
    const src = from.toUpperCase();
    const dst = target.toUpperCase();
    if (src === dst) return true;
    return freshHas(src) && freshHas(dst);
  }, [freshFx, from, target, freshRateKeys]);

  const midViaFresh = useMemo(() => {
    if (!freshFx) return null;
    const src = from.toUpperCase();
    const dst = target.toUpperCase();
    if (src === dst) return Number(amount) || 0;
    try {
      return fxConvert(Number(amount) || 0, src, dst, freshFx);
    } catch {
      return null;
    }
  }, [freshFx, amount, from, target]);

  const withMarginViaFresh = useMemo(() => {
    if (midViaFresh == null) return null;
    return withMargin(midViaFresh, providerFx.margin_bps);
  }, [midViaFresh, providerFx.margin_bps]);

  // What the app would show if it used freshFx (obeys loc.noMargin)
  const convertedViaFresh = useMemo(() => {
    if (midViaFresh == null) return null;
    return loc?.noMargin ? midViaFresh : withMarginViaFresh;
  }, [midViaFresh, withMarginViaFresh, loc?.noMargin]);

  /* --------------------------------- formatting -------------------------------- */
  const formattedProvider = useMemo(
    () => (loc?.format ? loc.format(convertedViaProvider, target) : `${target} ${(+convertedViaProvider).toFixed(2)}`),
    [loc?.format, convertedViaProvider, target]
  );

  const formattedFresh = useMemo(() => {
    if (convertedViaFresh == null) return '—';
    return loc?.format ? loc.format(convertedViaFresh, target) : `${target} ${(+convertedViaFresh).toFixed(2)}`;
  }, [loc?.format, convertedViaFresh, target]);

  const symbol = useMemo(
    () => (loc?.symbolFor ? loc.symbolFor(target) : target),
    [loc?.symbolFor, target]
  );

  const amountOnly = useMemo(
    () => (loc?.formatAmountOnly ? loc.formatAmountOnly(convertedViaProvider, target) : (+convertedViaProvider).toFixed(2)),
    [loc?.formatAmountOnly, convertedViaProvider, target]
  );

  const marginFactor = useMemo(
    () => 1 + (Number(loc?.fx?.margin_bps || 0) / 10000),
    [loc?.fx?.margin_bps]
  );

  /* ----------------------------------- UI ----------------------------------- */
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">FX conversion test</h1>

      {/* Quick switches (NO URL CHANGES) */}
      <section className="flex flex-wrap items-center gap-2 p-3 rounded-md border">
        <span className="text-sm text-gray-600">Quick switches (no navigation):</span>

        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => { setTo(''); loc?.setCurrency?.('GHS'); }}>
          Country → gh
        </button>
        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => { setTo(''); loc?.setCurrency?.('NGN'); }}>
          Country → ng
        </button>
        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => loc?.setCurrency?.('USD')}>
          UI currency → USD
        </button>
        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => { setFrom('GHS'); setTo(''); }}>
          From → GHS
        </button>
        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                onClick={() => { setFrom('NGN'); setTo(''); }}>
          From → NGN
        </button>

        <span className="ml-auto text-xs text-gray-500">
          Current path: <b>{pathname}</b>
        </span>
      </section>

      {/* Controls */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <label className="block">
          <span className="text-sm text-gray-600">Amount</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">From currency</span>
          <select className="mt-1 w-full rounded-md border px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)}>
            {supportedCodes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">To currency</span>
          <select className="mt-1 w-full rounded-md border px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">{`(Use UI currency: ${uiCurrency})`}</option>
            {supportedCodes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">UI currency:</span>
          <select
            className="rounded-md border px-3 py-2"
            value={uiCurrency}
            onChange={(e) => loc?.setCurrency?.(e.target.value)}
          >
            {['USD', 'GHS', 'NGN', 'GBP', 'EUR'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="AUTO">AUTO (server default)</option>
          </select>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!loc?.noMargin}
            onChange={(e) => loc?.setNoMargin?.(e.target.checked)}
          />
          Ignore margin (show mid-market)
        </label>

        <span className="text-xs text-gray-500">(Changing this won’t change the URL.)</span>
      </section>

      {/* Provider results */}
      <section className="rounded-lg border p-4 bg-white space-y-3">
        <div className="text-sm text-gray-600">
          convert(amount, from, to?) — <b>Provider</b>{' '}
          {loc?.noMargin ? '(mid-market)' : '(with margin)'}
        </div>
        <div className="text-xl font-bold">{formattedProvider}</div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="rounded-md bg-gray-50 p-3">
            <div><span className="text-gray-500">Symbol for target:</span> <strong>{symbol}</strong></div>
            <div><span className="text-gray-500">Amount-only:</span> <strong>{amountOnly}</strong></div>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <div>
              <span className="text-gray-500">via price(amount, from):</span>{' '}
              <strong>
                {loc?.format
                  ? loc.format(loc?.price ? loc.price(amount, from) : amount, target)
                  : (loc?.price ? loc.price(amount, from) : amount)}
              </strong>
            </div>
            <div><span className="text-gray-500">Target currency:</span> <strong>{target}</strong></div>
          </div>
        </div>

        {/* Mid vs With-margin breakdown */}
        <div className="text-xs text-gray-600">
          Mid: <b>{midViaProvider == null ? '—' : loc?.format ? loc.format(midViaProvider, target) : `${target} ${(+midViaProvider).toFixed(2)}`}</b>
          {' '}• With margin ({providerFx.margin_bps} bps):{' '}
          <b>{withMarginViaProvider == null ? '—' : loc?.format ? loc.format(withMarginViaProvider, target) : `${target} ${(+withMarginViaProvider).toFixed(2)}`}</b>
          {' '}• Factor: <b>{marginFactor.toFixed(4)}</b>
        </div>

        {!canProviderConvert && (
          <div className="text-sm text-red-600">
            Provider FX is missing a rate for <b>{!providerHas(from) ? from : target}</b>. Amount falls back to the input.
          </div>
        )}
      </section>

      {/* Fresh FX comparison */}
      <section className="rounded-lg border p-4 bg-white space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Comparison — <b>Fresh FX</b>{' '}{loc?.noMargin ? '(mid-market)' : '(with margin)'}</div>
          <button
            className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
            onClick={fetchFresh}
            disabled={fxLoading}
          >
            {fxLoading ? 'Fetching…' : 'Fetch fresh FX'}
          </button>
          {fxError && <span className="text-xs text-red-600">{fxError}</span>}
          {freshFx?.asOf && <span className="ml-auto text-xs text-gray-500">asOf: {freshAsOfStr}</span>}
        </div>

        <div className="text-lg font-semibold">{formattedFresh}</div>
        <div className="text-xs text-gray-600">
          Mid: <b>{midViaFresh == null ? '—' : loc?.format ? loc.format(midViaFresh, target) : `${target} ${(+midViaFresh).toFixed(2)}`}</b>
          {' '}• With margin ({providerFx.margin_bps} bps):{' '}
          <b>{withMarginViaFresh == null ? '—' : loc?.format ? loc.format(withMarginViaFresh, target) : `${target} ${(+withMarginViaFresh).toFixed(2)}`}</b>
          {' '}• Factor: <b>{marginFactor.toFixed(4)}</b>
        </div>

        {!canFreshConvert && (
          <div className="text-sm text-amber-600">
            Fresh FX is missing a needed rate for <b>{!freshHas(from) ? from : target}</b>.
          </div>
        )}
      </section>

      {/* Debug */}
      <section className="rounded-lg border p-4 bg-gray-50 text-sm space-y-3">
        <div className="mb-2 font-medium">Debug</div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <li>UI currency: <strong>{uiCurrency}</strong></li>
          <li>Resolved language: <strong>{loc?.resolvedLanguage || '—'}</strong></li>
          <li>FX base: <strong>{providerFx.base || '—'}</strong></li>
          <li>FX asOf: <strong>{providerAsOfStr}</strong></li>
          <li>FX margin_bps: <strong>{loc?.fx?.margin_bps ?? 0}</strong></li>
          <li>FX stale?: <strong>{String(loc?.stale)}</strong></li>
          <li>convert.length: <strong>{loc?.convert?.length ?? '—'}</strong> (should be 3)</li>
          <li>No-margin mode: <strong>{String(!!loc?.noMargin)}</strong></li>
          <li>
            Rates present — from <b>{from}</b>:
            {' '}<strong>{String(providerHas(from))}</strong>
            {' '}• to <b>{target}</b>:
            {' '}<strong>{String(providerHas(target))}</strong>
          </li>
        </ul>

        <details>
          <summary className="cursor-pointer">Show provider rate keys ({providerRateKeys.length})</summary>
          <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(providerRateKeys, null, 2)}</pre>
        </details>

        <details>
          <summary className="cursor-pointer">Show fresh rate keys ({freshRateKeys.length})</summary>
          <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(freshRateKeys, null, 2)}</pre>
        </details>
      </section>
    </main>
  );
}