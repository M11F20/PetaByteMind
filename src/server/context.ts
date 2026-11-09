import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { EdgeRequestInfo } from '@/lib/contracts';

export function edge() {
  return getCloudflareContext();
}

export function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
}

export function edgeRequestInfo(): EdgeRequestInfo {
  const cf = edge().cf;
  return {
    colo: String(cf?.colo ?? 'LOCAL'),
    country: String(cf?.country ?? 'XX'),
    city: cf?.city ? String(cf.city) : null,
    rttMs: typeof cf?.clientTcpRtt === 'number' && cf.clientTcpRtt > 0 ? cf.clientTcpRtt : null,
    httpProtocol: cf?.httpProtocol ? String(cf.httpProtocol) : null,
    tlsVersion: cf?.tlsVersion ? String(cf.tlsVersion) : null,
  };
}

/** Rate-limit binding wrapper. Fails open only when the binding is missing (plain `next dev`). */
export async function withinLimit(limiter: RateLimit | undefined, key: string): Promise<boolean> {
  if (!limiter) return true;
  const { success } = await limiter.limit({ key });
  return success;
}

export function json(data: unknown, init: ResponseInit & { cache?: string } = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', init.cache ?? 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}
