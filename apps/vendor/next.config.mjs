/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebookindia/ui", "@rebookindia/firebase", "@rebookindia/utils", "@rebookindia/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
};

export default nextConfig;
