// src/components/input/phoneInput.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js/min';

const toIso2 = (v) => (!v ? '' : String(v).trim().toUpperCase());

export default function PhoneInput({
  countries = [],
  selectedCountry = 'GH',
  value = '',
  onChange,
  onCountryChange,
  onBlur,
  onFocus,                  // forwarded
  invalid = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [country, setCountry] = useState(toIso2(selectedCountry));
  const [localDigits, setLocalDigits] = useState('');

  // keep internal ISO in sync with prop
  useEffect(() => { setCountry(toIso2(selectedCountry)); }, [selectedCountry]);

  // close on outside click
  useEffect(() => {
    const fn = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const countryEntry = useMemo(
    () => countries.find((c) => toIso2(c.code) === country) || countries[0] || { code:'GH', name:'Ghana', flag_emoji:'🇬🇭' },
    [countries, country]
  );

  const dial = useMemo(() => {
    const iso = toIso2(countryEntry?.code) || 'GH';
    try { return `+${getCountryCallingCode(iso)}`; } catch { return '+'; }
  }, [countryEntry]);

  const flag = countryEntry?.flag_emoji || '📞';

  // hydrate from value (E.164 or local digits)
  useEffect(() => {
    const v = String(value || '').trim();
    if (!v) { setLocalDigits(''); return; }
    if (v.startsWith('+')) {
      try {
        const pn = parsePhoneNumberFromString(v);
        if (pn) {
          setCountry(toIso2(pn.country || country));
          setLocalDigits(pn.nationalNumber || '');
          return;
        }
      } catch {}
    }
    setLocalDigits(v.replace(/\D/g, ''));
  }, [value]); // eslint-disable-line

  const handleLocalChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setLocalDigits(digits);
    onChange?.(digits);
  };

  const chooseCountry = (iso) => {
    const next = toIso2(iso);
    setCountry(next);
    onCountryChange?.(next);
    onChange?.(localDigits); // re-validate under new region
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={`flex w-full gap-2 ${className}`}>
      {/* prefix */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-28 sm:w-36 px-3 py-2 rounded border border-gray-300 dark:border-gray-700
                     bg-gray-100 dark:bg-gray-800 text-sm flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">{flag}</span>
            <span className="font-medium">{dial}</span>
          </span>
          <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-[18rem] max-h-64 overflow-auto rounded
                          border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
            <ul className="py-1">
              {countries.map((c) => {
                const iso = toIso2(c.code);
                let dc = '';
                try { dc = `+${getCountryCallingCode(iso)}`; } catch {}
                return (
                  <li key={iso}>
                    <button
                      type="button"
                      onClick={() => chooseCountry(iso)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800
                                 flex items-center gap-2"
                    >
                      <span className="text-base leading-none">{c.flag_emoji || '🏳️'}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-sm opacity-70">{dc}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* input */}
      <div className="flex-1 min-w-0">
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          placeholder="Phone Number"
          className={`w-full p-2 rounded border ${invalid ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900`}
          aria-invalid={invalid || undefined}
          aria-describedby="phone-help"
          value={localDigits}
          onChange={handleLocalChange}
          onBlur={onBlur}
          onFocus={onFocus}       // ← forwarded so parent can clear 'touched'
        />
      </div>
    </div>
  );
}