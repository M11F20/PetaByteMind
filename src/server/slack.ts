import 'server-only';

export interface IntakeNotification {
  id: number;
  handle: string;
  email: string;
  discipline: string;
  corridor: string;
  country: string | null;
}

/** Posts a new-intake alert to the maintainers' Slack channel via an Incoming Webhook. No-op if unconfigured. */
export async function notifyIntake(webhookUrl: string | undefined, n: IntakeNotification): Promise<void> {
  if (!webhookUrl) return;

  const lines = [
    `*New intake #${n.id}* — <https://github.com/${n.handle}|@${n.handle}>`,
    `• Discipline: \`${n.discipline}\``,
    `• Corridor: \`${n.corridor}\``,
    `• Origin: \`${n.country ?? 'unknown'}\``,
    `• Contact: ${n.email}`,
    `Approve: \`wrangler d1 execute petabytemind --remote --command "UPDATE intake_requests SET status='approved' WHERE id=${n.id}"\``,
  ];

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines.join('\n') }),
    signal: AbortSignal.timeout(5000),
  });
}
