'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { SYSTEM_PILLARS } from '@/data/content';
import { useLiveTelemetry } from '@/context/LiveTelemetryContext';
import { formatVital, vitalIsGood } from '@/lib/format';
import { ReticleCorner } from './ReticleCorner';
import { Activity, Cpu, ArrowUpRight, Terminal } from 'lucide-react';

export function TelemetryInspector() {
  const { activePillarNode, setActiveWorkspace } = useWorkspace();
  const { t, language } = useDirection();
  const { telemetry } = useLiveTelemetry();
  const vital = (m: string) => telemetry?.vitals.find((v) => v.metric === m);

  const node = SYSTEM_PILLARS.find((p) => p.id === activePillarNode) || SYSTEM_PILLARS[0];

  return (
    <div className="relative w-full h-full bg-void border border-slate-border p-4 flex flex-col justify-between overflow-y-auto select-none">
      <ReticleCorner position="top-left" label="INSP.01 // METRICS" />
      <ReticleCorner position="top-right" label={telemetry ? `EDGE: ${telemetry.edge.colo}` : 'EDGE: ---'} />
      <ReticleCorner position="bottom-left" label="CHANNEL: RX-02" />
      <ReticleCorner position="bottom-right" label={`REV: ${process.env.NEXT_PUBLIC_APP_VERSION}`} />

      {/* Panel Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-border pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-hyper animate-pulse" />
            <span className="font-mono text-xs font-semibold text-signal-pure tracking-wider uppercase">
              {t('inspector.title')}
            </span>
          </div>
          <span className="font-mono text-[10px] text-cyan-hyper px-1.5 py-0.5 bg-graphite border border-slate-border">
            {node.index}{' // ACTIVE'}
          </span>
        </div>

        {/* Node Heading */}
        <div className="space-y-1 mb-4">
          <div className="text-[10px] font-mono text-ash-muted uppercase tracking-wider">
            {node.complexityScore}
          </div>
          <h3 className="text-base font-mono font-bold text-signal-pure uppercase">
            {language === 'ar' ? node.labelAr : node.label}
          </h3>
          <p className="text-xs font-sans text-ash-muted leading-relaxed">
            {language === 'ar' ? node.descriptionAr : node.description}
          </p>
        </div>

        {/* Structured Spec Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-[10px]">
          {/* Latency Benchmark */}
          <div className="bg-graphite/80 border border-slate-border hover:border-cyan-hyper/80 transition-colors duration-150 p-2">
            <div className="text-ash-muted text-[9px] mb-0.5 uppercase tracking-wider">
              {t('inspector.latency')}
            </div>
            <div className="text-cyan-hyper font-semibold tabular-nums text-xs">
              {node.latencyBenchmark}
            </div>
          </div>

          {/* Intended Target Audience */}
          <div className="bg-graphite/80 border border-slate-border hover:border-cyan-hyper/80 transition-colors duration-150 p-2">
            <div className="text-ash-muted text-[9px] mb-0.5 uppercase tracking-wider">
              {t('inspector.audience')}
            </div>
            <div className="text-signal-pure truncate text-[10px]">
              {node.targetAudience}
            </div>
          </div>
        </div>

        {/* Runtime Stack Badges */}
        <div className="mb-4">
          <div className="text-[9px] font-mono text-ash-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-hyper" />
            <span>{t('inspector.stack')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.primaryStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-graphite border border-slate-border text-signal-pure font-mono text-[10px]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live edge + real-user telemetry: every value here is measured, none hardcoded */}
      <div className="mb-3 border border-slate-border bg-graphite/40 p-2 font-mono text-[10px]" data-testid="live-telemetry">
        <div className="text-[9px] text-ash-muted uppercase tracking-wider mb-1.5">{t('inspector.live')}</div>
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <LiveCell label="POP" value={telemetry?.edge.colo ?? '—'} />
          <LiveCell label="RTT" value={telemetry?.edge.rttMs != null ? `${telemetry.edge.rttMs}ms` : '—'} />
          <LiveCell label="PROTO" value={telemetry?.edge.httpProtocol?.replace('HTTP/', 'H') ?? '—'} />
        </div>
        <div className="text-[9px] text-ash-muted uppercase tracking-wider mb-1.5">{t('inspector.rum')}</div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['LCP', 'INP', 'CLS'] as const).map((m) => (
            <LiveCell key={m} label={m} value={formatVital(vital(m))} good={vitalIsGood(vital(m))} />
          ))}
        </div>
      </div>

      {/* Artifact Link & Action Jump */}
      <div className="border-t border-slate-border pt-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-ash-muted">
          <span>{t('inspector.artifact')}:</span>
          <span className="text-cyan-hyper hover:underline cursor-pointer">
            {node.artifactSlug}
          </span>
        </div>

        <button
          onClick={() => setActiveWorkspace('vault')}
          className="w-full flex items-center justify-between px-3 py-2 bg-graphite hover:bg-slate-border/50 border border-slate-border hover:border-cyan-hyper text-signal-pure font-mono text-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-hyper" />
            <span>INSPECT IN THE VAULT</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-ash-muted" />
        </button>
      </div>
    </div>
  );
}

function LiveCell({ label, value, good = null }: { label: string; value: string; good?: boolean | null }) {
  const tone = good === null ? 'text-signal-pure' : good ? 'text-cyan-hyper' : 'text-amber-400';
  return (
    <div className="bg-void border border-slate-border px-1.5 py-1">
      <div className="text-[8px] text-ash-muted">{label}</div>
      <div className={`tabular-nums font-semibold ${tone}`} data-telemetry>
        {value}
      </div>
    </div>
  );
}
