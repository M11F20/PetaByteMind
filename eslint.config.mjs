import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // App Router: fonts in the root [lang] layout load for every page, so this Pages-era rule is a false positive.
    rules: { '@next/next/no-page-custom-font': 'off' },
  },
  {
    ignores: ['.next/**', '.open-next/**', '.wrangler/**', 'node_modules/**', 'cloudflare-env.d.ts', 'playwright-report/**', 'test-results/**'],
  },
];

export default config;
