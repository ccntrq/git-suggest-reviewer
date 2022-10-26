import {describe, expect, beforeEach, test, jest} from '@jest/globals';
import {GitCmdError} from './errors';

import {gitBlame, gitDiff} from './git-cmds';

jest.mock('child_process');

describe('git-cmds', () => {
  beforeEach(() => {
    require('child_process').__setMockThrow(false);
  });
  test('gitBlame', () => {
    const result = gitBlame('HEAD', 'index.ts', 1, 5);
    expect(result).toBe('git blame HEAD index.ts -L1,+5');
  });
  test('gitDiff', () => {
    const result = gitDiff('HEAD');
    expect(result).toBe('git diff HEAD');
  });
  test('catches childprocess errors', () => {
    require('child_process').__setMockThrow(true);

    expect(() => gitBlame('HEAD', 'index.ts', 1, 5)).toThrow(GitCmdError);
  });
});
