import { z } from 'zod';

export interface EdgeRequestInfo {
  colo: string;
  country: string;
  city: string | null;
  rttMs: number | null;
  httpProtocol: string | null;
  tlsVersion: string | null;
}

export const DISCIPLINES = ['distributed_systems', 'kernel_baremetal', 'agentic_workflows', 'silicon_accelerators', 'wireless_5g'] as const;
export const CORRIDORS = ['MENA_TO_NA', 'NA_TO_GLOBAL'] as const;
export const VITAL_METRICS = ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'] as const;

export const intakeSchema = z.object({
  // GitHub handle rules: alnum + single hyphens, max 39 chars.
  handle: z
    .string()
    .trim()
    .transform((s) => s.replace(/^@/, '').toLowerCase())
    .pipe(z.string().regex(/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/, 'Invalid GitHub handle')),
  email: z.string().trim().toLowerCase().email().max(254),
  discipline: z.enum(DISCIPLINES),
  corridor: z.enum(CORRIDORS),
  turnstileToken: z.string().min(1).max(2048),
  website: z.string().max(256).optional(), // honeypot: any value → silent fake success in the route
});
export type IntakeInput = z.input<typeof intakeSchema>;

export type IntakeResponse =
  | { ok: true; id: number | null; duplicate: boolean }
  | { ok: false; error: 'invalid' | 'rate_limited' | 'captcha' | 'unavailable'; message: string };

export const vitalsBatchSchema = z
  .array(
    z.object({
      name: z.enum(VITAL_METRICS),
      value: z.number().finite().nonnegative().max(120_000),
      rating: z.enum(['good', 'needs-improvement', 'poor']),
      path: z.string().max(64).regex(/^\/[\w\-/]*$/),
    }),
  )
  .min(1)
  .max(10);
export type VitalsBatch = z.infer<typeof vitalsBatchSchema>;

export interface VitalSummary {
  metric: (typeof VITAL_METRICS)[number];
  p75: number | null;
  samples: number;
}

export interface TelemetryResponse {
  edge: EdgeRequestInfo;
  vitals: VitalSummary[];
  windowDays: number;
}

export interface PublicMember {
  handle: string;
  displayName: string;
  location: string;
  hub: 'MENA' | 'NORTH_AMERICA';
  discipline: string;
  project: string;
  projectUrl: string | null;
}
