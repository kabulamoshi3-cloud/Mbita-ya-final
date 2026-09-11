/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only ignore ESLint during builds if necessary for deployment
  // In development, ESLint should be fixed properly
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },

  // Only ignore TypeScript errors during builds if necessary for deployment
  // In development, TypeScript errors should be fixed properly
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },

  // Tell webpack to properly resolve modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "openai"];
    }
    
    // Ensure proper module resolution
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
    
    return config;
  },

  // Allow images from any domain (for Unsplash demo images etc.)
  // In production, restrict this to specific domains for security
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },

  // Suppress specific warnings
  logging: {
    fetches: { fullUrl: false },
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
