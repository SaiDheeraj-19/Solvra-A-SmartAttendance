import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    // add external domains as needed
    domains: []
  }
}

export default nextConfig
