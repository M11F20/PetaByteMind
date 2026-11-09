// Collects Worker secrets from the CI environment into a JSON file for `wrangler --secrets-file`.
// Empty values are skipped so optional secrets never overwrite existing ones with blanks.
import { writeFileSync } from 'node:fs';

const NAMES = ['TURNSTILE_SECRET_KEY', 'SLACK_WEBHOOK_URL', 'GITHUB_TOKEN'];
const out = process.argv[2] ?? '.secrets.json';
const secrets = Object.fromEntries(NAMES.filter((n) => process.env[n]).map((n) => [n, process.env[n]]));

writeFileSync(out, JSON.stringify(secrets), { mode: 0o600 });
console.log(`Wrote ${Object.keys(secrets).length} secret(s): ${Object.keys(secrets).join(', ') || 'none'}`);
