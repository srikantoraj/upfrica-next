'use client';

export default function ShopProfileSkeleton() {
  return (
    <div className="relative w-full animate-pulse">
      {/* Background skeleton */}
      <div className="w-full h-[240px] md:h-[320px] bg-gray-200 rounded-lg" />

      {/* Overlay Card Skeleton */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col items-center text-center gap-3 mt-4 md:mt-0">
          
          {/* Logo Circle */}
          <div className="h-20 w-20 rounded-full bg-gray-300" />

          {/* Shop Name */}
          <div className="h-6 w-40 bg-gray-300 rounded" />

          {/* Shop Type */}
          <div className="h-4 w-24 bg-gray-200 rounded" />

          {/* Follow / Share Skeleton */}
          <div className="flex items-center gap-4 mt-2">
            <div className="h-8 w-24 bg-gray-300 rounded-full" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>

          {/* Info line */}
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

        </div>
      </div>
    </div>
  );
}