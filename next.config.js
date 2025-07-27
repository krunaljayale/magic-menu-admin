/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // wildcards for all hosts
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint check during build
  },
};

module.exports = nextConfig;
