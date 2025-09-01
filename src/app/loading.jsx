// src/app/loading.js
export default function Loading() {
  return (
    <>
      {/* Accessible status for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading…
      </div>

      {/* Minimal top progress bar (pure CSS) */}
      <div className="fixed inset-x-0 top-0 z-[1000] h-1 bg-black/10">
        <div className="h-full bg-[var(--brand-600)] upfrica-loading-bar" />
      </div>

      <style>{`
        @keyframes upfrica-loading {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .upfrica-loading-bar {
          width: 30%;
          animation: upfrica-loading 1.2s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
