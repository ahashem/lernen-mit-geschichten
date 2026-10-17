import { execSync } from 'node:child_process';

// Short commit of this build, so a deploy can be matched to a commit from the outside.
export function buildMarker(): string {
  // BUILD_SHA wins: GITHUB_SHA cannot be overridden in a workflow, and one run builds two branches.
  const sha = process.env.BUILD_SHA ?? process.env.GITHUB_SHA;
  if (sha) return sha.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}
