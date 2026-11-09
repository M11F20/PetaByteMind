#!/usr/bin/env bash
# Wrangler custom build hook (wrangler.jsonc → build.command). Runs before every `wrangler deploy`,
# `wrangler versions upload`, and `wrangler dev`, so Workers Builds works with its default commands.
set -euo pipefail

OUT=.open-next
STAMP="$OUT/.build-sha"
SHA="${WORKERS_CI_COMMIT_SHA:-}"
PROD_BRANCH="${PROD_BRANCH:-main}"

needs_build() {
  [[ "${PBM_FORCE_BUILD:-}" == "1" ]] && return 0
  [[ -f "$OUT/worker.js" ]] || return 0
  # On Workers Builds, rebuild unless this exact commit was already built (e.g. by a separate build command).
  [[ "${WORKERS_CI:-}" == "1" && "$(cat "$STAMP" 2>/dev/null)" != "$SHA" ]] && return 0
  return 1
}

if needs_build; then
  npx opennextjs-cloudflare build --openNextConfigPath cloudflare/open-next.config.ts
  [[ -n "$SHA" ]] && echo "$SHA" > "$STAMP"
else
  echo "▶ Reusing existing $OUT build (PBM_FORCE_BUILD=1 to rebuild)"
fi

# Production schema migrations, before the new code goes live. Preview branches never migrate the shared DB.
if [[ "${WORKERS_CI:-}" == "1" && "${WORKERS_CI_BRANCH:-}" == "$PROD_BRANCH" ]]; then
  npx wrangler d1 info petabytemind >/dev/null 2>&1 \
    || npx wrangler d1 create petabytemind --location eeur --no-update-config
  npx wrangler d1 migrations apply DB --remote
fi
