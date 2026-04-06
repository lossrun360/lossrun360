/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  images: {
    domains: ['lossrun360.com'],
  },
}

module.exports = nextConfig
