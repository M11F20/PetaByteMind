import { edge, json } from '@/server/context';
import { getBuildStatus } from '@/server/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getBuildStatus(edge().env);
    return json(status, { cache: 'public, max-age=30, s-maxage=60' });
  } catch (err) {
    console.error('github status failed', err);
    return json({ error: 'upstream_unavailable' }, { status: 502 });
  }
}
