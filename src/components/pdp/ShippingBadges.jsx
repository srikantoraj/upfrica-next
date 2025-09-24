// src/components/pdp/ShippingBadges.jsx
'use client';

import React from 'react';

const CCY_SYMBOLS = { GHS:'GH₵', NGN:'₦', KES:'KSh', ZAR:'R', UGX:'USh', TZS:'TSh', RWF:'FRw', GBP:'£', EUR:'€', USD:'$', CAD:'C$', AUD:'A$' };
const sym = (ccy) => CCY_SYMBOLS[String(ccy || '').toUpperCase()] || String(ccy || '').toUpperCase();

export default function ShippingBadges({
  originCity,
  originCountryCode = 'GH',
  deliverCountryCode = 'GH',
  dutiesCollected = false,
  preview, // { cheapest:{feeMinor,currency}, fastest:{etaMin,etaMax} }
}) {
  const crossBorder = String(originCountryCode).toUpperCase() !== String(deliverCountryCode).toUpperCase();
  const fee =
    preview?.cheapest && Number.isFinite(preview.cheapest.feeMinor)
      ? `${sym(preview.cheapest.currency)} ${(preview.cheapest.feeMinor / 100).toFixed(2)}`
      : null;

  const eta =
    preview?.fastest &&
    Number.isFinite(preview.fastest.etaMin) &&
    Number.isFinite(preview.fastest.etaMax)
      ? `${preview.fastest.etaMin}–${preview.fastest.etaMax} days`
      : null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1">
        🚚 Ships from {originCity ? `${originCity}, ` : ''}{String(originCountryCode).toUpperCase()}
        {crossBorder ? ` → ${String(deliverCountryCode).toUpperCase()}` : ''}
      </span>

      {crossBorder && dutiesCollected && (
        <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1">🧾 Duties collected at checkout</span>
      )}

      {fee && eta && (
        <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1">📦 {fee} • {eta}</span>
      )}
    </div>
  );
}