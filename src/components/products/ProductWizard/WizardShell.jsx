// components/products/ProductWizard/WizardShell.jsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  List,
  Save,
  X,
} from "lucide-react";

/**
 * WizardShell
 * - Desktop: left stepper + sticky action bar
 * - Mobile: bottom-sheet step chooser + sticky action bar
 * - Progress: based on steps marked complete
 *
 * Props:
 *   productId: number
 *   steps: [{ id, title, component: (props) => JSX }]
 *   initialStepId: string
 *   onSave: (patch) => Promise<void> | void   // autosave hook passed down to steps
 */
export default function WizardShell({ productId, steps = [], initialStepId = "basics", onSave }) {
  const router = useRouter();
  const sp = useSearchParams();

  // ---- step index/id bookkeeping ----
  const stepIds = useMemo(() => steps.map((s) => s.id), [steps]);
  const validInitial = stepIds.includes(initialStepId) ? initialStepId : stepIds[0];
  const [activeId, setActiveId] = useState(validInitial);

  // read "?step=" if user changes URL manually
  useEffect(() => {
    const q = (sp.get("step") || "").toLowerCase();
    if (q && stepIds.includes(q)) setActiveId(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp?.get("step"), stepIds.join(",")]);

  // push step to URL (id preserved)
  const pushStepToUrl = useCallback(
    (nextId) => {
      if (!productId) return;
      const url = `/new-dashboard/products/editor?id=${productId}&step=${encodeURIComponent(nextId)}`;
      router.replace(url, { scroll: false });
    },
    [router, productId]
  );

  useEffect(() => {
    pushStepToUrl(activeId);
  }, [activeId, pushStepToUrl]);

  const idx = Math.max(0, stepIds.indexOf(activeId));
  const lastIdx = Math.max(0, stepIds.length - 1);

  // ---- completion tracking (simple & robust)
  //     - mark a step complete when user hits Next, or when a step calls markComplete()
  // ------------------------------------------
  const [complete, setComplete] = useState(() => new Set());
  const markComplete = useCallback((id = activeId) => {
    setComplete((prev) => new Set(prev).add(id));
  }, [activeId]);

  const completedCount = complete.size;
  const progressPct = Math.round((completedCount / Math.max(1, steps.length)) * 100);

  const goPrev = useCallback(() => {
    const p = Math.max(0, idx - 1);
    setActiveId(stepIds[p]);
  }, [idx, stepIds]);

  const goNext = useCallback(() => {
    markComplete(activeId);
    const n = Math.min(lastIdx, idx + 1);
    setActiveId(stepIds[n]);
  }, [idx, lastIdx, stepIds, activeId, markComplete]);

  // ---- bottom sheet (mobile) ----
  const [sheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  // ESC closes sheet
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSheetOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        try { onSave?.({ __ping: true }); } catch {}
      }
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, onSave]);

  const StepComp = steps[idx]?.component || (() => <div>Missing step</div>);

  // ---- tiny helpers ----
  const StepLine = ({ step, i }) => {
    const isActive = step.id === activeId;
    const isDone = complete.has(step.id);
    return (
      <button
        key={step.id}
        onClick={() => { setActiveId(step.id); setSheetOpen(false); }}
        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg
          ${isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
      >
        <div className={`w-6 h-6 rounded-full grid place-items-center text-xs font-semibold
            ${isActive ? "bg-white/15" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}>
          {i + 1}
        </div>
        <div className="flex-1 truncate">{step.title}</div>
        {isDone && <CheckCircle className={`w-4 h-4 ${isActive ? "opacity-90" : "text-emerald-600"}`} />}
      </button>
    );
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Top chrome */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="text-sm underline decoration-dotted underline-offset-2"
        >
          ← Back
        </button>

        {/* live progress */}
        <div className="w-56 hidden sm:block">
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
            Progress • {completedCount}/{steps.length}
          </div>
          <div className="h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-2 rounded bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSheetOpen(true)}
            className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <List className="w-4 h-4" /> Steps
          </button>
          <button
            onClick={() => {
              try { onSave?.({ __ping: true }); } catch {}
            }}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Save draft (⌘/Ctrl+S)"
          >
            <Save className="w-4 h-4" /> Save draft
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop stepper */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 p-3">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 px-2">
              Steps
            </div>
            <div className="mt-2 space-y-1">
              {steps.map((s, i) => <StepLine key={s.id} step={s} i={i} />)}
            </div>

            <div className="mt-3 px-2">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                Overall progress
              </div>
              <div className="h-1.5 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-1.5 rounded bg-gray-900 dark:bg-white"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Step panel */}
        <section className="flex-1 min-w-0">
          <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-700 p-4 md:p-5">
            <div className="mb-3">
              <h1 className="text-xl md:text-2xl font-semibold">
                {steps[idx]?.title || "—"}
              </h1>
              <div className="text-[11px] text-gray-500 mt-1">
                Step {idx + 1} of {steps.length}
              </div>
            </div>

            <div className="pt-1">
              <StepComp
                productId={productId}
                onSave={onSave}
                goNext={goNext}
                goPrev={goPrev}
                markComplete={() => markComplete(activeId)}
                stepId={activeId}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Sticky action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 border-t backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* progress (mobile) */}
          <div className="sm:hidden flex-1">
            <div className="h-1.5 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-1.5 rounded bg-gray-900 dark:bg-white"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {completedCount}/{steps.length} complete
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={idx === 0}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border
                ${idx === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={() => {
                try { onSave?.({ __ping: true }); } catch {}
              }}
              className="sm:hidden inline-flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Save draft"
            >
              <Save className="w-4 h-4" /> Save
            </button>

            <button
              onClick={goNext}
              disabled={idx === lastIdx}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-white
                ${idx === lastIdx ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"}`}
            >
              {idx === lastIdx ? "Done" : <>Next <ChevronRight className="w-4 h-4" /></>}
            </button>

            <button
              onClick={() => setSheetOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <List className="w-4 h-4" /> Steps
            </button>
          </div>
        </div>
      </div>

      {/* Bottom sheet: step picker (mobile + desktop accessible) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 sm:max-w-lg sm:mx-auto rounded-t-2xl bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 max-h-[88svh] overflow-hidden">
            <div className="py-3 flex justify-center">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="px-5 pb-3 flex items-center justify-between">
              <h3 id="sheet-title" className="text-base font-semibold">Jump to step</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-1 max-h-[65svh] overflow-y-auto">
              {steps.map((s, i) => <StepLine key={s.id} step={s} i={i} />)}
            </div>

            <div className="px-5 pb-5">
              <div className="text-[11px] text-gray-500 mb-1">Overall progress</div>
              <div className="h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-2 rounded bg-gradient-to-r from-emerald-400 to-emerald-600"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}