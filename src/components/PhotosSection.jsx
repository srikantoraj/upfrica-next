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

/**
 * PhotosSection
 * Props:
 *  - productId?: number
 *  - ensureProductId?: () => Promise<number>
 */
export default function PhotosSection({ productId, ensureProductId }) {
  // Each item: { id: number, url: string, primary: boolean }
  const [images, setImages] = useState([]);
  const [pid, setPid] = useState(productId ?? null);
  const hasProduct = useMemo(() => pid != null, [pid]);

  // Resolve a product id once (if we weren't given one)
  useEffect(() => {
    let cancelled = false;

    async function ensurePidOnce() {
      if (productId != null) {
        setPid(productId);
        return;
      }
      if (typeof ensureProductId === "function") {
        const id = await ensureProductId();
        if (!cancelled) setPid(id);
      }
    }
    if (pid == null) ensurePidOnce();

    return () => {
      cancelled = true;
    };
  }, [productId, ensureProductId, pid]);

  // Load existing images
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
        const mapped = list
          .map((it) => ({
            id: it.id,
            url: it.image_url || it.image || "",
            primary: !!it.is_main,
          }))
          .filter((it) => it.url);
        if (!cancelled) setImages(mapped);
      } catch (e) {
        // swallow; UI can stay empty
        // console.warn("load images failed", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasProduct, pid]);

  // When a new upload succeeds we receive the saved ProductImage object
  const handleUploaded = useCallback((imgObjOrUrl) => {
    // Accept either a full object or a naked URL
    if (imgObjOrUrl && typeof imgObjOrUrl === "object") {
      const url =
        imgObjOrUrl.image_url || imgObjOrUrl.image || imgObjOrUrl.url || "";
      if (!url) return;
      setImages((imgs) => [
        ...imgs,
        {
          id: imgObjOrUrl.id,
          url,
          primary: !!imgObjOrUrl.is_main,
        },
      ]);
    } else if (typeof imgObjOrUrl === "string" && imgObjOrUrl) {
      // No ID available — append a temp client id so the preview works
      setImages((imgs) => [
        ...imgs,
        { id: Date.now(), url: imgObjOrUrl, primary: imgs.length === 0 },
      ]);
    }
  }, []);

  // Toggle primary using the server action
  async function handleSetPrimary(id) {
    // Optimistic
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
      // Roll back on error
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
      // ignore
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
      newOrder = moved.map((i) => i.id);
      return moved;
    });

    // 2) persist order
    try {
      const productIdToUse =
        pid != null ? pid : typeof ensureProductId === "function"
          ? await ensureProductId()
          : null;
      if (productIdToUse == null) return;

      await fetch(`${BASE_API_URL}/api/product-images/reorder/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({
          product_id: productIdToUse,
          ordered_image_ids: newOrder,
        }),
      });
    } catch {
      // silently ignore; UI keeps new order
    }
  }

  return (
    <section>
      <div className="rounded-md border p-3 space-y-3">
        <ImageUploader
          productId={pid ?? undefined}
          ensureProductId={async () => {
            if (pid != null) return pid;
            if (typeof ensureProductId === "function") {
              const id = await ensureProductId();
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