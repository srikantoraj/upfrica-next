// next.config.js
/** @type {import('next').NextConfig} */

// Prefer env so you can swap per env (staging/prod)
const CDN_HOST = (process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.upfrica.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*/, ''); // hostname only (no protocol/path)

// Explicit CF hosts still referenced by some content
const CLOUDFRONT_HOSTS = [
  'd3q0odwafjkyv1.cloudfront.net', // alias for cdn.upfrica.com
  'd26ukeum83vx3b.cloudfront.net', // legacy/static
];

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  output: 'standalone',

  images: {
    loader: 'custom',
    loaderFile: './src/lib/cdn-image-loader.js',

    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes:  [16, 24, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 1 day

    // Use remotePatterns (no wildcards in hostname; list exact hosts)
    remotePatterns: [
      // Primary CDN (env-driven)
      { protocol: 'https', hostname: CDN_HOST, pathname: '/**' },

      // Known CloudFront origins (legacy)
      ...CLOUDFRONT_HOSTS.map((h) => ({ protocol: 'https', hostname: h, pathname: '/**' })),

      // Local dev Django media
      { protocol: 'http',  hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'http',  hostname: 'localhost',  port: '8000', pathname: '/media/**' },

      // Third-party
      { protocol: 'https', hostname: 'images.unsplash.com',      pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos',            pathname: '/**' },
      { protocol: 'https', hostname: 'storage.googleapis.com',   pathname: '/**' },

      // If you sometimes bypass CloudFront and hit S3 directly, uncomment:
      // { protocol: 'https', hostname: 'upfrica-media-euw2.s3.eu-west-2.amazonaws.com', pathname: '/**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;