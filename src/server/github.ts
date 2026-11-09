import 'server-only';
import type { BuildStatus } from '@/lib/build-status';

const KV_KEY = 'gh:build-status:v1';
const TTL_SECONDS = 120; // KV minimum is 60; 120 keeps us far below the unauthenticated 60 req/h limit.

interface GhCommit {
  sha: string;
  html_url: string;
  commit: { message: string; committer: { date: string } | null };
}
interface GhRuns {
  workflow_runs: Array<{ name: string; status: string; conclusion: string | null; html_url: string }>;
}

export async function getBuildStatus(env: CloudflareEnv): Promise<BuildStatus> {
  const cached = await env.CACHE?.get<BuildStatus>(KV_KEY, 'json');
  if (cached) return cached;

  const status = await fetchBuildStatus(env);
  await env.CACHE?.put(KV_KEY, JSON.stringify(status), { expirationTtl: TTL_SECONDS });
  return status;
}

async function fetchBuildStatus(env: CloudflareEnv): Promise<BuildStatus> {
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'petabytemind-site',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
  };
  const gh = <T>(path: string) =>
    fetch(`https://api.github.com/repos/${repo}${path}`, { headers, signal: AbortSignal.timeout(5000) }).then((r) => {
      if (!r.ok) throw new Error(`GitHub ${path} → ${r.status}`);
      return r.json() as Promise<T>;
    });

  const [commit, runs] = await Promise.all([
    gh<GhCommit>(`/commits/${branch}`),
    gh<GhRuns>(`/actions/runs?branch=${branch}&per_page=1`).catch(() => null),
  ]);

  const run = runs?.workflow_runs[0];
  return {
    repo,
    branch,
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    message: commit.commit.message.split('\n')[0].slice(0, 140),
    committedAt: commit.commit.committer?.date ?? new Date(0).toISOString(),
    commitUrl: commit.html_url,
    ci: run ? { status: run.status, conclusion: run.conclusion, workflow: run.name, url: run.html_url } : null,
    fetchedAt: new Date().toISOString(),
  };
}
