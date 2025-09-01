// src/components/home/Header.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";

/* ---------------------------------------------------------------------- */
/* Header                                                                 */
/* ---------------------------------------------------------------------- */
export default function Header({
  cc,
  countryCode,
  searchPlaceholder,
  deliverCity,
  categories = [],
}) {
  const prefix = `/${cc}`;

  // Location sheet control
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
      try { openerRef.current.focus(); } catch {}
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
      <MobileSidebar cc={cc} categories={categories} />

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
        <a href="/" className="text-[22px] sm:text-2xl font-black tracking-tight shrink-0">
          Upfrica<span className="text-[var(--brand-600)]">.{String(countryCode).toLowerCase()}</span>
        </a>

        {/* Deliver pill (desktop) */}
        <div className="hidden md:block">
          <DeliveryPill cc={cc} label="Deliver to" city={deliverCity} />
        </div>

        {/* Desktop search + categories */}
        <div className="flex-1 hidden md:flex items-stretch gap-2 min-w-0">
          <AllCategoriesMenu cc={cc} categories={categories} />
          <form action={`/${cc}/search`} className="flex-1 flex min-w-0" role="search" aria-label="Site">
            <label htmlFor="q" className="sr-only">Search</label>
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
          <span className="hidden md:block"><CountrySwitcher /></span>
          <span className="hidden md:block"><EarnDropdown cc={cc} /></span>
          <a href={`/${cc}/account`} className="px-2 py-2 rounded-lg hover:bg-[var(--alt-surface)]"><span className="hidden sm:inline">Account</span><span className="sm:hidden">👤</span></a>
          <a href={`/${cc}/cart`} className="px-1 py-1 rounded-lg hover:bg-[var(--alt-surface)]" aria-label="Cart">
            <span className="inline-flex items-center justify-center rounded-lg ring-2 ring-[var(--brand-600)] px-2 py-1 text-[18px] font-black">🛒</span>
          </a>
        </div>
      </div>

      {/* Mobile search + compact deliver row */}
      <div className="md:hidden px-4 pb-2 pt-1 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <form action={`/${cc}/search`} role="search" aria-label="Mobile Site Search" className="flex">
          <input
            name="q"
            type="search"
            placeholder={searchPlaceholder}
            className="w-full h-11 rounded-l-xl border border-[var(--line)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
            list="hot-searches"
          />
          <button className="h-11 px-3 rounded-r-xl bg-[var(--brand-600)] text-white text-sm font-medium" aria-label="Search">🔎</button>
        </form>

        {/* Inline deliver row — opens sheet */}
        <DeliverInline
          cc={cc}
          city={deliverCity}
          onOpen={(e) => { openerRef.current = e.currentTarget; setOpen(true); }}
        />
      </div>

      {/* shared datalist */}
      <datalist id="hot-searches">
        {hotSearches.map((s) => <option key={s} value={s} />)}
      </datalist>

      {/* Location Sheet (portal) */}
      <LocationSheet cc={cc} open={locOpen} onClose={() => setOpen(false)} />
    </header>
  );
}

/* ---------------------------------------------------------------------- */
/* Sub-components                                                         */
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
              <a key={c.id} href={c.href} className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[var(--alt-surface)]">
                <span className="text-lg" aria-hidden>{categoryIcon(c.icon)}</span>
                <span className="text-sm">{c.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <a href={`${prefix}/categories`} className="text-sm text-[var(--violet-500,#A435F0)] hover:underline">View all categories →</a>
            <div className="text-xs text-[var(--ink-2)]">Tip: use the chips below the hero to jump quickly.</div>
          </div>
        </div>
      </details>
    </div>
  );
}

function DeliveryPill({ cc, label = "Deliver to", city = "City" }) {
  const cities = COUNTRY_META_LOCAL[cc]?.cities || COUNTRY_META_LOCAL.gh.cities;
  return (
    <div className="relative inline-block">
      <details className="group">
        <summary className="list-none inline-flex items-center gap-2 px-3 h-9 rounded-xl border border-[var(--line)] bg-white cursor-pointer select-none">
          <span>📍</span><span className="text-sm">{label}</span>
          <span className="font-semibold text-sm">{city}</span>
          <span className="text-[var(--ink-2)] group-open:rotate-180 transition">▾</span>
        </summary>
        <div className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--line)] bg-white shadow-lg p-2 z-50">
          {cities.map((c) => (
            <a key={c} href={`/${cc}/search?city=${encodeURIComponent(c)}`} className="block px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-sm">
              {c}
            </a>
          ))}
          <a href={`/${cc}/location`} className="block px-3 py-2 rounded-lg text-sm text-[var(--violet-500,#A435F0)]">Choose a different city…</a>
        </div>
      </details>
    </div>
  );
}

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
            <a key={label} href={href} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] text-sm">
              <span>{label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)]">{tag}</span>
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

function CountrySwitcher() {
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)] cursor-pointer select-none">🌍 Country</summary>
        <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--line)] bg-white shadow-lg p-1">
          {["gh", "ng", "uk"].map((c) => (
            <a key={c} className="block px-3 py-2 rounded-lg hover:bg-[var(--alt-surface)]" href={`/${c}`}>
              {({ gh: "🇬🇭", ng: "🇳🇬", uk: "🇬🇧" }[c] || "🌍")} {c.toUpperCase()}
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

function DeliverInline({ cc, city, onOpen }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-[13px] leading-5 text-[var(--ink-2)]">
      <button
        type="button"
        onClick={onOpen}
        ref={opener => opener && (opener.tabIndex = 0)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-2 py-1 shrink-0"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <span aria-hidden>📍</span>
        <span className="text-sm">Deliver to</span>
        <span className="font-semibold text-sm">{city}</span>
        <span className="text-[var(--ink-2)]">▾</span>
      </button>
      <span className="truncate">
        · Order in <span className="font-semibold">2h 15m</span> for <span className="font-semibold">Same-Day</span>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* React-controlled Location Sheet (Portal)                                */
/* ---------------------------------------------------------------------- */
function LocationSheet({ cc, open, onClose }) {
  const prefix = `/${cc}`;
  const cities = COUNTRY_META_LOCAL[cc]?.cities ?? [];
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Create a container in body for the portal (so it can't be clipped by parents)
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "loc-portal";
    document.body.appendChild(el);
    containerRef.current = el;
    return () => { try { document.body.removeChild(el); } catch {} };
  }, []);

  const Sheet = (
    <>
      {/* Backdrop — double hidden for FOUC safety */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm ${open ? "block" : "hidden"} ${open ? "" : "pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="ls-title"
        className={`fixed inset-x-0 bottom-0 z-[1001] transition-transform duration-300 rounded-t-2xl border-t border-[var(--line)] bg-white shadow-2xl
                    max-h-[85vh] md:max-h-[85dvh] overflow-y-auto [padding-bottom:env(safe-area-inset-bottom)]
                    ${open ? "translate-y-0" : "translate-y-full pointer-events-none"}`}
        hidden={!open}  // extra guard against first-paint flash
      >
        <div className="p-4 mx-auto max-w-7xl">
          <div className="flex items-start justify-between">
            <h2 id="ls-title" className="text-lg font-black">Choose your location</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--alt-surface)]" aria-label="Close">✕</button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map((c) => (
              <a
                key={c}
                href={`${prefix}/search?city=${encodeURIComponent(c)}`}
                onClick={onClose}
                className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--alt-surface)]"
              >
                {c}
              </a>
            ))}
          </div>

          <a
            href={`${prefix}/location`}
            onClick={onClose}
            className="mt-3 inline-block text-[var(--violet-500,#A435F0)] text-sm font-medium"
          >
            Enter a postcode / choose a different city →
          </a>
        </div>
      </aside>
    </>
  );

  if (!mounted || !containerRef.current) return null;
  return createPortal(Sheet, containerRef.current);
}

/* ---------------------------------------------------------------------- */
/* Mobile drawer                                                           */
/* ---------------------------------------------------------------------- */
// --- REPLACE ONLY MobileSidebar with this portal-driven version ------------


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

  // mount portal container
  useEffect(() => {
    setMounted(true);
    const el = document.createElement("div");
    el.id = "drawer-portal";
    document.body.appendChild(el);
    bodyEl.current = el;
    return () => { try { document.body.removeChild(el); } catch {} };
  }, []);

  // sync with the existing checkbox (#nav-drawer)
  useEffect(() => {
    const cb = document.getElementById("nav-drawer");
    if (!cb) return;
    cbRef.current = cb;
    const sync = () => setOpen(cb.checked);
    sync();
    cb.addEventListener("change", sync);
    return () => cb.removeEventListener("change", sync);
  }, []);

  // scroll lock + ESC close
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
    if (cb) { cb.checked = false; setOpen(false); }
  };

  if (!mounted || !bodyEl.current) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={close}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={`fixed left-0 top-0 z-[1101] h-[100dvh] w-[88%] max-w-[420px] bg-white shadow-2xl rounded-r-2xl border-r border-[var(--line)] overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} [padding-bottom:env(safe-area-inset-bottom)]`}
      >
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 id="mobile-menu-title" className="text-lg font-black">Menu</h2>
          <button onClick={close} className="p-3 rounded-xl hover:bg-[var(--alt-surface)]" aria-label="Close menu">✕</button>
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
          <div className="px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-2)] mb-2">Quick links</div>
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
/* Local data                                                              */
/* ---------------------------------------------------------------------- */
const COUNTRY_META_LOCAL = {
  gh: { cities: ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"] },
  ng: { cities: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Abeokuta"] },
  uk: { cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"] },
};
const categoryIcon = (key) =>
  ({ devices:"📱", hair:"💇🏾‍♀️", food:"🥘", fashion:"👗", home:"🏠", box:"📦", car:"🚗", factory:"🏭", baby:"🍼", dumbbell:"🏋🏾", heart:"💖", wrench:"🛠️" }[key] || "🛍️");