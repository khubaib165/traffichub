/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  output: "export",
  experimental: {
    optimizePackageImports: ["recharts", "lucide-react"],
  },
};

module.exports = nextConfig;
