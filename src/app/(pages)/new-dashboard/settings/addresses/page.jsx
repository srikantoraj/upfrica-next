// app/(pages)/new-dashboard/settings/addresses/page.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';            // ⬅️ NEW
import { motion, AnimatePresence } from 'framer-motion';
import AddressForm from '@/components/addresses/AddressForm';
import { BASE_API_URL } from '@/app/constants';
import { getCleanToken } from '@/lib/getCleanToken';

/* -------------------------- helpers -------------------------- */

const API_ROOT = (BASE_API_URL || '').replace(/\/+$/, '');
const API = (p) => `${API_ROOT}/api/${String(p).replace(/^\/+/, '')}`;

const absolutize = (maybeRelative) =>
  !maybeRelative ? null :
  /^https?:\/\//i.test(maybeRelative) ? maybeRelative :
  `${API_ROOT}${maybeRelative.startsWith('/') ? '' : '/'}${maybeRelative}`;

const safelyExtractArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  if (Array.isArray(payload.data)) return payload.data;
  for (const v of Object.values(payload)) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object' && Array.isArray(v.results)) return v.results;
  }
  return [];
};

const codeToFlag = (code) => {
  if (!code) return '';
  const cc = String(code).slice(0, 2).toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + (c.charCodeAt() - 65)));
};

// Copy/labels per kind
const KIND_META = {
  delivery: {
    title: 'Delivery addresses',
    subtitle: 'Used at checkout. You can set one primary address.',
    add: 'Add address',
    primary: 'Primary delivery address',
    list: 'Delivery addresses',
    empty: 'You don’t have any delivery addresses yet.',
  },
  return: {
    title: 'Return addresses',
    subtitle: 'Where buyers should send returns for your items.',
    add: 'Add return address',
    primary: 'Primary return address',
    list: 'Return addresses',
    empty: 'You don’t have any return addresses yet.',
  },
  // (dispatch/collection can be added later)
};

/* ------------------------- UI piece -------------------------- */

const AddressCard = ({
  addr,
  onEdit,
  onMakePrimary,
  onDelete,
  pendingPrimaryId,
  pendingDeleteId,
}) => {
  const flag = addr.flag_emoji || codeToFlag(addr.country_code || addr.country);
  const phone = addr.phone_number || '';
  const isDefault = !!addr.default;

  const making = pendingPrimaryId === addr.id;
  const deleting = pendingDeleteId === addr.id;

  return (
    <div
      className={`rounded-2xl border p-4 md:p-5 shadow-sm
      ${isDefault
        ? 'border-violet-500/60 bg-violet-50 dark:bg-violet-950/30'
        : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            {flag && <span className="text-lg leading-none">{flag}</span>}
            <span className="truncate">{addr.country || addr.country_code}</span>
            {isDefault && (
              <span className="inline-flex items-center rounded-full border border-violet-500/50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                Primary
              </span>
            )}
          </div>
          <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
            {addr.full_name}
          </div>
          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {addr.display_address || [
              addr.address_line_1, addr.address_line_2, addr.local_area,
              addr.town, addr.state_or_region, addr.postcode, addr.country
            ].filter(Boolean).join(', ')}
          </div>
          {phone && (
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{phone}</div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {!isDefault && (
            <button
              onClick={() => onMakePrimary(addr.id)}
              disabled={making}
              aria-busy={making}
              className="rounded-full border px-3 py-1 text-sm font-medium
                         border-gray-300 text-gray-800 hover:bg-gray-100
                         dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800
                         disabled:opacity-50"
            >
              {making ? 'Making…' : 'Make primary'}
            </button>
          )}
          <button
            onClick={() => onEdit(addr)}
            className="rounded-full border px-3 py-1 text-sm font-medium
                       border-gray-300 text-gray-800 hover:bg-gray-100
                       dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(addr.id)}
            disabled={deleting}
            aria-busy={deleting}
            className="rounded-full border px-3 py-1 text-sm font-medium
                       border-red-300 text-red-700 hover:bg-red-50
                       dark:border-red-700/60 dark:text-red-400 dark:hover:bg-red-950/30
                       disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------- page ---------------------------- */

export default function AddressPage() {
  const cleanToken = getCleanToken();
  const searchParams = useSearchParams();                          // ⬅️ NEW
  const router = useRouter();                                      // ⬅️ NEW

  // "delivery" | "return"
  const initialKind = (searchParams.get('kind') || 'delivery').toLowerCase();
  const [kind, setKind] = useState(['delivery', 'return'].includes(initialKind) ? initialKind : 'delivery');

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [defaultCountry, setDefaultCountry] = useState(null);

  // in-flight UX guards
  const [pendingPrimaryId, setPendingPrimaryId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const meta = KIND_META[kind] || KIND_META.delivery;

  /* -------------------- loaders -------------------- */

  const getMe = async () => {
    if (!cleanToken) return null;
    try {
      const res = await fetch(API('users/me/'), {
        headers: { Authorization: `Token ${cleanToken}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const u = await res.json();
      const code = u?.country_fk?.code || u?.country || u?.country_code || null;
      setDefaultCountry(code ? String(code).toUpperCase() : null);
      return u;
    } catch { return null; }
  };

  const fetchAllPages = async (startUrl) => {
    const out = [];
    let url = startUrl;
    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `Token ${cleanToken}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) break;
      const json = await res.json().catch(() => null);
      out.push(...safelyExtractArray(json));
      url = absolutize(json?.next);
      if (url === startUrl) break;
    }
    return out;
  };

  const fetchAddresses = async (userId = null) => {
    // 1) primary list (scoped to request.user by backend), filtered by kind
    let list = await fetchAllPages(API(`addresses/?kind=${encodeURIComponent(kind)}`));

    // 2) optional fallback if list is empty and legacy owner params exist
    if (!list.length && userId) {
      list = await fetchAllPages(API(`addresses/?owner_type=User&owner_id=${userId}&kind=${encodeURIComponent(kind)}`));
    }

    return (list || [])
      .filter((a) => a && a.is_deleted !== true)
      .sort((a, b) => Number(b?.default) - Number(a?.default));
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const me = await getMe();
      const list = await fetchAddresses(me?.id ?? null);
      setAddresses(list);
      console.log(`[${kind}] 📫 addresses (ids/default):`, list.map(a => ({ id: a.id, d: a.default })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [cleanToken, kind]);

  // keep URL query in sync when switching tabs
  const switchKind = (k) => {
    const next = (k || 'delivery').toLowerCase();
    setKind(next);
    const url = new URL(window.location.href);
    url.searchParams.set('kind', next);
    router.replace(url.pathname + '?' + url.searchParams.toString());
  };

  /* -------------------- actions -------------------- */

  const openAdd = () => { setEditingAddress(null); setSheetOpen(true); };

  const openEdit = (addr) => {
    const d = addr.address_data || {};
    setEditingAddress({
      id: addr.id,
      kind: addr.kind || kind,                     // ⬅️ keep kind with the edit
      full_name: addr.full_name,
      phone_number: addr.phone_number || d.phone_number || '',
      address_line_1: addr.address_line_1 || d.address_line_1 || '',
      address_line_2: addr.address_line_2 || d.address_line_2 || '',
      town: addr.town || d.town || '',
      local_area: addr.local_area || d.local_area || '',
      state_or_region: addr.state_or_region || d.state_or_region || '',
      country: addr.country_code || addr.country || d.country_code || '',
      postcode: addr.postcode || d.postcode || '',
      delivery_instructions: addr.delivery_instructions || d.delivery_instructions || '',
      default: !!addr.default,
    });
    setSheetOpen(true);
  };

  const closeSheet = () => { setEditingAddress(null); setSheetOpen(false); };
  const handleSaved = () => { closeSheet(); refresh(); };

  const handleMakePrimary = async (id) => {
    if (!cleanToken || pendingPrimaryId) return;
    setPendingPrimaryId(id);
    try {
      const res = await fetch(API(`addresses/${id}/set-default/`), {
        method: 'POST',
        headers: { Authorization: `Token ${cleanToken}` },
      });
      if (res.ok) await refresh();
    } finally {
      setPendingPrimaryId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!cleanToken || pendingDeleteId) return;
    if (!confirm('Delete this address?')) return;
    setPendingDeleteId(id);
    try {
      const res = await fetch(API(`addresses/${id}/`), {
        method: 'DELETE',
        headers: { Authorization: `Token ${cleanToken}` },
      });
      if (res.ok) await refresh();
    } finally {
      setPendingDeleteId(null);
    }
  };

  /* --------------------------- UI --------------------------- */

  const primary = useMemo(() => addresses.find((a) => a.default), [addresses]);
  const others  = useMemo(() => addresses.filter((a) => !a.default), [addresses]);

  return (
    <div className="mx-auto w/full max-w-5xl px-0 py-6 text-gray-900 dark:text-gray-100">
      {/* Kind tabs */}
      <div className="mb-4 flex gap-2">
        {['delivery','return'].map((k) => (
          <button
            key={k}
            onClick={() => switchKind(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium border
              ${kind === k
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {KIND_META[k].title}
          </button>
        ))}
      </div>

      <div className="mb-5 sm:mb-6 grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-100">{meta.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{meta.subtitle}</p>
        </div>

        <button
          onClick={openAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-full
                     bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {meta.add}
        </button>
      </div>

      {/* loading state */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {!loading && addresses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            {meta.empty}
          </p>
          <button
            onClick={openAdd}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {meta.add}
          </button>
        </div>
      )}

      {!loading && addresses.length > 0 && (
        <>
          {primary ? (
            <>
              <h2 className="mb-2 mt-4 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {meta.primary}
              </h2>
              <AddressCard
                addr={primary}
                onEdit={openEdit}
                onMakePrimary={handleMakePrimary}
                onDelete={handleDelete}
                pendingPrimaryId={pendingPrimaryId}
                pendingDeleteId={pendingDeleteId}
              />

              {others.length > 0 && (
                <>
                  <h2 className="mb-2 mt-6 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Other {meta.list.toLowerCase()}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {others.map((a) => (
                      <AddressCard
                        key={a.id}
                        addr={a}
                        onEdit={openEdit}
                        onMakePrimary={handleMakePrimary}
                        onDelete={handleDelete}
                        pendingPrimaryId={pendingPrimaryId}
                        pendingDeleteId={pendingDeleteId}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="mb-2 mt-4 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {meta.list}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((a) => (
                  <AddressCard
                    key={a.id}
                    addr={a}
                    onEdit={openEdit}
                    onMakePrimary={handleMakePrimary}
                    onDelete={handleDelete}
                    pendingPrimaryId={pendingPrimaryId}
                    pendingDeleteId={pendingDeleteId}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ---------------- Bottom Sheet (Add/Edit) ---------------- */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSheet}
            />
            {/* sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h[85vh] overflow-auto rounded-t-3xl
                         bg-white p-4 shadow-2xl dark:bg-gray-900 md:inset-y-10 md:mx-auto md:max-w-2xl md:rounded-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="mx-auto w-full max-w-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingAddress ? 'Edit address' : `Add ${kind} address`}
                  </h3>
                  <button
                    onClick={closeSheet}
                    className="rounded-full border border-gray-300 px-3 py-1 text-sm dark:border-gray-700"
                  >
                    Close
                  </button>
                </div>

                <AddressForm
                  token={cleanToken}
                  kind={kind}                               // ⬅️ NEW
                  onSave={handleSaved}
                  initialData={editingAddress}
                  editId={editingAddress?.id || null}
                  onCancel={closeSheet}
                  defaultCountry={defaultCountry}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}