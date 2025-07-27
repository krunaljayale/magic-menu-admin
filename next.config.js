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
};

module.exports = nextConfig; // ✅ Use CommonJS export
