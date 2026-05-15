/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "pdf-parse"],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
