'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { fixImageUrl } from '@/lib/image';
import { uploadFile, deleteUpload } from '@/lib/upload'; // server delete helper

const STORE = 'uploadsGallery';
const DELETE_DELAY_MS = 2800; // time to allow Undo

export default function DisplayUploadedTest() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]); // [{ cdnUrl, key }]
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  // load saved gallery
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
  }, []);

  // seed from ?src= or ?key=
  useEffect(() => {
    const urlish = searchParams?.get('src') || searchParams?.get('u');
    const key = searchParams?.get('key');
    const raw = urlish || key;
    if (!raw) return;

    const cdnUrl = fixImageUrl(raw);
    const k =
      key ||
      (cdnUrl.startsWith('http')
        ? new URL(cdnUrl).pathname.replace(/^\/+/, '')
        : raw);

    setItems((prev) => {
      const next = [{ cdnUrl, key: k }, ...prev.filter((it) => it.cdnUrl !== cdnUrl)];
      sessionStorage.setItem(STORE, JSON.stringify(next));
      sessionStorage.setItem('lastUploadCdnUrl', cdnUrl);
      if (k) sessionStorage.setItem('lastUploadKey', k);
      return next;
    });
  }, [searchParams]);

  // add files
  async function handleFiles(files) {
    if (!files?.length) return;
    setBusy(true); setErr('');
    const added = [];
    try {
      for (const file of files) {
        const { cdnUrl, key } = await uploadFile({ file, kind: 'product', refId: '123' });
        added.push({ cdnUrl, key });
      }
      setItems((prev) => {
        const next = [...added, ...prev];
        sessionStorage.setItem(STORE, JSON.stringify(next));
        if (added[0]?.cdnUrl) sessionStorage.setItem('lastUploadCdnUrl', added[0].cdnUrl);
        if (added[0]?.key) sessionStorage.setItem('lastUploadKey', added[0].key);
        return next;
      });
      toast.success(added.length === 1 ? 'Image uploaded' : `${added.length} images uploaded`);
    } catch (e) {
      setErr(e.message || String(e));
      toast.error('Upload failed');
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const onInputChange = (e) => handleFiles(Array.from(e.target.files || []));

  // paste URL / key
  const [manual, setManual] = useState('');
  const addManual = (e) => {
    e.preventDefault();
    const raw = manual.trim();
    if (!raw) return;
    const cdnUrl = fixImageUrl(raw);
    const k =
      cdnUrl.startsWith('http')
        ? new URL(cdnUrl).pathname.replace(/^\/+/, '')
        : raw.replace(/^\/+/, '');
    setItems((prev) => {
      const next = [{ cdnUrl, key: k }, ...prev];
      sessionStorage.setItem(STORE, JSON.stringify(next));
      return next;
    });
    toast.success('Added from URL');
    setManual('');
  };

  // save helper
  const save = (arr) => sessionStorage.setItem(STORE, JSON.stringify(arr));

  // remove with toast + undo; delay the actual server delete
  function removeAt(idx) {
    const prev = items;
    const removed = prev[idx];
    const next = prev.filter((_, i) => i !== idx);

    setItems(next);
    save(next);

    let undone = false;
    const restore = () => {
      if (undone) return;
      undone = true;
      // put it back at its original index
      const restored = [...prev];
      setItems(restored);
      save(restored);
      toast.success('Restored');
    };

    // show toast w/ Undo
    const tId = toast.custom((t) => (
      <div style={{
        background: '#111', color: '#fff', padding: '10px 14px',
        borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12
      }}>
        <span>Deleted image</span>
        <button
          onClick={() => { restore(); toast.dismiss(t.id); }}
          style={{
            background: '#fff', color: '#111', border: 0, borderRadius: 8,
            padding: '4px 10px', cursor: 'pointer'
          }}
        >
          Undo
        </button>
      </div>
    ), { duration: DELETE_DELAY_MS + 600 });

    // after a short delay (if not undone), ask backend to delete
    setTimeout(async () => {
      if (undone) return;
      try {
        if (removed?.key) {
          await deleteUpload(removed.key); // accepts key or keys
        } else if (removed?.cdnUrl) {
          await deleteUpload({ url: removed.cdnUrl });
        }
        toast.dismiss(tId);
        toast('Deleted on server', { icon: '🗑️' });
      } catch {
        // roll back if server delete failed and user didn’t undo
        const rolledBack = [...prev];
        setItems(rolledBack);
        save(rolledBack);
        toast.error('Server delete failed — restored');
      }
    }, DELETE_DELAY_MS);
  }

  async function clearAll() {
    if (!items.length) return;
    const keys = items.map((x) => x.key).filter(Boolean);
    const old = items;
    setItems([]); save([]);
    toast('Cleared', { icon: '🧹' });

    // best-effort bulk delete; ignore errors (this is a demo page)
    if (keys.length) {
      try { await deleteUpload(keys); }
      catch { setItems(old); save(old); toast.error('Could not clear on server — restored'); }
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
      <h1>Display uploaded test</h1>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          disabled={busy}
        />
        <form onSubmit={addManual} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Paste CDN URL or key (e.g. products/123/original/..)"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            style={{ width: 420, padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button type="submit" disabled={!manual.trim()}>Add</button>
        </form>
        <button onClick={clearAll} disabled={!items.length}>Clear</button>
        {busy && <span>Uploading…</span>}
      </div>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      {!items.length ? (
        <p>Upload images or paste a CDN URL/key to start.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
            marginTop: 12,
          }}
        >
          {items.map((it, idx) => (
            <figure
              key={it.cdnUrl + idx}
              style={{
                margin: 0,
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 8,
                position: 'relative',
                background: '#fff',
              }}
            >
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                <a href={it.cdnUrl} target="_blank" rel="noreferrer" title="Open">🔗</a>
                <button
                  onClick={() => { navigator.clipboard.writeText(it.cdnUrl); toast('URL copied', { icon: '📋' }); }}
                  title="Copy URL"
                >
                  📋
                </button>
                <button onClick={() => removeAt(idx)} title="Remove">✖️</button>
              </div>
              <Image
                src={it.cdnUrl}
                alt=""
                width={800}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 8 }}
              />
              <figcaption style={{ marginTop: 6, fontSize: 12, color: '#555', wordBreak: 'break-all' }}>
                <div>key: {it.key || '(unknown)'}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}