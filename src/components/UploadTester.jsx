// components/UploadTester.jsx
'use client';
import { useState } from 'react';
import { API_BASE } from '@/app/constants';  // ← uses http://127.0.0.1:8000/api by default

export default function UploadTester() {
  const [url, setUrl] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(''); setUrl(null);
    try {
      const r = await fetch(`${API_BASE}/uploads/presign`, {   // ← absolute API URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'product',
          product_id: '123',
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
        }),
      });
      if (!r.ok) throw new Error('presign failed');
      const { upload, cdnUrl } = await r.json();

      const form = new FormData();
      Object.entries(upload.fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', file);

      const up = await fetch(upload.url, { method: 'POST', body: form });
      if (!up.ok) throw new Error('upload failed');

      setUrl(cdnUrl);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <input type="file" accept="image/*" onChange={onChange} disabled={busy} />
      {busy && <p>Uploading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {url && (
        <div style={{ marginTop: 12 }}>
          <div>
            CDN URL: <a href={url} target="_blank" rel="noreferrer">{url}</a>
          </div>
          <img alt="" src={url} style={{ maxWidth: 320, marginTop: 8 }} />
        </div>
      )}
    </div>
  );
}