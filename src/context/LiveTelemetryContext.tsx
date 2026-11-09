'use client';

import React, { createContext, useContext, useEffect, useEffectEvent, useState } from 'react';
import { PRESENCE_HEARTBEAT, PRESENCE_PATH, type PresenceMessage, type PresencePing, type PresenceSnapshot } from '@/lib/presence-protocol';
import type { BuildStatus } from '@/lib/build-status';
import type { TelemetryResponse } from '@/lib/contracts';

export type LinkState = 'connecting' | 'live' | 'offline';

interface LiveTelemetryValue {
  link: LinkState;
  presence: PresenceSnapshot | null;
  pings: PresencePing[];
  telemetry: TelemetryResponse | null;
  build: BuildStatus | null;
}

const LiveTelemetryContext = createContext<LiveTelemetryValue | null>(null);

const MAX_PINGS = 8;
const MAX_RECONNECT_FAILURES = 6;

export function LiveTelemetryProvider({ children }: { children: React.ReactNode }) {
  const [link, setLink] = useState<LinkState>('connecting');
  const [presence, setPresence] = useState<PresenceSnapshot | null>(null);
  const [pings, setPings] = useState<PresencePing[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryResponse | null>(null);
  const [build, setBuild] = useState<BuildStatus | null>(null);

  usePresenceSocket({
    onState: setLink,
    onMessage: (msg) => {
      if (msg.type === 'snapshot') setPresence(msg);
      else setPings((prev) => [msg, ...prev].slice(0, MAX_PINGS));
    },
  });
  usePolling<TelemetryResponse>('/api/telemetry', 60_000, setTelemetry);
  usePolling<BuildStatus>('/api/github', 120_000, setBuild);

  return (
    <LiveTelemetryContext.Provider value={{ link, presence, pings, telemetry, build }}>
      {children}
    </LiveTelemetryContext.Provider>
  );
}

export function useLiveTelemetry() {
  const ctx = useContext(LiveTelemetryContext);
  if (!ctx) throw new Error('useLiveTelemetry must be used within a LiveTelemetryProvider');
  return ctx;
}

function usePolling<T>(url: string, intervalMs: number, onData: (data: T) => void) {
  const deliver = useEffectEvent(onData);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState === 'hidden') return;
      try {
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (res.ok && !cancelled) deliver((await res.json()) as T);
      } catch {
        // Keep last good value; the UI renders "—" until the first success.
      }
    };
    load();
    const id = setInterval(load, intervalMs);
    document.addEventListener('visibilitychange', load);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', load);
    };
  }, [url, intervalMs]);
}

function usePresenceSocket({ onState, onMessage }: { onState: (s: LinkState) => void; onMessage: (m: PresenceMessage) => void }) {
  const emitState = useEffectEvent(onState);
  const emitMessage = useEffectEvent(onMessage);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      emitState('connecting');
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${location.host}${PRESENCE_PATH}`);

      ws.onopen = () => {
        failures = 0;
        emitState('live');
        heartbeat = setInterval(() => ws?.readyState === WebSocket.OPEN && ws.send(PRESENCE_HEARTBEAT.request), 25_000);
      };
      ws.onmessage = (ev) => {
        if (ev.data === PRESENCE_HEARTBEAT.response) return;
        try {
          emitMessage(JSON.parse(ev.data as string) as PresenceMessage);
        } catch {
          // Ignore malformed frames.
        }
      };
      ws.onclose = () => {
        clearInterval(heartbeat);
        if (disposed) return;
        failures += 1;
        if (failures >= MAX_RECONNECT_FAILURES) {
          emitState('offline');
          return; // Resumes on next visibility change.
        }
        emitState('connecting');
        retry = setTimeout(connect, Math.min(30_000, 1000 * 2 ** failures));
      };
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible' && (!ws || ws.readyState === WebSocket.CLOSED)) {
        failures = 0;
        clearTimeout(retry);
        connect();
      }
    };

    connect();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      clearTimeout(retry);
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', onVisible);
      ws?.close(1000, 'unmount');
    };
  }, []);
}
