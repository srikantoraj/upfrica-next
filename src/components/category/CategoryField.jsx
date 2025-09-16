//src/components/category/CategoryField.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------- tiny in-memory cache (per tab) -------------------- */
const _catCache = { pagesLoaded: 0, items: [], byId: new Map(), byParent: new Map(), next: null };
const RECENTS_KEY = "upfrica:cat:recents";
const FAVS_KEY = "upfrica:cat:favs";

// cooldown store for "Suggest a category"
const SUGGEST_LS_KEY = "upfrica:cat:suggested-v1";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

function slugify(s = "") {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readMap() {
  try { return JSON.parse(localStorage.getItem(SUGGEST_LS_KEY) || "{}"); }
  catch { return {}; }
}
function writeMap(m) {
  try { localStorage.setItem(SUGGEST_LS_KEY, JSON.stringify(m)); }
  catch {}
}

/* -------------------- helpers -------------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const byId = (id) => _catCache.byId.get(Number(id));
const pathNames = (cat) => {
  if (!cat) return [];
  const out = [];
  let cur = cat;
  // climb using cache parents we’ve seen
  const guard = new Set();
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    out.push(cur.name);
    cur = cur.parent ? byId(cur.parent.id) : null;
  }
  return out.reverse();
};
const pathString = (cat, sep = " › ") => pathNames(cat).join(sep);

/* -------------------- persistence -------------------- */
const loadLS = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; }
};
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* -------------------- API loaders -------------------- */
async function fetchCategoriesPage(url = "/api/categories/?page_size=200") {
  const r = await fetch(url, { headers: { Accept: "application/json" }, credentials: "omit", cache: "no-store" });
  if (!r.ok) throw new Error(`categories HTTP ${r.status}`);
  const data = await r.json();
  const items = Array.isArray(data) ? data : data.results || [];
  const next = data?.next || null;

  // index
  for (const it of items) {
    _catCache.byId.set(it.id, it);
  }
  _catCache.items.push(...items);
  _catCache.pagesLoaded += 1;
  _catCache.next = next;

  // parent map (for fast tree)
  for (const it of items) {
    const pid = it.parent?.id ?? 0;
    if (!_catCache.byParent.has(pid)) _catCache.byParent.set(pid, []);
    _catCache.byParent.get(pid).push(it);
  }
  return { items, next };
}

async function ensureSomeCategories() {
  if (_catCache.items.length) return;
  await fetchCategoriesPage(); // first page
}

/* -------------------- fuzzy-ish client search -------------------- */
function makeIndexString(c) {
  const crumbs = [];
  if (c.parent?.id) {
    let cur = byId(c.parent.id);
    const seen = new Set();
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      crumbs.unshift(cur.name);
      cur = cur.parent?.id ? byId(cur.parent.id) : null;
    }
  }
  return `${c.name} ${crumbs.join(" ")}`.toLowerCase();
}
function searchLocal(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const hits = [];
  for (const c of _catCache.items) {
    if (makeIndexString(c).includes(needle)) hits.push(c);
    if (hits.length >= 50) break;
  }
  return hits;
}



/* -------------------- Suggest new category (POST) -------------------- */
async function postCategorySuggestion({ name, parent_id, reason }) {
  const payload = {
    name: (name || "").trim(),
    parent: parent_id || null,            // FK id
    fallback_category: parent_id || null, // safe interim bucket
    notes: reason || "",                  // maps to PendingCategory.notes
  };

  const r = await fetch("/api/pending-categories/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (r.status === 401 || r.status === 403) throw new Error("Please sign in to suggest a category.");
  if (!r.ok) throw new Error((await r.text().catch(() => "")) || `suggest failed ${r.status}`);
  return r.json().catch(() => ({}));
}



/* ====================================================================== */
/*  Public component: CategoryField                                       */
/* ====================================================================== */
export default function CategoryField({
  label = "Category",
  value,                 // {id, name, parent?}  (optional full object)
  valueId,               // number|string (used if value not provided)
  onChange,              // (categoryObject) => void
  required = true,
  titleHint = "",        // use to pre-suggest from title
  autosave = () => {},   // call after commit (debounced outside)
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => (value || byId(valueId) || null), [value, valueId]);

  const missing = required && !selected;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </div>

      {/* Pill */}
      <div
        className={cls(
          "flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm",
          "bg-white dark:bg-gray-900",
          missing ? "border-red-500 text-red-600" : "border-gray-300 dark:border-gray-700"
        )}
      >
        <span className="truncate">
          {selected
            ? <span className="text-gray-800 dark:text-gray-200">
                {pathString(selected) || selected.name}
              </span>
            : <span className="text-gray-500">Not set — choose a category</span>}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto text-blue-600 dark:text-blue-400 hover:underline"
        >
          {selected ? "Change" : "Choose"}
        </button>
      </div>

      {/* Validation microcopy */}
      {missing && (
        <p className="text-xs text-red-600">
          Choose a category to help buyers find your item.
        </p>
      )}

      {open && (
        <CategoryPickerDrawer
          initialSelectedId={selected?.id}
          titleHint={titleHint}
          onClose={() => setOpen(false)}
          onCommit={(cat) => {
            setOpen(false);
            onChange?.(cat);
            autosave?.();
          }}
        />
      )}
    </div>
  );
}

/* ====================================================================== */
/*  Drawer with Search + Tree + Recents + Favorites + Suggest             */
/* ====================================================================== */
function CategoryPickerDrawer({ initialSelectedId, onCommit, onClose, titleHint }) {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("browse"); // 'browse' | 'search'
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [stack, setStack] = useState([]); // breadcrumb stack of category IDs
  const [recents, setRecents] = useState([]);
  const [favs, setFavs] = useState([]);

  const drawerRef = useRef(null);
  const debRef = useRef(null);

  // bootstrap cache + recents/favs
  useEffect(() => {
    (async () => {
      try {
        await ensureSomeCategories();
      } finally {
        setReady(true);
      }
    })();
    setRecents(loadLS(RECENTS_KEY, []));
    setFavs(loadLS(FAVS_KEY, []));
  }, []);

  // suggest from title once
  useEffect(() => {
    if (!titleHint || !ready) return;
    const hits = searchLocal(titleHint).slice(0, 1);
    if (hits[0]) {
      // pre-open on search tab with suggestion
      setTab("search");
      setQ(titleHint);
      setResults(hits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // debounced search
  useEffect(() => {
    if (!ready) return;
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      const text = q.trim();
      if (!text) { setResults([]); setSearching(false); return; }
      setSearching(true);
      let hits = searchLocal(text);
      // If we have more pages and few hits, try to progressively load more
      let guard = 0;
      while (_catCache.next && hits.length < 10 && guard < 5) {
        await fetchCategoriesPage(_catCache.next);
        hits = searchLocal(text);
        guard += 1;
      }
      setResults(hits);
      setSearching(false);
    }, 250);
    return () => clearTimeout(debRef.current);
  }, [q, ready]);

  // start at root “department” list
  const roots = useMemo(() => (_catCache.byParent.get(0) || []).sort(sortByName), [ready]);

  // visible children of current node (or roots)
  const currentId = stack[stack.length - 1] || 0;
  const currentChildren = useMemo(() => (_catCache.byParent.get(currentId) || []).sort(sortByName), [currentId, ready]);
  const currentCrumbs = useMemo(() => {
    const out = [];
    for (const id of stack) out.push(byId(id));
    return out.filter(Boolean);
  }, [stack]);

  function selectNode(cat) {
    // If leaf (no children), commit immediately
    const kids = _catCache.byParent.get(cat.id) || [];
    if (!kids.length) {
      commit(cat);
      return;
    }
    // otherwise drill down
    setStack((s) => [...s, cat.id]);
  }

  function goUpTo(idx) {
    setStack((s) => s.slice(0, idx));
  }

  function toggleFav(catId) {
    const id = Number(catId);
    let next;
    if (favs.includes(id)) next = favs.filter((x) => x !== id);
    else next = [id, ...favs].slice(0, 12);
    setFavs(next);
    saveLS(FAVS_KEY, next);
  }

  function commit(cat) {
    // recents
    const next = [cat.id, ...recents.filter((x) => x !== cat.id)].slice(0, 5);
    setRecents(next);
    saveLS(RECENTS_KEY, next);
    onCommit?.(cat);
  }

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex"
      onKeyDown={(e) => { if (e.key === "Escape") onClose?.(); }}
    >
      {/* scrim */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* panel */}
      <div className="w-full max-w-lg h-full overflow-hidden bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800">
        {/* header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <div className="flex-1">
            <input
              autoFocus
              value={q}
              onChange={(e) => { setQ(e.target.value); setTab("search"); }}
              placeholder="Search categories (e.g., Computer Monitor)"
              aria-label="Search categories"
              aria-autocomplete="list"
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
          <button onClick={onClose} className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800">
            Close
          </button>
        </div>

        {/* tabs */}
        <div className="px-3 pt-2">
          <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              className={cls("px-3 py-1.5 text-sm", tab === "browse" ? "bg-gray-100 dark:bg-gray-800" : "")}
              onClick={() => setTab("browse")}
            >
              Browse
            </button>
            <button
              className={cls("px-3 py-1.5 text-sm", tab === "search" ? "bg-gray-100 dark:bg-gray-800" : "")}
              onClick={() => setTab("search")}
            >
              Search
            </button>
          </div>
        </div>

        {/* content */}
        <div className="h-[calc(100%-116px)] overflow-y-auto">
          {/* Recents & Favorites */}
          {!!(recents.length || favs.length) && tab === "browse" && (
            <div className="px-3 pt-3 space-y-3">
              {!!recents.length && (
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Recent</div>
                  <div className="flex flex-wrap gap-2">
                    {recents.map((id) => byId(id)).filter(Boolean).map((c) => (
                      <button
                        key={`r-${c.id}`}
                        onClick={() => commit(c)}
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {pathString(c)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!!favs.length && (
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Favorites</div>
                  <div className="flex flex-wrap gap-2">
                    {favs.map((id) => byId(id)).filter(Boolean).map((c) => (
                      <button
                        key={`f-${c.id}`}
                        onClick={() => commit(c)}
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {pathString(c)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search results */}
          {tab === "search" && (
            <div className="p-3">
              {searching && <div className="text-sm text-gray-500">Searching…</div>}
              {!searching && q && results.length === 0 && (
                <EmptySearchState query={q} stack={stack} />
              )}
              <ul role="listbox" className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.map((c) => (
                  <li key={`s-${c.id}`} role="option">
                    <button
                      onClick={() => commit(c)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        {pathString(c)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tree browser */}
          {tab === "browse" && (
            <div className="px-3 pt-3 grid grid-cols-2 gap-3">
              {/* breadcrumb */}
              <div className="col-span-2">
                <nav aria-label="Category" className="text-xs text-gray-600 dark:text-gray-300">
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => setStack([])}
                  >
                    All departments
                  </span>
                  {currentCrumbs.map((node, i) => (
                    <span key={node.id}>
                      {" "}›{" "}
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => goUpTo(i + 1)}
                      >
                        {node.name}
                      </span>
                    </span>
                  ))}
                </nav>
              </div>

              {/* left: top level */}
              <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <ListHeader title="Departments" />
                <div className="max-h-[55vh] overflow-y-auto">
                  {roots.map((c) => (
                    <Row
                      key={`root-${c.id}`}
                      cat={c}
                      active={c.id === currentId}
                      onClick={() => setStack([c.id])}
                      starred={favs.includes(c.id)}
                      onStar={() => toggleFav(c.id)}
                    />
                  ))}
                </div>
              </div>

              {/* right: children */}
              <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
                <ListHeader title={currentId ? "Drill down" : "Pick a department"} />
                <div className="max-h-[55vh] overflow-y-auto">
                  {currentChildren.length === 0 && (
                    <div className="p-3 text-sm text-gray-500">No further levels. Choose on the left.</div>
                  )}
                  {currentChildren.map((c) => (
                    <Row
                      key={`child-${c.id}`}
                      cat={c}
                      onClick={() => selectNode(c)}
                      starred={favs.includes(c.id)}
                      onStar={() => toggleFav(c.id)}
                      showChevron={(_catCache.byParent.get(c.id) || []).length > 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggestion CTA */}
          <SuggestCTA currentId={currentId} />
        </div>
      </div>
    </div>
  );
}

/* -------------------- small subcomponents -------------------- */
function ListHeader({ title }) {
  return (
    <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
      {title}
    </div>
  );
}

function Row({ cat, onClick, active, showChevron = false, starred, onStar }) {
  return (
    <div
      className={cls(
        "flex items-center justify-between px-3 py-2 cursor-pointer",
        active ? "bg-blue-50 dark:bg-blue-950/40" : "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <div className="truncate">
        <div className="font-medium truncate">{cat.name}</div>
        {cat.parent?.id && (
          <div className="text-xs text-gray-500 truncate">{pathString(cat)}</div>
        )}
      </div>
      <div className="flex items-center gap-3 pl-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onStar?.(); }}
          title={starred ? "Unfavorite" : "Favorite"}
          className={cls(
            "text-xs rounded px-1.5 py-0.5 border",
            starred ? "bg-yellow-200/70 dark:bg-yellow-900/50" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          ★
        </button>
        {showChevron && <span className="text-gray-400">›</span>}
      </div>
    </div>
  );
}

function EmptySearchState({ query, stack }) {
  const [open, setOpen] = useState(false);
  const parentId = Array.isArray(stack) && stack.length ? stack[stack.length - 1] : undefined;

  return (
    <div className="text-sm text-gray-600 dark:text-gray-300">
      <div className="mb-2">No matches for “{query}”.</div>
      <button className="underline text-blue-600 dark:text-blue-400" onClick={() => setOpen(true)}>
        Suggest a new category
      </button>
      {open && <SuggestModal parentId={parentId} onClose={() => setOpen(false)} />}
    </div>
  );
}

function SuggestCTA({ currentId }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-3">
      <button className="text-xs underline text-gray-600 dark:text-gray-300" onClick={() => setOpen(true)}>
        Can’t find your category? Suggest a new one
      </button>
      {open && <SuggestModal parentId={currentId || undefined} onClose={() => setOpen(false)} />}
    </div>
  );
}

function SuggestModal({ parentId, onClose }) {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const parentKey = `P:${parentId || 0}`;            // 🔧 throttle per parent
  const key = `${parentId || 0}:${slugify(name)}`;   // exact (parent,name)

  // lock if same parent OR same (parent,name) was submitted recently
  const alreadyLocked = (() => {
    const map = readMap();
    const now = Date.now();
    const ts1 = map[key];
    const ts2 = map[parentKey];                       // 🔧 parent-level lock
    return (ts1 && now - ts1 < COOLDOWN_MS) || (ts2 && now - ts2 < COOLDOWN_MS);
  })();

  async function submit() {
    setSaving(true);
    setMsg("");
    try {
      await postCategorySuggestion({ name, parent_id: parentId || null, reason });
      setSent(true);

      // record cooldowns
      const map = readMap();
      const now = Date.now();
      map[key] = now;                                 // exact suggestion
      map[parentKey] = now;                           // 🔧 parent-level throttle
      writeMap(map);

      setMsg("Thanks! We’ll review it. For now, please pick the closest match.");
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
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
        <h4 className="text-lg font-semibold mb-3">Suggest a new category</h4>

        <label className="block text-sm mb-1">Proposed name</label>
        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 mb-3"
          value={name}
          onChange={(e) => { setName(e.target.value); setMsg(""); }}
          placeholder="e.g., Gaming Laptops"
          disabled={sent || alreadyLocked}
        />

        <label className="block text-sm mb-1">Why do you need it? (optional)</label>
        <textarea
          rows={3}
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Helps us prioritize"
          disabled={sent || alreadyLocked}
        />

        <div className="text-sm mb-3">
          {msg ||
            (alreadyLocked
              ? "You recently suggested a category here. Please try again later."
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

/* -------------------- util -------------------- */
function sortByName(a, b) {
  return String(a.name).localeCompare(String(b.name), undefined, { sensitivity: "base" });
}