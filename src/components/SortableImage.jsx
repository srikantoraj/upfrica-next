//src/components/SortableImage.jsx ✅
// (draggable wrapper with “Set as primary” and “Delete”).
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Star } from "lucide-react";

export default function SortableImage({ id, url, isPrimary, onSetPrimary, onDelete }) {
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
      {...attributes}
      {...listeners}
      className="relative group rounded-md border overflow-hidden bg-gray-50 dark:bg-gray-800 touch-pan-y"
    >
      <img
        src={url}
        alt="product"
        className="h-24 w-24 sm:h-28 sm:w-28 object-cover select-none pointer-events-none"
        draggable={false}
      />

      {isPrimary && (
        <div className="absolute top-1 left-1 bg-yellow-400 text-[10px] px-1.5 py-0.5 rounded shadow">
          Primary
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/40 transition">
        {!isPrimary && (
          <button
            type="button"
            onClick={() => onSetPrimary(id)}
            className="px-2 py-1 bg-white text-xs rounded shadow flex items-center gap-1"
          >
            <Star size={14} />
            Primary
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="px-2 py-1 bg-red-600 text-white text-xs rounded shadow flex items-center gap-1"
        >
          <X size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}