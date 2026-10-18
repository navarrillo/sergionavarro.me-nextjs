/** @type {import('next').NextConfig} */
import generateRssFeed from "./src/lib/generateTss.mjs";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,

  webpack: (config, { isServer }) => {
    if (isServer) {
      generateRssFeed();
    }
    return config;
  },
};

export default nextConfig;
