import { DurableObject } from 'cloudflare:workers';
import { PRESENCE_HEARTBEAT, type PresenceMessage, type PresenceSnapshot } from '../src/lib/presence-protocol';

interface Attachment {
  country: string;
  colo: string;
  joinedAt: number;
}

/**
 * Single global room. Hibernatable WebSockets: idle sockets cost nothing, and heartbeats are answered by the
 * runtime without waking the object. Only country + Cloudflare colo are kept — never IPs.
 */
export class PresenceRoom extends DurableObject<CloudflareEnv> {
  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
    ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair(PRESENCE_HEARTBEAT.request, PRESENCE_HEARTBEAT.response),
    );
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 426 });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    const attachment: Attachment = {
      country: sanitizeCode(request.headers.get('x-pbm-country'), 'XX'),
      colo: sanitizeCode(request.headers.get('x-pbm-colo'), '---'),
      joinedAt: Date.now(),
    };

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(attachment);

    this.broadcast({ type: 'join', country: attachment.country, colo: attachment.colo, at: attachment.joinedAt });
    this.broadcast(this.snapshot());

    return new Response(null, { status: 101, webSocket: client });
  }

  // Clients are receive-only; anything other than the auto-answered heartbeat is ignored.
  async webSocketMessage(): Promise<void> {}

  async webSocketClose(ws: WebSocket, code: number, reason: string): Promise<void> {
    this.release(ws, code, reason);
  }

  async webSocketError(ws: WebSocket): Promise<void> {
    this.release(ws, 1011, 'error');
  }

  private release(ws: WebSocket, code: number, reason: string) {
    try {
      ws.close(code === 1005 ? 1000 : code, reason);
    } catch {
      // Already closed by the runtime.
    }
    this.broadcast(this.snapshot(ws));
  }

  private openSockets(exclude?: WebSocket): WebSocket[] {
    return this.ctx.getWebSockets().filter((s) => s !== exclude && s.readyState === WebSocket.OPEN);
  }

  private snapshot(exclude?: WebSocket): PresenceSnapshot {
    const counts = new Map<string, number>();
    const colos = new Set<string>();
    const sockets = this.openSockets(exclude);

    for (const ws of sockets) {
      const a = ws.deserializeAttachment() as Attachment | null;
      if (!a) continue;
      counts.set(a.country, (counts.get(a.country) ?? 0) + 1);
      colos.add(a.colo);
    }

    return {
      type: 'snapshot',
      total: sockets.length,
      byCountry: [...counts.entries()]
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      colos: [...colos].sort(),
      at: Date.now(),
    };
  }

  private broadcast(message: PresenceMessage) {
    const payload = JSON.stringify(message);
    for (const ws of this.openSockets()) {
      try {
        ws.send(payload);
      } catch {
        // Socket raced into CLOSING; its close handler will rebroadcast.
      }
    }
  }
}

function sanitizeCode(value: string | null, fallback: string): string {
  return value && /^[A-Z0-9]{2,4}$/.test(value) ? value : fallback;
}
