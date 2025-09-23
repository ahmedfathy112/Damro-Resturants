/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // مهم للصور المحلية
  trailingSlash: true,
  images: {
    unoptimized: true, // هذا السطر أساسي
    domains: [
      "damro-resturants.vercel.app",
      "rodgpnbaewagvfedxbqs.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rodgpnbaewagvfedxbqs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://damro-resturants.vercel.app"
      : "",
};

export default nextConfig;
