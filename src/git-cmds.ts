import {spawnSync} from 'child_process';
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
    '--line-porcelain',
  ]);
}

export function gitDiff(baseRevision: string): string {
  return runGitCmd('diff', [baseRevision]);
}

function runGitCmd(cmd: SupportedGitCmd, opts: Array<string>): string {
  const args = [cmd, ...opts];

  const result = spawnSync('git', args, {encoding: 'utf-8'});
  if (result.error || result.stderr) {
    throw new GitCmdError(
      `Couldn't execute git command: 'git ${args.join(' ')}'`,
      result.error ?? result.stderr
    );
  }

  return result.stdout;
}
