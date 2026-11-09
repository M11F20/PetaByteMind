import 'server-only';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// Cloudflare's documented always-pass secret, used only outside production.
const DEV_SECRET = '1x0000000000000000000000000000000AA';

export type TurnstileResult = { ok: true } | { ok: false; reason: 'misconfigured' | 'rejected' | 'unreachable' };

export async function verifyTurnstile(token: string, ip: string, secret: string | undefined): Promise<TurnstileResult> {
  const key = secret || (process.env.NODE_ENV !== 'production' ? DEV_SECRET : undefined);
  if (!key) return { ok: false, reason: 'misconfigured' };

  const body = new FormData();
  body.append('secret', key);
  body.append('response', token);
  if (ip !== 'local') body.append('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as { success: boolean };
    return data.success ? { ok: true } : { ok: false, reason: 'rejected' };
  } catch {
    return { ok: false, reason: 'unreachable' };
  }
}
