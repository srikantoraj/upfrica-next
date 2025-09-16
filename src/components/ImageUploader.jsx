//src/components/ImageUploader.jsx
"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/upload";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

/**
 * Props:
 *  - productId?: number
 *  - ensureProductId: () => Promise<number>   // will be called if no productId yet
 *  - onUploaded: (savedObjOrUrl: any) => void // called twice: temp URL, then saved object
 *  - multiple?: boolean
 */
export default function ImageUploader({
  productId,
  ensureProductId,
  onUploaded,
  multiple = true,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function choose() {
    inputRef.current?.click();
  }

  async function onChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setErr("");
    setBusy(true);
    try {
      // 1) we need a product id (may create a draft)
      const pid =
        productId ?? (typeof ensureProductId === "function"
          ? await ensureProductId()
          : null);
      if (!pid) throw new Error("No product id available");

      // 2) upload files to S3 → get CDN URLs
      for (const file of files) {
        // show temp card immediately
        // (PhotosSection will swap the temp item when the DB object arrives)
        const temp = URL.createObjectURL(file);
        onUploaded?.(temp);

        const { cdnUrl } = await uploadFile({
          file,
          kind: "product",
          refId: String(pid),
        });

        // 3) persist a ProductImage row pointing at the CDN URL
        //    (send multiple compatible keys; backend can pick any)
        const res = await fetch(`${BASE_API_URL}/api/product-images/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          credentials: "include",
          body: JSON.stringify({
            product: pid,
            product_id: pid,
            image_url: cdnUrl, // preferred
            image: cdnUrl,     // back-compat name
            url: cdnUrl,       // extra alias if you support it
          }),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Save image failed: ${res.status} ${msg}`);
        }

        const saved = await res.json();
        onUploaded?.(saved); // replace the temp card w/ real DB object
      }
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={choose}
        disabled={busy}
        className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800"
      >
        {busy ? "Uploading…" : "Upload images"}
      </button>
      {err && <span className="text-sm text-red-500">{err}</span>}
    </div>
  );
}