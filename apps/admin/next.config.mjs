/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebookindia/ui", "@rebookindia/appwrite", "@rebookindia/utils", "@rebookindia/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
      }
    ],
  },
};

export default nextConfig;
