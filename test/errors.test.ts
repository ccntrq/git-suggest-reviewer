import {describe, expect, test} from 'vitest';
import {UnexpectedError} from '../src/errors';
import {version} from '../src/package';

describe('errors', () => {
  test('UnexpectedError newIssueUrl works', () => {
    expect(new UnexpectedError('Outch!').newIssueUrl()).toBe(
      'https://github.com/ccntrq/git-suggest-reviewer/issues/new?title=Unexpected%20Error%20occured&body=An%20unexpected%20error%20occured%3A%0AOutch!%0A%0AVersion%3A%20' +
        version
    );
  });
});
