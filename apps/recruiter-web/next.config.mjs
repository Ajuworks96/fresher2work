/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fresher2work/api-client', '@fresher2work/types', '@fresher2work/ui-tokens'],
  async redirects() {
    return [
      {
        source: '/talents',
        destination: '/discover',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
