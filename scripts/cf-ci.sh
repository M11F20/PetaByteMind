#!/usr/bin/env bash
# Optional explicit entrypoint (`npm run cf:ci`). Equivalent to Workers Builds' default commands:
# the build + migrations happen in the wrangler build hook (scripts/build-worker.sh).
set -euo pipefail

BRANCH="${WORKERS_CI_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo local)}"
if [[ "$BRANCH" == "${PROD_BRANCH:-main}" ]]; then
  npx wrangler deploy
else
  ALIAS="$(echo "$BRANCH" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9-]+/-/g; s/^-+|-+$//g' | cut -c1-40)"
  npx wrangler versions upload --preview-alias "${ALIAS:-preview}"
fi
