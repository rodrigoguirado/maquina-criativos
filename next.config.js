/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "fal.run" },
      { protocol: "https", hostname: "v3.fal.media" },
    ],
  },
};
module.exports = nextConfig;
