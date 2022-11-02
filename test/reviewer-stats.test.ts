import {describe, expect, test} from '@jest/globals';
import {renderTopReviewerTable} from '../src';
import type {SuggestedReviewers} from '../src/reviewer-stats';
import {lines} from '../src/utils';

describe('reviewer-stats', () => {
  test('renderTopReviewerTable works', () => {
    const reviewers: SuggestedReviewers = [
      {
        author: 'Peter Pan',
        authorEmail: 'peter@pan.de',
        changedLines: 87,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: 'ed7432a',
      },
      {
        author: 'Captain Hook',
        authorEmail: 'captain@hook.de',
        changedLines: 3,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: '1j4nn1d',
      },
    ];

    expect(renderTopReviewerTable(reviewers)).toBe(
      `Author        Changed Lines  Last Commit Date
Peter Pan     87             2022-10-23      
Captain Hook  3              2022-10-23      `
    );
  });
  test('renderTopReviewerTable limits output to 10 reviewers', () => {
    const reviewers: SuggestedReviewers = [
      {
        author: 'Peter Pan',
        authorEmail: 'peter@pan.de',
        changedLines: 87,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: 'ed7432a',
      },
      {
        author: 'Captain Hook',
        authorEmail: 'captain@hook.de',
        changedLines: 70,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: '1j4nn1d',
      },
      {
        author: 'Wendy Darling',
        authorEmail: 'wendy@darling.de',
        changedLines: 44,
        lastCommitDate: new Date(Date.UTC(2022, 9, 25)),
        lastCommitId: 'akakdn1',
      },
      {
        author: 'Tinker Bell',
        authorEmail: 'tinker@bell.de',
        changedLines: 37,
        lastCommitDate: new Date(Date.UTC(2019, 0, 21)),
        lastCommitId: 'akakdn1',
      },
      {
        author: 'Tiger Lily',
        authorEmail: 'tiger@lily.de',
        changedLines: 29,
        lastCommitDate: new Date(Date.UTC(2018, 1, 1)),
        lastCommitId: 'adjn11l',
      },
      {
        author: 'John Darling',
        authorEmail: 'john@darling.de',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2012, 1, 1)),
        lastCommitId: 'okf14km',
      },
      {
        author: 'Michael Darling',
        authorEmail: 'michael@darling.de',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2009, 1, 1)),
        lastCommitId: 'k1dnnm1',
      },
      {
        author: 'George Darling',
        authorEmail: 'george@darling.de',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2006, 1, 1)),
        lastCommitId: 'ak1nn1e',
      },
      {
        author: 'Mary Darling',
        authorEmail: 'mary@darling.de',
        changedLines: 20,
        lastCommitDate: new Date(Date.UTC(2006, 1, 1)),
        lastCommitId: 'k2n51l1',
      },
      {
        author: 'James Barrie',
        authorEmail: 'james@barrie.de',
        changedLines: 9,
        lastCommitDate: new Date(Date.UTC(1860, 4, 1937)),
        lastCommitId: '1dalnael',
      },
      {
        author: 'Alexander Pankoff',
        authorEmail: 'ccntrq@screenri.de',
        changedLines: 1,
        lastCommitDate: new Date(Date.UTC(2020, 2, 22)),
        lastCommitId: '1dalnael',
      },
    ];

    expect(reviewers.length).toBeGreaterThan(10);
    expect(lines(renderTopReviewerTable(reviewers)).length).toBe(11);
  });
});
