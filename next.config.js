const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // jsdom (pulled in by isomorphic-dompurify) cannot be bundled into the
    // Vercel serverless runtime — without this, on-demand renders of pages
    // that sanitize HTML (/blogs/[slug], /news/[slug]) crash with a 500.
    serverComponentsExternalPackages: ['isomorphic-dompurify'],
  },
  // Explicit Webpack alias so @ resolves in production (Vercel) same as in dev
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
  images: {
    remotePatterns: [
        // Cloudinary (REQUIRED)
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig