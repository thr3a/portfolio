/** @type {import('next').NextConfig} */
const urlPrefix = process.env.URL_PREFIX ? '/' + process.env.URL_PREFIX : '';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: urlPrefix,
  basePath: urlPrefix,
  trailingSlash: true,
  experimental: {
    images: {
      unoptimized: true
    }
  },
  images: {
    unoptimized: true
  }
};
module.exports = nextConfig;
