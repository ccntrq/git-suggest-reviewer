import {describe, expect, jest, test} from '@jest/globals';

import {gitSuggestReviewer} from './core';
import {GitCmdError, UnexpectedError} from './errors';

jest.mock('./git-cmds');

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    const topReviewers = gitSuggestReviewer('HEAD');
    expect(topReviewers.length).toBe(2);
    expect(topReviewers[0]?.changedLines).toBe(12);
    expect(topReviewers[0]?.author).toBe('Captain Hook');
    expect(topReviewers[1]?.changedLines).toBe(6);
    expect(topReviewers[1]?.author).toBe('Peter Pan');
  });
  test('throws GitCmdError on invalid baseRevision', () => {
    expect(() => gitSuggestReviewer('invalid')).toThrow(GitCmdError);
  });
  test('throws UnexpectedError on error', () => {
    expect(() => gitSuggestReviewer('error')).toThrow(UnexpectedError);
  });
});
