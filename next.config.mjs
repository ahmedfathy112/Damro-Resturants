/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rodgpnbaewagvfedxbqs.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },

      {
        protocol: "https",
        hostname: "damro-resturants.vercel.app",
        port: "",
        pathname: "/Images/**",
      },
    ],
    unoptimized: true,
  },

  trailingSlash: true,
  // Webpack config for backward compatibility
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/i,
      type: "asset/resource",
    });
    return config;
  },
  // Turbopack config (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
