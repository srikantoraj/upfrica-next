//src/components/SortableImage.jsx ✅
"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableImage({
  id,
  url,
  isPrimary = false,
  onSetPrimary,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-lg overflow-hidden border bg-white dark:bg-gray-900"
    >
      {/* Top-right controls */}
      <div className="absolute right-2 top-2 z-10 flex gap-2">
        <button
          title="Drag"
          {...attributes}
          {...listeners}
          className="rounded bg-white/80 dark:bg-gray-800/70 px-2 py-1 text-xs shadow"
        >
          ⠿
        </button>
        <button
          title={isPrimary ? "Primary" : "Set primary"}
          onClick={() => onSetPrimary?.(id)}
          className={`rounded px-2 py-1 text-xs shadow ${
            isPrimary
              ? "bg-yellow-400/90 text-black"
              : "bg-white/80 dark:bg-gray-800/70"
          }`}
        >
          ★
        </button>
        <button
          title="Delete"
          onClick={() => onDelete?.(id)}
          className="rounded bg-white/80 dark:bg-gray-800/70 px-2 py-1 text-xs shadow"
        >
          🗑
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square relative">
        <Image
          src={url}
          alt=""
          fill
          sizes="240px"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Footer */}
      <div className="p-2 text-[11px] text-gray-600 dark:text-gray-400">
        <span className="truncate block">{isPrimary ? "Primary" : "\u00A0"}</span>
      </div>
    </div>
  );
}