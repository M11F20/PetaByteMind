#!/usr/bin/env bash
# Boots the real Worker bundle (OpenNext + D1 + KV + DO + rate limits) under wrangler dev and probes it.
# Usage: scripts/smoke.sh   (expects `npm run cf:build` to have run)
set -euo pipefail

PORT="${PORT:-8787}"
BASE="http://127.0.0.1:${PORT}"
LOG="$(mktemp)"

[[ -f .dev.vars ]] || cp .dev.vars.example .dev.vars
npx wrangler d1 migrations apply DB --local >/dev/null
npx wrangler dev --port "$PORT" --ip 127.0.0.1 >"$LOG" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do curl -fs -o /dev/null "$BASE/en" && break; sleep 2; done

fail() { echo "✘ $1"; echo "--- wrangler log"; tail -40 "$LOG"; exit 1; }
expect() { # expect <name> <expected-status> <curl args...>
  local name="$1" want="$2"; shift 2
  local got; got="$(curl -s -o /dev/null -w '%{http_code}' "$@")"
  [[ "$got" == "$want" ]] && echo "✔ $name ($got)" || fail "$name: expected $want, got $got"
}

expect "GET /en" 200 "$BASE/en"
expect "GET /ar" 200 "$BASE/ar"
expect "GET / → redirect" 307 "$BASE/"
expect "GET /sitemap.xml" 200 "$BASE/sitemap.xml"
expect "GET /api/telemetry" 200 "$BASE/api/telemetry"
expect "GET /api/members" 200 "$BASE/api/members"
expect "POST /api/telemetry (valid beacon)" 204 -X POST -d '[{"name":"LCP","value":1200,"rating":"good","path":"/en"}]' "$BASE/api/telemetry"
expect "POST /api/telemetry (invalid beacon)" 400 -X POST -d '[{"name":"NOPE","value":-1}]' "$BASE/api/telemetry"
expect "POST /api/intake (invalid)" 400 -X POST -H 'content-type: application/json' -d '{"handle":"bad handle"}' "$BASE/api/intake"
expect "GET /api/presence (no upgrade)" 426 "$BASE/api/presence"

curl -s "$BASE/ar" | grep -q '<html lang="ar" dir="rtl"' && echo "✔ /ar server-rendered RTL" || fail "/ar missing lang/dir"

node --input-type=module -e "
const ws = new WebSocket('ws://127.0.0.1:${PORT}/api/presence');
const t = setTimeout(() => { console.error('✘ presence: no snapshot'); process.exit(1); }, 8000);
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.type === 'snapshot' && m.total >= 1) { console.log('✔ presence DO snapshot total=' + m.total); clearTimeout(t); ws.close(); process.exit(0); } };
ws.onerror = () => { console.error('✘ presence socket error'); process.exit(1); };
"

echo "All smoke checks passed."
