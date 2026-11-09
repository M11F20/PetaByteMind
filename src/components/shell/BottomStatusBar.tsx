'use client';

import React, { useEffect, useState } from 'react';
import { AudioVuMeter } from '@/components/hud/AudioVuMeter';
import { Cpu, Gauge, Radio, Clock } from 'lucide-react';
import { useClock } from '@/context/ClockContext';
import { useLiveTelemetry } from '@/context/LiveTelemetryContext';

// Chromium-only, non-standard; absent elsewhere and simply hidden.
type MemoryPerformance = Performance & { memory?: { usedJSHeapSize: number } };

export function BottomStatusBar() {
  const { timecode, fps } = useClock();
  const { telemetry, link } = useLiveTelemetry();
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);
  const [heapMb, setHeapMb] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    const sampleHeap = () => {
      const mem = (performance as MemoryPerformance).memory;
      if (mem) setHeapMb((mem.usedJSHeapSize / 1_048_576).toFixed(1));
    };
    onResize();
    sampleHeap();
    const id = setInterval(sampleHeap, 5000);
    window.addEventListener('resize', onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const rtt = telemetry?.edge.rttMs;

  return (
    <footer className="w-full h-8 bg-graphite border-t border-slate-border px-3 flex items-center justify-between text-[10px] font-mono select-none z-30 shrink-0">
      <div className="flex items-center gap-4">
        <AudioVuMeter />
        <span className="text-slate-border hidden sm:inline">|</span>
        <div className="hidden sm:flex items-center gap-1.5 text-ash-muted" data-testid="edge-rtt">
          <Gauge className="w-3 h-3 text-cyan-hyper" />
          <span>
            RTT: <span className="text-signal-pure tabular-nums">{rtt != null ? `${rtt}ms` : '—'}</span>
            <span className="text-slate-border"> @ </span>
            <span className="text-signal-pure">{telemetry?.edge.colo ?? '---'}</span>
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 text-ash-muted">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-cyan-hyper" />
          <span>
            FPS: <span className="text-signal-pure tabular-nums">{fps}</span>
          </span>
          {heapMb && (
            <>
              <span className="text-slate-border">/</span>
              <span>
                HEAP: <span className="text-signal-pure tabular-nums">{heapMb} MB</span>
              </span>
            </>
          )}
        </div>
        <span className="text-slate-border">|</span>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-hyper" />
          <span>
            WS: <span className={link === 'live' ? 'text-cyan-hyper' : 'text-ash-muted'}>{link.toUpperCase()}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-ash-muted">
        <span className="hidden lg:inline text-ash-muted">
          VIEWPORT: <span className="text-signal-pure tabular-nums">{viewport ? `[X:${viewport.w}, Y:${viewport.h}]` : '[X:----, Y:----]'}</span>
        </span>
        <span className="text-slate-border hidden lg:inline">|</span>
        <div className="flex items-center gap-1 text-cyan-hyper">
          <Clock className="w-3 h-3" />
          <span className="tabular-nums font-semibold">{timecode}</span>
        </div>
      </div>
    </footer>
  );
}
