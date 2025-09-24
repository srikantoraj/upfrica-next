// src/components/home/Header.jsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocalization } from "@/contexts/LocalizationProvider";
import { useAuth } from "@/contexts/AuthContext";
import { fetchI18nInit } from "@/lib/i18n";
import { withCountryPrefix } from "@/lib/locale-routing";
import NotificationsBell from "@/components/common/nav/NotificationsBell";
import SearchAutosuggest from "@/components/search/SearchAutosuggest";

/* utils */
const isoToSlug = (iso) =>
  (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
const slugToIso = (slug) =>
  (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());
const normalizeCc = (cc) => {
  const v = String(cc || "").toLowerCase();
  return v === "gb" ? "uk" : v || "uk";
};

// country code -> emoji flag (handles UK/GB gracefully)
const toFlag = (cc) => {
  const raw = String(cc || "").toLowerCase();
  const code = raw === "uk" ? "gb" : raw; // map UK -> GB for emoji
  const s = code.slice(0, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(s)) return "🌐";
  const pts = [...s].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  try {
    return String.fromCodePoint(...pts);
  } catch {
    return "🌐";
  }
};

/* ---------------------------------------------------------------------- */
/* Header                                                                 */
/* ---------------------------------------------------------------------- */
export default function Header({
  cc,
  countryCode,
  searchPlaceholder,
  categories = [],
}) {
  const { country: ctxCountry } = useLocalization();
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isRequests = /^\/[a-z]{2}\/requests(?:\/|$|\?)/i.test(pathname || "");

  const ccInitial = normalizeCc(cc || "uk");
  const [viewCc, setViewCc] = useState(ccInitial);

  useEffect(() => {
    if (ctxCountry) setViewCc(normalizeCc(ctxCountry));
  }, [ctxCountry]);

  // precompute country code pieces for the brand
  const cc2 = (ccInitial ?? "gh").slice(0, 2).toLowerCase();
  const cc2Upper = cc2.toUpperCase();
  const brandHref = useMemo(() => withCountryPrefix(ccInitial, "/"), [ccInitial]);

  // locale sheet
  const [locOpen, setLocOpen] = useState(false);
  const openerRef = useRef(null);
  const setOpen = (v) => setLocOpen(Boolean(v));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.toggle("overflow-hidden", locOpen);
    document.body.classList.toggle("overflow-hidden", locOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [locOpen]);

  useEffect(() => {
    if (!locOpen && openerRef.current) {
      try {
        openerRef.current.focus();
      } catch {}
    }
  }, [locOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      router.push("/");
      router.refresh();
    }
  }, [logout, router]);

  const hotSearches = [
    "Phones under GH₵500",
    "Human Hair Kumasi",
    "Spice Grinder",
    "Jollof Pot",
    "LED Ring Light",
    "Shea Butter",
  ];

  // derive first name (robust to various backend keys)
  const firstName = useMemo(() => {
    const raw =
      (user?.first_name ??
        user?.firstName ??
        user?.given_name ??
        user?.name ??
        "")
        .toString()
        .trim();
    if (!raw) return "";
    const fn = raw.split(/\s+/)[0];
    return fn.charAt(0).toUpperCase() + fn.slice(1);
  }, [user]);

  // Read saved city cookie (for a tiny caption under the mobile pill)
  const [savedCity, setSavedCity] = useState("");
  useEffect(() => {
    try {
      const cc = (String(viewCc || "uk")).toLowerCase();
      const key = `deliver_to_${cc}`;
      const m = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]+)`));
      setSavedCity(m ? decodeURIComponent(m[1]) : "");
    } catch {
      setSavedCity("");
    }
  }, [viewCc, locOpen]);

  return (
    <header className="sticky top-0 z-[70] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-[var(--line)]">
      {/* A11y for hamburger drawer */}
      <Script id="nav-drawer-a11y" strategy="lazyOnload">{`
        ;(function () {
          if (typeof window === 'undefined') return;
          function init() {
            var cb = document.getElementById('nav-drawer');
            if (!cb) return;
            var panel = document.getElementById('mobile-menu');
            function onChange(){
              var open = cb.checked;
              document.documentElement.classList.toggle('overflow-hidden', open);
              document.body.classList.toggle('overflow-hidden', open);
              if (panel) { panel.hidden = !open; panel.setAttribute('aria-hidden', String(!open)); }
            }
            cb.addEventListener('change', onChange);
            if (panel) { panel.hidden = !cb.checked; panel.setAttribute('aria-hidden', String(!cb.checked)); }
          }
          if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 3000 });
          else window.addEventListener('load', function(){ setTimeout(init, 1); }, { once: true });
        })();
      `}</Script>

      {/* hidden control for hamburger drawer */}
      <input id="nav-drawer" type="checkbox" className="peer hidden" aria-hidden="true" />
      <MobileSidebar
        cc={ccInitial}
        categories={categories}
        authed={!!user}
        onLogout={handleLogout}
      />

      {/* Top row */}
      <div className="mx-auto max-w-8xl px-4 py-2 flex items-center gap-2 sm:gap-3 text-[var(--ink)] min-w-0">
        {/* Hamburger */}
        <label
          id="hamburger-trigger"
          htmlFor="nav-drawer"
          role="button"
          tabIndex={0}
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-haspopup="dialog"
          aria-expanded="false"
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--alt-surface)] group shrink-0"
        >
          <span className="relative block h-5 w-6">
            <span className="absolute inset-x-0 top-0 h-[2px] bg-current"></span>
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current"></span>
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-current"></span>
          </span>
        </label>

        {/* Brand */}
        <a href={brandHref} className="uf-logo" data-country={cc2} aria-label={`Upfrica ${cc2Upper}`}>
          <span className="uf-logo__brand" aria-hidden="true">
            <span className="uf-logo__mark">
              <span className="uf-logo__u">U</span>
              <svg className="uf-logo__caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 14 L12 6 L20 14" fill="none" />
              </svg>
            </span>
            <span className="uf-logo__rest">pfrica</span>
          </span>
          <span className="uf-logo__badge" aria-hidden="true">
            {cc2Upper}
          </span>
          <span className="sr-only">Upfrica {cc2Upper}</span>
        </a>

        {/* i18n pill — desktop only to avoid mobile duplication */}
        <span className="hidden md:inline-flex">
          <LocalePill
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpen(true);
            }}
            ariaExpanded={locOpen}
          />
        </span>

        {/* Desktop search + categories */}
        <div className="flex-1 hidden md:flex items-stretch gap-2 min-w-0" role="search">
          <AllCategoriesMenu cc={ccInitial} categories={categories} />
          <SearchAutosuggest
            key={`sa-${ccInitial}`}
            cc={ccInitial}
            deliverTo={viewCc}
            placeholder={searchPlaceholder || "Search products, brands, shops…"}
            ctaMode="always"
            ctaText="Source it for me"
            scopes={["products", "requests", "shops"]}
            defaultScope={isRequests ? "requests" : "products"}
          />
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          {hydrated && user ? <NotificationsBell dashboardHref="/new-dashboard" /> : null}

          <span className="hidden md:block">
            <SourcingDropdown cc={ccInitial} />
          </span>

          <span className="hidden md:block">
            <EarnDropdown cc={ccInitial} />
          </span>

          {hydrated && user ? (
            <>
              {/* Hello, {name} / Account (desktop) */}
              <Link
                href="/new-dashboard"
                className="hidden md:flex flex-col justify-center px-2 py-1.5 rounded-lg hover:bg-[var(--alt-surface)] leading-tight"
                aria-label="Go to your account"
              >
                <span className="text-[11px] text-[var(--ink-2)]">
                  {`Hello${firstName ? "," : ""} ${firstName || ""}`.trim()}
                </span>
                <span className="text-sm font-medium">Account</span>
              </Link>

              {/* Compact account on small screens — shows firstName */}
              <Link
                href="/new-dashboard"
                className="md:hidden px-2 py-1 rounded-lg hover:bg-[var(--alt-surface)] inline-flex items-center gap-1 max-w-[44vw]"
                aria-label={firstName ? `Account — ${firstName}` : "Account"}
                title={firstName ? `Hello, ${firstName}` : "Account"}
              >
                <span aria-hidden>👤</span>
                <span className="text-sm font-medium truncate">{firstName || "Account"}</span>
              </Link>

              {/* Hide logout on mobile to reduce crowding */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:inline-flex px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-[var(--ink)]"
                aria-label="Log out"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)]">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 rounded-lg bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Cart — larger tap target */}
          <a
            href={`/${ccInitial}/cart`}
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl hover:bg-[var(--alt-surface)]"
            aria-label="Cart"
          >
            <span className="inline-flex items-center justify-center rounded-lg ring-1 ring-[var(--brand-600)] px-2 py-1 text-[18px] font-black">
              🛒
            </span>
          </a>
        </div>
      </div>

      {/* Mobile search + compact pill */}
      <div className="md:hidden px-4 pb-2 pt-1 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70" role="search">
        <SearchAutosuggest
          key={`sa-m-${ccInitial}`}
          cc={ccInitial}
          deliverTo={viewCc}
          placeholder={searchPlaceholder || "Search products…"}
          className="mt-0"
          inputClassName="rounded-l-xl"
          buttonClassName=""
          ctaMode="always"
          ctaText="Source it for me"
          scopes={["products", "requests", "shops"]}
          defaultScope={isRequests ? "requests" : "products"}
        />
        <div className="mt-2">
          {/* keep only this Deliver To pill on mobile */}
          <LocalePill
            compact
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpen(true);
            }}
            ariaExpanded={locOpen}
          />
          {savedCity ? (
            <div className="mt-1 text-xs text-[var(--ink-2)] truncate">
              Delivering to <span className="font-medium">{savedCity}</span>
            </div>
          ) : null}
        </div>
      </div>

      <datalist id="hot-searches">
        {hotSearches.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <LocaleSheet open={locOpen} onClose={() => setOpen(false)} />
    </header>
  );
}

/* ---------------------------------------------------------------------- */
/* Hydration-safe Locale Pill */
function LocalePill({ onClick, compact = false, ariaExpanded = false }) {
  const { loading, country, currency, resolvedLanguage, langLabel } = useLocalization();

  if (loading) {
    return (
      <button
        onClick={onClick}
        aria-label="Open region & preferences"
        aria-haspopup="dialog"
        aria-expanded={ariaExpanded}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-[var(--alt-surface)]"
      >
        <span suppressHydrationWarning>Deliver to 🌐</span>
        {!compact && <span className="text-[var(--ink-2)]" suppressHydrationWarning>—</span>}
        <span suppressHydrationWarning>—</span>
      </button>
    );
  }

  const flag = toFlag(country);
  const langText = langLabel(resolvedLanguage);

  return (
    <button
      onClick={onClick}
      aria-label="Open region & preferences"
      aria-haspopup="dialog"
      aria-expanded={ariaExpanded}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-[var(--alt-surface)]"
    >
      <span suppressHydrationWarning>{`Deliver to ${flag}`}</span>
      {!compact && <span suppressHydrationWarning>{langText}</span>}
      <span suppressHydrationWarning>{currency}</span>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* All Categories                                                         */
/* ---------------------------------------------------------------------- */
function AllCategoriesMenu({ cc, categories = [] }) {
  const prefix = `/${cc}`;
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none inline-flex items-center gap-2 h-11 px-3 rounded-xl border border-[var(--line)] bg-white cursor-pointer select-none hover:bg-[var(--alt-surface)]">
          <span>📂</span>
          <span className="font-semibold text-sm">All Categories</span>
          <span className="text-[var(--ink-2)] group-open:rotate-180 transition">▾</span>
        </summary>
        <div className="absolute left-0 mt-2 w-[680px] max-w-[90vw] rounded-2xl border border-[var(--line)] bg-white shadow-xl p-3 z-50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.slice(0, 12).map((c) => (
              <a
                key={c.id}
                href={c.href}
                className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[var(--alt-surface)]"
              >
                <span className="text-lg" aria-hidden>{categoryIcon(c.icon)}</span>
                <span className="text-sm">{c.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <a href={`${prefix}/categories`} className="text-sm text-[var(--violet-500,#A435F0)] hover:underline">
              View all categories →
            </a>
            <div className="text-xs text-[var(--ink-2)]">Tip: use the chips below the hero to jump quickly.</div>
          </div>
        </div>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* NEW: Sourcing dropdown (desktop)                                       */
/* ---------------------------------------------------------------------- */
function SourcingDropdown({ cc }) {
  const prefix = `/${cc}`;
  const items = [
    { label: "Browse Requests", href: `${prefix}/requests`, icon: "📥", tag: "Live" },
    { label: "Source it for me", href: `${prefix}/sourcing`, icon: "🔎", tag: "Post request" },
    { label: "Become a Sourcing Agent", href: `${prefix}/sourcing-agents`, icon: "🧰", tag: "Pro" },
  ];
  return (
    <div className="relative">
      <details>
        <summary className="list-none px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] cursor-pointer select-none">
          🧾 Sourcing
        </summary>
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--line)] bg-white shadow-lg p-1 z-50">
          <div className="mx-1 my-1 rounded-lg p-2 bg-gradient-to-r from-amber-50 to-violet-50 border border-[var(--line)] text-[13px]">
            Find buyers’ requests, send quotes, and earn commissions.
          </div>
          {items.map(({ label, href, icon, tag }) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <span aria-hidden>{icon}</span>
                {label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)]">{tag}</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Earn dropdown (desktop) — with icons & standout                        */
/* ---------------------------------------------------------------------- */
function EarnDropdown({ cc }) {
  const prefix = `/${cc}`;
  const items = [
    { label: "Sell on Upfrica", href: `${prefix}/sell`, icon: "🏪", tag: "Start free" },
    { label: "Earn Money", href: `${prefix}/earn`, icon: "💸", tag: "Ways to earn" },
    { label: "Become an Affiliate", href: `${prefix}/affiliate`, icon: "🤝", tag: "Referrals" },
  ];
  return (
    <div className="relative">
      <details>
        <summary className="list-none px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] cursor-pointer select-none">
          💼 Earn
        </summary>
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--line)] bg-white shadow-lg p-1 z-50">
          <div className="mx-1 my-1 rounded-lg p-2 bg-gradient-to-r from-emerald-50 to-sky-50 border border-[var(--line)] text-[13px]">
            Turn your skills and audience into income on Upfrica.
          </div>
          {items.map(({ label, href, icon, tag }) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <span aria-hidden>{icon}</span>
                {label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)]">{tag}</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Unified Locale Sheet — hidden list + smart search + GB→UK + PDP fix    */
/* ---------------------------------------------------------------------- */
function LocaleSheet({ open, onClose }) {
  const {
    country,
    currency,
    language,
    setCountry,
    setCurrency,
    setLanguage,
    supported = {},
  } = useLocalization();

  // ---------- portal root (state so we re-render when ready) ------------
  const [portalEl, setPortalEl] = useState(null);
  useEffect(() => {
    let el = document.getElementById("loc-portal");
    let created = false;
    if (!el) {
      el = document.createElement("div");
      el.id = "loc-portal";
      created = true;
    }
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      if (created && el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  // ---------- helpers ---------------------------------------------------
  const canonicalCc = (cc) =>
    (String(cc || "").toLowerCase() === "gb" ? "uk" : String(cc || "").toLowerCase());

  // map GB→uk for routing
  const toSlug = (cc) =>
    (String(cc || "").toLowerCase() === "gb" ? "uk" : String(cc || "").toLowerCase());

  // build the next URL with the new country slug, keeping the rest of the path + query
  const buildCountryUrl = (slug) => {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const rest = path.replace(/^\/[a-z]{2}(?=\/|$)/i, ""); // strip existing /xx
    const next = `/${toSlug(slug)}${rest || "/"}`;
    return `${next}${qs}`;
  };

  // is the current path a PDP like /gh/my-product-slug ?
  const isPdpPath = (p) => /^\/[a-z]{2}\/[^\/?#]+$/.test(p || "");

  const normCountry = (c) => {
    const raw = (c?.code || c?.iso || c?.slug || c?.id || "").toString();
    const code = canonicalCc(raw);
    const name = code === "uk" ? "United Kingdom" : c?.name || c?.label || raw.toUpperCase();
    return { code, name, flag: c?.flag || toFlag(code) };
  };

  // ---------- base options + local state --------------------------------
  const baseCountries = supported.countries || [];
  const baseLanguages = supported.languages || [];
  const baseCurrencies = supported.currencies || [];

  const [ccDraft, setCcDraft] = useState(canonicalCc(country));
  const [lngDraft, setLngDraft] = useState(language || "auto");
  const [curDraft, setCurDraft] = useState(currency || "auto");
  const [city, setCity] = useState("");
  const [filter, setFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  const [opts, setOpts] = useState({
    countries: baseCountries,
    languages: baseLanguages,
    currencies: baseCurrencies,
  });
  const [optsLoading, setOptsLoading] = useState(false);

  // cache defaults for the draft country (used to set currency immediately on PDP)
  const [nextDefaults, setNextDefaults] = useState({ language: null, currency: null });

  useEffect(() => {
    if (open) {
      setCcDraft(canonicalCc(country));
      setLngDraft(language || "auto");
      setCurDraft(currency || "auto");
      setCity("");
      setFilter("");
      setShowAll(false);
      setOpts({ countries: baseCountries, languages: baseLanguages, currencies: baseCurrencies });
      setNextDefaults({ language: null, currency: null });
    }
  }, [open, country, language, currency]); // eslint-disable-line

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!open || !ccDraft || canonicalCc(ccDraft) === canonicalCc(country)) {
        setOpts({
          countries: baseCountries,
          languages: baseLanguages,
          currencies: baseCurrencies,
        });
        setNextDefaults({ language: null, currency: null });
        return;
      }
      setOptsLoading(true);
      try {
        const init = await fetchI18nInit(ccDraft);
        if (cancelled) return;
        setOpts({
          countries: init?.supported?.countries || baseCountries,
          languages: init?.supported?.languages || baseLanguages,
          currencies: init?.supported?.currencies || baseCurrencies,
        });
        setNextDefaults({
          language: init?.language || null,
          currency: (init?.currency || "").toUpperCase() || null,
        });
        setLngDraft("auto");
        setCurDraft("auto");
      } finally {
        if (!cancelled) setOptsLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [ccDraft, open]); // eslint-disable-line

  // ---------- country data + smart search --------------------------------
  const allCountries = useMemo(() => {
    const arr = (opts.countries || []).map(normCountry).filter((c) => c.code);
    arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [opts.countries]);

  const PINNED = ["gh", "ng", "uk"];
  const pinned =
    PINNED.map((k) => allCountries.find((c) => c.code === k) || { code: k, name: { gh: "Ghana", ng: "Nigeria", uk: "United Kingdom" }[k], flag: toFlag(k) });

  const rank = (q, c) => {
    if (!q) return 0;
    const code = c.code.toLowerCase(),
      name = c.name.toLowerCase();
    const bonus = PINNED.includes(code) ? -100 : 0;
    if (code === q || name === q) return bonus - 50;
    if (code.startsWith(q) || name.startsWith(q)) return bonus - 25;
    if (code.includes(q) || name.includes(q)) return bonus - 5;
    return 999;
  };

  const aliases = {
    uk: ["gb", "britain", "great britain", "united kingdom", "u k", "uk"],
    gh: ["ghana", "gh"],
    ng: ["nigeria", "ng"],
  };
  const normalizeQuery = (s) => s.replace(/\./g, "").trim().toLowerCase();
  const qRaw = normalizeQuery(filter);
  const q = Object.entries(aliases).find(([, arr]) => arr.includes(qRaw))?.[0] || qRaw;

  const filtered = useMemo(() => {
    if (!q) return [];
    const scored = allCountries.map((c) => ({ c, s: rank(q, c) }));
    scored.sort((a, b) => a.s - b.s || a.c.name.localeCompare(b.c.name));
    return scored.filter(({ s }) => s < 999).map(({ c }) => c);
  }, [q, allCountries]);

  const topSuggestions = (q ? filtered : pinned).slice(0, 8);

  // Suggestion popover open/close + click-away
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setShowSuggest(false);
    }
  }, [open]);

  useEffect(() => {
    const onDown = (e) => {
      if (showSuggest && suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showSuggest]);

  // ---------- apply + cookies -------------------------------------------
  const setCookie = (k, v, days = 180) => {
    try {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${k}=${encodeURIComponent(v)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
    } catch {}
  };

  const apply = async () => {
    const cc = canonicalCc(ccDraft);
    if (city) setCookie(`deliver_to_${cc}`, city);

    const path = typeof window !== "undefined" ? window.location.pathname : "/";

    // Decide target currency now (avoid "AUTO" to prevent sticking to old default)
    let targetCurrency = null;
    if (curDraft) {
      if (String(curDraft).toLowerCase() === "auto") {
        targetCurrency = nextDefaults.currency;
        if (!targetCurrency) {
          try {
            const init = await fetchI18nInit(cc);
            targetCurrency = (init?.currency || "").toUpperCase() || null;
          } catch {}
        }
      } else {
        targetCurrency = String(curDraft).toUpperCase();
      }
    }

    if (cc !== canonicalCc(country)) {
      if (isPdpPath(path)) {
        // PDP: keep URL; update in place
        setCountry(cc, { navigate: false });
        if (targetCurrency) setCurrency(targetCurrency);
        if (lngDraft) setLanguage(lngDraft);
        onClose();
      } else {
        // Non-PDP pages: safe to change the /cc/ in the URL
        const nextUrl = buildCountryUrl(cc);
        window.location.assign(nextUrl);
      }
      return;
    }

    // Same-country: just update prefs in place
    if (targetCurrency) setCurrency(targetCurrency);
    if (lngDraft) setLanguage(lngDraft);
    onClose();
  };

  // ---------- UI ---------------------------------------------------------
  const Sheet = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm ${open ? "block" : "hidden"} ${
          open ? "" : "pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel (centered) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="ls-title"
        className={`fixed inset-x-0 bottom-0 z-[1101] transition-transform duration-300 bg-transparent
                    ${open ? "translate-y-0" : "translate-y-full pointer-events-none"}`}
        hidden={!open}
      >
        <div className="mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl">
          <div
            className="rounded-t-2xl border-t border-[var(--line)] bg-white shadow-2xl
                        max-h-[88vh] overflow-y-auto [padding-bottom:env(safe-area-inset-bottom)]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[var(--line)] px-4 pt-3 pb-3 rounded-t-2xl">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 mb-2" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 id="ls-title" className="text-lg font-semibold flex-1">
                  Region & Preferences
                </h2>

                {/* Search + suggestions */}
                <div className="relative" ref={suggestRef}>
                  <input
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setShowSuggest(true);
                    }}
                    onFocus={() => setShowSuggest(true)}
                    placeholder="Search country"
                    className="pl-9 pr-3 py-2 text-sm border rounded-xl min-w-[240px] w-[280px]"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    🔎
                  </span>

                  {showSuggest && topSuggestions.length > 0 && (
                    <div className="absolute right-0 mt-1 w-[min(420px,90vw)] max-h-[50vh] overflow-y-auto rounded-xl border border-[var(--line)] bg-white shadow-xl z-[5]">
                      {topSuggestions.map((c) => (
                        <button
                          key={`sugg-${c.code}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setCcDraft(c.code);
                            setFilter("");
                            setShowSuggest(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[var(--alt-surface)]"
                        >
                          <span>{c.flag}</span>
                          <span className="font-medium">{c.name}</span>
                          <span className="ml-auto text-xs text-gray-500 uppercase">
                            {c.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-8">
              {/* Quick pins only */}
              <section className="space-y-2">
                <div className="text-sm font-semibold">Deliver to</div>
                <div className="flex flex-wrap gap-2">
                  {pinned.map((c) => (
                    <RadioChip
                      key={`pin-${c.code}`}
                      label={`${c.flag} ${c.name}`}
                      checked={String(ccDraft).toLowerCase() === c.code}
                      onChange={() => {
                        setCcDraft(c.code);
                        setShowSuggest(false);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Reveal grid when searching / show-all */}
              {(filter.trim() || showAll) && (
                <section className="space-y-2">
                  <div className="text-xs text-gray-500">
                    {optsLoading ? "Loading country options…" : filter.trim() ? "Search results" : "All countries"}
                  </div>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
                  >
                    {(filter.trim() ? filtered : allCountries).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCcDraft(c.code);
                          setShowSuggest(false);
                        }}
                        className={`px-3 py-2 w-full rounded-full border text-sm flex items-center gap-2 justify-between
                          ${
                            String(ccDraft).toLowerCase() === c.code
                              ? "bg-[var(--brand-50,#EEF2FF)] border-[var(--brand-600)]"
                              : "border-[var(--line)] hover:bg-[var(--alt-surface)]"
                          }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span aria-hidden>{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {!filter.trim() && !showAll && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="px-4 py-2 rounded-full text-sm border hover:bg-[var(--alt-surface)]"
                  >
                    Browse all countries
                  </button>
                </div>
              )}

              {/* Language */}
              <section>
                <div className="mb-2 text-sm font-semibold">Language</div>
                <select
                  value={lngDraft}
                  onChange={(e) => setLngDraft(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="auto">Auto (recommended)</option>
                  {(Array.isArray(baseLanguages)
                    ? opts.languages || baseLanguages
                    : []
                  ).map((l) => {
                    const item = typeof l === "string" ? { code: l, label: l } : l;
                    return (
                      <option key={item.code} value={item.code}>
                        {item.label || item.code}
                      </option>
                    );
                  })}
                </select>
              </section>

              {/* Currency */}
              <section>
                <div className="mb-2 text-sm font-semibold">Currency</div>
                <select
                  value={curDraft}
                  onChange={(e) => setCurDraft(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="auto">Auto (recommended)</option>
                  {(opts.currencies || baseCurrencies || []).map((c) => {
                    const code = typeof c === "string" ? c : c?.code || "";
                    return code ? (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ) : null;
                  })}
                </select>
              </section>

              {/* City (optional) */}
              <section>
                <div className="mb-2 text-sm font-semibold">City (optional)</div>
                <input
                  placeholder="e.g., Accra, Kumasi, Lagos"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  We’ll remember this for delivery options.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--line)] px-4 py-3 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-full border text-sm">
                Cancel
              </button>
              <button
                onClick={apply}
                className="px-5 py-2 rounded-full text-sm text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  if (!portalEl) return null;
  return createPortal(Sheet, portalEl);
}

/* small chip-like radio with keyboard support (unchanged) */
function RadioChip({ label, checked, onChange }) {
  const onKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange?.();
    }
  };
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      onKeyDown={onKeyDown}
      className={`px-3 py-1.5 rounded-full border text-sm ${
        checked
          ? "bg-[var(--brand-50,#eef2ff)] border-[var(--brand-600)]"
          : "border-[var(--line)] hover:bg-[var(--alt-surface)]"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Mobile drawer                                                          */
/* ---------------------------------------------------------------------- */
function MobileSidebar({ cc, categories = [], authed, onLogout }) {
  const prefix = `/${cc}`;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const bodyEl = useRef(null);
  const cbRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const el = document.createElement("div");
    el.id = "drawer-portal";
    document.body.appendChild(el);
    bodyEl.current = el;
    return () => {
      try {
        document.body.removeChild(el);
      } catch {}
    };
  }, []);

  useEffect(() => {
    const cb = document.getElementById("nav-drawer");
    if (!cb) return;
    cbRef.current = cb;
    const sync = () => setOpen(cb.checked);
    sync();
    cb.addEventListener("change", sync);
    return () => cb.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.toggle("overflow-hidden", open);
    document.body.classList.toggle("overflow-hidden", open);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  const close = () => {
    const cb = cbRef.current;
    if (cb) {
      cb.checked = false;
      setOpen(false);
    }
  };

  if (!mounted || !bodyEl.current) return null;

  return createPortal(
    <>
      {/* Backdrop masks page */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={`fixed left-0 top-0 z-[1101] h-[100dvh] w-[88%] max-w-[420px] bg-white shadow-2xl rounded-r-2xl border-r border-[var(--line)] overflow-y-auto transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } [padding-bottom:env(safe-area-inset-bottom)]`}
      >
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 id="mobile-menu-title" className="text-lg font-black">
            Menu
          </h2>
          <button
            onClick={close}
            className="p-3 rounded-xl hover:bg-[var(--alt-surface)]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Auth block */}
        <div className="px-4 py-3 border-b border-[var(--line)]">
          {authed ? (
            <div className="flex gap-2">
              <Link
                href="/new-dashboard"
                className="flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-[var(--alt-surface)]"
                onClick={close}
              >
                Account
                <span
                  id="m-notif-dot"
                  className="ml-2 inline-block w-2 h-2 rounded-full bg-[var(--brand-600)]"
                  style={{ display: "none" }}
                />
              </Link>
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  close();
                }}
                className="flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-[var(--alt-surface)]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={close}
                className="flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm hover:bg-[var(--alt-surface)]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Categories scroller */}
        <div className="px-4 py-3">
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <ul className="flex gap-2 min-w-max">
              {categories.slice(0, 18).map((c) => (
                <li key={c.id} className="shrink-0">
                  <a
                    href={c.href}
                    onClick={close}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs hover:border-[var(--violet-500,#A435F0)] hover:text-[var(--violet-500,#A435F0)]"
                  >
                    <span aria-hidden>{categoryIcon(c.icon)}</span>
                    <span>{c.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick links */}
        <nav className="px-2 py-3 border-t border-[var(--line)]">
          <div className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)] mb-2">
            Quick links
          </div>
          <ul className="space-y-1">
            {[
              ["🔥 Today’s Deals", `${prefix}/deals`],
              ["⚡ Same-Day Near Me", `${prefix}/search?delivery=same-day`],
              ["✅ Verified Sellers", `${prefix}/search?seller=verified`],
              ["📦 Wholesale & Bulk", `${prefix}/wholesale`],
              ["🧭 Explore", `${prefix}/search?sort=trending&near=me`],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={close}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] border border-transparent hover:border-[var(--line)]"
                >
                  <span className="text-sm">{label}</span>
                  <span aria-hidden>›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sourcing */}
        <nav className="px-2 py-3 border-t border-[var(--line)]">
          <div className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)] mb-2">
            Sourcing
          </div>
          <ul className="space-y-1">
            {[
              ["📥 Sourcing Requests", `${prefix}/requests`],
              ["🔎 Source it for me", `${prefix}/sourcing`],
              ["🧰 Become a Sourcing Agent", `${prefix}/sourcing-agents`],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={close}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] border border-transparent hover:border-[var(--line)]"
                >
                  <span className="text-sm">{label}</span>
                  <span aria-hidden>›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Earn with Upfrica */}
        <nav className="px-2 py-3 border-t border-[var(--line)]">
          <div className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)] mb-2">
            Earn with Upfrica
          </div>
          <ul className="space-y-1">
            {[
              ["🏪 Sell on Upfrica", `${prefix}/sell`],
              ["💸 Earn Money", `${prefix}/earn`],
              ["🤝 Become an Affiliate", `${prefix}/affiliate`],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={close}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] border border-transparent hover:border-[var(--line)]"
                >
                  <span className="text-sm">{label}</span>
                  <span aria-hidden>›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>,
    bodyEl.current
  );
}

/* ---------------------------------------------------------------------- */
/* Local helpers                                                          */
/* ---------------------------------------------------------------------- */
const categoryIcon = (key) =>
  ({
    devices: "📱",
    hair: "💇🏾‍♀️",
    food: "🥘",
    fashion: "👗",
    home: "🏠",
    box: "📦",
    car: "🚗",
    factory: "🏭",
    baby: "🍼",
    dumbbell: "🏋🏾",
    heart: "💖",
    wrench: "🛠️",
  }[key] || "🛍️");