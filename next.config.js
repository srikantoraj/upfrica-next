// next.config.js
const path = require('path');

const CDN_HOST = (process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.upfrica.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*/, '');

const CLOUDFRONT_HOSTS = [
  'd3q0odwafjkyv1.cloudfront.net',
  'd26ukeum83vx3b.cloudfront.net',
];

// New: allow the raw media host (S3/R2/etc) by env, eg.
// NEXT_PUBLIC_MEDIA_HOST=upfrica-media-euw2.s3.eu-west-2.amazonaws.com
const MEDIA_HOST = (process.env.NEXT_PUBLIC_MEDIA_HOST || process.env.NEXT_PUBLIC_MEDIA_BASE || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*/, '');

const CC_GROUP = (process.env.NEXT_PUBLIC_SUPPORTED_CC || 'gh,ng,ke').replace(/,\s*/g, '|');

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  output: 'standalone',

  webpack(config) {
    config.resolve.alias = { ...(config.resolve.alias || {}), '@': path.resolve(__dirname, 'src') };
    return config;
  },

  images: {
    loader: 'custom',
    loaderFile: './src/lib/cdn-image-loader.js',
    deviceSizes: [320,480,640,750,828,1080,1200,1920,2048],
    imageSizes: [16,24,32,48,64,96,128,256,384],
    formats: ['image/avif','image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: 'https', hostname: CDN_HOST, pathname: '/**' },
      ...CLOUDFRONT_HOSTS.map((h) => ({ protocol: 'https', hostname: h, pathname: '/**' })),
      { protocol: 'http',  hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'http',  hostname: 'localhost',  port: '8000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'images.unsplash.com',    pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos',          pathname: '/**' },
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      // common raw storage hosts (keep explicit)
      { protocol: 'https', hostname: 's3.eu-west-2.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'r2.cloudflarestorage.com',    pathname: '/**' },
    ].concat(
      MEDIA_HOST ? [{ protocol: 'https', hostname: MEDIA_HOST, pathname: '/**' }] : []
    ),
  },

  async redirects() {
    return [
      { source: `/:cc(${CC_GROUP})/find-for-me`, destination: '/:cc/sourcing', permanent: true },
      { source: '/find-for-me', destination: '/sourcing', permanent: true },
    ];
  },
};

module.exports = nextConfig;