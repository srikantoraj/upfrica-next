// src/components/pdp/ShippingPreview.jsx
'use client';

import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useSellerPreview } from '@/lib/useSellerPreview';

const DEBUG =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('debug');

const toMinor = (o) => (Number.isFinite(+o) ? Math.round(+o * 100) : 0);
const uniq = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

export default function ShippingPreview({
  productId,
  sellerId = null,        // Product.owner user_id (optional: server can infer from productId)
  shopSlug = null,        // kept for API parity, unused by useSellerPreview
  deliverCc,
  deliverCity = '',
  deliverPostcode = '',
  onState,                // ({ deliverable, cheapest, fastest, allowedPayments, reason })
  onChangeLocation,
}) {
  const cc = (deliverCc || 'GH').toUpperCase();

  // Resilient hook: options endpoint → legacy preview → synth from configs
  const {
    loading,
    options,
    cheapest,
    fastest,
    deliverable,
    error,
    reason,
  } = useSellerPreview({
    productId,
    sellerId,            // pass true sellerId when you have it
    deliverCc: cc,
    city: deliverCity || '',
    postcode: deliverPostcode || '',
  });

  // Gather allowed payments (prefer the method we’re actually showing)
  const allowedPaymentCodes = React.useMemo(() => {
    const fromFastest = fastest?.allowed_payment_codes || fastest?.allowed_payments || [];
    const fromCheapest = cheapest?.allowed_payment_codes || cheapest?.allowed_payments || [];
    const fromAny = (options?.[0]?.allowed_payment_codes || options?.[0]?.allowed_payments || []);
    return uniq([...fromFastest, ...fromCheapest, ...fromAny]);
  }, [fastest, cheapest, options]);

  // Push normalized state up to PDP whenever it changes
  React.useEffect(() => {
    const up = {
      deliverable, // true | false | null
      cheapest: cheapest
        ? { feeMinor: cheapest.fee_minor ?? toMinor(cheapest.fee), currency: cheapest.currency }
        : null,
      fastest: fastest
        ? {
            label: fastest.method_label || fastest.method_code,
            etaMin: fastest.eta_min_days,
            etaMax: fastest.eta_max_days,
          }
        : null,
      allowedPayments: allowedPaymentCodes,
      reason: error || reason || null,
    };

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log('[ShippingPreview] up->PDP', {
        inputs: { productId, sellerId, cc, deliverCity, deliverPostcode },
        loading,
        options,
        cheapest,
        fastest,
        deliverable,
        error,
        reason,
        up,
      });
    }

    onState?.(up);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, options, cheapest, fastest, deliverable, error, reason, allowedPaymentCodes]);

  // Human status line (mobile PDP)
  let status;
  if (loading) {
    status = <>Checking delivery options…</>;
  } else if (deliverable === false) {
    status = <>
      Not deliverable to {cc}
      {deliverCity ? <> • {deliverCity}</> : null}
      {reason ? <> — {String(reason)}</> : null}
    </>;
  } else if (fastest) {
    status = (
      <>
        via <strong>{fastest.method_label || fastest.method_code}</strong>
        {Number.isFinite(fastest.eta_min_days) && Number.isFinite(fastest.eta_max_days)
          ? <> • {fastest.eta_min_days}–{fastest.eta_max_days} days</>
          : null}
      </>
    );
  } else if (deliverable === true) {
    status = <>Deliverable — get a shipping quote.</>;
  } else {
    status = <>Add city for accurate ETA &amp; fees</>;
  }

  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[ShippingPreview] render-status', {
      cc,
      city: deliverCity,
      postcode: deliverPostcode,
      statusText: String(status?.props?.children || status),
    });
  }

  return (
    <div
      className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300"
      aria-live="polite"
      aria-busy={loading}
    >
      <span>{status}</span>
      <button
        type="button"
        onClick={onChangeLocation}
        className="inline-flex items-center gap-1 text-[var(--violet-600,#7c3aed)] hover:underline"
      >
        <FaMapMarkerAlt aria-hidden /> Change location
      </button>
    </div>
  );
}