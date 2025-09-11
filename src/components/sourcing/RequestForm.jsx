// src/components/sourcing/RequestForm.jsx
'use client';
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { createRequest, getConfig } from '@/lib/sourcing/api';

// Minimal labels; extend if you like or import from your cc helper.
const COUNTRY_LABELS = {
  gh: 'Ghana',
  ng: 'Nigeria',
  ke: 'Kenya',
  tz: 'Tanzania',
  ug: 'Uganda',
  rw: 'Rwanda',
};

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors',
        checked ? 'bg-black' : 'bg-neutral-300'
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

function TextHelp({ children }) {
  return <p className="text-xs text-neutral-500 mt-1">{children}</p>;
}

export default function RequestForm({ cc = 'gh' }) {
      const router = useRouter(); // ← add this
  // Core fields
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [condition, setCondition] = useState('any');
  const [country, setCountry] = useState((cc || 'gh').toLowerCase());

  // Extra capture
  const [quantity, setQuantity] = useState(1);
  const [allowAlts, setAllowAlts] = useState(false);
  const [neededBy, setNeededBy] = useState('');
  const [brands, setBrands] = useState(''); // comma separated
  const [city, setCity] = useState('');     // delivery city

  // Media
  const [imageFiles, setImageFiles] = useState([]); // File[]
  const [videoFile, setVideoFile] = useState(null); // File | null
  const [mediaLinks, setMediaLinks] = useState(['']); // string[] (image/video links)
  const imgPickerRef = useRef(null);
  const vidPickerRef = useRef(null);

  // UX
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [okMessage, setOkMessage] = useState('');

  // Config / countries
  const [allowedCountries, setAllowedCountries] = useState(null);

  useEffect(() => {
    (async () => {
      const cfg = await getConfig(); // may be null
      const list = Array.isArray(cfg?.countries) ? cfg.countries.map(s => String(s).toLowerCase()) : null;
      setAllowedCountries(list);
      if (list && list.length) {
        // Default to cc if allowed, else the first allowed
        setCountry(list.includes(cc.toLowerCase()) ? cc.toLowerCase() : list[0]);
      }
    })();
  }, [cc]);

  const countryOptions = useMemo(() => {
    const base = allowedCountries ?? Object.keys(COUNTRY_LABELS);
    const uniq = Array.from(new Set(base.map(c => c.toLowerCase())));
    // Put current country first
    return [country, ...uniq.filter(c => c !== country)];
  }, [allowedCountries, country]);

  function toDecimal(s) {
    if (s === '' || s == null) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function buildAugmentedDetails({ uploadedUrls = [], videoUrl = null }) {
    const extras = [];
    if (quantity) extras.push(`Quantity: ${quantity}`);
    extras.push(`Allow alternatives: ${allowAlts ? 'yes' : 'no'}`);
    if (city) extras.push(`Delivery city: ${city}`);
    if (neededBy) extras.push(`Needed by: ${neededBy}`);
    if (brands.trim()) extras.push(`Preferred brands: ${brands.trim()}`);

    const linkList = [
      ...uploadedUrls,
      ...mediaLinks.map(s => s.trim()).filter(Boolean),
      ...(videoUrl ? [videoUrl] : []),
    ];
    if (linkList.length) extras.push(`Media links:\n${linkList.map(u => `- ${u}`).join('\n')}`);

    return [details.trim(), extras.length ? `\n\n---\n${extras.join('\n')}` : ''].join('');
  }

  // --- Direct upload helpers (robust across shapes) -----------------------

async function presignUpload(file) {
  const bodies = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      kind: 'misc',
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      content_type: file.type || 'application/octet-stream',
    }),
  };

  for (const p of ['/api/uploads/presign/', '/api/uploads/presign']) {
    try {
      const resp = await fetch(p, bodies);
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
    } catch {} // try next
  }
  return null;
}

  async function uploadFile(file) {
    const sig = await presignUpload(file);
    if (!sig) return null;

    // S3-style presigned POST
    if (sig.method === 'post' && sig.url && sig.fields) {
      const form = new FormData();
      Object.entries(sig.fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', file);

      const up = await fetch(sig.url, { method: 'POST', body: form });
      if (!up.ok) return null;

      // Prefer backend-provided CDN URL, else Location header, else strip qs.
      const loc = up.headers.get('Location');
      return sig.publicUrl || loc || sig.url.split('?')[0];
    }

    // Presigned PUT
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
      if (urls.length >= 5) break; // limit: 5 images
      const u = await uploadFile(f);
      if (u) urls.push(u);
    }
    let videoUrl = null;
    if (videoFile) {
      // Your Django presign currently caps at ~25MB; keep it best-effort.
      if (videoFile.type === 'video/mp4') {
        videoUrl = await uploadFile(videoFile);
      }
    }
    return { urls, videoUrl };
  }

  function resetForm() {
    setTitle('');
    setDetails('');
    setBudgetMin('');
    setBudgetMax('');
    setCondition('any');
    setQuantity(1);
    setAllowAlts(false);
    setNeededBy('');
    setBrands('');
    setCity('');
    setImageFiles([]);
    setVideoFile(null);
    setMediaLinks(['']);
  }

async function onSubmit(e) {
  e.preventDefault();
  setError('');
  setOkMessage('');
  setSubmitting(true);

  try {
    // Try direct uploads first (no-op if presign not available)
    const { urls: uploadedUrls, videoUrl } = await uploadAllSelected();

    const payload = {
      title: title?.trim(),
      description: buildAugmentedDetails({ uploadedUrls, videoUrl }),
      budget_min: toDecimal(budgetMin),
      budget_max: toDecimal(budgetMax),
      condition: condition === 'any' ? null : condition,
      country: (country || 'gh').toLowerCase(),
    };

    // ⬇️ changed: capture the created object
    const created = await createRequest(payload);

    setOkMessage('Request posted! We’ll notify you when offers arrive.');
    resetForm();

    // ⬇️ new: jump to sourcing page focused on the new request
    if (created?.id) {
      router.replace(`/${(country || 'gh')}/sourcing?request=${created.id}`, { scroll: false });
    }
  } catch (err) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.non_field_errors?.join(', ') ||
      'Sorry, failed to submit. Please try again.';
    setError(msg);
  } finally {
    setSubmitting(false);
  }
}

  // --- Media handlers
  function onPickImages(e) {
    const files = Array.from(e.target.files || []);
    const imgs = files.filter(f => /^image\//i.test(f.type)).slice(0, 5 - imageFiles.length);
    if (imgs.length) setImageFiles(prev => [...prev, ...imgs]);
    e.target.value = '';
  }
  function onPickVideo(e) {
    const f = (e.target.files || [])[0];
    if (f) setVideoFile(f);
    e.target.value = '';
  }
  function removeImageAt(i) {
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-8 shadow-sm">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold">What do you need?</h2>
        <p className="text-neutral-500 mt-1">
          We connect you with vetted sellers and negotiate the best prices in {COUNTRY_LABELS[country] ?? country.toUpperCase()}.
        </p>
      </div>

      {/* Product name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-800 mb-1">Product name</label>
        <input
          type="text"
          inputMode="text"
          placeholder="e.g., HP EliteBook 840 G8"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Details */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-800 mb-1">Details</label>
        <textarea
          placeholder="Specs, preferred color, delivery city, timelines, etc."
          className="w-full h-40 rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <TextHelp>Tip: paste links to product references or photos if you have them.</TextHelp>
      </div>

      {/* Budget row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Budget (min)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Budget (max)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
          />
        </div>
      </div>

      {/* qty + alt + city */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="flex items-end">
          <div className="flex items-center gap-3">
            <Switch checked={allowAlts} onChange={setAllowAlts} />
            <span className="text-sm font-medium text-neutral-800">Allow similar alternatives</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Delivery city</label>
          <input
            type="text"
            placeholder="e.g., Accra"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>

      {/* date + brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Needed by</label>
          <input
            type="date"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Preferred brands (optional)</label>
          <input
            type="text"
            placeholder="e.g., HP, Lenovo"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
            value={brands}
            onChange={(e) => setBrands(e.target.value)}
          />
        </div>
      </div>

      {/* Condition + Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Condition</label>
          <select
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="any">Any</option>
            <option value="new">New</option>
            <option value="refurbished">Refurbished</option>
            <option value="used">Used</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1">Country</label>
          <select
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
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
        <label className="block text-sm font-medium text-neutral-800 mb-2">Attach media</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Images */}
          <div className="rounded-lg border border-dashed border-neutral-300 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Images (up to 5)</div>
                <TextHelp>JPG/PNG; previews below.</TextHelp>
              </div>
              <button
                type="button"
                className="text-sm rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
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
                  <div key={`${f.name}-${i}`} className="relative aspect-square overflow-hidden rounded-md border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={f.name}
                      src={URL.createObjectURL(f)}
                      className="h-full w-full object-cover"
                    />
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
          <div className="rounded-lg border border-dashed border-neutral-300 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Video (mp4, 1 file)</div>
                <TextHelp>Short clip of the product if you have one.</TextHelp>
              </div>
              <button
                type="button"
                className="text-sm rounded-md border border-neutral-300 px-3 py-1 hover:bg-neutral-50"
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
            {videoFile && (
              <div className="mt-3 text-sm text-neutral-700 truncate">{videoFile.name}</div>
            )}
          </div>
        </div>

        {/* Media links */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-800 mb-1">Or paste media links</label>
          <div className="space-y-2">
            {mediaLinks.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo-or-video.mp4"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                  value={v}
                  onChange={(e) =>
                    setMediaLinks((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))
                  }
                />
                {mediaLinks.length > 1 && (
                  <button
                    type="button"
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
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
                className="mt-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
                onClick={() => setMediaLinks((prev) => [...prev, ''])}
              >
                + Add another link
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {okMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {okMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={clsx(
          'w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-white',
          'hover:bg-black/90 disabled:opacity-50'
        )}
      >
        {submitting ? 'Sending…' : 'Post Sourcing Request'}
      </button>

      <TextHelp className="mt-3">
        We’ll verify sellers and negotiate on your behalf.
      </TextHelp>
    </form>
  );
}