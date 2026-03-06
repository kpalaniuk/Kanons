const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
  async redirects() {
    return [
      {
        source: '/workshop/work/hopper',
        destination: '/workshop/operation-hot-dog/hopper',
        permanent: false,
      },
      // RoomForge lives at /workshop/work/roomforge — no redirect
      {
        source: '/workshop/work',
        destination: '/workshop/pph',
        permanent: false,
      },
      {
        source: '/workshop/work/((?!roomforge).*)',
        destination: '/workshop/pph/$1',
        permanent: false,
      },
    ]
  },
}
module.exports = nextConfig
