if (typeof global !== 'undefined' && 'localStorage' in global) {
  // @ts-ignore
  delete global.localStorage;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
