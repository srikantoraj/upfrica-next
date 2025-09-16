// src/components/sourcing/RequestForm.jsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import { addDays, format as fmt } from 'date-fns';
import { createRequest, getConfig } from '@/lib/sourcing/api';
import { useAuthSheet } from '@/components/auth/AuthSheetProvider';

const COUNTRY_LABELS = {
  gh: 'Ghana',
  ng: 'Nigeria',
  ke: 'Kenya',
  tz: 'Tanzania',
  ug: 'Uganda',
  rw: 'Rwanda',
  uk: 'United Kingdom',
  gb: 'United Kingdom',
  us: 'United States',
};

// Currency by country (extend as needed)
const CC_CURRENCY = {
  gh: { code: 'GHS', symbol: '₵' },
  ng: { code: 'NGN', symbol: '₦' },
  ke: { code: 'KES', symbol: 'KSh' },
  tz: { code: 'TZS', symbol: 'TSh' },
  ug: { code: 'UGX', symbol: 'USh' },
  rw: { code: 'RWF', symbol: 'FRw' },
  uk: { code: 'GBP', symbol: '£' },
  gb: { code: 'GBP', symbol: '£' },
  us: { code: 'USD', symbol: '$' },
};

const DRAFT_KEY = 'sourcing_draft_v1';

function currencyForCountry(slug) {
  return CC_CURRENCY[slug?.toLowerCase()] || CC_CURRENCY.gh;
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors',
        checked ? 'bg-black' : 'bg-neutral-300 dark:bg-neutral-700'
      )}
    >
      <span
        className={clsx(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
      {label && <span className="ml-3 text-sm">{label}</span>}
    </button>
  );
}

function TextHelp({ children, className = '' }) {
  return <p className={clsx('text-xs text-neutral-500 dark:text-neutral-400 mt-1', className)}>{children}</p>;
}

function QuickDate({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        type="button"
        className="px-2.5 py-1 rounded-md border text-xs border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        onClick={() => onPick(new Date())}
      >
        Today
      </button>
      {[7, 14, 30].map((d) => (
        <button
          key={d}
          type="button"
          className="px-2.5 py-1 rounded-md border text-xs border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          onClick={() => onPick(addDays(new Date(), d))}
        >
          +{d}d
        </button>
      ))}
      <button
        type="button"
        className="px-2.5 py-1 rounded-md border text-xs border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        onClick={() => onPick(null)}
      >
        Clear
      </button>
    </div>
  );
}

function MoneyInput({ value, onChange, symbol, ...props }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
        {symbol}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}

export default function RequestForm({ cc = 'gh', initialTitle = '', onSuccess }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper: remove ?resume=1 from URL without reloading
  const stripResumeFromUrl = () => {
    const sp = new URLSearchParams(searchParams?.toString() || '');
    if (sp.has('resume')) {
      sp.delete('resume');
      router.replace(`${pathname}${sp.size ? `?${sp.toString()}` : ''}`, { scroll: false });
    }
  };

  // Try to access the global auth sheet (defensive: provider may not be mounted)
  let openLoginSheet = null;
  try {
    const sheet = useAuthSheet?.();
    if (sheet && typeof sheet.open === 'function') openLoginSheet = sheet.open;
    else if (sheet && typeof sheet.openAuthSheet === 'function') openLoginSheet = sheet.openAuthSheet;
    else if (sheet && typeof sheet.openLogin === 'function') openLoginSheet = sheet.openLogin;
  } catch {}

  // Core fields
  const [title, setTitle] = useState(initialTitle);
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const [details, setDetails] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [country, setCountry] = useState((cc || 'gh').toLowerCase());

  // Extras
  const [quantity, setQuantity] = useState(1);
  const [allowAlts, setAllowAlts] = useState(false);
  const [neededByDt, setNeededByDt] = useState(null); // Date | null
  const [brands, setBrands] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState(''); // neighborhood/area

  // Media
  const [imageFiles, setImageFiles] = useState([]);   // File[]
  const [videoFile, setVideoFile] = useState(null);   // File | null
  const [mediaLinks, setMediaLinks] = useState(['']); // string[]
  const imgPickerRef = useRef(null);
  const vidPickerRef = useRef(null);

  // UX
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [okMessage, setOkMessage] = useState('');

  // Config / countries
  const [allowedCountries, setAllowedCountries] = useState(null);

  // ---- Draft restore (after login) ---------------------------------------
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const shouldRestore = searchParams?.get('resume') === '1';
      if (!shouldRestore) return;

      const draft = JSON.parse(raw);
      const f = draft?.fields || {};
      setCountry(draft?.cc || country);
      setTitle(f.title ?? '');
      setDetails(f.details ?? '');
      setBudgetMin(f.budgetMin ?? '');
      setBudgetMax(f.budgetMax ?? '');
      setQuantity(f.quantity ?? 1);
      setAllowAlts(!!f.allowAlts);
      setBrands(f.brands ?? '');
      setCity(f.city ?? '');
      setArea(f.area ?? '');
      setNeededByDt(f.neededByDt ? new Date(f.neededByDt) : null);

      // Rehydrate uploaded media as links so they submit fine
      const pre = [
        ...(Array.isArray(draft?.preUploadedUrls) ? draft.preUploadedUrls : []),
        ...(draft?.preUploadedVideo ? [draft.preUploadedVideo] : []),
      ].filter(Boolean);
      if (pre.length) {
        setMediaLinks((prev) => {
          const merged = Array.from(new Set([...pre, ...prev.filter(Boolean)]));
          return merged.length ? merged : [''];
        });
      }

      setOkMessage('Welcome back! We restored your draft from before login.');
      sessionStorage.removeItem(DRAFT_KEY);
      stripResumeFromUrl(); // keep URL clean after restoring
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const cfg = await getConfig(); // may be null
      const raw = Array.isArray(cfg?.allowed_countries)
        ? cfg.allowed_countries
        : Array.isArray(cfg?.countries)
          ? cfg.countries
          : null;
      const list = raw ? raw.map((s) => String(s).toLowerCase()) : null;
      setAllowedCountries(list);
      if (list && list.length) {
        setCountry(list.includes(cc.toLowerCase()) ? cc.toLowerCase() : list[0]);
      }
    })();
  }, [cc]);

  const countryOptions = useMemo(() => {
    const base = allowedCountries ?? Object.keys(COUNTRY_LABELS);
    const uniq = Array.from(new Set(base.map((c) => c.toLowerCase())));
    return [country, ...uniq.filter((c) => c !== country)];
  }, [allowedCountries, country]);

  function toDecimal(s) {
    if (s === '' || s == null) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  // Build a structured JSON for specs (keeps JSONField happy & future-proof)
  function buildSpecs({ uploadedUrls = [], videoUrl = null }) {
    const links = [
      ...uploadedUrls,
      ...mediaLinks.map((s) => s.trim()).filter(Boolean),
      ...(videoUrl ? [videoUrl] : []),
    ];
    return {
      details: details.trim(),
      quantity: Number(quantity) || 1,
      allow_alternatives: !!allowAlts,
      deliver_to_city: city || '',
      deliver_to_area: area || '',
      needed_by: neededByDt ? fmt(neededByDt, 'yyyy-MM-dd') : null,
      preferred_brands: brands.trim(),
      media_links: links,
    };
  }

  // --- Upload helpers -----------------------------------------------------
  async function presignUpload(file) {
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        kind: 'request',
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        content_type: file.type || 'application/octet-stream',
      }),
    };

    for (const p of ['/api/uploads/presign/', '/api/uploads/presign']) {
      try {
        const resp = await fetch(p, options);
        if (!resp.ok) continue;
        const data = await resp.json();
        if (data?.upload?.url && data?.upload?.fields) {
          return { method: 'post', url: data.upload.url, fields: data.upload.fields, publicUrl: data.cdnUrl || null };
        }
        if (Array.isArray(data?.uploads) && data.uploads[0]?.url && data.uploads[0]?.fields) {
          const u = data.uploads[0];
          return { method: 'post', url: u.url, fields: u.fields, publicUrl: u.publicUrl || null };
        }
        if (data?.upload_url) {
          return { method: 'put', url: data.upload_url, publicUrl: data.public_url || data.cdnUrl || null };
        }
        if (data?.url && data?.fields) {
          return { method: 'post', url: data.url, fields: data.fields, publicUrl: data.publicUrl || null };
        }
      } catch {}
    }
    return null;
  }

  async function uploadFile(file) {
    const sig = await presignUpload(file);
    if (!sig) return null;

    if (sig.method === 'post' && sig.url && sig.fields) {
      const form = new FormData();
      Object.entries(sig.fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', file);
      const up = await fetch(sig.url, { method: 'POST', body: form });
      if (!up.ok) return null;
      const loc = up.headers.get('Location');
      return sig.publicUrl || loc || sig.url.split('?')[0];
    }

    if (sig.method === 'put' && sig.url) {
      const up = await fetch(sig.url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      if (!up.ok) return null;
      return sig.publicUrl || sig.url.split('?')[0];
    }
    return null;
  }

  async function uploadAllSelected() {
    const urls = [];
    for (const f of imageFiles) {
      if (urls.length >= 5) break;
      const u = await uploadFile(f);
      if (u) urls.push(u);
    }
    let videoUrl = null;
    if (videoFile && /^video\/mp4$/i.test(videoFile.type)) {
      videoUrl = await uploadFile(videoFile);
    }
    return { urls, videoUrl };
  }

  function resetForm() {
    setTitle('');
    setDetails('');
    setBudgetMin('');
    setBudgetMax('');
    setQuantity(1);
    setAllowAlts(false);
    setNeededByDt(null);
    setBrands('');
    setCity('');
    setArea('');
    setImageFiles([]);
    setVideoFile(null);
    setMediaLinks(['']);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setOkMessage('');
    setSubmitting(true);

    // keep these in outer scope so we can store them on AUTH_REQUIRED
    let uploadedUrls = [];
    let uploadedVideo = null;

    try {
      // Upload media first (works for guests), so we can resume after login
      const up = await uploadAllSelected();
      uploadedUrls = up.urls;
      uploadedVideo = up.videoUrl;

      const specs = buildSpecs({ uploadedUrls, videoUrl: uploadedVideo });

      // Compose media array for the dedicated field as well
      const mediaCombined = Array.from(new Set(specs.media_links || []));
      const { code: curCode } = currencyForCountry(country);

      const payload = {
        title: title?.trim(),
        specs,                             // JSON object
        media: mediaCombined,              // list of URLs (images/video)
        budget_min: toDecimal(budgetMin),
        budget_max: toDecimal(budgetMax),
        deliver_to_country: (country || 'gh').toLowerCase(),
        // join city + area into a single field supported by backend
        deliver_to_city: [city, area].filter(Boolean).join(' — ') || '',
        deadline: specs.needed_by,         // "YYYY-MM-DD" or null
        currency: curCode,
      };

      const created = await createRequest(payload);

      setOkMessage('Request posted! We’ll notify you when offers arrive.');
      resetForm();
      stripResumeFromUrl(); // clean URL on success

      if (typeof onSuccess === 'function') {
        onSuccess(created, country);
      } else if (created?.id) {
        // fallback if no handler is provided
        router.replace(`/${(country || 'gh')}/sourcing?request=${created.id}`, { scroll: false });
      }
    } catch (err) {
      // If auth required, save a resumable draft then open login UI
      if (err?.code === 'AUTH_REQUIRED' || err?.response?.status === 401 || err?.response?.status === 403) {
        try {
          const draft = {
            at: Date.now(),
            cc: country,
            fields: {
              title,
              details,
              budgetMin,
              budgetMax,
              quantity,
              allowAlts,
              brands,
              city,
              area,
              neededByDt: neededByDt ? neededByDt.toISOString() : null,
            },
            preUploadedUrls: [
              ...uploadedUrls,
              ...((mediaLinks || []).filter((x) => /^https?:\/\//i.test(x))),
            ],
            preUploadedVideo: uploadedVideo || null,
          };
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } catch {}

        const nextPath = `/${(country || 'gh')}/sourcing?resume=1`;

        if (typeof openLoginSheet === 'function') {
          // Open the sheet, and if it reports success, try submit again immediately.
          openLoginSheet({
            mode: 'login',
            reason: 'Please sign in to post your request',
            onSuccess: async () => {
              try {
                const specs2 = buildSpecs({ uploadedUrls, videoUrl: uploadedVideo });
                const media2 = Array.from(new Set(specs2.media_links || []));
                const { code } = currencyForCountry(country);
                const payload2 = {
                  title: title?.trim(),
                  specs: specs2,
                  media: media2,
                  budget_min: toDecimal(budgetMin),
                  budget_max: toDecimal(budgetMax),
                  deliver_to_country: (country || 'gh').toLowerCase(),
                  deliver_to_city: [city, area].filter(Boolean).join(' — ') || '',
                  deadline: specs2.needed_by,
                  currency: code,
                };
                const created2 = await createRequest(payload2);
                sessionStorage.removeItem(DRAFT_KEY);
                resetForm();
                stripResumeFromUrl();
                setOkMessage('Request posted! We’ll notify you when offers arrive.');

                if (typeof onSuccess === 'function') {
                  onSuccess(created2, country);
                } else if (created2?.id) {
                  router.replace(`/${(country || 'gh')}/sourcing?request=${created2.id}`, { scroll: false });
                }
              } catch (e2) {
                setError(e2?.response?.data?.detail || 'Sorry, failed to submit after login. Please try again.');
              }
            },
            // If the sheet is closed, keep the draft and let the user submit later
          });
        } else {
          // Fallback: go to the normal login page
          router.push(`/login?next=${encodeURIComponent(nextPath)}`);
        }
        return; // don’t show generic error
      }

      const msg =
        err?.response?.data?.detail ||
        (Array.isArray(err?.response?.data?.non_field_errors) && err.response.data.non_field_errors.join(', ')) ||
        'Sorry, failed to submit. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // Media handlers
  function onPickImages(e) {
    const files = Array.from(e.target.files || []);
    const imgs = files
      .filter((f) => /^image\//i.test(f.type))
      .slice(0, Math.max(0, 5 - imageFiles.length));
    if (imgs.length) setImageFiles((prev) => [...prev, ...imgs]);
    e.target.value = '';
  }
  function onPickVideo(e) {
    const f = (e.target.files || [])[0];
    if (f) setVideoFile(f);
    e.target.value = '';
  }
  function removeImageAt(i) {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  const neededByDisplay = neededByDt ? fmt(neededByDt, 'EEE, MMM d') : 'Pick a date';
  const { code: curCode, symbol: curSymbol } = currencyForCountry(country);

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 md:p-8 shadow-sm"
    >
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">What do you need?</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          We connect you with vetted sellers and negotiate the best prices in {COUNTRY_LABELS[country] ?? country.toUpperCase()}.
        </p>
      </div>

      {/* Product name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Product name</label>
        <input
          type="text"
          inputMode="text"
          placeholder="e.g., HP EliteBook 840 G8"
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Details</label>
        <textarea
          placeholder="Specs, preferred color, delivery city/area, timelines, etc."
          className="w-full h-40 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <TextHelp>Tip: paste links to product references or photos if you have them.</TextHelp>
      </div>

      {/* Budget row with currency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
            Budget (min) <span className="text-neutral-400">({curCode})</span>
          </label>
          <MoneyInput symbol={curSymbol} min="0" step="0.01" value={budgetMin} onChange={setBudgetMin} />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
            Budget (max) <span className="text-neutral-400">({curCode})</span>
          </label>
          <MoneyInput symbol={curSymbol} min="0" step="0.01" value={budgetMax} onChange={setBudgetMax} />
        </div>
      </div>

      {/* qty + alt + city */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="flex items-end">
          <div className="flex items-center gap-3">
            <Switch checked={allowAlts} onChange={setAllowAlts} />
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Allow similar alternatives</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Delivery city</label>
          <input
            type="text"
            placeholder="e.g., Accra"
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      {/* Area / neighborhood */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Area / neighborhood</label>
        <input
          type="text"
          placeholder="e.g., East Legon / Lekki Phase 1"
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <TextHelp>Be specific – this helps estimate delivery fees accurately.</TextHelp>
      </div>

      {/* date + brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Needed by</label>
          <DatePicker
            selected={neededByDt}
            onChange={(d) => setNeededByDt(d)}
            placeholderText="Select date"
            minDate={new Date()}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            dateFormat="EEE, MMM d, yyyy"
            popperPlacement="bottom-start"
          />
          <QuickDate onPick={setNeededByDt} />
          <TextHelp>Selected: {neededByDisplay}</TextHelp>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Preferred brands (optional)</label>
          <input
            type="text"
            placeholder="e.g., HP, Lenovo"
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            value={brands}
            onChange={(e) => setBrands(e.target.value)}
          />
        </div>
      </div>

      {/* Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Country</label>
          <select
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {COUNTRY_LABELS[c] ?? c.toUpperCase()}
              </option>
            ))}
          </select>
          <TextHelp>
            {allowedCountries ? 'Countries limited by configuration.' : 'Using default country list.'}
          </TextHelp>
        </div>
      </div>

      {/* Media */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2">Attach media</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Images */}
          <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Images (up to 5)</div>
                <TextHelp>JPG/PNG; previews below.</TextHelp>
              </div>
              <button
                type="button"
                className="text-sm rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => imgPickerRef.current?.click()}
              >
                Choose
              </button>
              <input
                ref={imgPickerRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPickImages}
              />
            </div>
            {!!imageFiles.length && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {imageFiles.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="relative aspect-square overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={f.name} src={URL.createObjectURL(f)} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImageAt(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Video (mp4, 1 file)</div>
                <TextHelp>Short clip of the product if you have one.</TextHelp>
              </div>
              <button
                type="button"
                className="text-sm rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => vidPickerRef.current?.click()}
              >
                {videoFile ? 'Replace' : 'Choose'}
              </button>
              <input
                ref={vidPickerRef}
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={onPickVideo}
              />
            </div>
            {videoFile && <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300 truncate">{videoFile.name}</div>}
          </div>
        </div>

        {/* Media links */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">Or paste media links</label>
          <div className="space-y-2">
            {mediaLinks.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo-or-video.mp4"
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
                  value={v}
                  onChange={(e) =>
                    setMediaLinks((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
                  }
                />
                {mediaLinks.length > 1 && (
                  <button
                    type="button"
                    className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    onClick={() => setMediaLinks((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove link"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {mediaLinks.length < 5 && (
              <button
                type="button"
                className="mt-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => setMediaLinks((prev) => [...prev, ''])}
              >
                + Add another link
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {okMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          {okMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={clsx(
          'w-full md:w-auto inline-flex items-center justify-center rounded-lg px-5 py-2.5',
          'bg-black text-white hover:bg-black/90',
          'dark:bg-white dark:text-black dark:hover:bg-white/90',
          'disabled:opacity-50'
        )}
      >
        {submitting ? 'Sending…' : 'Post Sourcing Request'}
      </button>

      <TextHelp className="mt-3">We’ll verify sellers and negotiate on your behalf.</TextHelp>
    </form>
  );
}