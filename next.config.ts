import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
