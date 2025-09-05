"use client";
import { useRef, useState } from "react";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

export default function ImageUploader({
  productId,
  ensureProductId,
  onUploaded,
  multiple = true,
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  async function resolveProductId() {
    if (productId) return productId;
    if (typeof ensureProductId === "function") {
      return await ensureProductId();
    }
    return null;
  }

  // Normalize presign payload into a standard shape
  function normalizePresign(json) {
    const uploadUrl = json?.upload?.url ?? json?.url ?? "";
    const fields = json?.upload?.fields ?? json?.fields ?? {};
    const publicUrl =
      json?.cdnUrl ??
      json?.cdn_url ??
      json?.publicUrl ??
      json?.public_url ??
      json?.publicURL ??
      json?.public ??
      "";
    return { url: uploadUrl, fields, publicUrl };
  }

  async function presignOne(file, pid) {
    const res = await fetch(`${BASE_API_URL}/api/uploads/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({
        kind: "product",
        product_id: Number(pid),
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });
    if (!res.ok) {
      let detail = "";
      try { detail = JSON.stringify(await res.json()); }
      catch { try { detail = await res.text(); } catch {} }
      throw new Error(`presign failed ${res.status} ${detail}`);
    }
    const json = await res.json();
    const { url, fields, publicUrl } = normalizePresign(json);
    if (!url || !fields) throw new Error("Unexpected presign response");
    return { url, fields, publicUrl };
  }

  async function handleFiles(files) {
    if (!files?.length) return;
    setBusy(true);
    setErr("");
    try {
      const pid = await resolveProductId();
      if (pid == null) throw new Error("Please create the product first, then upload photos.");

      for (const file of files) {
        // 1) presign
        const { url, fields, publicUrl } = await presignOne(file, pid);

        // 2) actual upload to storage
        const form = new FormData();
        Object.entries(fields).forEach(([k, v]) => form.append(k, v));
        form.append("file", file);
        const up = await fetch(url, { method: "POST", body: form });
        if (!up.ok) throw new Error("Upload failed");

        // 3) register with backend
        const imgRes = await fetch(`${BASE_API_URL}/api/product-images/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({
            product: Number(pid),
            external_url: publicUrl || undefined, // backend resolves to CDN/AS
            // is_main omitted — backend will set first image primary if needed
            alt_text: file.name || "",
          }),
        });

        if (!imgRes.ok) {
          let detail = "";
          try { detail = JSON.stringify(await imgRes.json()); }
          catch { try { detail = await imgRes.text(); } catch {} }
          throw new Error(`Image register failed: ${imgRes.status} ${detail}`);
        }

        // Send the full object to the parent (id, is_main, image_url, etc.)
        const saved = await imgRes.json();
        onUploaded?.(saved);
      }

      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setErr(e.message || "Upload error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center px-3 py-2 rounded-md border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles([...e.target.files])}
          disabled={busy}
        />
        {busy ? "Uploading…" : "Upload images"}
      </label>
      {err ? <p className="text-xs text-red-500">{err}</p> : null}
    </div>
  );
}