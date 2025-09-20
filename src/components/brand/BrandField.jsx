"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------- tiny helpers -------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const SUGGEST_LS_KEY = "upfrica:brand:suggested-v1";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const readMap = () => {
  try { return JSON.parse(localStorage.getItem(SUGGEST_LS_KEY) || "{}"); } catch { return {}; }
};
const writeMap = (m) => { try { localStorage.setItem(SUGGEST_LS_KEY, JSON.stringify(m)); } catch {} };

/* -------------------- API -------------------- */
async function searchBrands(q, signal) {
  const r = await fetch(`/api/brands/search/?q=${encodeURIComponent(q)}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
    signal,
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json().catch(() => ({}));
  const list = Array.isArray(data) ? data : data.results || [];
  // IMPORTANT: include `id` so parent can send the FK
  return list
    .map((b) => ({
      id: b?.id ?? b?.pk ?? null,
      name: b?.name || b?.label || "",
      slug: b?.slug || "",
    }))
    .filter((b) => (b.name || b.slug));
}

async function postBrandSuggestion({ name }) {
  const r = await fetch("/api/pending-brands/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ name: (name || "").trim() }),
  });
  if (r.status === 401 || r.status === 403) throw new Error("Please sign in to suggest a brand.");
  if (!r.ok) throw new Error((await r.text().catch(() => "")) || `suggest failed ${r.status}`);
  return r.json().catch(() => ({}));
}

/* ===================================================================== */
/*  BrandField                                                            */
/* ===================================================================== */
export default function BrandField({
  label = "Brand (optional)",
  value = "",
  onChange,             // (text) => void
  onResolved,           // ({id, name, slug} | null) => void
  autosave = () => {},  // called on commit/blur
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState([]); // [{id, name, slug}]
  const [err, setErr] = useState("");
  const [active, setActive] = useState(0);

  const wrapRef = useRef(null);
  const abortRef = useRef(null);
  const debRef = useRef(null);

  // keep external value in sync if parent resets
  useEffect(() => setQ(value || ""), [value]);

  // typeahead
  useEffect(() => {
    setErr("");
    if (debRef.current) clearTimeout(debRef.current);
    if (abortRef.current) abortRef.current.abort();

    const text = q.trim();
    if (text.length < 2) { setOpts([]); setLoading(false); return; }

    debRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const list = await searchBrands(text, ctrl.signal);
        setOpts(list.slice(0, 20));
        setActive(0);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Brand search failed");
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(debRef.current);
  }, [q]);

  // click-outside to close
  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function commitSelection(item) {
    setOpen(false);
    const nextText = item?.name || q;
    onChange?.(nextText);
    // Pass full object (with id) to parent; if free-typed, null
    onResolved?.(item?.id ? item : null);
    autosave?.();
  }

  function onKeyDown(e) {
    const maxIndex = opts.length; // +1 row for "suggest", handled with rows array below
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) { setOpen(true); return; }
    if (!open) return;

    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(maxIndex, a + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === "Escape")    setOpen(false);
    if (e.key === "Enter") {
      e.preventDefault();
      if (active === maxIndex) { // suggest row
        setShowSuggest(true);
      } else {
        commitSelection(opts[active] || null);
      }
    }
  }

  // Suggest modal
  const [showSuggest, setShowSuggest] = useState(false);

  const rows = useMemo(() => {
    const text = q.trim();
    return [...opts, { __suggest: true, name: text }];
  }, [opts, q]);

  return (
    <div className="md:col-span-2" ref={wrapRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          className="w-full rounded-md border px-3 py-3 bg-white dark:bg-gray-800"
          value={q}
          onChange={(e) => { setQ(e.target.value); onChange?.(e.target.value); onResolved?.(null); }}
          onFocus={() => setOpen(true)}
          onBlur={() => autosave?.()}
          onKeyDown={onKeyDown}
          placeholder="Start typing (e.g., Samsung)…"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />

        {/* dropdown */}
        {open && (q.trim().length >= 2 || loading || err) && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
            {loading && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
            {!!err && <div className="px-3 py-2 text-sm text-red-500">{err}</div>}

            {!loading && !err && (
              <ul role="listbox" className="max-h-64 overflow-y-auto">
                {rows.map((b, idx) => {
                  const isSuggest = b.__suggest;
                  const isActive = idx === active;
                  return (
                    <li key={isSuggest ? "__suggest" : String(b.id ?? b.slug ?? b.name)}>
                      <button
                        type="button"
                        className={cls(
                          "w-full text-left px-3 py-2 text-sm",
                          isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800",
                          isSuggest && "border-t border-gray-100 dark:border-gray-800"
                        )}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => (isSuggest ? setShowSuggest(true) : commitSelection(b))}
                      >
                        {isSuggest ? (
                          <div>
                            Can’t find it?{" "}
                            <span className="underline">Suggest “{b.name || "this brand"}”</span>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium">{b.name}</div>
                            {b.slug && <div className="text-xs text-gray-500">{b.slug}</div>}
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
                {rows.length === 1 && !opts.length && q.trim() && (
                  <li className="px-3 py-2 text-sm text-gray-500">No matches.</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      {showSuggest && (
        <SuggestBrandModal
          defaultName={q.trim()}
          onClose={() => setShowSuggest(false)}
          onSent={(createdName) => {
            onChange?.(createdName || q);
            onResolved?.(null);
          }}
        />
      )}
    </div>
  );
}

/* ===================================================================== */
/*  Suggest brand modal                                                   */
/* ===================================================================== */
function SuggestBrandModal({ defaultName = "", onClose, onSent }) {
  const [name, setName] = useState(defaultName);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const key = slugify(name || "");
  const alreadyLocked = (() => {
    const map = readMap();
    const ts = map[key];
    return !!ts && Date.now() - ts < COOLDOWN_MS;
  })();

  async function submit() {
    setSaving(true); setMsg("");
    try {
      await postBrandSuggestion({ name });
      setSent(true);
      const map = readMap(); map[key] = Date.now(); writeMap(map);
      setMsg("Thanks! We’ll review this brand soon.");
      onSent?.(name);
    } catch (e) {
      setMsg(e.message || "Could not submit suggestion.");
    } finally {
      setSaving(false);
    }
  }

  const disabled = saving || sent || alreadyLocked || !name.trim();

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w/full max-w-md h-full bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
        <h4 className="text-lg font-semibold mb-3">Suggest a new brand</h4>
        <label className="block text-sm mb-1">Brand name</label>
        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 mb-3"
          value={name}
          onChange={(e) => { setName(e.target.value); setMsg(""); }}
          placeholder="e.g., Acme"
          disabled={sent || alreadyLocked}
        />
        <div className="text-sm mb-3">
          {msg ||
            (alreadyLocked
              ? "You already suggested this recently. Thanks!"
              : sent
              ? "Suggestion sent ✓"
              : null)}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Close</button>
          <button
            onClick={submit}
            disabled={disabled}
            className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
          >
            {sent || alreadyLocked ? "Submitted ✓" : (saving ? "Sending…" : "Send suggestion")}
          </button>
        </div>
      </div>
    </div>
  );
}