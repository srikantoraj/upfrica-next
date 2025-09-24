// app/(pages)/[cc]/head.jsx
export default function Head({ params }) {
  const cc = (params?.cc || "gh").toLowerCase(); // fine to keep, if you ever branch on cc
  const cdnHost =
    process.env.NEXT_PUBLIC_CDN_HOST || "https://cdn.upfrica.com";
  const apiHost =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    null;

  return (
    <>
      {/* Enable DNS prefetching hints globally */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />

      {/* Unsplash (hero fallbacks) */}
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />

      {/* Your CDN */}
      <link rel="dns-prefetch" href={cdnHost} />
      <link rel="preconnect" href={cdnHost} crossOrigin="" />

      {/* Optional: API origin if different and used on first paint */}
      {apiHost && !apiHost.startsWith("/") && (
        <>
          <link rel="dns-prefetch" href={apiHost} />
          <link rel="preconnect" href={apiHost} crossOrigin="" />
        </>
      )}
    </>
  );
}