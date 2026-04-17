/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure build output for Firebase Hosting
  output: 'standalone',
  // Optimize for production
  compress: true,
  // Environment variables
  env: {
    // These will be available in the browser
    NEXT_PUBLIC_APP_NAME: 'TrafficFlow',
  },
};

module.exports = nextConfig;
