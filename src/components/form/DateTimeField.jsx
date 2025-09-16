//src/components/form/DateTimeField.jsx
"use client";

import React, { useMemo } from "react";
import clsx from "clsx";

// ---- tiny utils ----
const pad = (n) => String(n).padStart(2, "0");
const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeInput = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

function addDays(base, days) {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * DateTimeField
 *
 * Props:
 * - mode: "date" | "datetime" (default "date")
 * - label?: string
 * - value: string | null  (ISO "YYYY-MM-DD" when mode="date"; ISO-like when "datetime")
 * - onChange(v:string): void   // emits "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
 * - showHelpers?: boolean      // show quick helpers row
 * - className?: string
 */
export default function DateTimeField({
  mode = "date",
  label,
  value,
  onChange,
  showHelpers = true,
  className,
}) {
  const isDateTime = mode === "datetime";

  const dateVal = useMemo(() => {
    if (!value) return "";
    if (isDateTime) return (value.split("T")[0] || "");
    return value; // already YYYY-MM-DD
  }, [value, isDateTime]);

  const timeVal = useMemo(() => {
    if (!isDateTime) return "";
    if (!value) return "";
    const t = value.split("T")[1] || "";
    return t.slice(0, 5); // HH:mm
  }, [value, isDateTime]);

  function setDatePart(dStr) {
    if (!isDateTime) return onChange?.(dStr || "");
    const now = new Date();
    const hhmm = timeVal || toTimeInput(now);
    onChange?.(dStr ? `${dStr}T${hhmm}` : "");
  }

  function setTimePart(tStr) {
    if (!isDateTime) return;
    const d = dateVal || toDateInput(new Date());
    onChange?.(`${d}T${tStr || "00:00"}`);
  }

  function setToday() {
    const d = toDateInput(new Date());
    setDatePart(d);
  }

  function setRelative(days) {
    const d = toDateInput(addDays(new Date(), days));
    setDatePart(d);
  }

  function setNow() {
    if (!isDateTime) return;
    const n = new Date();
    setTimePart(toTimeInput(n));
    setDatePart(toDateInput(n));
  }

  return (
    <div className={clsx("w-full", className)}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}

      <div className={clsx("grid", isDateTime ? "grid-cols-2 gap-3" : "grid-cols-1")}>
        {/* Date */}
        <div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              value={dateVal}
              onChange={(e) => setDatePart(e.target.value)}
              aria-label="Select date"
            />
            <button
              type="button"
              onClick={setToday}
              className="text-sm text-blue-600 hover:underline"
              aria-label="Set date to today"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setRelative(1)}
              className="text-sm text-blue-600 hover:underline"
              aria-label="Set date to tomorrow"
            >
              Tomorrow
            </button>
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            <button
              type="button"
              onClick={() => setRelative(-1)}
              className="hover:underline"
              aria-label="Set date to yesterday"
            >
              Yesterday
            </button>
          </div>
        </div>

        {/* Time */}
        {isDateTime && (
          <div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                value={timeVal}
                onChange={(e) => setTimePart(e.target.value)}
                aria-label="Select time"
              />
              <button
                type="button"
                onClick={setNow}
                className="text-sm text-blue-600 hover:underline"
                aria-label="Set time to now"
              >
                Now
              </button>
            </div>
          </div>
        )}
      </div>

      {showHelpers && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-neutral-500">Quick helpers:</span>

          {isDateTime ? (
            <button
              type="button"
              className="rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2.5 py-1"
              onClick={setNow}
            >
              Start now
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2.5 py-1"
              onClick={setToday}
            >
              Today
            </button>
          )}

          <span className="text-neutral-500 ml-1">End in:</span>
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => setDatePart(toDateInput(addDays(new Date(), d)))}
              aria-label={`Set date to ${d} days from now`}
            >
              {d}d
            </button>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-neutral-500">
        Times use your local timezone. You can type or pick values; quick links help you fill fast.
      </p>
    </div>
  );
}