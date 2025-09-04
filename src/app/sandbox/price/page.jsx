'use client';
import React, { useMemo, useCallback } from 'react';
import SimplePrice from '@/components/SimplePrice';
import { buildPricing, symbolFor } from '@/lib/pricing-mini';

// ⚠️ Replace with your real FX function if needed.
// Here we *don’t* convert (identity), so you can validate raw seller prices.
const conv = (amount, _fromCurrency) => amount;

export default function PriceSandbox() {
  // Ground-truth product (stable)
  const product = useMemo(() => ({
    id: 4905,
    title: 'SONLINK Motorcycle Cross 3 Plus Motobike',
    price_currency: 'GHS',
    price_cents: 1390000,        // 13,900.00 GHS
    sale_price_cents: 1300000,   // 13,000.00 GHS
    sale_end_date: '2026-02-12T11:00:00Z',
    postage_fee_cents: 0,
    total_additional_cents: 0,
  }), []);

  // Keep UI in seller currency to avoid any conversion.
  const uiCurrency = 'GHS';

  const pricing = useMemo(
    () => buildPricing(product, { uiCurrency, locale: 'en', conv }),
    [product, uiCurrency]
  );

  const symbol = pricing.display.symbol || symbolFor(pricing.display.currency, 'en');

  const toggleTrace = useCallback(() => {
    try {
      const cur = localStorage.getItem('debugPrice') === '1';
      localStorage.setItem('debugPrice', cur ? '0' : '1');
      location.reload();
    } catch {}
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <h1>Price Sandbox</h1>
      <p>
        Expect: <b>{symbol}13,000.00</b> (active) and strikethrough <b>{symbol}13,900.00</b>,<br />
        Free delivery.
      </p>

      <div style={{ marginTop: 12 }}>
        <button onClick={toggleTrace} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc' }}>
          Toggle trace
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <SimplePrice
          symbol={symbol}
          activeAmountOnly={pricing.display.activeAmountOnly}
          originalAmountOnly={pricing.display.originalAmountOnly}
          saleActive={pricing.saleActive}
          postageAmountOnly={pricing.display.postageAmountOnly}
        />
      </div>

      <pre style={{ marginTop: 24, background: '#0B1020', color: '#C9D1D9', padding: 16, borderRadius: 8, fontSize: 12, overflowX: 'auto' }}>
        {JSON.stringify(pricing, null, 2)}
      </pre>
    </div>
  );
}