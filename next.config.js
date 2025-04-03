/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Disable source maps in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'eval';
    }
    return config;
  }
};

module.exports = nextConfig; 