// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- file exists only after `opennextjs-cloudflare build`
// @ts-ignore
import { default as nextHandler } from '../.open-next/worker.js';
import { PRESENCE_PATH } from '../src/lib/presence-protocol';
import { pruneVitals } from '../src/server/maintenance';

export { PresenceRoom } from './presence-room';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // WebSockets bypass Next.js entirely: route handlers can't return a 101 with a webSocket.
    if (url.pathname === PRESENCE_PATH) {
      return routePresence(request, env, url);
    }

    return nextHandler.fetch(request, env, ctx);
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(pruneVitals(env.DB));
  },
} satisfies ExportedHandler<CloudflareEnv>;

function routePresence(request: Request, env: CloudflareEnv, url: URL): Promise<Response> | Response {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Upgrade Required', { status: 426 });
  }

  // Same-origin only, so third-party pages can't inflate the live count.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== url.host) {
    return new Response('Forbidden', { status: 403 });
  }

  const cf = request.cf as IncomingRequestCfProperties | undefined;
  const headers = new Headers(request.headers);
  headers.set('x-pbm-country', String(cf?.country ?? 'XX'));
  headers.set('x-pbm-colo', String(cf?.colo ?? '---'));

  const stub = env.PRESENCE.get(env.PRESENCE.idFromName('global'));
  return stub.fetch(new Request(request, { headers }));
}
