'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Radio, Terminal, ShieldCheck, Server, ExternalLink, Activity } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';
import { useLiveTelemetry } from '@/context/LiveTelemetryContext';
import { ReticleCorner } from '@/components/hud/ReticleCorner';
import { IntakeForm } from '@/components/network/IntakeForm';
import type { PublicMember } from '@/lib/contracts';

export function NetworkWorkspace() {
  const { t } = useDirection();
  const { presence, link } = useLiveTelemetry();
  const online = link === 'live' && presence ? presence.total.toLocaleString('en-US') : '—';

  return (
    <div className="w-full h-full flex flex-col space-y-4 p-3 md:p-4 overflow-y-auto">
      <section className="relative w-full bg-void border border-slate-border p-4 select-none">
        <ReticleCorner position="top-left" label="NET.01 // CORRIDOR" />
        <ReticleCorner position="top-right" label={`STATUS: ${link.toUpperCase()}`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-graphite border border-cyan-hyper text-cyan-hyper text-[10px] font-mono tracking-widest uppercase mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>TRANS-REGIONAL ENGINEERING BACKPLANE</span>
            </div>
            <h2 className="text-base sm:text-xl font-mono font-bold text-signal-pure uppercase tracking-wide">{t('network.title')}</h2>
            <p className="mt-1 text-xs font-sans text-ash-muted max-w-2xl leading-relaxed">{t('network.subtitle')}</p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-ash-muted">
            <div className="px-3 py-1.5 bg-graphite border border-slate-border flex items-center gap-2" data-testid="presence-count">
              <span className={`w-2 h-2 rounded-full ${link === 'live' ? 'bg-cyan-hyper animate-ping' : 'bg-ash-muted'}`} />
              <span>
                {t('telemetry.live')}: <span className="text-signal-pure font-bold">{online}</span> {t('telemetry.online')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <section className="relative lg:col-span-5 bg-void border border-slate-border p-4 flex flex-col justify-between">
          <ReticleCorner position="top-left" label="INTAKE // PROTOCOL" />
          <div>
            <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-hyper" />
                <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">{t('network.intake_title')}</span>
              </div>
              <span className="font-mono text-[9px] text-ash-muted">D1 // TURNSTILE</span>
            </div>
            <IntakeForm />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-[10px] font-mono text-ash-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-hyper" />
              <span>INVITE INTAKE: GATED & RATE-LIMITED (3/MIN)</span>
            </span>
          </div>
        </section>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <PresencePanel />
          <SpotlightsPanel />
        </div>
      </div>
    </div>
  );
}

function PresencePanel() {
  const { t } = useDirection();
  const { presence, pings, link } = useLiveTelemetry();

  return (
    <section className="relative bg-void border border-slate-border p-4" data-testid="presence-panel">
      <ReticleCorner position="top-left" label="PRESENCE // DO" />
      <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-hyper" />
          <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">{t('network.presence')}</span>
        </div>
        <span className="font-mono text-[10px] text-ash-muted">DURABLE OBJECT // WEBSOCKET</span>
      </div>

      {link !== 'live' || !presence ? (
        <p className="font-mono text-[11px] text-ash-muted">{link === 'connecting' ? 'LINKING TO EDGE ROOM…' : 'EDGE ROOM OFFLINE — retrying on focus.'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px]">
          <div>
            <div className="text-ash-muted uppercase tracking-wider mb-1.5">BY COUNTRY</div>
            <ul className="space-y-1">
              {presence.byCountry.slice(0, 6).map((c) => (
                <li key={c.country} className="flex items-center justify-between bg-graphite/60 border border-slate-border px-2 py-1">
                  <span className="text-signal-pure">{c.country}</span>
                  <span className="text-cyan-hyper tabular-nums font-semibold">{c.count}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-ash-muted">
              POPS: <span className="text-signal-pure">{presence.colos.join(' · ') || '—'}</span>
            </div>
          </div>
          <div>
            <div className="text-ash-muted uppercase tracking-wider mb-1.5">RECENT LINKS</div>
            <ul className="space-y-1">
              {pings.length === 0 && <li className="text-ash-muted">Awaiting next session…</li>}
              {pings.map((p) => (
                <li key={`${p.at}-${p.colo}`} className="flex items-center justify-between px-2 py-1 border border-slate-border/60">
                  <span>
                    <span className="text-cyan-hyper">{p.country}</span> → <span className="text-signal-pure">{p.colo}</span>
                  </span>
                  <span className="text-ash-muted tabular-nums">{new Date(p.at).toISOString().slice(11, 19)}Z</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function SpotlightsPanel() {
  const { t } = useDirection();
  const [members, setMembers] = useState<PublicMember[] | null>(null);

  useEffect(() => {
    fetch('/api/members')
      .then(async (r) => (r.ok ? ((await r.json()) as { members: PublicMember[] }) : { members: [] }))
      .then((d) => setMembers(d.members))
      .catch(() => setMembers([]));
  }, []);

  return (
    <section className="relative bg-void border border-slate-border p-4 flex-1 flex flex-col justify-between">
      <ReticleCorner position="top-left" label="SPOTLIGHTS // VERIFIED" />
      <div>
        <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-hyper" />
            <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">{t('network.spotlights')}</span>
          </div>
          <span className="font-mono text-[10px] text-ash-muted">D1 // KV-CACHED</span>
        </div>

        {members === null ? (
          <p className="font-mono text-[11px] text-ash-muted animate-pulse">QUERYING MEMBER LEDGER…</p>
        ) : members.length === 0 ? (
          <p className="font-sans text-xs text-ash-muted leading-relaxed" data-testid="spotlights-empty">
            {t('network.no_members')}
          </p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.handle} className="p-3 bg-graphite/60 border border-slate-border hover:border-cyan-hyper transition-all duration-150 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-hyper font-bold">@{m.handle}</span>
                    <span className="text-slate-border">|</span>
                    <span className="text-signal-pure font-semibold">{m.displayName}</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-void border border-slate-border text-[9px] text-ash-muted">{m.location}</span>
                </div>
                <div className="text-xs text-signal-pure/90 font-sans mb-1 font-medium">{m.discipline}</div>
                <div className="flex items-center justify-between text-[10px] text-ash-muted pt-2 border-t border-slate-border/50">
                  <span className="truncate">
                    PROJECT: <span className="text-signal-pure">{m.project}</span>
                  </span>
                  {m.projectUrl && (
                    <a href={m.projectUrl} target="_blank" rel="noreferrer" className="text-cyan-hyper ms-2 shrink-0 flex items-center gap-1 hover:underline">
                      REPO <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-[10px] font-mono text-ash-muted">
        <span className="flex items-center gap-1.5">
          <Server className="w-3 h-3 text-cyan-hyper" />
          <span>REGIONAL BRIDGE: TORONTO ↔ BAGHDAD ↔ BOSTON</span>
        </span>
      </div>
    </section>
  );
}
