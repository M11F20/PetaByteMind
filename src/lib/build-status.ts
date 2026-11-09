export interface BuildStatus {
  repo: string;
  branch: string;
  sha: string;
  shortSha: string;
  message: string;
  committedAt: string;
  commitUrl: string;
  ci: {
    status: 'queued' | 'in_progress' | 'completed' | string;
    conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | string | null;
    workflow: string;
    url: string;
  } | null;
  fetchedAt: string;
}
