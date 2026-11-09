// Runtime secrets, set in the dashboard (Worker → Settings → Variables & Secrets) or `wrangler secret put`.
// Optional by design: every consumer degrades gracefully when one is missing.
interface CloudflareEnv {
  TURNSTILE_SECRET_KEY?: string;
  SLACK_WEBHOOK_URL?: string;
  GITHUB_TOKEN?: string;
}
