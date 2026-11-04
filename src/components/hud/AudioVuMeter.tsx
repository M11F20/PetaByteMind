'use client';

import React, { useState, useEffect } from 'react';

export function AudioVuMeter() {
  const [levels, setLevels] = useState<{ left: number; right: number }>({ left: 68, right: 62 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Natural audio level jitter
      const l = 50 + Math.random() * 38;
      const r = 48 + Math.random() * 40;
      setLevels({ left: Math.round(l), right: Math.round(r) });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-ash-muted select-none">
      <span className="text-[9px] tracking-wider text-ash-muted">VU:</span>
      <div className="flex flex-col gap-[2px]">
        {/* Left Channel */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] w-2 text-ash-muted">L</span>
          <div className="w-16 h-1.5 bg-void border border-slate-border flex overflow-hidden">
            <div
              className="h-full bg-cyan-hyper/80 transition-all duration-75"
              style={{ width: `${levels.left}%` }}
            />
          </div>
        </div>
        {/* Right Channel */}
        <div className="flex items-center gap-1">
          <span className="text-[8px] w-2 text-ash-muted">R</span>
          <div className="w-16 h-1.5 bg-void border border-slate-border flex overflow-hidden">
            <div
              className="h-full bg-cyan-hyper/80 transition-all duration-75"
              style={{ width: `${levels.right}%` }}
            />
          </div>
        </div>
      </div>
      <span className="text-[9px] text-signal-pure/70 tabular-nums">
        -{Math.max(1, 24 - Math.round(levels.left / 4))}dB
      </span>
    </div>
  );
}
