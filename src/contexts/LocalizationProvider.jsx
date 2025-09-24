// src/contexts/LocalizationProvider.jsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { convert as fxConvert, withMargin, fetchFx } from "../lib/fx";
import { fetchI18nInit } from "../lib/i18n";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

const LS_KEY = "upfrica.locale";            // { country, currency, language("auto"|tag) }
const NOMARGIN_LS = "upfrica.fx.nomargin";  // "1"|"0" — mid-market toggle

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

/** Lightweight client-side cc canonicalizer (aligns with middleware behavior). */
const CC_ALIASES = { uk: "gb" };
function canonCc(x) {
  // accept string or { code } / { country } objects
  const raw =
    typeof x === "string"
      ? x
      : x && typeof x === "object"
      ? x.code || x.country || ""
      : "";
  const cc = String(raw).trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(cc)) return ""; // ignore non-2-letter inputs
  return CC_ALIASES[cc] || cc;
}

function readLocalSafe(key = LS_KEY) {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key);
    return key === LS_KEY ? JSON.parse(raw || "{}") : raw;
  } catch {
    return key === LS_KEY ? {} : null;
  }
}

function writeLocalSafe(objOrVal, key = LS_KEY) {
  if (typeof window === "undefined") return;
  try {
    if (key === LS_KEY) localStorage.setItem(LS_KEY, JSON.stringify(objOrVal));
    else localStorage.setItem(key, String(objOrVal ?? ""));
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

/** Should we suppress margin (mid-market mode)? URL `?fx_nomargin=1` wins. */
function readNoMarginFlag() {
  if (typeof window === "undefined") return false;
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.has("fx_nomargin")) {
      const v = (sp.get("fx_nomargin") ?? "").toLowerCase();
      return v === "" || v === "1" || v === "true";
    }
    const raw = (readLocalSafe(NOMARGIN_LS) ?? "").toLowerCase();
    return raw === "1" || raw === "true";
  } catch {
    return false;
  }
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

  // NOTE: `country` is the DELIVERY country (mutable).
  //       `routeSlug` is the BROWSING cc from the URL (read-only).
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

  // mid-market toggle state
  const [noMargin, setNoMarginFlag] = useState(readNoMarginFlag());

  // guard to avoid spamming backfill requests
  const fxBackfillRef = useRef({ inFlight: false, lastKey: "" });

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

        const initFx = {
          base: init.fx?.base || "USD",
          rates: init.fx?.rates || {},
          asOf: init.fx?.as_of || null,
          margin_bps: Number(init.fx?.margin_bps || 0),
          stale: Boolean(init.fx?.stale),
        };
        setFx(initFx);

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

        // If server FX is stale or older than ~4h, gently refresh in background
        const t = initFx.asOf ? new Date(initFx.asOf).getTime() : NaN;
        const ageHrs = Number.isFinite(t) ? (Date.now() - t) / 36e5 : Infinity; // hours
        if (initFx.stale || ageHrs > 4) {
          fetchFx({ base: initFx.base || "USD" })
            .then((fresh) => {
              if (!fresh || !alive) return;
              setFx((prev) => ({
                ...prev,
                base: fresh.base || prev.base,
                rates: { ...(prev.rates || {}), ...(fresh.rates || {}) },
                asOf: fresh.asOf || prev.asOf,
                stale: !fresh.asOf,
              }));
            })
            .catch(() => {});
        }
      } else {
        // If init fails, fetch bare FX so price()/convert() still work.
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

  // keep no-margin flag in sync if localStorage changes (other tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === NOMARGIN_LS) setNoMarginFlag(readNoMarginFlag());
    };
    window.addEventListener?.("storage", onStorage);
    return () => window.removeEventListener?.("storage", onStorage);
  }, []);

  /* ----------------------- persist user preferences ---------------------- */
  useEffect(() => {
    const current = readLocalSafe();
    writeLocalSafe(
      { ...current, country, currency, language },
      LS_KEY
    );
    // SSR-friendly cookies (kept simple)
    setCookie("upfrica_cc", routeSlug);         // browsing cc (from URL)
    setCookie("upfrica_currency", currency);
    setCookie("upfrica_lang", language);
    setCookie("deliver_cc", country);           // delivery cc (kept separate)
  }, [country, currency, language, routeSlug]);

  /* ---------- soft-refresh defaults/FX when country changes (no nav) ----- */
  useEffect(() => {
    // If user changed country without navigation, refresh server suggestions/FX
    if (country === routeSlug) return; // initial mount corresponds to route
    let alive = true;
    (async () => {
      const init = await fetchI18nInit(country).catch(() => null);
      if (!alive || !init) return;

      // Update server-suggested defaults for the new deliver-to country
      setDefaults((prev) => ({
        language: init.language || prev.language,
        currency: init.currency || prev.currency,
      }));

      // Merge FX (don’t drop anything we already have)
      setFx((prev) => ({
        base: init.fx?.base || prev.base,
        rates: { ...(prev.rates || {}), ...(init.fx?.rates || {}) },
        asOf: init.fx?.as_of || prev.asOf,
        margin_bps: Number(init.fx?.margin_bps ?? prev.margin_bps ?? 0),
        stale: Boolean(init.fx?.stale),
      }));
    })();

    return () => {
      alive = false;
    };
  }, [country, routeSlug]);

  /* ----------------------------- memo context ---------------------------- */
  const value = useMemo(() => {
    const marginBps = Number(fx.margin_bps || 0);

    const hasRate = (fxObj, ccy) => {
      const C = String(ccy || "").toUpperCase();
      if (!C) return false;
      const base = String(fxObj?.base || "").toUpperCase();
      const keys = fxObj?.rates ? Object.keys(fxObj.rates) : [];
      return C === base || keys.includes(C);
    };

    // Fire-and-forget backfill for missing pairs; merges new rates into state
    const ensureFxCoverage = (src, dst) => {
      const s = String(src || "").toUpperCase();
      const d = String(dst || "").toUpperCase();
      if (!s || !d) return;
      if (hasRate(fx, s) && hasRate(fx, d)) return;

      const key = `${s}->${d}`;
      if (fxBackfillRef.current.inFlight && fxBackfillRef.current.lastKey === key)
        return;

      fxBackfillRef.current.inFlight = true;
      fxBackfillRef.current.lastKey = key;

      fetchFx({ base: fx.base || "USD" })
        .then((fresh) => {
          if (!fresh) return;
          setFx((prev) => ({
            ...prev,
            base: fresh.base || prev.base,
            rates: { ...(prev.rates || {}), ...(fresh.rates || {}) },
            asOf: fresh.asOf || prev.asOf,
            stale: !fresh.asOf,
          }));
        })
        .catch(() => {})
        .finally(() => {
          fxBackfillRef.current.inFlight = false;
        });
    };

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
     * - Returns `{ amount, converted }` with margin optionally suppressed.
     * - If required rates are missing, it will asynchronously backfill FX and
     *   return the input amount for now (next render will convert).
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

      if (!hasRate(fx, src) || !hasRate(fx, dst)) {
        ensureFxCoverage(src, dst);
        return { amount: a, converted: false, toCurrency: dst };
      }

      try {
        const raw = fxConvert(a, src, dst, fx); // mid-market
        const ok = Number.isFinite(raw) && raw > 0;
        if (!ok) {
          ensureFxCoverage(src, dst);
          return { amount: a, converted: false, toCurrency: dst };
        }
        const out = noMargin ? raw : withMargin(raw, marginBps);
        return { amount: out, converted: true, toCurrency: dst };
      } catch {
        ensureFxCoverage(src, dst);
        return { amount: a, converted: false, toCurrency: dst };
      }
    };

    /** price(): convert to current UI currency if possible; otherwise return input */
    const price = (amount, fromCurrency) => {
      const res = convertOnce(amount, fromCurrency, currency);
      return res.amount;
    };

    /** Public converter with a stable 3-arg signature */
    function convert(amount, fromCurrency, toCurrency) {
      const dst = toCurrency || currency;
      const res = convertOnce(amount, fromCurrency, dst);
      return res.amount;
    }

    /** Formatters & symbol helpers */
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
      const t = new Date(fx.asOf).getTime();
      if (!Number.isFinite(t)) return true;
      const ageHrs = (Date.now() - t) / 36e5;
      return ageHrs > 72;
    })();

    /** Country change helpers */

    // By default: do NOT navigate (keeps PDP /cc/ unchanged).
    // Accepts string or { code } object; normalizes via canonCc.
    const changeCountry = (
      nextCountry,
      opts = { navigate: false, persistQuery: false, persistCookie: true }
    ) => {
      const next = canonCc(nextCountry);
      if (!next || next === country) return;

      if (opts.navigate) {
        try {
          const segs = window.location.pathname.split("/").filter(Boolean);
          if (/^[a-z]{2}$/i.test(segs[0])) segs[0] = next;
          else segs.unshift(next);
          const newPath = "/" + segs.join("/");
          window.location.assign(newPath + window.location.search);
          return;
        } catch {
          /* fall through */
        }
      }

      // No navigation → update state + persistence
      setCountry(next);

      // Optional: keep ?region=cc in the URL (helps middleware on next req)
      if (opts.persistQuery) {
        try {
          const u = new URL(window.location.href);
          u.searchParams.set("region", next);
          window.history.replaceState({}, "", u.toString());
        } catch {}
      }

      // Optional: write delivery cookie now (SSR-friendly)
      if (opts.persistCookie) setCookie("deliver_cc", next);
    };

    // Convenience alias when you DO want to change the URL segment
    const navigateToCountry = (slug) =>
      changeCountry(slug, { navigate: true, persistQuery: false });

    // Accept "AUTO" then resolve to defaults for current country
    const changeCurrency = (ccy) => {
      const v = String(ccy || "").toUpperCase();
      setCurrency(v === "AUTO" ? (defaults.currency || currency) : v);
    };
    const changeLanguage = (lng) =>
      setLanguage(
        String(lng || "").toLowerCase() === "auto" ? "auto" : String(lng || "")
      );

    // Allow pages to toggle mid-market mode for demos/tests.
    const setNoMargin = (on) => {
      const flag = Boolean(on);
      try {
        writeLocalSafe(flag ? "1" : "0", NOMARGIN_LS);
      } catch {}
      setNoMarginFlag(flag);
    };

    return {
      // read-only browsing cc from URL (use this to build links)
      routeCountry: routeSlug,

      // state
      loading,
      country,          // DELIVERY country (mutable)
      currency,
      language,         // preference: "auto" or explicit tag
      resolvedLanguage, // used by formatters/i18n
      supported,
      defaults,         // server suggestions for the current delivery country
      fx,
      stale: isStale,
      noMargin,         // mid-market mode flag

      // helpers
      price,               // number (UI-major if converted; else seller-major)
      convert,             // number; (amt, from[, to]) -> to || current UI ccy
      convertOnce,         // { amount, converted, toCurrency }
      format,              // "symbol + amount"
      formatAmountOnly,    // amount-only string
      symbolFor,           // currency symbol for a code
      langLabel,           // human language name

      // actions
      setCountry: changeCountry,     // does NOT navigate (and normalizes input)
      navigateToCountry,             // use only if you want /cc/ to change
      setCurrency: changeCurrency,
      setLanguage: changeLanguage,
      setNoMargin,                   // toggle mid-market mode
    };
  }, [
    loading,
    country,
    currency,
    language,
    supported,
    defaults,
    fx,
    noMargin,
    routeSlug,
  ]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}