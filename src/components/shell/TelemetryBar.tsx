'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useClock } from '@/context/ClockContext';
import { useLiveTelemetry } from '@/context/LiveTelemetryContext';
import { useDirection } from '@/context/DirectionContext';
import { Search, CheckCircle2, XCircle, Loader2, Radio, Terminal, MapPin } from 'lucide-react';

export function TelemetryBar() {
  const { activeWorkspace, toggleCommandPalette } = useWorkspace();
  const { timecode: smpteTimecode } = useClock();
  const { t, language } = useDirection();
  const { build, presence, link, telemetry } = useLiveTelemetry();

  const ci = build?.ci;
  const buildState = !ci ? 'UNKNOWN' : ci.status !== 'completed' ? 'RUNNING' : ci.conclusion === 'success' ? 'PASSING' : 'FAILING';
  const BuildIcon = buildState === 'FAILING' ? XCircle : buildState === 'RUNNING' ? Loader2 : CheckCircle2;

  const workspacePaths: Record<string, string> = {
    cmd: '~/petabytemind/cmd-center',
    vault: '~/petabytemind/vault/artifacts',
    dossier: '~/petabytemind/dossier/curriculum-vitae',
    network: '~/petabytemind/network/nodes',
  };

  return (
    <header className="w-full h-10 bg-graphite border-b border-slate-border px-3 flex items-center justify-between text-xs font-mono select-none z-30">
      {/* Start: Path & Active Workspace Indicator */}
      <div className="flex items-center gap-3">
        {/* Terminal path prompt */}
        <div className="flex items-center gap-1.5 text-ash-muted">
          <Terminal className="w-3.5 h-3.5 text-cyan-hyper" />
          <span className="text-signal-pure font-semibold tracking-wide hidden sm:inline">
            {workspacePaths[activeWorkspace]}
          </span>
          <span className="text-signal-pure font-semibold sm:hidden">
            ~/{activeWorkspace}
          </span>
        </div>

        {/* Separator */}
        <span className="text-slate-border hidden md:inline">|</span>

        {/* Live Build Status */}
        <a
          href={ci?.url ?? build?.commitUrl ?? 'https://github.com/M11F20/PetaByteMind'}
          target="_blank"
          rel="noreferrer"
          title={build ? `${build.shortSha} — ${build.message}` : undefined}
          className="hidden lg:flex items-center gap-1.5 text-[11px] text-ash-muted hover:text-signal-pure"
          data-testid="build-status"
        >
          <BuildIcon className={`w-3 h-3 ${buildState === 'FAILING' ? 'text-red-400' : 'text-cyan-hyper'} ${buildState === 'RUNNING' ? 'animate-spin' : ''}`} />
          <span>
            {t('telemetry.build')}: {buildState}{' // '}{build?.shortSha ?? '-------'}
          </span>
        </a>
      </div>

      {/* Center: Live Community & Module Telemetry */}
      <div className="hidden xl:flex items-center gap-5 text-[11px] text-ash-muted">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-cyan-hyper" />
          <span>
            {t('telemetry.edge')}: <span className="text-signal-pure">{telemetry?.edge.colo ?? '---'}</span>
          </span>
        </div>

        <span className="text-slate-border">|</span>

        <div className="flex items-center gap-1.5">
          <Radio className={`w-3 h-3 ${link === 'live' ? 'text-cyan-hyper' : 'text-ash-muted'}`} />
          <span>
            {t('telemetry.live')}: <span className="text-signal-pure">{link === 'live' && presence ? presence.total : '—'}</span> {t('telemetry.online')}
          </span>
        </div>
      </div>

      {/* End: Search / Cmd+K Trigger & Timecode */}
      <div className="flex items-center gap-3">
        {/* Live SMPTE Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-void border border-slate-border text-[10px] text-ash-muted">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          <span className="text-signal-pure tabular-nums">{smpteTimecode}</span>
        </div>

        {/* Command Palette Trigger Button */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 bg-void hover:bg-slate-border/50 border border-slate-border hover:border-cyan-hyper text-signal-pure text-[11px] transition-colors"
          title="Open Command Palette (Cmd+K / Ctrl+K)"
        >
          <Search className="w-3 h-3 text-cyan-hyper" />
          <span className="hidden sm:inline text-ash-muted text-[10px]">
            {language === 'ar' ? 'البحث' : 'DISPATCH'}
          </span>
          <kbd className="px-1.5 py-0.2 bg-graphite border border-slate-border text-[9px] text-cyan-hyper font-semibold">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
