const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts',
);
const semi = require('@douyinfe/semi-next').default({
  /* the extension options */
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['i.postimg.cc'],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        'supports-color': 'supports-color',
      });
    }
    return config;
  },
};

module.exports = withNextIntl(semi(nextConfig));
