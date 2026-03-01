/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Work → PPH (all routes except hopper)
      {
        source: '/workshop/work/hopper',
        destination: '/workshop/operation-hot-dog/hopper',
        permanent: false,
      },
      {
        source: '/workshop/work',
        destination: '/workshop/pph',
        permanent: false,
      },
      {
        source: '/workshop/work/:path*',
        destination: '/workshop/pph/:path*',
        permanent: false,
      },
    ]
  },
}
module.exports = nextConfig
