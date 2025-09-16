"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------- helpers ---------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEBOUNCE = 180;
const STORAGE_KEY = "up_recent_searches_v1";

/* recent searches (client) */
function readRecent() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function writeRecent(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 12))); } catch {} }
function addRecent(q) { if (!q) return; const list = readRecent().filter((x) => x !== q); list.unshift(q); writeRecent(list); }

/* proxy client -> Next API -> Django */
async function fetchSuggest(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `/api/suggest${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("suggest failed");
  return res.json();
}

/* availability pill */
function AvailabilityBadge({ availability, cc }) {
  if (!availability) return null;
  const base = "ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap";
  if (availability === "ships")  return <span className={cls(base, "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200")}>Deliverable</span>;
  if (availability === "likely") return <span className={cls(base, "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200")}>Likely in {String(cc).toUpperCase()}</span>;
  return <span className={cls(base, "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300")}>Ships elsewhere</span>;
}

/* highlight query tokens */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Highlight({ text, query }) {
  if (!text) return null;
  const q = (query || "").trim();
  if (!q) return <>{text}</>;
  const tokens = q.split(/\s+/).filter(Boolean);
  const set = new Set(tokens.map((t) => t.toLowerCase()));
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  return (
    <>
      {String(text).split(re).map((part, i) =>
        set.has(part.toLowerCase()) ? <strong key={i} className="font-semibold">{part}</strong> : <span key={i}>{part}</span>
      )}
    </>
  );
}

/* ---------- component ---------- */
export default function SearchAutosuggest({
  cc = "gh",
  deliverTo,                 // optional; falls back to cc
  placeholder,               // will be auto-scoped if not provided
  className = "",
  inputClassName = "",
  buttonClassName = "",
  useBackdrop = true,
  ctaMode = "auto",          // "auto" | "never" | "always"
  ctaText = "Find for me",   // CTA button label
  /* NEW: scoped search */
  scopes = ["products", "requests", "shops"],
  defaultScope = "products",
  showScope = true,
}) {
  const router = useRouter();

  const [scope, setScope] = useState(
    scopes.includes(defaultScope) ? defaultScope : "products"
  );
  const scopeToPath = (s) => (s === "requests" ? "requests" : s === "shops" ? "shops" : "search");
  const scopedPlaceholder =
    placeholder ||
    (scope === "requests" ? "Search requests…" : scope === "shops" ? "Search shops…" : "Search products…");

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(-1);

  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggest, setSuggest] = useState({ queries: [], brands: [], categories: [], products: [] });

  const [hideNo, setHideNo] = useState(true);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const _cc = (cc || "gh").toLowerCase();
  const _deliverTo = (deliverTo || _cc).toLowerCase();

  /* preload */
  useEffect(() => {
    setRecent(readRecent());
    (async () => {
      try {
        const data = await fetchSuggest({ type: "trending", cc: _cc });
        setTrending(data?.queries || []);
      } catch {}
    })();
  }, [_cc]);

  /* debounced fetch (only for product scope) */
  useEffect(() => {
    let active = true;
    const query = (q || "").trim();

    // Disable network suggest when not searching products
    if (scope !== "products") {
      setSuggest({ queries: [], brands: [], categories: [], products: [] });
      return;
    }

    if (query.length < 2) {
      setSuggest({ queries: [], brands: [], categories: [], products: [] });
      return;
    }

    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchSuggest({ q: query, cc: _cc, deliver_to: _deliverTo, limit: 6 });
        if (active) {
          setSuggest({
            queries: data?.queries || [],
            brands: data?.brands || [],
            categories: data?.categories || [],
            products: (data?.products || []).filter((p) => !hideNo || p?.meta?.availability !== "no"),
          });
        }
      } catch {}
      finally { active && setLoading(false); }
    }, DEBOUNCE);

    return () => { active = false; clearTimeout(handle); };
  }, [q, _cc, _deliverTo, hideNo, scope]);

  /* build rows for list + strict CTA rule */
  const { rows, showCta } = useMemo(() => {
    const query = (q || "").trim();
    const out = [];
    let hasAny = false;

    if (query.length < 2) {
      if (recent.length) out.push({ type: "label", label: "Recent" }), recent.slice(0, 6).forEach((s) => out.push({ type: "recent", text: s }));
      if (trending.length) out.push({ type: "label", label: "Trending" }), trending.slice(0, 6).forEach((s) => out.push({ type: "trending", text: s }));
      hasAny = out.length > 0;
      return { rows: out, showCta: false };
    }

    const { queries, brands, categories, products } = suggest;

    if (scope === "products") {
      if (queries.length)   { hasAny = true; out.push({ type: "label", label: "Suggestions" }); queries.forEach((t) => out.push({ type: "query", text: t })); }
      if (brands.length)    { hasAny = true; out.push({ type: "label", label: "Brands" });      brands.forEach((b) => out.push({ type: "brand", text: b?.name || b })); }
      if (categories.length){ hasAny = true; out.push({ type: "label", label: "Categories" });  categories.forEach((c) => out.push({ type: "category", text: c?.name || c })); }
      if (products.length)  { hasAny = true; out.push({ type: "label", label: "Products" });    products.forEach((p) => out.push({ type: "product", product: p, text: p?.title || "" })); }
    }

    if (!hasAny) out.push({ type: "empty" });

    const allowCta = (ctaMode === "always") || (ctaMode === "auto" && !hasAny);
    return { rows: out, showCta: allowCta };
  }, [q, recent, trending, suggest, ctaMode, scope]);

  /* open/close */
  const onFocus = () => setOpen(true);
  const onBlur = async () => { await sleep(80); setOpen(false); setIdx(-1); };

  /* actions */
  const gotoSearch = useCallback((value) => {
    const text = (value || q || "").trim();
    if (!text) return;
    addRecent(text);
    const dt = _deliverTo ? `&deliver_to=${encodeURIComponent(_deliverTo)}` : "";
    const path = scopeToPath(scope);
    router.push(`/${_cc}/${path}?q=${encodeURIComponent(text)}${dt}`);
  }, [router, _cc, _deliverTo, q, scope]);

  const gotoSourcing = useCallback((intent) => {
    const text = (intent || q || "").trim();
    if (!text) return;
    const dt = _deliverTo ? `&deliver_to=${encodeURIComponent(_deliverTo)}` : "";
    router.push(`/${_cc}/sourcing?intent=${encodeURIComponent(text)}${dt}`);
  }, [router, _cc, _deliverTo, q]);

  /* keyboard */
  const scrollIntoView = (i) => {
    const list = listRef.current;
    if (!list || i < 0) return;
    const el = list.querySelector(`[data-idx="${i}"]`);
    if (!el) return;
    const boxTop = list.scrollTop, boxBottom = boxTop + list.clientHeight;
    const top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < boxTop) list.scrollTop = top;
    else if (bottom > boxBottom) list.scrollTop = bottom - list.clientHeight;
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
    if (e.key === "Enter") {
      if (idx === -1) showCta ? gotoSourcing(q) : gotoSearch(q);
      else {
        const row = rows[idx];
        handleRowClick(row);
      }
      return;
    }
    if (!rows.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      let next = idx + 1;
      while (next < rows.length && rows[next].type === "label") next++;
      if (next >= rows.length) next = -1;
      setIdx(next); scrollIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      let prev = idx - 1;
      if (prev < -1) prev = rows.length - 1;
      while (prev >= 0 && rows[prev].type === "label") prev--;
      setIdx(prev); scrollIntoView(prev);
    } else if (e.key === "Escape") {
      setOpen(false); setIdx(-1); inputRef.current?.blur();
    }
  };

  const handleRowClick = (row) => {
    if (!row) return;
    if (row.type === "empty") return; // handled by CTA block
    if (row.type === "product" && row.product?.frontend_url) {
      router.push(row.product.frontend_url); return;
    }
    const text = row.text || "";
    if (text) gotoSearch(text);
  };

  /* presence of the special empty card */
  const hasEmptyRow = rows.some((r) => r.type === "empty");

  return (
    <div className={cls("relative flex-1", className)}>
      {/* Optional backdrop for focus */}
      {open && useBackdrop && (
        <button
          aria-label="Close suggestions"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setOpen(false); setIdx(-1); }}
          className="fixed inset-0 z-[70] bg-black/10 dark:bg-black/40"
        />
      )}

      <div className="flex min-w-0 relative z-[80]">
        {/* NEW: scope selector (desktop) */}
        {showScope && (
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="hidden md:block h-11 rounded-l-xl border border-[var(--line)] bg-white dark:bg-[#0b0f19] text-sm px-2 text-[var(--ink)] dark:text-gray-100"
          >
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s === "products" ? "Products" : s === "requests" ? "Requests" : "Shops"}
              </option>
            ))}
          </select>
        )}

        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggest-listbox"
          aria-autocomplete="list"
          placeholder={scopedPlaceholder}
          className={cls(
            "w-full h-11 border border-[var(--line)] px-4 text-sm bg-white dark:bg-[#0b0f19] text-[var(--ink,#111827)] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]",
            showScope ? "rounded-none md:rounded-r-none md:border-l-0 rounded-l-xl md:rounded-l-none" : "rounded-l-xl",
            inputClassName
          )}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <button
          type="button"
          className={cls(
            "h-11 rounded-r-xl bg-[var(--brand-600)] px-4 text-white text-sm font-medium hover:bg-[var(--brand-700)]",
            buttonClassName
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => (showCta ? gotoSourcing(q) : gotoSearch())}
        >
          Search
        </button>
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl border border-[var(--line)] bg-white dark:bg-[#0b0f19] shadow-xl z-[90] overflow-hidden">
          <ul id="search-suggest-listbox" ref={listRef} role="listbox" className="max-h-[60vh] overflow-auto py-1">
            {rows.map((row, i) => {
              if (row.type === "label") {
                return (
                  <li key={`label-${row.label}-${i}`} className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-[var(--ink-2)] dark:text-gray-400">
                    {row.label}
                  </li>
                );
              }

              // --- Bold empty state with sourcing CTA (ENTIRE CARD CLICKABLE) ---
              if (row.type === "empty") {
                const toTitle = (s) =>
                  (s || "").trim().replace(/\s+/g, " ")
                    .toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

                const niceQuery = toTitle(q);
                const href = `/${_cc}/sourcing?intent=${encodeURIComponent(q || "")}${
                  _deliverTo ? `&deliver_to=${encodeURIComponent(_deliverTo)}` : ""
                }`;

                const go = () => gotoSourcing(q);

                return (
                  <li key="empty" className="px-4 py-4" aria-live="polite">
                    <a
                      href={href}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => { e.preventDefault(); go(); }}
                      aria-label={`Find for me ${niceQuery || "this item"}`}
                      className="block rounded-xl border border-[var(--line)] bg-[var(--alt-surface,#f9fafb)] dark:bg-[#111826] p-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)] cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl" aria-hidden>🧭</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[var(--ink,#111827)] dark:text-gray-100">
                            Can’t find it?
                          </div>
                          <p className="text-sm mt-1 text-[var(--ink-2)] dark:text-gray-400">
                            We’ll <strong>find it for you</strong>. Post what you want.
                            Sellers send offers. <strong>Free</strong>.
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-600)] px-3 py-2 text-sm text-white hover:bg-[var(--brand-700)]">
                              🔎 Find for me {niceQuery ? `“${niceQuery}”` : ""}
                            </span>
                            <span className="text-[11px] text-[var(--ink-3,#6b7280)] dark:text-gray-500">
                              Usually a few offers within 24–48h
                            </span>
                          </div>
                        </div>
                        <div className="ml-2 self-center text-[var(--ink-3,#6b7280)] dark:text-gray-400" aria-hidden>→</div>
                      </div>
                    </a>
                  </li>
                );
              }
              // ------------------------------------------------------------------

              const selected = i === idx;
              const text = row.text || (row.product?.title ?? "");
              const sub = row.product?.brand || row.product?.price_display || "";
              const availability = row.product?.meta?.availability;
              return (
                <li
                  key={`row-${i}-${row.type}-${text}`}
                  role="option"
                  aria-selected={selected}
                  data-idx={i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleRowClick(row)}
                  className={cls(
                    "px-3 py-2 cursor-pointer flex items-center gap-2",
                    selected ? "bg-[var(--alt-surface)] dark:bg-[#121a2a]" : "hover:bg-[var(--alt-surface)] dark:hover:bg-[#121a2a]"
                  )}
                >
                  <span className="shrink-0">
                    {row.type === "product" ? "🛍️" :
                     row.type === "brand" ? "🏷️" :
                     row.type === "category" ? "📂" :
                     row.type === "recent" ? "🕓" :
                     row.type === "trending" ? "🔥" : "🔎"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm truncate">
                      <Highlight text={text} query={q} />
                      {row.type === "product" && <AvailabilityBadge availability={availability} cc={_deliverTo} />}
                    </div>
                    {row.type === "product" && sub ? (
                      <div className="text-[12px] text-[var(--ink-2)] dark:text-gray-400 truncate">{sub}</div>
                    ) : null}
                  </div>
                  {row.type === "product" && row.product?.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.product.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
                  ) : null}
                </li>
              );
            })}

            {/* Small CTA row when forced by prop but not using the big empty state */}
            {showCta && !hasEmptyRow && (
              <li
                role="option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => gotoSourcing(q)}
                className="px-3 py-2 cursor-pointer flex items-center justify-center gap-2 bg-[var(--brand-50,#eff6ff)] dark:bg-[#111a2c]"
              >
                <span>🔎</span>
                <span className="text-sm font-medium">{ctaText} “{(q || "").trim()}”</span>
              </li>
            )}
          </ul>

          {/* quick controls/status bar (hide ‘ships elsewhere’ toggle when not products) */}
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-[var(--ink-3,#6b7280)] dark:text-gray-400 border-t dark:border-gray-800">
            {scope === "products" ? (
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={hideNo} onChange={(e) => setHideNo(e.target.checked)} />
                Hide “Ships elsewhere”
              </label>
            ) : <span />}
            <span>Deliver to <strong>{_deliverTo.toUpperCase()}</strong></span>
          </div>
          <div className="px-3 py-1.5 text-[11px] text-[var(--ink-3,#6b7280)] dark:text-gray-400 border-t dark:border-gray-800">
            Powered by UpSearch{loading && scope === "products" ? <span className="ml-2">• Loading…</span> : null}
          </div>
        </div>
      )}
    </div>
  );
}