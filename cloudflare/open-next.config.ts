// Lives outside the repo root on purpose: wrangler only auto-delegates `wrangler deploy` to
// `opennextjs-cloudflare deploy` when open-next.config.* sits at the root. Keeping it here lets plain
// `wrangler deploy` run the build hook in wrangler.jsonc (build → migrate → bundle → deploy).
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Every page is prerendered (SSG); dynamic data flows through /api routes, so no R2/KV page cache is needed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
