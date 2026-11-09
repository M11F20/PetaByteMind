import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/server/db/client';
import { edge, json } from '@/server/context';
import type { PublicMember } from '@/lib/contracts';

export const dynamic = 'force-dynamic';

const KV_KEY = 'members:public:v1';

export async function GET() {
  const { env } = edge();
  try {
    let members = await env.CACHE?.get<PublicMember[]>(KV_KEY, 'json');
    if (!members) {
      members = await getDb(env.DB)
        .select({
          handle: schema.members.handle,
          displayName: schema.members.displayName,
          location: schema.members.location,
          hub: schema.members.hub,
          discipline: schema.members.discipline,
          project: schema.members.project,
          projectUrl: schema.members.projectUrl,
        })
        .from(schema.members)
        .where(eq(schema.members.visible, true))
        .orderBy(desc(schema.members.approvedAt))
        .limit(12);
      await env.CACHE?.put(KV_KEY, JSON.stringify(members), { expirationTtl: 300 });
    }
    return json({ members }, { cache: 'public, max-age=60' });
  } catch (err) {
    console.error('members query failed', err);
    return json({ members: [] satisfies PublicMember[] }, { status: 503 });
  }
}
