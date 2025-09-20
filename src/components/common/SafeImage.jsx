
// src/components/common/SafeImage.jsx
"use client";

import React from "react";
import Image from "next/image";
import ImageSkeleton from "@/components/common/ImageSkeleton";

/**
 * Fix “cdn/https%3A/...” double-proxy shapes if they ever slip in.
 * (Same as the version that worked inside your slider.)
 */
function cleanSrc(u) {
  if (!u) return "";
  try {
    const url = new URL(u);
    const p = url.pathname.replace(/^\/+/, "");
    if (/^(https|http)%3A/i.test(p)) {
      const decoded = decodeURIComponent(p);
      const fixed = decoded
        .replace(/^https:\//, "https://")
        .replace(/^http:\//, "http://");
      if (/^https?:\/\//i.test(fixed)) return fixed;
    }
  } catch {
    // not a URL; ignore
  }
  return u;
}

export function fixDisplayUrl(u) {
  return cleanSrc(u || "");
}

export default function SafeImage({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  priority,
  fill,
  style,
  quality = 80,
  onLoad,
  loading,
}) {
  const [imgSrc, setImgSrc] = React.useState(fixDisplayUrl(src));
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(fixDisplayUrl(src));
    setLoaded(false);
    setErrored(false);
  }, [src]);

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`}>
      {!loaded && <ImageSkeleton className={fill ? "absolute inset-0" : ""} />}

      <Image
        src={!errored ? imgSrc : (process.env.NEXT_PUBLIC_FALLBACK_IMAGE || "/placeholder.png")}
        alt={alt || "Image"}
        className={className}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        fill={fill}
        quality={quality}
        loading={loading}
        unoptimized                 // ← ALWAYS bypass the Next loader (matches the working version)
        style={{ ...(style || {}), opacity: loaded ? 1 : 0, transition: "opacity .2s ease" }}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e?.currentTarget);
        }}
        onError={() => {
          setErrored(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}

