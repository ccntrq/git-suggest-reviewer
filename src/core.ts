import {GitCmdError, UnexpectedError} from './errors';
import {gitDiff, gitBlame} from './git-cmds';
import type {ReviewerStats, SuggestedReviewers} from './reviewer-stats';
import {lines} from './utils';

/**
 * Suggests possible reviewers based on the previous authors of changed lines
 * since `baseRevision`.
 *
 * @param baseRevision
 * @returns Array of {@link ReviewerStats}, sorted by the amount of changed
 * lines  per author in descending order.
 *
 * @throws {@link GitCmdError}
 * This exception is thrown in when any of the git operations fail
 *
 * @throws {@link UnexpectedError}
 * This exception is thrown on unknown/unhandled errors. This is considered a
 * bug.
 */
export function gitSuggestReviewer(baseRevision: string): SuggestedReviewers {
  try {
    return gitSuggestReviewerUnsafe(baseRevision);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error?.constructor.name === GitCmdError.name
    ) {
      throw error;
    } else {
      throw new UnexpectedError(
        error instanceof Error && error.stack ? error.stack : `${error}`
      );
    }
  }
}

function gitSuggestReviewerUnsafe(baseRevision: string): SuggestedReviewers {
  const diff = gitDiff(baseRevision);
  const diffChanges = getDiffChanges(diff);
  const diffBlames = collectBlames(baseRevision, diffChanges);
  const diffBlameInfo = collectBlameInfo(diffBlames);
  const summary = summarizeBlameInfos([...diffBlameInfo.values()].flat());

  return summary;
}

type FilePath = string;

type DiffChanges = Map<FilePath, Array<Range>>;
type DiffBlames = Map<FilePath, Array<string>>;
type DiffBlameInfo = Map<FilePath, Array<BlameInfo>>;

interface BlameInfo {
  author: string;
  authorEmail: string;
  commitId: string;
  commitDate: Date;
}

interface Range {
  startLine: number;
  linesChanged: number;
}

function summarizeBlameInfos(blameInfos: Array<BlameInfo>): SuggestedReviewers {
  const map = new Map<string, ReviewerStats>();

  blameInfos.forEach(blameInfo => {
    const current = map.get(blameInfo.author);
    if (current) {
      current.changedLines += 1;
      if (compareDates(blameInfo.commitDate, current.lastCommitDate) > 0) {
        current.lastCommitDate = blameInfo.commitDate;
        current.lastCommitId = blameInfo.commitId;
      }
    } else {
      map.set(blameInfo.author, {
        author: blameInfo.author,
        authorEmail: blameInfo.authorEmail,
        lastCommitId: blameInfo.commitId,
        lastCommitDate: blameInfo.commitDate,
        changedLines: 1,
      });
    }
  });

  return [...map.values()].sort((a, b) => {
    return b.changedLines - a.changedLines;
  });
}

function collectBlameInfo(diffBlames: DiffBlames): DiffBlameInfo {
  const blameInfo: DiffBlameInfo = new Map();

  diffBlames.forEach((blames, file) => {
    const fileBlameInfo = blames.map(blame => {
      return parseBlame(blame);
    });

    blameInfo.set(file, fileBlameInfo.flat());
  });

  return blameInfo;
}

function collectBlames(baseRevision: string, changes: DiffChanges): DiffBlames {
  const blames: DiffBlames = new Map();

  changes.forEach((ranges, file) => {
    const fileBlames = ranges.map(range =>
      gitBlame(baseRevision, file, range.startLine, range.linesChanged)
    );

    blames.set(file, fileBlames);
  });

  return blames;
}

function getDiffChanges(diff: string): DiffChanges {
  const changes: DiffChanges = new Map();

  let currentfile: string | undefined = undefined;

  lines(diff).forEach(line => {
    const changedFileLine = line.match(/^--- a\/(.*)/);

    if (changedFileLine) {
      currentfile = changedFileLine[1];
      return; // next
    }

    const newFileLine = line.match(/^--- \/dev\/null/);
    if (newFileLine) {
      currentfile = undefined;
      return; // next
    }

    if (!currentfile) {
      // Currently in a file that didn't exist in baseRevision
      return; // next
    }

    const rangeLine = line.match(/^@@\s-(\d+)(?:,(\d+))?\s\+\d+,\d+\s@@/);
    if (rangeLine && rangeLine[1] && rangeLine[2]) {
      const range = {
        startLine: parseInt(rangeLine[1]),
        linesChanged: rangeLine[2] ? parseInt(rangeLine[2]) : 1,
      };
      const current = changes.get(currentfile);

      if (current) {
        // update existing array
        current.push(range);
      } else {
        changes.set(currentfile, [range]);
      }

      return; // next
    }
  });

  return changes;
}

function parseBlame(blame: string): Array<BlameInfo> {
  const chunks = blame.split(/\n\t.*\n/);

  return chunks.filter(p => !!p.length).map(parseBlameChunk);
}

// NOTE:
// Very brittle parsing. This will break if the output of git blame is not
function parseBlameChunk(chunk: string): BlameInfo {
  const getValue = (line: string): string => {
    const value = line.split(' ').slice(1).join(' ');
    if (!value) {
      throw new Error(`getValue failed: '${line}'`);
    }

    return value;
  };

  const removeAngleBrackets = (withAngleBrackets: string): string => {
    return withAngleBrackets.replace(/^<(.*)>$/, (_, m1) => m1);
  };

  const chunkLines = lines(chunk);
  const commitId = chunkLines[0]?.split(' ')[0];
  if (!(commitId && chunkLines[1] && chunkLines[2] && chunkLines[3])) {
    throw new Error(`Cannot parse blame: ${chunk}`);
  }

  return {
    author: getValue(chunkLines[1]),
    authorEmail: removeAngleBrackets(getValue(chunkLines[2])),
    commitId: commitId,
    commitDate: new Date(parseInt(getValue(chunkLines[3])) * 1000),
  };
}

function compareDates(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}
