#!/usr/bin/env bash
# Single entrypoint for Cloudflare Workers Builds (production AND preview triggers).
# Dashboard → Worker → Settings → Build:
#   Build command:                          (leave empty)
#   Deploy command:                         npm run cf:ci
#   Non-production branch deploy command:   npm run cf:ci
set -euo pipefail

PROD_BRANCH="${PROD_BRANCH:-main}"
BRANCH="${WORKERS_CI_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo local)}"
SHA="${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null || echo unknown)}"
# No spaces: `opennextjs-cloudflare deploy -- <args>` re-splits passthrough args on whitespace.
MESSAGE="${BRANCH}@${SHA:0:7}"

echo "▶ Branch: ${BRANCH} (production: ${PROD_BRANCH})"
npx opennextjs-cloudflare build

if [[ "$BRANCH" == "$PROD_BRANCH" ]]; then
  # First deploy auto-provisions D1, so the pre-deploy migration may legitimately find no database yet.
  npx wrangler d1 migrations apply DB --remote || echo "⚠ D1 not provisioned yet — migrating after deploy."
  npx opennextjs-cloudflare deploy -- --message "$MESSAGE"
  npx wrangler d1 migrations apply DB --remote
else
  # Preview: uploads a non-promoted version. Production traffic is never touched from a branch.
  ALIAS="$(echo "$BRANCH" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9-]+/-/g; s/^-+|-+$//g' | cut -c1-40)"
  npx wrangler versions upload --preview-alias "${ALIAS:-preview}" --message "$MESSAGE"
fi
