/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 不设置 output: 'export'，使用 Next.js 框架模式
  // EdgeOne Pages 框架预设=Next + 输出目录=.next，支持 Cloud Functions / SSR
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
