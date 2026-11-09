import { lt } from 'drizzle-orm';
import { getDb, schema } from './db/client';

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export async function pruneVitals(d1: D1Database): Promise<void> {
  await getDb(d1)
    .delete(schema.webVitals)
    .where(lt(schema.webVitals.createdAt, new Date(Date.now() - RETENTION_MS)));
}
