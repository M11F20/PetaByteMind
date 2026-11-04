'use client';

import React from 'react';
import { AudioVuMeter } from '@/components/hud/AudioVuMeter';
import { Cpu, HardDrive, ShieldCheck, Clock } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';

export function BottomStatusBar() {
  const { smpteTimecode, liveFps } = useWorkspace();

  return (
    <footer className="w-full h-8 bg-graphite border-t border-slate-border px-3 flex items-center justify-between text-[10px] font-mono select-none z-30 shrink-0">
      {/* Start: Audio VU Meter & Buffer */}
      <div className="flex items-center gap-4">
        <AudioVuMeter />

        <span className="text-slate-border hidden sm:inline">|</span>

        <div className="hidden sm:flex items-center gap-1.5 text-ash-muted">
          <HardDrive className="w-3 h-3 text-cyan-hyper" />
          <span>BUFFER: <span className="text-signal-pure">99.4% (4096 SLOTS)</span></span>
        </div>
      </div>

      {/* Center: Memory & Synchronization */}
      <div className="hidden md:flex items-center gap-4 text-ash-muted">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-cyan-hyper" />
          <span>HEAP: <span className="text-signal-pure">44.8 MB</span></span>
          <span className="text-slate-border">/</span>
          <span>RSS: <span className="text-signal-pure">92.1 MB</span></span>
        </div>

        <span className="text-slate-border">|</span>

        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-cyan-hyper" />
          <span>SYNC: <span className="text-cyan-hyper">LOCKED (IEEE-1588)</span></span>
        </div>
      </div>

      {/* End: Coordinate Locator & Master Clock */}
      <div className="flex items-center gap-3 text-ash-muted">
        <span className="hidden lg:inline text-ash-muted">
          COORDS: <span className="text-signal-pure">[X:1920, Y:1080]</span>
        </span>

        <span className="text-slate-border hidden lg:inline">|</span>

        <div className="flex items-center gap-1 text-cyan-hyper">
          <Clock className="w-3 h-3" />
          <span className="tabular-nums font-semibold">{smpteTimecode}</span>
        </div>
      </div>
    </footer>
  );
}
