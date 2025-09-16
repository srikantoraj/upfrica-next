// src/lib/upload.js
// usage (unchanged idea):
//   import { uploadFile } from '@/lib/upload';
//   const { cdnUrl } = await uploadFile({ file, kind: 'product', refId: productId });

import { apiJSON } from '@/lib/api';        // cookie-aware /api proxy fetcher
import { fixImageUrl } from '@/lib/image';

/* --------------------------- small helpers --------------------------- */

export async function dataUrlToFile(dataUrl, filename = 'upload.png') {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'application/octet-stream' });
}

function extractKeyFromUrl(u = '') {
  try {
    if (!u) return '';
    if (!/^https?:/i.test(u)) return String(u).replace(/^\/+/, '');
    const { pathname } = new URL(u);
    return pathname.replace(/^\/+/, '');
  } catch {
    return String(u).replace(/^\/+/, '');
  }
}

// POST to S3 with progress via XHR (fetch has no upload progress)
function postToS3(upload, file, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    Object.entries(upload.fields).forEach(([k, v]) => form.append(k, v));
    form.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', upload.url, true);
    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) onProgress({ loaded: evt.loaded, total: evt.total, pct: (evt.loaded / evt.total) * 100 });
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

/* ----------------------------- core APIs ---------------------------- */

/**
 * uploadFile({ file|dataUrl, kind, refId, filename, contentType, folder, onProgress })
 * - kind: 'product' | 'review' | 'sourcing' | 'user' | 'shop' | 'misc' ...
 * - refId: string/number id tied to the entity (sent as ref_id + product_id back-compat)
 * Returns: { cdnUrl, key, upload }
 */
export async function uploadFile(opts = {}) {
  let {
    file, dataUrl,
    kind = 'misc',
    refId = '',
    filename,
    contentType,
    folder,           // optional explicit folder override (backend supports)
    onProgress,       // optional (0..100)
  } = opts;

  if (!file && dataUrl) file = await dataUrlToFile(dataUrl, filename);
  if (!file) throw new Error('No file provided');

  const name = filename || file.name || 'upload';
  const type = contentType || file.type || 'application/octet-stream';

  // 1) presign via Next /api proxy
  const presigned = await apiJSON('uploads/presign', {
    kind,
    ref_id: String(refId ?? ''),          // generic ref
    product_id: String(refId ?? ''),      // older clients/servers expect this
    filename: name,
    contentType: type,
    folder,                               // optional passthrough
    count: 1,
  });

  const single = presigned?.uploads?.[0] || presigned;
  const { upload, cdnUrl, publicUrl, key } = single || {};
  if (!upload?.url || !upload?.fields) throw new Error('Invalid presign response');

  // 2) POST the file to S3 (with progress)
  await postToS3(upload, file, onProgress);

  // 3) return canonical CDN URL + key
  const url = fixImageUrl(cdnUrl || publicUrl);
  return { cdnUrl: url, key, upload };
}

/**
 * uploadFiles({ files, kind, refId, onItemProgress })
 * - Sequentially uploads an array of File or data URLs.
 * - onItemProgress?: (index, {loaded,total,pct}) => void
 * Returns: Array<{ cdnUrl, key }>
 */
export async function uploadFiles(opts = {}) {
  const {
    files = [],
    kind = 'misc',
    refId = '',
    folder,
    onItemProgress,
  } = opts;

  const list = [];
  for (let i = 0; i < files.length; i++) {
    let f = files[i];
    if (typeof f === 'string' && f.startsWith('data:')) {
      f = await dataUrlToFile(f);
    }
    // per-file progress callback
    const res = await uploadFile({
      file: f,
      kind,
      refId,
      folder,
      onProgress: (p) => onItemProgress?.(i, p),
    });
    list.push(res);
  }
  return list;
}

/**
 * deleteUpload(input)
 * Accepts:
 *  - "key"                       (string)
 *  - ["k1","k2"]                 (array)
 *  - URL string(s)               (we'll extract the key)
 *  - { key }, { keys }, { url }, { urls }
 */
export async function deleteUpload(input) {
  let payload = {};

  const toKey = (x) => extractKeyFromUrl(x);

  if (Array.isArray(input)) {
    payload = { keys: input.map(toKey) };
  } else if (typeof input === 'string') {
    payload = input.startsWith('http') ? { key: toKey(input) } : { key: input };
  } else if (input && typeof input === 'object') {
    if (input.keys) payload.keys = input.keys.map(toKey);
    else if (input.urls) payload.keys = input.urls.map(toKey);
    else if (input.url) payload.key = toKey(input.url);
    else if (input.key) payload.key = input.key;
  }

  // If nothing resolved, bail early
  if (!payload.key && !payload.keys?.length) {
    throw new Error('deleteUpload: no key(s) provided');
  }

  // POST to Django via /api/uploads/delete (make sure backend exposes it)
  return apiJSON('uploads/delete', payload, { method: 'POST' });
}

// Named export for convenience in callers/tests
export const extractKey = extractKeyFromUrl;