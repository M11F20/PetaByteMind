import { getDb, schema } from '@/server/db/client';
import { clientIp, edge, json, withinLimit } from '@/server/context';
import { verifyTurnstile } from '@/server/turnstile';
import { notifyIntake } from '@/server/slack';
import { intakeSchema, type IntakeResponse } from '@/lib/contracts';

export const dynamic = 'force-dynamic';

const reply = (body: IntakeResponse, status = 200) => json(body, { status });

export async function POST(request: Request) {
  const { env, ctx, cf } = edge();
  const ip = clientIp(request);

  if (!(await withinLimit(env.INTAKE_LIMITER, `intake:${ip}`))) {
    return reply({ ok: false, error: 'rate_limited', message: 'Too many requests. Retry in a minute.' }, 429);
  }

  const parsed = intakeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return reply({ ok: false, error: 'invalid', message: parsed.error.issues[0]?.message ?? 'Invalid payload' }, 400);
  }
  const input = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing.
  if (input.website) return reply({ ok: true, id: null, duplicate: false });

  const captcha = await verifyTurnstile(input.turnstileToken, ip, env.TURNSTILE_SECRET_KEY);
  if (!captcha.ok) {
    const status = captcha.reason === 'rejected' ? 403 : 503;
    return reply({ ok: false, error: captcha.reason === 'rejected' ? 'captcha' : 'unavailable', message: `Verification ${captcha.reason}.` }, status);
  }

  const country = cf?.country ? String(cf.country) : null;
  try {
    const [row] = await getDb(env.DB)
      .insert(schema.intakeRequests)
      .values({
        handle: input.handle,
        email: input.email,
        discipline: input.discipline,
        corridor: input.corridor,
        country,
        createdAt: new Date(),
      })
      .onConflictDoNothing({ target: schema.intakeRequests.handle })
      .returning({ id: schema.intakeRequests.id });

    if (!row) return reply({ ok: true, id: null, duplicate: true });

    ctx.waitUntil(
      notifyIntake(env.SLACK_WEBHOOK_URL, { id: row.id, ...input, country }).catch((err) =>
        console.error('slack notify failed', err),
      ),
    );
    return reply({ ok: true, id: row.id, duplicate: false }, 201);
  } catch (err) {
    console.error('intake insert failed', err);
    return reply({ ok: false, error: 'unavailable', message: 'Intake store unavailable.' }, 503);
  }
}
