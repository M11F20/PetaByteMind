// Optional secrets that are intentionally absent from `secrets.required` in wrangler.jsonc.
interface CloudflareEnv {
  GITHUB_TOKEN?: string;
  SLACK_WEBHOOK_URL?: string;
}
