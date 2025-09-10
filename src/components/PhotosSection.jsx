// src/components/PhotosSection.jsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "@/components/SortableImage";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

function authHeaders() {
  const t = getCleanToken?.();
  return t ? { Authorization: `Token ${t}` } : {};
}

// Helpers
const isRealId = (v) => Number.isFinite(Number(v)) && Number(v) > 0;
const normalizeFromApi = (it) => ({
  id: Number(it.id),
  url: it.image_url || it.image || "",
  primary: !!it.is_main,
});

export default function PhotosSection({ productId, ensureProductId }) {
  // Each item: { id: number, url: string, primary: boolean }
  const [images, setImages] = useState([]);
  const [pid, setPid] = useState(productId ?? null);
  const hasProduct = useMemo(() => pid != null, [pid]);

  // Only mirror a provided productId → local pid (no auto-creation here)
  useEffect(() => {
    if (productId != null) setPid(productId);
  }, [productId]);

  // Load existing images when we have a product
  useEffect(() => {
    if (!hasProduct) return;
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(
          `${BASE_API_URL}/api/product-images/?product=${pid}`,
          { headers: { ...authHeaders() }, credentials: "include" }
        );
        if (!r.ok) return;
        const data = await r.json();
        const list = Array.isArray(data) ? data : data.results || [];
        const mapped = list.map(normalizeFromApi).filter((it) => it.url);
        if (!cancelled) setImages(mapped);
      } catch {
        /* ignore; UI can stay empty */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasProduct, pid]);

  // When a new upload succeeds we receive the saved ProductImage object OR a temp URL
  const handleUploaded = useCallback((imgObjOrUrl) => {
    // Saved object returned by backend
    if (imgObjOrUrl && typeof imgObjOrUrl === "object") {
      const url =
        imgObjOrUrl.image_url || imgObjOrUrl.image || imgObjOrUrl.url || "";
      if (!url) return;

      const realId = Number(imgObjOrUrl.id);

      setImages((imgs) => {
        // If we previously inserted a temp entry for this URL, replace its id
        const idx = imgs.findIndex((i) => i.url === url && !isRealId(i.id));
        if (idx !== -1) {
          const next = imgs.slice();
          next[idx] = {
            ...next[idx],
            id: realId,
            primary: !!imgObjOrUrl.is_main || next[idx].primary,
          };
          return next;
        }
        // Otherwise append
        return [
          ...imgs,
          {
            id: realId,
            url,
            primary: !!imgObjOrUrl.is_main,
          },
        ];
      });
      return;
    }

    // Plain URL (temp preview before server responds with an ID)
    if (typeof imgObjOrUrl === "string" && imgObjOrUrl) {
      setImages((imgs) => [
        ...imgs,
        {
          id: Date.now(), // temp id (will be replaced when real object arrives)
          url: imgObjOrUrl,
          primary: imgs.length === 0,
        },
      ]);
    }
  }, []);

  // Toggle primary using the server action (optimistic + rollback)
  async function handleSetPrimary(id) {
    const prev = images.find((i) => i.primary);
    setImages((imgs) => imgs.map((i) => ({ ...i, primary: i.id === id })));

    try {
      const r = await fetch(
        `${BASE_API_URL}/api/product-images/${id}/set_primary/`,
        {
          method: "POST",
          headers: { ...authHeaders() },
          credentials: "include",
        }
      );
      if (!r.ok) throw new Error("set_primary failed");
    } catch {
      setImages((imgs) =>
        imgs.map((i) => ({ ...i, primary: !!prev && i.id === prev.id }))
      );
    }
  }

  // Remove (server first; then update UI regardless)
  async function handleDelete(id) {
    try {
      await fetch(`${BASE_API_URL}/api/product-images/${id}/`, {
        method: "DELETE",
        headers: { ...authHeaders() },
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
    setImages((imgs) => imgs.filter((i) => i.id !== id));
  }

  // Drag → reorder + persist to backend using latest state
  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 1) compute the new order locally and set it
    let newOrder = [];
    setImages((imgs) => {
      const oldIndex = imgs.findIndex((i) => i.id === active.id);
      const newIndex = imgs.findIndex((i) => i.id === over.id);
      const moved = arrayMove(imgs, oldIndex, newIndex);
      // Only include real DB IDs; coerce to integers
      newOrder = moved
        .map((i) => Number(i.id))
        .filter((n) => Number.isFinite(n) && n > 0);
      return moved;
    });

    // 2) persist order (send multiple compatible keys)
    try {
      const productIdToUse =
        pid != null
          ? pid
          : typeof ensureProductId === "function"
          ? await ensureProductId()
          : null;
      if (productIdToUse == null || newOrder.length === 0) return;

      const res = await fetch(`${BASE_API_URL}/api/product-images/reorder/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({
          // product id (accepts either key on server)
          product: productIdToUse,
          product_id: productIdToUse,
          // ordered ids (accepts any of these keys on server)
          ordered_ids: newOrder,
          ordered_image_ids: newOrder,
          image_ids: newOrder,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Reorder failed:", res.status, txt);
      }
    } catch (e) {
      // silently ignore; UI keeps new order
      console.error("Reorder request error:", e);
    }
  }

  return (
    <section>
      <div className="rounded-md border p-3 space-y-3">
        <ImageUploader
          productId={pid ?? undefined}
          ensureProductId={async () => {
            if (pid != null) return pid;           // use existing id
            if (typeof ensureProductId === "function") {
              const id = await ensureProductId();  // lazily create draft when needed
              setPid(id);
              return id;
            }
            throw new Error("No product id available");
          }}
          onUploaded={handleUploaded}
          multiple
        />

        {images.length > 0 && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
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