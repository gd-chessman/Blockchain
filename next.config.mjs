/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Các cấu hình khác của bạn có thể nằm ở đây
    images: {
      unoptimized: true,
    },
    experimental: {
      outputFileTracingRoot: undefined,
    },
  };
  
export default nextConfig;
  
