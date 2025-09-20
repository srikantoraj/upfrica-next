//src/components/common/ImageSkeleton.jsx
"use client";

export default function ImageSkeleton({ className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-neutral-800 ${className}`}>
      <div className="absolute inset-0 animate-pulse" />
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
          animation: "shimmer 1.6s infinite",
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}