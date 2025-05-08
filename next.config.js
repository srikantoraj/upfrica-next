// module.exports = {
//   images: {
//     domains: ['d3q0odwafjkyv1.cloudfront.net', 'd26ukeum83vx3b.cloudfront.net','d3f8uk6yuqjl48.cloudfront.net'],
//   },
// };


// next.config.js
module.exports = {
  images: {

    domains: [
      '**.cloudfront.net',
      
    ],
    // If you’d prefer to allow *any* *.cloudfront.net, use remotePatterns:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // (Optional) If you want Next.js itself to add CORS headers
  // on _its_ routes (API routes, pages, etc.), you can do:
  async headers() {
    return [
      {
        // apply these headers to all routes in your Next.js app
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
