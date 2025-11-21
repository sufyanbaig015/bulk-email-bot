/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For App Router, body size limits are handled in route handlers
  // No need for api.bodyParser config in Next.js 14
}

module.exports = nextConfig

