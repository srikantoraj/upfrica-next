// src/components/PhotosSection.jsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "@/components/SortableImage";

// --- presign + upload helpers (via unified /api proxy) -----------------
async function presignProductUpload(productId, file) {
  const resp = await fetch("/api/uploads/presign/", {
    method: "POST",
    headers: { "content-type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({
      kind: "product",
      product_id: productId,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      content_type: file.type || "application/octet-stream",
    }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.detail || `presign failed (${resp.status})`);

  if (data?.upload?.url && data?.upload?.fields) {
    return { method: "post", url: data.upload.url, fields: data.upload.fields, publicUrl: data.cdnUrl || data.publicUrl || null };
  }
  if (Array.isArray(data?.uploads) && data.uploads[0]?.url && data.uploads[0]?.fields) {
    const u = data.uploads[0];
    return { method: "post", url: u.url, fields: u.fields, publicUrl: u.publicUrl || data.cdnUrl || null };
  }
  if (data?.upload_url) return { method: "put", url: data.upload_url, publicUrl: data.public_url || data.cdnUrl || null };
  if (data?.url && data?.fields) return { method: "post", url: data.url, fields: data.fields, publicUrl: data.publicUrl || null };
  throw new Error("Invalid presign response");
}

async function uploadWithSignature(sig, file) {
  if (sig.method === "post" && sig.url && sig.fields) {
    const form = new FormData();
    Object.entries(sig.fields).forEach(([k, v]) => form.append(k, v));
    form.append("file", file);
    const up = await fetch(sig.url, { method: "POST", body: form });
    if (!up.ok) throw new Error(`upload failed (${up.status})`);
    const loc = up.headers.get("Location");
    return sig.publicUrl || loc || sig.url.split("?")[0];
  }
  if (sig.method === "put" && sig.url) {
    const up = await fetch(sig.url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });
    if (!up.ok) throw new Error(`upload failed (${up.status})`);
    return sig.publicUrl || sig.url.split("?")[0];
  }
  throw new Error("Unsupported presign method");
}

// Helpers
const isRealId = (v) => Number.isFinite(Number(v)) && Number(v) > 0;
const normalizeFromApi = (it) => ({
  id: Number(it.id),
  url: it.image_url || it.external_url || it.image || "",
  primary: !!it.is_main,
});

export default function PhotosSection({
  productId,
  ensureProductId,
  onCountChange,  // <-- new optional callbacks
  onUploaded,
  onRemoved,
}) {
  const [images, setImages] = useState([]);
  const [pid, setPid] = useState(productId ?? null);
  const hasProduct = useMemo(() => pid != null, [pid]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // small helper to emit count safely
  const emitCount = useCallback(
    (arrOrLen) => {
      const n = Array.isArray(arrOrLen) ? arrOrLen.length : Number(arrOrLen || 0);
      onCountChange?.(n);
    },
    [onCountChange]
  );

  useEffect(() => {
    if (productId != null) setPid(productId);
  }, [productId]);

  // Load existing images (via proxy)
  useEffect(() => {
    if (!hasProduct) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/product-images/?product=${pid}`, {
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        if (!r.ok) return;
        const data = await r.json();
        const list = Array.isArray(data) ? data : data.results || [];
        const mapped = list.map(normalizeFromApi).filter((it) => it.url);
        if (!cancelled) {
          setImages(mapped);
          emitCount(mapped); // tell parent initial count
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [hasProduct, pid, emitCount]);

  // Safety net: if length changes for any reason, emit count
  useEffect(() => { emitCount(images.length); }, [images.length, emitCount]);

  const handleUploaded = useCallback((imgObjOrUrl) => {
    if (imgObjOrUrl && typeof imgObjOrUrl === "object") {
      const url = imgObjOrUrl.image_url || imgObjOrUrl.external_url || imgObjOrUrl.image || imgObjOrUrl.url || "";
      if (!url) return;
      const realId = Number(imgObjOrUrl.id);
      setImages((imgs) => {
        const idx = imgs.findIndex((i) => i.url === url && !isRealId(i.id));
        if (idx !== -1) {
          const next = imgs.slice();
          next[idx] = { ...next[idx], id: realId, primary: !!imgObjOrUrl.is_main || next[idx].primary };
          return next;
        }
        return [...imgs, { id: realId, url, primary: !!imgObjOrUrl.is_main }];
      });
      onUploaded?.();
      return;
    }
    if (typeof imgObjOrUrl === "string" && imgObjOrUrl) {
      setImages((imgs) => [...imgs, { id: Date.now(), url: imgObjOrUrl, primary: imgs.length === 0 }]);
      onUploaded?.();
    }
  }, [onUploaded]);

  // Attach using the field the serializer expects: external_url ✅
  async function attachImageUrl(productId, publicUrl) {
    const res = await fetch(`/api/product-images/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({
        product: productId,
        external_url: publicUrl,
      }),
    });

    if (res.ok) return res.json();

    // Fallback to multipart (still `external_url`)
    if (res.status === 400 || res.status === 415) {
      const fd = new FormData();
      fd.append("product", String(productId));
      fd.append("external_url", publicUrl);
      const res2 = await fetch(`/api/product-images/`, {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
        body: fd,
      });
      if (!res2.ok) {
        const txt = await res2.text().catch(() => "");
        throw new Error(`attach failed (${res2.status}) ${txt}`);
      }
      return res2.json();
    }

    const txt = await res.text().catch(() => "");
    throw new Error(`attach failed (${res.status}) ${txt}`);
  }

  // Upload flow: presign -> S3 upload -> attach (external_url)
  async function onPickImages(e) {
    setError("");
    const files = Array.from(e.target.files || []).filter((f) => /^image\//i.test(f.type));
    e.target.value = "";
    if (!files.length) return;

    try {
      setUploading(true);

      const id = pid ?? (typeof ensureProductId === "function" ? await ensureProductId() : null);
      if (id == null) throw new Error("No product id available");
      if (pid == null) setPid(id);

      // Only first temp is primary when list is empty
      const startLen = images.length;
      const tempEntries = files.slice(0, 10).map((f, idx) => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(f),
        primary: startLen === 0 && idx === 0,
        _temp: true,
      }));

      setImages((prev) => {
        const next = [...prev, ...tempEntries];
        emitCount(next);          // optimistic count
        return next;
      });

      // Upload sequentially and replace each temp when saved
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        const tempId = tempEntries[i].id;

        const sig = await presignProductUpload(id, f);
        const publicUrl = await uploadWithSignature(sig, f);

        const saved = await attachImageUrl(id, publicUrl);
        const savedUrl = saved.image_url || saved.external_url || saved.image || "";

        setImages((prev) => {
          const idx = prev.findIndex((x) => x.id === tempId);
          if (idx !== -1) {
            const wasPrimary = !!prev[idx].primary;
            const next = prev.slice();
            next[idx] = { id: Number(saved.id), url: savedUrl, primary: saved.is_main ?? wasPrimary };
            return next;
          }
          if (prev.some((x) => x.id === Number(saved.id) || x.url === savedUrl)) return prev;
          return [...prev, { id: Number(saved.id), url: savedUrl, primary: !!saved.is_main }];
        });

        onUploaded?.();           // notify parent for its own refresh logic
        try { URL.revokeObjectURL(tempEntries[i].url); } catch {}
      }
    } catch (err) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSetPrimary(id) {
    const prev = images.find((i) => i.primary);
    setImages((imgs) => imgs.map((i) => ({ ...i, primary: i.id === id })));
    try {
      const r = await fetch(`/api/product-images/${id}/set_primary/`, {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (!r.ok) throw new Error("set_primary failed");
    } catch {
      setImages((imgs) => imgs.map((i) => ({ ...i, primary: !!prev && i.id === prev.id })));
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/product-images/${id}/`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
    } catch {}
    setImages((prev) => {
      const next = prev.filter((i) => i.id !== id);
      emitCount(next);            // update count immediately
      return next;
    });
    onRemoved?.();                // notify parent
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let newOrder = [];
    setImages((imgs) => {
      const oldIndex = imgs.findIndex((i) => i.id === active.id);
      const newIndex = imgs.findIndex((i) => i.id === over.id);
      const moved = arrayMove(imgs, oldIndex, newIndex);
      newOrder = moved.map((i) => Number(i.id)).filter((n) => Number.isFinite(n) && n > 0);
      return moved;
    });

    try {
      const productIdToUse =
        pid != null ? pid : typeof ensureProductId === "function" ? await ensureProductId() : null;
      if (productIdToUse == null || newOrder.length === 0) return;

      const res = await fetch(`/api/product-images/reorder/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ product: productIdToUse, ordered_ids: newOrder }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Reorder failed:", res.status, txt);
      }
    } catch (e) {
      console.error("Reorder request error:", e);
    }
  }

  return (
    <section>
      <div className="rounded-md border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Upload images</label>
          <button
            type="button"
            className="px-3 py-1.5 text-sm rounded-md border"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Choose"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPickImages}
          />
        </div>

        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

        {images.length > 0 && (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img) => (
                  <div key={img.id} data-photo-id={img.id}>
                    <SortableImage
                      id={img.id}
                      url={img.url}
                      isPrimary={img.primary}
                      onSetPrimary={handleSetPrimary}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}