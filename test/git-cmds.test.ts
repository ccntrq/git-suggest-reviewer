import {describe, expect, beforeEach, test, vi} from 'vitest';
import {SpawnSyncReturns, spawnSync} from 'child_process';

import {GitCmdError} from '../src/errors';
import {gitBlame, gitDiff} from '../src/git-cmds';

vi.mock('child_process');

const out: SpawnSyncReturns<string> = {
  pid: 1,
  output: [],
  stderr: '',
  stdout: '',
  status: null,
  signal: null,
};

describe('git-cmds', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  test('gitBlame', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (spawnSync as any).mockImplementationOnce((cmd, args) => {
      return {...out, stdout: [cmd, ...args].join(' ')};
    });
    const result = gitBlame('HEAD', 'index.ts', 1, 5);
    expect(result).toBe('git blame HEAD index.ts -L1,+5 --line-porcelain');
  });
  test('gitDiff', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (spawnSync as any).mockImplementationOnce((cmd, args) => {
      return {...out, stdout: [cmd, ...args].join(' ')};
    });
    const result = gitDiff('HEAD');
    expect(result).toBe('git diff HEAD');
  });
  test('handles spawn errors', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (spawnSync as any).mockImplementationOnce(() => {
      return {...out, error: new Error('Throw')};
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any;
    try {
      gitBlame('HEAD', 'index.ts', 1, 5);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GitCmdError);
    expect(error.originalError).toBeInstanceOf(Error);
    expect(`${error.originalError}`).toBe('Error: Throw');
  });
  test('handles stderr', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (spawnSync as any).mockImplementationOnce(() => {
      return {...out, stderr: 'Failed'};
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any;
    try {
      gitBlame('HEAD', 'index.ts', 1, 5);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GitCmdError);
    expect(error.originalError).toBe('Failed');
  });
});
