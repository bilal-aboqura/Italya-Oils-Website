import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker — copies only the minimal files needed to run
  output: "standalone",

  // Enable Gzip/Brotli compression at the Node.js server level
  compress: true,

  // Don't advertise the framework (minor security + cleaner headers)
  poweredByHeader: false,

  // Suppress verbose fetch logs in production
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "elitalyea.com" },
      { protocol: "https", hostname: "www.elitalyea.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    // Serve WebP/AVIF automatically — smaller files, faster loads
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  // Experimental: faster builds
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
