/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "cloud.appwrite.io" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "sgp.cloud.appwrite.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
module.exports = nextConfig;
