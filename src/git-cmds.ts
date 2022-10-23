import {execSync} from 'child_process';

type SupportedGitCmd = 'diff' | 'blame';

export function gitBlame(
  baseRevision: string,
  file: string,
  startLine: number,
  lineCount: number
): string {
  return runGitCmd('blame', [
    baseRevision,
    file,
    `-L${startLine},+${lineCount}`,
  ]);
}

export function gitDiff(baseRevision: string): string {
  return runGitCmd('diff', [baseRevision]);
}

function runGitCmd(cmd: SupportedGitCmd, opts: Array<string>): string {
  const fullCmd = ['git', cmd, ...opts].join(' ');

  const result = execSync(fullCmd);

  return result.toString();
}
