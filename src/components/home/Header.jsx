// src/components/home/Header.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";
import { useLocalization } from "@/contexts/LocalizationProvider";
import { fetchI18nInit } from "@/lib/i18n";
import { withCountryPrefix } from "@/lib/locale-routing"; // .ts or .js, both work

/* utils */
const isoToSlug = (iso) =>
  (String(iso).toUpperCase() === "GB" ? "uk" : String(iso || "").toLowerCase());
const slugToIso = (slug) =>
  (String(slug).toLowerCase() === "uk" ? "GB" : String(slug || "").toUpperCase());

/* ---------------------------------------------------------------------- */
/* Header                                                                 */
/* ---------------------------------------------------------------------- */
export default function Header({
  cc,
  countryCode,
  searchPlaceholder,
  categories = [],
  deliverCity, // optional hint
}) {
  const { country: ctxCountry } = useLocalization();
  const ccSafe = (cc || ctxCountry || "uk").toLowerCase();

  // location sheet control (desktop pill + mobile row share this)
  const [locOpen, setLocOpen] = useState(false);
  const openerRef = useRef(null);
  const setOpen = (v) => setLocOpen(Boolean(v));

  // esc + scroll lock + focus restore
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

  const hotSearches = [
    "Phones under GH₵500",
    "Human Hair Kumasi",
    "Spice Grinder",
    "Jollof Pot",
    "LED Ring Light",
    "Shea Butter",
  ];

  const brandHref = useMemo(() => withCountryPrefix(ccSafe, "/"), [ccSafe]);

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
      <MobileSidebar cc={ccSafe} categories={categories} />

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

        {/* Brand (keeps current country prefix) */}
        <a href={brandHref} className="text-[22px] sm:text-2xl font-black tracking-tight shrink-0">
          Upfrica
          <span className="text-[var(--brand-600)]">
            .{String(countryCode || ccSafe).toLowerCase()}
          </span>
        </a>

        {/* i18n pill (desktop) */}
        <div className="hidden md:block">
          <LocalePill
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpen(true);
            }}
          />
        </div>

        {/* Desktop search + categories */}
        <div className="flex-1 hidden md:flex items-stretch gap-2 min-w-0">
          <AllCategoriesMenu cc={ccSafe} categories={categories} />
          <form action={`/${ccSafe}/search`} className="flex-1 flex min-w-0" role="search" aria-label="Site">
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder={searchPlaceholder}
              className="w-full h-11 rounded-l-xl border border-[var(--line)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              autoComplete="off"
              list="hot-searches"
            />
            <button className="h-11 rounded-r-xl bg-[var(--brand-600)] px-4 text-white text-sm font-medium hover:bg-[var(--brand-700)]">
              Search
            </button>
          </form>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1 sm:gap-3 shrink-0">
          <span className="hidden md:block">
            <EarnDropdown cc={ccSafe} />
          </span>
          <a
            href={`/${ccSafe}/account`}
            className="px-2 py-2 rounded-lg hover:bg-[var(--alt-surface)]"
          >
            <span className="hidden sm:inline">Account</span>
            <span className="sm:hidden">👤</span>
          </a>
          <a
            href={`/${ccSafe}/cart`}
            className="px-1 py-1 rounded-lg hover:bg-[var(--alt-surface)]"
            aria-label="Cart"
          >
            <span className="inline-flex items-center justify-center rounded-lg ring-2 ring-[var(--brand-600)] px-2 py-1 text-[18px] font-black">
              🛒
            </span>
          </a>
        </div>
      </div>

      {/* Mobile search + compact pill */}
      <div className="md:hidden px-4 pb-2 pt-1 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <form
          action={`/${ccSafe}/search`}
          role="search"
          aria-label="Mobile Site Search"
          className="flex"
        >
          <input
            name="q"
            type="search"
            placeholder={searchPlaceholder}
            className="w-full h-11 rounded-l-xl border border-[var(--line)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
            list="hot-searches"
          />
          <button
            className="h-11 px-3 rounded-r-xl bg-[var(--brand-600)] text-white text-sm font-medium"
            aria-label="Search"
          >
            🔎
          </button>
        </form>

        <div className="mt-2">
          <LocalePill
            compact
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setOpen(true);
            }}
          />
        </div>
      </div>

      {/* shared datalist */}
      <datalist id="hot-searches">
        {hotSearches.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      {/* Locale Sheet (portal) */}
      <LocaleSheet open={locOpen} onClose={() => setOpen(false)} />
    </header>
  );
}

/* ---------------------------------------------------------------------- */
/* Hydration-safe Locale Pill                                             */
function LocalePill({ onClick, compact = false }) {
  const { loading, country, currency, resolvedLanguage, langLabel } = useLocalization();

  if (loading) {
    return (
      <button
        onClick={onClick}
        aria-label="Open region & preferences"
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-[var(--alt-surface)]"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Set location · —
      </button>
    );
  }

  const flag = { gh: "🇬🇭", ng: "🇳🇬", uk: "🇬🇧" }[country] || "🌐";
  const langText = langLabel(resolvedLanguage);

  const parts = compact
    ? [`Deliver to ${flag}`, currency]
    : [`Deliver to ${flag}`, langText, currency];

  return (
    <button
      onClick={onClick}
      aria-label="Open region & preferences"
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm bg-white hover:bg-[var(--alt-surface)]"
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      {parts.join(" · ")}
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
                <span className="text-lg" aria-hidden>
                  {categoryIcon(c.icon)}
                </span>
                <span className="text-sm">{c.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <a
              href={`${prefix}/categories`}
              className="text-sm text-[var(--violet-500,#A435F0)] hover:underline"
            >
              View all categories →
            </a>
            <div className="text-xs text-[var(--ink-2)]">
              Tip: use the chips below the hero to jump quickly.
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Earn dropdown                                                          */
/* ---------------------------------------------------------------------- */
function EarnDropdown({ cc }) {
  const prefix = `/${cc}`;
  const items = [
    ["Sell on Upfrica", `${prefix}/sell`, "Start free"],
    ["Become an Agent", `${prefix}/agents`, "Earn per seller"],
    ["Become a Sourcing Agent", `${prefix}/sourcing-agents`, "Trusted pros"],
    ["Earn Money Sourcing", `${prefix}/sourcing`, "Commission"],
    ["Become an Affiliate", `${prefix}/affiliate`, "Referral pay"],
  ];
  return (
    <div className="relative">
      <details>
        <summary className="list-none px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] cursor-pointer select-none">
          💼 Earn
        </summary>
        <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--line)] bg-white shadow-lg p-1 z-50">
          {items.map(([label, href, tag]) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-sm"
            >
              <span>{label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)]">
                {tag}
              </span>
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Unified Locale Sheet (Country + Language + Currency)                    */
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

  // --- base options from current page/country (fallbacks) ---
  const baseCountries   = supported.countries  || []; // [{code,name,flag_emoji}]
  const baseLanguages   = supported.languages  || []; // ["en-GH"] or [{code,label}]
  const baseCurrencies  = supported.currencies || []; // ["GHS"] or [{code}]

  // local draft state
  const [ccDraft, setCcDraft]   = useState(country);
  const [lngDraft, setLngDraft] = useState(language || "auto"); // "auto" or tag
  const [curDraft, setCurDraft] = useState(currency || "auto"); // "auto" or ccy
  const [city, setCity]         = useState("");
  const [filter, setFilter]     = useState("");

  // preview options that live-update when ccDraft changes
  const [opts, setOpts]         = useState({
    countries: baseCountries,
    languages: baseLanguages,
    currencies: baseCurrencies,
  });
  const [optsLoading, setOptsLoading] = useState(false);

  // reset drafts on open
  useEffect(() => {
    if (open) {
      setCcDraft(country);
      setLngDraft(language || "auto");
      setCurDraft(currency || "auto");
      setCity("");
      setFilter("");
      setOpts({ countries: baseCountries, languages: baseLanguages, currencies: baseCurrencies });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, country, language, currency]);

  // when user picks a different country in the list, fetch its i18n options
  useEffect(() => {
    let cancelled = false;
    async function run() {
      // if same as current page country, just use base options
      if (!open || !ccDraft || ccDraft === country) {
        setOpts({ countries: baseCountries, languages: baseLanguages, currencies: baseCurrencies });
        return;
      }
      setOptsLoading(true);
      try {
        const init = await fetchI18nInit(ccDraft);
        if (cancelled) return;
        setOpts({
          countries: init?.supported?.countries  || baseCountries,
          languages: init?.supported?.languages  || baseLanguages,
          currencies: init?.supported?.currencies || baseCurrencies,
        });
        // nudge chips back to "auto" so the user sees that country’s defaults
        setLngDraft("auto");
        setCurDraft("auto");
      } catch {
        if (!cancelled) {
          setOpts({ countries: baseCountries, languages: baseLanguages, currencies: baseCurrencies });
        }
      } finally {
        if (!cancelled) setOptsLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ccDraft, open]);

  // portal container
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "loc-portal";
    document.body.appendChild(el);
    containerRef.current = el;
    return () => { try { document.body.removeChild(el); } catch {} };
  }, []);

  // filtered countries
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const all = opts.countries || [];
    if (!q) return all;
    return all.filter((c) =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.code || "").toLowerCase().includes(q)
    );
  }, [filter, opts.countries]);

  // normalize shapes
  const allLanguages = (opts.languages || []).map((l) =>
    typeof l === "string" ? { code: l, label: l } : l
  );
  const allCurrencies = (opts.currencies || []).map((c) =>
    typeof c === "string" ? c : (c?.code || "")
  ).filter(Boolean);

  // helpers
  const setCookie = (k, v, days = 180) => {
    try {
      const d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000);
      document.cookie = `${k}=${encodeURIComponent(v)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
    } catch {}
  };

  const apply = () => {
    if (city) setCookie(`deliver_to_${ccDraft}`, city);

    if (ccDraft !== country) {
      setCountry(ccDraft); // hard redirect for SEO/SSR
      return;
    }

    // allow Auto choices to persist
    if (curDraft) setCurrency(curDraft === "auto" ? "AUTO" : curDraft);
    if (lngDraft) setLanguage(lngDraft); // can be "auto"

    onClose();
  };

  const Sheet = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm ${open ? "block" : "hidden"} ${open ? "" : "pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="ls-title"
        className={`fixed inset-x-0 bottom-0 z-[1001] transition-transform duration-300 rounded-t-2xl border-t border-[var(--line)] bg-white shadow-2xl
                    max-h-[88vh] overflow-y-auto [padding-bottom:env(safe-area-inset-bottom)]
                    ${open ? "translate-y-0" : "translate-y-full pointer-events-none"}`}
        hidden={!open}
      >
        <div className="p-4 mx-auto max-w-5xl">
          <div className="flex items-start justify-between">
            <h2 id="ls-title" className="text-lg font-black">Region & Preferences</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--alt-surface)]" aria-label="Close">✕</button>
          </div>

          {/* Deliver to */}
          <section className="mt-3">
            <h3 className="text-sm font-semibold">Deliver to</h3>
            <div className="mt-2 grid gap-3 md:grid-cols-[2fr_1fr]">
              <div className="rounded-xl border border-[var(--line)] p-2">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search country…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[var(--line)] px-3 text-sm"
                  />
                  {optsLoading && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--ink-2)]">Loading…</span>
                  )}
                </div>
                <div className="mt-2 max-h-60 overflow-y-auto pr-1">
                  {(filtered.length ? filtered : [{ code: slugToIso(ccDraft), name: "Loading…" }])
                    .slice(0, 200)
                    .map((c) => {
                      const slug = isoToSlug(c.code);
                      const active = slug === ccDraft;
                      return (
                        <button
                          key={c.code}
                          onClick={() => setCcDraft(slug)}
                          className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm hover:bg-[var(--alt-surface)] ${active ? "bg-[var(--alt-surface)]" : ""}`}
                        >
                          <span className="text-base">{c.flag_emoji || "🌍"}</span>
                          <span className="flex-1 text-left">{c.name || c.code}</span>
                          {active ? <span className="text-xs">Selected</span> : null}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* City / postcode */}
              <div className="rounded-xl border border-[var(--line)] p-2">
                <label className="block text-sm mb-1">City / Postcode (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Accra, 00233"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[var(--line)] px-3 text-sm"
                />
                <p className="mt-2 text-xs text-[var(--ink-2)]">Used to suggest faster delivery options near you.</p>
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="mt-4">
            <h3 className="text-sm font-semibold">Language</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <RadioChip
                label="Auto (recommended)"
                checked={lngDraft === "auto"}
                onChange={() => setLngDraft("auto")}
              />
              {(allLanguages.length ? allLanguages : [{ code: language || "en-GB", label: language || "en-GB" }]).map((lng) => (
                <RadioChip
                  key={lng.code}
                  label={lng.label || lng.code}
                  checked={lngDraft === (lng.code || lng)}
                  onChange={() => setLngDraft(lng.code || lng)}
                />
              ))}
            </div>
          </section>

          {/* Currency */}
          <section className="mt-4">
            <h3 className="text-sm font-semibold">Currency</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <RadioChip
                label="Auto (recommended)"
                checked={curDraft === "auto"}
                onChange={() => setCurDraft("auto")}
              />
              {((allCurrencies && allCurrencies.length) ? allCurrencies : ["GHS","NGN","GBP","USD","EUR","ZAR","CAD"]).map((ccy) => (
                <RadioChip
                  key={ccy}
                  label={ccy}
                  checked={curDraft === ccy}
                  onChange={() => setCurDraft(ccy)}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--ink-2)]">
              Prices may be shown as estimates in your selected currency. You’ll see the charge currency at checkout.
            </p>
          </section>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-2">
            <button className="px-3 py-2 text-sm" onClick={onClose}>Close</button>
            <button
              className="px-4 py-2 text-sm rounded bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]"
              onClick={apply}
            >
              Save & apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );

  if (!mounted || !containerRef.current) return null;
  return createPortal(Sheet, containerRef.current);
}

/* small chip-like radio with keyboard support */
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
/* Mobile drawer (portal-driven)                                          */
/* ---------------------------------------------------------------------- */
function MobileSidebar({ cc, categories = [] }) {
  const prefix = `/${cc}`;
  const quick = [
    ["🔥 Today’s Deals", `${prefix}/deals`],
    ["⚡ Same-Day Near Me", `${prefix}/search?delivery=same-day`],
    ["✅ Verified Sellers", `${prefix}/search?seller=verified`],
    ["📦 Wholesale & Bulk", `${prefix}/wholesale`],
    ["🧭 Explore", `${prefix}/search?sort=trending&near=me`],
  ];

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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
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
            {quick.map(([label, href]) => (
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