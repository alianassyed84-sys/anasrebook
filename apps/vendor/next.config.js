/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rebookindia/ui", "@rebookindia/firebase", "@rebookindia/utils", "@rebookindia/types"],
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;
