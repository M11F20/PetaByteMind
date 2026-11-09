'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import type { VitalsBatch } from '@/lib/contracts';

/** Real-user monitoring: buffers Core Web Vitals and flushes one beacon when the page is hidden. */
export function WebVitalsReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const queue = new Map<string, VitalsBatch[number]>();
    const path = location.pathname.replace(/\/+$/, '') || '/';

    const record = (m: Metric) => {
      queue.set(m.name, { name: m.name as VitalsBatch[number]['name'], value: Math.round(m.value * 1000) / 1000, rating: m.rating, path });
    };

    const flush = () => {
      if (!queue.size) return;
      const body = JSON.stringify([...queue.values()]);
      queue.clear();
      if (!navigator.sendBeacon?.('/api/telemetry', body)) {
        fetch('/api/telemetry', { method: 'POST', body, keepalive: true }).catch(() => {});
      }
    };

    onLCP(record);
    onINP(record);
    onCLS(record);
    onFCP(record);
    onTTFB(record);

    const onHidden = () => document.visibilityState === 'hidden' && flush();
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return null;
}
