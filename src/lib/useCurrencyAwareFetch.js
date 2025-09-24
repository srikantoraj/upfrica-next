// src/lib/useCurrencyAwareFetch.js
"use client";

import { useCallback } from "react";
import { useLocalization } from "@/contexts/LocalizationProvider";

/**
 * Client-side fetch that automatically adds the current UI locale headers.
 *
 * Usage:
 *   const fxFetch = useCurrencyAwareFetch();
 *   const res = await fxFetch("/api/products?limit=20");
 *   const data = await res.json();
 *
 * Pair with server-side fetchJson() for SSR.
 */
export function useCurrencyAwareFetch() {
  const {
    currency,          // UI currency code (already resolved; not "AUTO")
    country,           // delivery country (mutable)
    routeCountry,      // browsing country from the URL (read-only)
    resolvedLanguage,  // e.g. "en-GB"
  } = useLocalization();

  return useCallback(
    (input, init = {}) => {
      const headers = new Headers(init.headers || {});
      if (currency)      headers.set("x-ui-currency", String(currency).toUpperCase());
      if (country)       headers.set("x-deliver-cc", String(country).toLowerCase());
      if (routeCountry)  headers.set("x-browse-cc", String(routeCountry).toLowerCase());
      if (resolvedLanguage) headers.set("x-ui-language", resolvedLanguage);

      // Optional composite for easier CDN cache-keying
      headers.set(
        "x-site-variant",
        [
          String(currency || "").toUpperCase(),
          String(country || "").toLowerCase(),
          String(routeCountry || "").toLowerCase(),
          String(resolvedLanguage || ""),
        ].join("|")
      );

      return fetch(input, { ...init, headers });
    },
    [currency, country, routeCountry, resolvedLanguage]
  );
}

/**
 * Small convenience if you mostly fetch JSON from the client.
 * Same headers, with basic error handling.
 */
export function useCurrencyAwareJson() {
  const fxFetch = useCurrencyAwareFetch();

  return useCallback(
    async (input, init = {}) => {
      const res = await fxFetch(input, {
        ...init,
        headers: {
          Accept: "application/json",
          ...(init.headers || {}),
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}${text ? ` – ${text}` : ""}`);
      }
      return res.json();
    },
    [fxFetch]
  );
}