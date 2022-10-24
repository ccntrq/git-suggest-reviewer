import {execSync} from 'child_process';
import {GitCmdError} from './errors';

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

  try {
    const result = execSync(fullCmd);
    return result.toString();
  } catch (error: unknown) {
    throw new GitCmdError(`Couldn't execute git command: '${fullCmd}'`);
  }
}
