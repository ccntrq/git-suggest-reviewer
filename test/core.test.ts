import {describe, expect, vi, test} from 'vitest';
import {gitSuggestReviewer, GitCmdError, UnexpectedError} from '../src';

vi.mock('../src/git-cmds', async () => {
  const mock = await import('./__mocks__/git-cmds');
  return mock;
});

describe('core', () => {
  test('reviewer suggestions work', () => {
    const topReviewers = gitSuggestReviewer('HEAD');
    expect(topReviewers.length).toBe(2);
    expect(topReviewers[0]?.changedLines).toBe(12);
    expect(topReviewers[0]?.author).toBe('Captain Hook');
    expect(topReviewers[0]?.authorEmail).toBe('captain@hook.de');
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
