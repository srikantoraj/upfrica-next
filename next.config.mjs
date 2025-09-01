// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'd3q0odwafjkyv1.cloudfront.net', // ✅ Upfrica CDN
      'upfrica.com',                   // (optional) fallback
      'res.cloudinary.com',           // (optional) if used
      'images.unsplash.com',          // (optional) example
    ],
  },
};

export default nextConfig;
