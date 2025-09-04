// src/contexts/LocalizationProvider.jsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { convert as fxConvert, withMargin, fetchFx } from "../lib/fx";
import { fetchI18nInit } from "../lib/i18n";
import { withCountryPrefix } from "@/lib/locale-routing"; // .ts or .js, both work

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

const LS_KEY = "upfrica.locale"; // { country, currency, language("auto"|tag) }

/** Sensible global fallback (only used if we cannot infer anything). */
const FALLBACK = { country: "gb", currency: "GBP", language: "en-GB" };

/**
 * Route defaults used for the **very first paint** (to avoid SSR/CSR drift).
 * The backend init will hydrate/override right after mount.
 */
const DEFAULTS_BY_SLUG = {
  gh: { currency: "GHS", language: "en-GH" },
  ng: { currency: "NGN", language: "en-NG" },
  gb: { currency: "GBP", language: "en-GB" },
  uk: { currency: "GBP", language: "en-GB" }, // alias accepted in routes
  fr: { currency: "EUR", language: "fr-FR" },
  us: { currency: "USD", language: "en-US" },
  ke: { currency: "KES", language: "en-KE" },
  za: { currency: "ZAR", language: "en-ZA" },
  ca: { currency: "CAD", language: "en-CA" },
  ie: { currency: "EUR", language: "en-IE" },
  de: { currency: "EUR", language: "de-DE" },
  it: { currency: "EUR", language: "it-IT" },
  es: { currency: "EUR", language: "es-ES" },
  nl: { currency: "EUR", language: "nl-NL" },
  pt: { currency: "EUR", language: "pt-PT" },
};

function defaultsForSlug(slug) {
  const key = String(slug || "").toLowerCase();
  return DEFAULTS_BY_SLUG[key] || FALLBACK;
}

function readLocalSafe() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLocalSafe(obj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {}
}

/** Extract `/cc` from the current path. Accept **any** 2-letter code. */
function pathCountrySlug() {
  if (typeof window === "undefined") return null;
  const first = (window.location.pathname.split("/").filter(Boolean)[0] || "")
    .toLowerCase();
  return /^[a-z]{2}$/.test(first) ? first : null;
}

/** Light cookie setter for SSR harmony */
function setCookie(k, v, days = 180) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${k}=${encodeURIComponent(
      v ?? ""
    )}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  } catch {}
}

/* ------------------------------------------------------------------ */
/* context hook                                                        */
/* ------------------------------------------------------------------ */

const LocalizationContext = createContext(null);
export const useLocalization = () => useContext(LocalizationContext);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export default function LocalizationProvider({ children, routeCc }) {
  // Use server-provided cc if available; otherwise derive from the URL.
  const routeSlug =
    routeCc ||
    (typeof window !== "undefined" ? pathCountrySlug() : null) ||
    FALLBACK.country;

  // First paint defaults (route only) — prevents SSR mismatch.
  const routeDefaults = defaultsForSlug(routeSlug);

  const [country, setCountry] = useState(routeSlug);
  const [currency, setCurrency] = useState(routeDefaults.currency);

  // "auto" = use server suggested language for current country.
  const [language, setLanguage] = useState("auto");

  const [defaults, setDefaults] = useState({
    language: routeDefaults.language,
    currency: routeDefaults.currency,
  });

  const [supported, setSupported] = useState({
    countries: [],
    currencies: [],
    languages: [],
  });

  const [fx, setFx] = useState({
    base: "USD",
    rates: {},
    asOf: null,
    margin_bps: 0,
    stale: true,
  });

  const [loading, setLoading] = useState(true);

  /* --------------------------- mount bootstrap --------------------------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const init = await fetchI18nInit(routeSlug).catch(() => null);
      const local = readLocalSafe();

      if (!alive) return;

      if (init) {
        setSupported({
          countries: init.supported?.countries || [],
          currencies: init.supported?.currencies || [],
          languages: init.supported?.languages || [],
        });

        setFx({
          base: init.fx?.base || "USD",
          rates: init.fx?.rates || {},
          asOf: init.fx?.as_of || null,
          margin_bps: Number(init.fx?.margin_bps || 0),
          stale: Boolean(init.fx?.stale),
        });

        // Currency: local override → server suggestion → route default → fallback
        setCurrency(
          (local.currency ||
            init.currency ||
            routeDefaults.currency ||
            FALLBACK.currency).toUpperCase()
        );

        // Language preference
        setLanguage(local.language || "auto");

        // Keep server defaults for AUTO resolution
        setDefaults({
          language: init.language || routeDefaults.language || FALLBACK.language,
          currency: init.currency || routeDefaults.currency || FALLBACK.currency,
        });
      } else {
        // If init fails, fetch bare FX so price() still works.
        try {
          const fallbackFx = await fetchFx({ base: "USD" });
          if (!alive) return;
          setFx((prev) => ({
            ...prev,
            ...fallbackFx,
            margin_bps: 0,
            stale: !fallbackFx?.asOf,
          }));
        } catch {}
      }

      setLoading(false);
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------- persist user preferences ---------------------- */
  useEffect(() => {
    const current = readLocalSafe();
    writeLocalSafe({
      ...current,
      country,
      currency,
      language,
    });
    // SSR-friendly cookies (kept simple)
    setCookie("upfrica_cc", country);
    setCookie("upfrica_currency", currency);
    setCookie("upfrica_lang", language);
  }, [country, currency, language]);

  /* ----------------------------- memo context ---------------------------- */
  const value = useMemo(() => {
    const marginBps = Number(fx.margin_bps || 0);

    /** Use the **resolved language** for display formatting. */
    const resolvedLanguage =
      language !== "auto"
        ? language
        : (defaults.language ||
            (typeof navigator !== "undefined" ? navigator.language : "") ||
            FALLBACK.language);

    /** Human language name (intl-backed, with server label fallback). */
    const langLabel = (tag) => {
      const t = String(tag || "").replace("_", "-");
      const list = supported.languages || [];
      const hit = list.find((l) => (l.code || l) === t);
      if (hit && (hit.label || hit.name)) return hit.label || hit.name;
      try {
        const dn = new Intl.DisplayNames([resolvedLanguage || "en"], {
          type: "language",
        });
        const base = t.split("-")[0];
        return dn.of(base) || base || "—";
      } catch {
        return (t || "—").split("-")[0];
      }
    };

    /**
     * Low-level, **single-shot** converter.
     * - Only applies margin when a real currency change happens.
     * - Returns `{ amount, converted }`, where `converted` is true iff we changed currency
     *   and had a finite positive output.
     */
    const convertOnce = (amount, fromCurrency, toCurrency = currency) => {
      const src = String(fromCurrency || "").toUpperCase();
      const dst = String(toCurrency || "").toUpperCase();
      const a = Number(amount);
      if (!Number.isFinite(a) || a <= 0 || !src || !dst || !fx) {
        return { amount: a, converted: false, toCurrency: dst };
      }
      if (src === dst) {
        return { amount: a, converted: false, toCurrency: dst };
      }
      try {
        const raw = fxConvert(a, src, dst, fx);
        const ok = Number.isFinite(raw) && raw > 0;
        if (!ok) return { amount: a, converted: false, toCurrency: dst };
        const withM = withMargin(raw, marginBps);
        return { amount: withM, converted: true, toCurrency: dst };
      } catch {
        return { amount: a, converted: false, toCurrency: dst };
      }
    };

    /**
     * High-level helper used by pricing code:
     * - Attempts to convert to current UI currency.
     * - If FX fails, **returns the original amount** (no margin).
     * NOTE: Callers that need to know if conversion happened should use `convertOnce`.
     */
    const price = (amount, fromCurrency) => {
      const res = convertOnce(amount, fromCurrency, currency);
      return res.amount; // number only (UI-major if converted; else seller-major)
    };

    /** Format full currency string (symbol+amount) for the given currency. */
    const format = (amount, ccy = currency, opts = {}) => {
      try {
        return new Intl.NumberFormat(resolvedLanguage || undefined, {
          style: "currency",
          currency: ccy,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...opts,
        }).format(amount);
      } catch {
        return String(amount);
      }
    };

    /** Format amount-only (no symbol) for the given currency/locale. */
    const formatAmountOnly = (amount, ccy = currency, opts = {}) => {
      try {
        const parts = new Intl.NumberFormat(resolvedLanguage || undefined, {
          style: "currency",
          currency: ccy,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          ...opts,
        }).formatToParts(amount);
        return parts
          .filter((p) => p.type !== "currency")
          .map((p) => p.value)
          .join("")
          .trim();
      } catch {
        const n = Number(amount || 0);
        return Number.isFinite(n) ? n.toFixed(2) : String(amount ?? "");
      }
    };

    /** Extract just the localized currency symbol. */
    const symbolFor = (ccy = currency) => {
      try {
        const parts = new Intl.NumberFormat(resolvedLanguage || undefined, {
          style: "currency",
          currency: ccy,
        }).formatToParts(1);
        return parts.find((p) => p.type === "currency")?.value || ccy;
      } catch {
        return ccy || "";
      }
    };

    const isStale = (() => {
      if (typeof fx.stale === "boolean") return fx.stale;
      if (!fx.asOf) return true;
      const ageHrs = (Date.now() - new Date(fx.asOf).getTime()) / 36e5;
      return ageHrs > 72;
    })();

    /** Replace the **first** path segment if it’s a country; otherwise prepend. */
    const changeCountry = (slug) => {
      const next = String(slug || "").toLowerCase();
      if (!next || next === country) return;
      try {
        const segs = window.location.pathname.split("/").filter(Boolean);
        if (/^[a-z]{2}$/i.test(segs[0])) segs[0] = next;
        else segs.unshift(next);
        const newPath = "/" + segs.join("/");
        window.location.assign(newPath + window.location.search);
      } catch {
        setCountry(next); // non-browser fallback
      }
    };

    // Accept "AUTO" then resolve to defaults for current country
    const changeCurrency = (ccy) => {
      const v = String(ccy || "").toUpperCase();
      setCurrency(v === "AUTO" ? (defaults.currency || currency) : v);
    };
    const changeLanguage = (lng) =>
      setLanguage(
        String(lng || "").toLowerCase() === "auto" ? "auto" : String(lng || "")
      );

    return {
      // state
      loading,
      country,
      currency,
      language, // preference: "auto" or explicit tag
      resolvedLanguage, // used by formatters/i18n
      supported,
      defaults, // server suggestions for the current country
      fx,
      stale: isStale,

      // helpers
      price,               // number (UI-major if converted; else seller-major)
      convertOnce,         // { amount, converted, toCurrency }
      format,              // "symbol + amount"
      formatAmountOnly,    // amount-only string
      symbolFor,           // currency symbol for a code
      langLabel,           // human language name

      // actions
      setCountry: changeCountry,
      setCurrency: changeCurrency,
      setLanguage: changeLanguage,
    };
  }, [loading, country, currency, language, supported, defaults, fx]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}