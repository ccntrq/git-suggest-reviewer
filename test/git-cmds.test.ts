import {describe, expect, beforeEach, test, jest} from '@jest/globals';

import {GitCmdError} from '../src/errors';
import {gitBlame, gitDiff} from '../src/git-cmds';

jest.mock('child_process');

describe('git-cmds', () => {
  beforeEach(() => {
    require('child_process').__setMockOpts({
      mockThrow: '',
      mockError: '',
    });
  });
  test('gitBlame', () => {
    const result = gitBlame('HEAD', 'index.ts', 1, 5);
    expect(result).toBe('git blame HEAD index.ts -L1,+5 --line-porcelain');
  });
  test('gitDiff', () => {
    const result = gitDiff('HEAD');
    expect(result).toBe('git diff HEAD');
  });
  test('handles spawn errors', () => {
    require('child_process').__setMockOpts({mockThrow: 'Throw'});

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
    require('child_process').__setMockOpts({mockError: 'Failed'});

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
