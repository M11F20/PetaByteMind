import type { VitalSummary } from './contracts';

// Google's Core Web Vitals "good" thresholds.
const GOOD: Record<VitalSummary['metric'], number> = { LCP: 2500, INP: 200, CLS: 0.1, TTFB: 800, FCP: 1800 };

export function formatVital(v: VitalSummary | undefined): string {
  if (!v || v.p75 === null) return '—';
  return v.metric === 'CLS' ? v.p75.toFixed(3) : `${Math.round(v.p75)}ms`;
}

export function vitalIsGood(v: VitalSummary | undefined): boolean | null {
  if (!v || v.p75 === null) return null;
  return v.p75 <= GOOD[v.metric];
}

export function relativeTime(iso: string, lang: 'en' | 'ar'): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, secs] of steps) if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  return rtf.format(Math.round(diff), 'second');
}
