import { sql } from 'drizzle-orm';
import { getDb, schema } from '@/server/db/client';
import { clientIp, edge, edgeRequestInfo, json, withinLimit } from '@/server/context';
import { VITAL_METRICS, vitalsBatchSchema, type TelemetryResponse, type VitalSummary } from '@/lib/contracts';

export const dynamic = 'force-dynamic';

const WINDOW_DAYS = 7;
const SUMMARY_KEY = 'telemetry:vitals:v1';

/** Live edge info for this request + p75 Core Web Vitals across real visitors (KV-cached 60s). */
export async function GET() {
  const { env } = edge();
  const body: TelemetryResponse = {
    edge: edgeRequestInfo(),
    vitals: await vitalsSummary(env).catch((err) => {
      console.error('vitals summary failed', err);
      return VITAL_METRICS.map((metric) => ({ metric, p75: null, samples: 0 }));
    }),
    windowDays: WINDOW_DAYS,
  };
  return json(body);
}

/** RUM beacon sink. Accepts text/plain (sendBeacon) or JSON. */
export async function POST(request: Request) {
  const { env, cf } = edge();
  if (!(await withinLimit(env.TELEMETRY_LIMITER, `rum:${clientIp(request)}`))) {
    return new Response(null, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > 4096) return new Response(null, { status: 413 });

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = vitalsBatchSchema.safeParse(payload);
  if (!parsed.success) return new Response(null, { status: 400 });

  const now = new Date();
  const country = cf?.country ? String(cf.country) : null;
  const colo = cf?.colo ? String(cf.colo) : null;

  try {
    await getDb(env.DB)
      .insert(schema.webVitals)
      .values(parsed.data.map((v) => ({ metric: v.name, value: v.value, rating: v.rating, path: v.path, country, colo, createdAt: now })));
  } catch (err) {
    console.error('vitals insert failed', err);
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 204 });
}

async function vitalsSummary(env: CloudflareEnv): Promise<VitalSummary[]> {
  const cached = await env.CACHE?.get<VitalSummary[]>(SUMMARY_KEY, 'json');
  if (cached) return cached;

  const since = Date.now() - WINDOW_DAYS * 86_400_000;
  const db = getDb(env.DB);

  // SQLite has no PERCENTILE_CONT: count, then OFFSET into the sorted set. Indexed on (metric, created_at).
  const summaries = await Promise.all(
    VITAL_METRICS.map(async (metric): Promise<VitalSummary> => {
      const [{ n }] = await db.all<{ n: number }>(
        sql`SELECT COUNT(*) AS n FROM ${schema.webVitals} WHERE metric = ${metric} AND created_at >= ${since}`,
      );
      if (!n) return { metric, p75: null, samples: 0 };
      const offset = Math.min(n - 1, Math.floor(n * 0.75));
      const [row] = await db.all<{ value: number }>(
        sql`SELECT value FROM ${schema.webVitals} WHERE metric = ${metric} AND created_at >= ${since} ORDER BY value LIMIT 1 OFFSET ${offset}`,
      );
      return { metric, p75: row?.value ?? null, samples: n };
    }),
  );

  await env.CACHE?.put(SUMMARY_KEY, JSON.stringify(summaries), { expirationTtl: 60 });
  return summaries;
}
