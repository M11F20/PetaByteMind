// Wire protocol shared by the PresenceRoom Durable Object and the browser client.
export interface PresenceSnapshot {
  type: 'snapshot';
  total: number;
  byCountry: Array<{ country: string; count: number }>;
  colos: string[];
  at: number;
}

export interface PresencePing {
  type: 'join';
  country: string;
  colo: string;
  at: number;
}

export type PresenceMessage = PresenceSnapshot | PresencePing;

export const PRESENCE_PATH = '/api/presence';
export const PRESENCE_HEARTBEAT = { request: 'ping', response: 'pong' } as const;
