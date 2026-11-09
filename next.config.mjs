import { readFileSync } from 'node:fs';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_APP_VERSION: version },
  async redirects() {
    return [
      // Arabic-first browsers land on /ar; everyone else on /en. Non-permanent so the choice stays negotiable.
      {
        source: '/',
        has: [{ type: 'header', key: 'accept-language', value: '^ar.*' }],
        destination: '/ar',
        permanent: false,
      },
      { source: '/', destination: '/en', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

// Exposes D1/KV/rate-limit bindings to `next dev` through Miniflare.
initOpenNextCloudflareForDev();
