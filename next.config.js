/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["www.zyklotron-ag.de"],
  },
};

module.exports = nextConfig;
