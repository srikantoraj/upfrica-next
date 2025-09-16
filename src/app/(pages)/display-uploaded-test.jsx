//src/app/(pages)/display-uploaded-test.jsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { fixImageUrl } from '@/lib/image';

export default function DisplayUploadedTest() {
  const searchParams = useSearchParams();
  const [src, setSrc] = useState('');

  // read from URL (?src= or ?key=). If absent, fall back to sessionStorage.
  useEffect(() => {
    const urlish = searchParams?.get('src') || searchParams?.get('u');
    const key = searchParams?.get('key');

    const raw = urlish || key || '';
    if (raw) {
      setSrc(fixImageUrl(raw));
      return;
    }

    // fallback: last upload remembered by the tester page
    try {
      const saved = sessionStorage.getItem('lastUploadCdnUrl')
        || sessionStorage.getItem('lastUploadUrl')
        || sessionStorage.getItem('lastUploadKey')
        || '';
      if (saved) setSrc(fixImageUrl(saved));
    } catch {}
  }, [searchParams]);

  const [manual, setManual] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    if (!manual.trim()) return;
    const clean = fixImageUrl(manual.trim());
    setSrc(clean);
    try { sessionStorage.setItem('lastUploadCdnUrl', clean); } catch {}
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Display uploaded test</h1>

      <form onSubmit={onSubmit} style={{ margin: '12px 0' }}>
        <input
          type="text"
          placeholder="Paste CDN URL or /media key…"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          style={{ width: 'min(680px, 90%)', padding: 8, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '8px 12px', borderRadius: 8 }}>
          Show
        </button>
      </form>

      {!src ? (
        <p>Pass <code>?src=&lt;cdn url&gt;</code> or <code>?key=&lt;cdn key&gt;</code>, or paste above.</p>
      ) : (
        <>
          <div style={{ marginBottom: 8, wordBreak: 'break-all' }}>
            CDN URL: <a href={src} target="_blank" rel="noreferrer">{src}</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <figure style={{ margin: 0 }}>
              <figcaption style={{ marginBottom: 8 }}>Next &lt;Image /&gt;</figcaption>
              <div style={{ border: '1px solid #eee', padding: 8, borderRadius: 12, maxWidth: 900 }}>
                <Image
                  src={src}
                  alt="Uploaded"
                  width={900}
                  height={900}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </figure>

            <figure style={{ margin: 0 }}>
              <figcaption style={{ marginBottom: 8 }}>Plain &lt;img&gt;</figcaption>
              <div style={{ border: '1px solid #eee', padding: 8, borderRadius: 12, maxWidth: 900 }}>
                <img src={src} alt="" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              </div>
            </figure>
          </div>
        </>
      )}
    </main>
  );
}