// src/components/search/SearchAutosuggest.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** small helpers */
const cls = (...a) => a.filter(Boolean).join(" ");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEBOUNCE = 180;
const STORAGE_KEY = "up_recent_searches_v1";

/** read/write recent searches (client-only) */
function readRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function writeRecent(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 12))); } catch {}
}
function addRecent(q) {
  if (!q) return;
  const list = readRecent().filter((x) => x !== q);
  list.unshift(q);
  writeRecent(list);
}

/** proxy client -> Next API -> Django (avoids CORS) */
async function fetchSuggest(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `/api/suggest${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("suggest failed");
  return res.json();
}

/** tiny availability pill */
function AvailabilityBadge({ availability, cc }) {
  if (!availability) return null;
  const base =
    "ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap";
  if (availability === "ships")
    return <span className={`${base} bg-green-100 text-green-800`}>Deliverable</span>;
  if (availability === "likely")
    return <span className={`${base} bg-amber-100 text-amber-800`}>Likely in {String(cc).toUpperCase()}</span>;
  return <span className={`${base} bg-gray-100 text-gray-500`}>Ships elsewhere</span>;
}

/** highlight helper: bold every token from the query anywhere it appears */
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Highlight({ text, query }) {
  if (!text) return null;
  const q = (query || "").trim();
  if (!q) return <>{text}</>;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.length) return <>{text}</>;
  const set = new Set(tokens.map((t) => t.toLowerCase()));
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  const parts = String(text).split(re);
  return (
    <>
      {parts.map((part, i) =>
        set.has(part.toLowerCase()) ? (
          <strong key={i} className="font-semibold">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Renders the smart search input with suggestions. */
export default function SearchAutosuggest({
  cc = "gh",
  deliverTo, // optional; falls back to cc
  placeholder = "Search products…",
  className = "",
  inputClassName = "",
  buttonClassName = "",
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(-1); // highlighted row

  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggest, setSuggest] = useState({
    queries: [],
    brands: [],
    categories: [],
    products: [],
  });

  // client-side filter to hide “no” availability
  const [hideNo, setHideNo] = useState(true);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  const _cc = (cc || "gh").toLowerCase();
  const _deliverTo = (deliverTo || _cc).toLowerCase();

  /** preload recent + trending on mount */
  useEffect(() => {
    setRecent(readRecent());
    (async () => {
      try {
        const data = await fetchSuggest({ type: "trending", cc: _cc });
        setTrending(data?.queries || []);
      } catch {}
    })();
  }, [_cc]);

  /** debounced fetch */
  useEffect(() => {
    let active = true;
    if (!q || q.trim().length < 2) {
      setSuggest({ queries: [], brands: [], categories: [], products: [] });
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchSuggest({ q, cc: _cc, deliver_to: _deliverTo, limit: 6 });
        if (active)
          setSuggest({
            queries: data?.queries || [],
            brands: data?.brands || [],
            categories: data?.categories || [],
            products: (data?.products || []).filter(
              (p) => !hideNo || p?.meta?.availability !== "no"
            ),
          });
      } catch {}
      finally {
        active && setLoading(false);
      }
    }, DEBOUNCE);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [q, _cc, _deliverTo, hideNo]);

  /** build flat list for keyboard navigation */
  const rows = useMemo(() => {
    const out = [];
    if (!q || q.trim().length < 2) {
      if (recent.length) out.push({ type: "label", label: "Recent" });
      recent.slice(0, 6).forEach((s) => out.push({ type: "recent", text: s }));
      if (trending.length) out.push({ type: "label", label: "Trending" });
      trending.slice(0, 6).forEach((s) => out.push({ type: "trending", text: s }));
      return out;
    }
    const { queries, brands, categories, products } = suggest;
    if (queries.length) {
      out.push({ type: "label", label: "Suggestions" });
      queries.forEach((t) => out.push({ type: "query", text: t }));
    }
    if (brands.length) {
      out.push({ type: "label", label: "Brands" });
      brands.forEach((b) => out.push({ type: "brand", text: b?.name || b }));
    }
    if (categories.length) {
      out.push({ type: "label", label: "Categories" });
      categories.forEach((c) => out.push({ type: "category", text: c?.name || c }));
    }
    if (products.length) {
      out.push({ type: "label", label: "Products" });
      products.forEach((p) => out.push({ type: "product", product: p, text: p?.title || "" }));
    }
    if (out.length === 0) {
      out.push({ type: "empty" });
      out.push({ type: "cta", text: `Find “${q}” for me` });
    }
    return out;
  }, [q, recent, trending, suggest]);

  /** open dropdown when focused/typing */
  const onFocus = () => setOpen(true);
  const onBlur = async () => {
    await sleep(80); // let click finish
    setOpen(false);
    setIdx(-1);
  };

  /** actions */
  const gotoSearch = useCallback(
    (value) => {
      const text = (value || q || "").trim();
      if (!text) return;
      addRecent(text);
      const dt = _deliverTo ? `&deliver_to=${encodeURIComponent(_deliverTo)}` : "";
      router.push(`/${_cc}/search?q=${encodeURIComponent(text)}${dt}`);
    },
    [router, _cc, _deliverTo, q]
  );

  const gotoSourcing = useCallback(
    (intent) => {
      router.push(`/${_cc}/sourcing?intent=${encodeURIComponent(intent || q)}`);
    },
    [router, _cc, q]
  );

  /** keyboard nav */
  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
    if (!rows.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      let next = idx + 1;
      while (next < rows.length && rows[next].type === "label") next++;
      if (next >= rows.length) next = -1; // wrap to input
      setIdx(next);
      scrollIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      let prev = idx - 1;
      if (prev < -1) prev = rows.length - 1;
      while (prev >= 0 && rows[prev].type === "label") prev--;
      setIdx(prev);
      scrollIntoView(prev);
    } else if (e.key === "Enter") {
      if (idx === -1) {
        gotoSearch(q);
      } else {
        const row = rows[idx];
        handleRowClick(row);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setIdx(-1);
      inputRef.current?.blur();
    }
  };

  const scrollIntoView = (i) => {
    const list = listRef.current;
    if (!list || i < 0) return;
    const el = list.querySelector(`[data-idx="${i}"]`);
    if (!el) return;
    const boxTop = list.scrollTop;
    const boxBottom = boxTop + list.clientHeight;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < boxTop) list.scrollTop = top;
    else if (bottom > boxBottom) list.scrollTop = bottom - list.clientHeight;
  };

  const handleRowClick = (row) => {
    if (!row) return;
    if (row.type === "empty") return;
    if (row.type === "cta") {
      gotoSourcing(q);
      return;
    }
    if (row.type === "product" && row.product?.frontend_url) {
      router.push(row.product.frontend_url);
      return;
    }
    const text = row.text || "";
    if (text) gotoSearch(text);
  };

  return (
    <div className={cls("relative flex-1", className)}>
      <div className="flex min-w-0">
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggest-listbox"
          aria-autocomplete="list"
          placeholder={placeholder}
          className={cls(
            "w-full h-11 rounded-l-xl border border-[var(--line)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]",
            inputClassName
          )}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
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
          onClick={() => gotoSearch()}
        >
          Search
        </button>
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl border border-[var(--line)] bg-white shadow-xl z-[80] overflow-hidden">
          <ul
            id="search-suggest-listbox"
            ref={listRef}
            role="listbox"
            className="max-h-[60vh] overflow-auto py-1"
          >
            {rows.map((row, i) => {
              if (row.type === "label") {
                return (
                  <li
                    key={`label-${row.label}-${i}`}
                    className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-[var(--ink-2)]"
                  >
                    {row.label}
                  </li>
                );
              }
              if (row.type === "empty") {
                return (
                  <li
                    key="empty"
                    className="px-4 py-6 text-sm text-center text-[var(--ink-2)]"
                  >
                    No suggestions — try a different term.
                  </li>
                );
              }
              const selected = i === idx;
              const text = row.text || (row.product?.title ?? "");
              const sub = row.product?.brand || row.product?.price_display || "";
              const availability = row.product?.meta?.availability; // "ships" | "likely" | "no"
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
                    selected ? "bg-[var(--alt-surface)]" : "hover:bg-[var(--alt-surface)]"
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
                      {/* 🔎 highlight the typed query inside the text */}
                      <Highlight text={text} query={q} />
                      {/* availability pill inline with title */}
                      {row.type === "product" && (
                        <AvailabilityBadge availability={availability} cc={_deliverTo} />
                      )}
                    </div>
                    {row.type === "product" && sub ? (
                      <div className="text-[12px] text-[var(--ink-2)] truncate">{sub}</div>
                    ) : null}
                  </div>
                  {row.type === "product" && row.product?.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.product.thumbnail}
                      alt=""
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : null}
                </li>
              );
            })}

            {/* CTA if no “rows” were produced */}
            {rows.find((r) => r.type === "cta") && (
              <li
                role="option"
                data-idx={rows.findIndex((r) => r.type === "cta")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => gotoSourcing(q)}
                className="px-3 py-2 cursor-pointer flex items-center justify-center gap-2 bg-[var(--brand-50,#eff6ff)]"
              >
                <span>🔎</span>
                <span className="text-sm font-medium">Find “{q}” for me</span>
              </li>
            )}
          </ul>

          {/* quick controls/status bar */}
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-[var(--ink-3,#6b7280)] border-t">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={hideNo}
                onChange={(e) => setHideNo(e.target.checked)}
              />
              Hide “Ships elsewhere”
            </label>
            <span>
              Deliver to <strong>{_deliverTo.toUpperCase()}</strong>
            </span>
          </div>

          <div className="px-3 py-1.5 text-[11px] text-[var(--ink-3,#6b7280)] border-t">
            Powered by UpSearch
            {loading ? <span className="ml-2">• Loading…</span> : null}
          </div>
        </div>
      )}
    </div>
  );
}