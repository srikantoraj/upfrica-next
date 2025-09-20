// app/(pages)/[cc]/head.jsx
export default function Head({ params }) {
  const cc = (params?.cc || "gh").toLowerCase();
  const cdnHost = process.env.NEXT_PUBLIC_CDN_HOST || "https://cdn.upfrica.com";
  return (
    <>
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      <link rel="preconnect" href={cdnHost} />
    </>
  );
}