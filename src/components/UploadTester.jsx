// components/UploadTester.jsx
'use client';
import { useState } from 'react';
import { uploadFile } from '@/lib/upload';

export default function UploadTester() {
  const [url, setUrl] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(''); setUrl(null);
    try {
      const { cdnUrl } = await uploadFile({ file, kind: 'product', refId: '123' });
      setUrl(cdnUrl);
    } catch (e) {
      setErr(e.message || String(e));
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
          <div>CDN URL: <a href={url} target="_blank" rel="noreferrer">{url}</a></div>
          <img alt="" src={url} style={{ maxWidth: 320, marginTop: 8 }} />
        </div>
      )}
    </div>
  );
}