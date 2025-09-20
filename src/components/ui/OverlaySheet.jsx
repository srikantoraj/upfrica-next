"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function OverlayPageFrame({
  title,
  right,          // optional header right node (e.g., autosave pill)
  footer,         // optional sticky footer (inside the sheet)
  children,
  onClose,
  className = "",
  maxWidth = "max-w-4xl", // tweak per page if needed
}) {
  const sheetRef = useRef(null);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on outside click (backdrop)
  function onBackdrop(e) {
    if (!sheetRef.current) return;
    if (!sheetRef.current.contains(e.target)) onClose?.();
  }

  return (
    <div className="fixed inset-0 z-[1200]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onMouseDown={onBackdrop}
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 top-[3svh] sm:top-[6svh] px-2 sm:px-6 pb-4">
        <div
          ref={sheetRef}
          className={[
            "mx-auto w-full rounded-2xl border border-gray-200 dark:border-gray-800",
            "bg-white dark:bg-gray-900 shadow-2xl",
            maxWidth,
            className,
          ].join(" ")}
          style={{ maxHeight: "94svh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700 sm:hidden" />
              <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
            </div>
            <div className="flex items-center gap-3">
              {right ? <div className="hidden sm:block">{right}</div> : null}
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex flex-col h-[calc(94svh-52px)] sm:h-[calc(94svh-57px)]">
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
              {children}
            </div>

            {/* Sticky footer (inside the sheet) */}
            {footer ? (
              <div
                className="px-3 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur"
                style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}