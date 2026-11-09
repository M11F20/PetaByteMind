'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ClockValue {
  /** Wall-clock SMPTE timecode at 24 fps: HH:MM:SS:FF. */
  timecode: string;
  /** Measured requestAnimationFrame rate of this tab, one decimal. */
  fps: string;
}

const ClockContext = createContext<ClockValue>({ timecode: '00:00:00:00', fps: '--.-' });

// Isolated from WorkspaceContext so 10 Hz clock ticks only re-render the readouts that display them.
export function ClockProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ClockValue>({ timecode: '00:00:00:00', fps: '--.-' });

  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let windowStart = performance.now();
    let lastPublish = 0;
    let fps = '--.-';

    const tick = (now: number) => {
      frames += 1;
      if (now - windowStart >= 500) {
        fps = ((frames * 1000) / (now - windowStart)).toFixed(1);
        frames = 0;
        windowStart = now;
      }
      if (now - lastPublish >= 100) {
        lastPublish = now;
        setValue({ timecode: wallClockTimecode(), fps });
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export const useClock = () => useContext(ClockContext);

function wallClockTimecode(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const frame = Math.floor((d.getMilliseconds() / 1000) * 24);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}:${pad(frame)}`;
}
