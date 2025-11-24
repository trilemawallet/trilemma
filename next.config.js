/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    turbo: {
      resolveAlias: {
        // Avoid native bindings when using Turbopack (dev --turbo / prod).
        'sodium-native': 'sodium-javascript',
      },
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    // Force the pure JS sodium implementation to avoid native bindings in both server and client bundles.
    config.resolve.alias['sodium-native'] = 'sodium-javascript';
    return config;
  },
};

module.exports = nextConfig;
