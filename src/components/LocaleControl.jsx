// src/components/LocaleControl.jsx
"use client";

import React, { useMemo, useState } from "react";
import { useLocalization } from "../contexts/LocalizationProvider";

// map UI slug <-> ISO for GB/UK
const ISO_TO_SLUG = { GB: "uk" };
const SLUG_TO_ISO = { uk: "GB" };

function isoFromSlug(slug) {
  if (!slug) return "";
  const s = String(slug).toLowerCase();
  return s === "uk" ? "GB" : s.toUpperCase(); // gh -> GH, ng -> NG, uk -> GB
}
function slugFromIso(iso) {
  if (!iso) return "";
  const i = String(iso).toUpperCase();
  return ISO_TO_SLUG[i] || i.toLowerCase();
}

export default function LocaleControl() {
  const {
    country,            // slug: gh/ng/uk
    currency,
    language,
    supported,          // { countries: [{code,name,flag_emoji}], currencies: [{code}], languages: [] }
    fx, stale,
    setCountry, setCurrency, setLanguage,
  } = useLocalization();

  const [open, setOpen] = useState(false);

  // Pending selections (allow user to tweak then "Save & apply")
  const [pendingCountry, setPendingCountry] = useState(country);
  const [pendingCurrency, setPendingCurrency] = useState(currency);
  const [pendingLanguage, setPendingLanguage] = useState(language);
  const [search, setSearch] = useState("");

  // Resolve current country meta from supported list
  const currentIso = isoFromSlug(country);
  const countries = supported.countries || [];
  const currentCountry = useMemo(
    () => countries.find(c => String(c.code).toUpperCase() === currentIso),
    [countries, currentIso]
  );

  // Build pill text
  const pillText = useMemo(() => {
    const flag = currentCountry?.flag_emoji || "🌐";
    const label = currentCountry?.name || country?.toUpperCase() || "Region";
    return `Deliver to ${flag} ${label} · ${currency}`;
  }, [currentCountry, country, currency]);

  // Filtered countries (simple typeahead)
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries.slice(0, 24); // show first chunk
    return countries.filter(
      c =>
        c.name?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q) ||
        slugFromIso(c.code).includes(q)
    );
  }, [countries, search]);

  // Currency options (ensure current is present)
  const currencyOptions = useMemo(() => {
    const list = (supported.currencies || []).map(c => c.code).filter(Boolean);
    if (!list.includes(currency)) list.unshift(currency);
    // small fallback if bootstrap missing
    const fallback = ["USD", "EUR", "GBP", "GHS", "NGN", "ZAR", "CAD"];
    const base = list.length ? list : fallback;
    return Array.from(new Set(base));
  }, [supported.currencies, currency]);

  // Language options (ensure current is present)
  const languageOptions = useMemo(() => {
    const list = (supported.languages || []).filter(Boolean);
    if (!list.includes(language)) list.unshift(language);
    return Array.from(new Set(list));
  }, [supported.languages, language]);

  // Open handler: seed pending with current selections
  const openSheet = () => {
    setPendingCountry(country);
    setPendingCurrency(currency);
    setPendingLanguage(language);
    setSearch("");
    setOpen(true);
  };

  const onSave = () => {
    // Commit changes. Changing country triggers hard redirect (via provider).
    if (pendingCountry !== country) setCountry(pendingCountry);
    if (pendingCurrency !== currency) setCurrency(pendingCurrency);
    if (pendingLanguage !== language) setLanguage(pendingLanguage);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={openSheet}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
        aria-label="Change region, language, and currency"
      >
        {pillText}
      </button>

      {!open ? null : (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          {/* Sheet / Dialog */}
          <div className="relative w-full sm:max-w-2xl sm:rounded-xl bg-white p-4 sm:p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Region & Preferences</h3>

            {/* FX stale hint (from backend flag) */}
            {stale ? (
              <div className="mb-3 rounded-md bg-amber-50 text-amber-900 text-xs px-3 py-2">
                Live FX is temporarily stale. Prices may be shown as estimates; you’ll
                see the exact charge currency at checkout.
              </div>
            ) : null}

            <div className="space-y-6">
              {/* Deliver to */}
              <section>
                <h4 className="text-sm font-medium mb-2">Deliver to</h4>

                <div className="mb-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country…"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto pr-1">
                  {filteredCountries.map((c) => {
                    const slug = slugFromIso(c.code);
                    const active = pendingCountry === slug;
                    return (
                      <button
                        key={c.code}
                        onClick={() => setPendingCountry(slug)}
                        className={`flex items-center gap-2 rounded border px-2 py-2 text-sm text-left ${
                          active ? "border-black" : "border-gray-300"
                        }`}
                        title={c.code}
                      >
                        <span className="text-base">{c.flag_emoji || "🌐"}</span>
                        <span className="truncate">{c.name || c.code}</span>
                      </button>
                    );
                  })}
                  {filteredCountries.length === 0 ? (
                    <div className="col-span-full text-sm text-gray-500">
                      No matches.
                    </div>
                  ) : null}
                </div>
              </section>

              {/* Language */}
              <section>
                <h4 className="text-sm font-medium mb-2">Language</h4>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((lng) => (
                    <button
                      key={lng}
                      onClick={() => setPendingLanguage(lng)}
                      className={`rounded border px-3 py-1 text-sm ${
                        pendingLanguage === lng ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </section>

              {/* Currency */}
              <section>
                <h4 className="text-sm font-medium mb-2">Currency</h4>
                <div className="flex flex-wrap gap-2">
                  {currencyOptions.map((ccy) => (
                    <button
                      key={ccy}
                      onClick={() => setPendingCurrency(ccy)}
                      className={`rounded border px-3 py-1 text-sm ${
                        pendingCurrency === ccy ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {ccy}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Prices may be shown as estimates in your selected currency. You’ll see
                  the charge currency at checkout.
                </p>
              </section>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm rounded bg-black text-white"
                onClick={onSave}
              >
                Save & apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}