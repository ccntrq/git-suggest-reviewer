import {describe, expect, test} from '@jest/globals';
import {renderTopReviewerTable, SuggestedReviewers} from './reviewer-stats';
import {lines} from './utils';

describe('reviewer-stats', () => {
  test('renderTopReviewerTable works', () => {
    const reviewers: SuggestedReviewers = [
      {
        author: 'Peter Pan',
        changedLines: 87,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: 'ed7432a',
      },
      {
        author: 'Captain Hook',
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
        changedLines: 87,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: 'ed7432a',
      },
      {
        author: 'Captain Hook',
        changedLines: 70,
        lastCommitDate: new Date(Date.UTC(2022, 9, 23)),
        lastCommitId: '1j4nn1d',
      },
      {
        author: 'Wendy Darling',
        changedLines: 44,
        lastCommitDate: new Date(Date.UTC(2022, 9, 25)),
        lastCommitId: 'akakdn1',
      },
      {
        author: 'Tinker Bell',
        changedLines: 37,
        lastCommitDate: new Date(Date.UTC(2019, 0, 21)),
        lastCommitId: 'akakdn1',
      },
      {
        author: 'Tiger Lily',
        changedLines: 29,
        lastCommitDate: new Date(Date.UTC(2018, 1, 1)),
        lastCommitId: 'adjn11l',
      },
      {
        author: 'John Darling',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2012, 1, 1)),
        lastCommitId: 'okf14km',
      },
      {
        author: 'Michael Darling',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2009, 1, 1)),
        lastCommitId: 'k1dnnm1',
      },
      {
        author: 'George Darling',
        changedLines: 21,
        lastCommitDate: new Date(Date.UTC(2006, 1, 1)),
        lastCommitId: 'ak1nn1e',
      },
      {
        author: 'Mary Darling',
        changedLines: 20,
        lastCommitDate: new Date(Date.UTC(2006, 1, 1)),
        lastCommitId: 'k2n51l1',
      },
      {
        author: 'James Barrie',
        changedLines: 9,
        lastCommitDate: new Date(Date.UTC(1860, 4, 1937)),
        lastCommitId: '1dalnael',
      },
      {
        author: 'Alexander Pankoff',
        changedLines: 1,
        lastCommitDate: new Date(Date.UTC(2020, 2, 22)),
        lastCommitId: '1dalnael',
      },
    ];

    expect(reviewers.length).toBeGreaterThan(10);
    expect(lines(renderTopReviewerTable(reviewers)).length).toBe(11);
  });
});
