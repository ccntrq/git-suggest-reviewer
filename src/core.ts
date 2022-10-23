import {gitDiff, gitBlame} from './git-cmds';
import {lines} from './utils';

export interface ReviewerStats {
  author: string;
  changedLines: number;
  lastCommitId: string;
  lastCommitDate: string;
}

export function gitSuggestReviewer(baseRevision: string): Array<ReviewerStats> {
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
  commitId: string;
  commitDate: string;
}

interface Range {
  startLine: number;
  linesChanged: number;
}

function summarizeBlameInfos(
  blameInfos: Array<BlameInfo>
): Array<ReviewerStats> {
  const map = new Map<string, ReviewerStats>();

  blameInfos.forEach(blameInfo => {
    const current = map.get(blameInfo.author);
    if (current) {
      current.changedLines += 1;
      // NOTE: needs proper date handling!
      if (blameInfo.commitDate > current.lastCommitDate) {
        current.lastCommitDate = blameInfo.commitDate;
        current.lastCommitId = blameInfo.commitId;
      }
    } else {
      map.set(blameInfo.author, {
        author: blameInfo.author,
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
      return lines(blame)
        .filter(Boolean) // remove empty lines
        .map(line => {
          return parseBlameLine(line);
        })
        .flat();
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
    if (rangeLine) {
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

function parseBlameLine(blame: string): BlameInfo {
  const match = blame.match(
    /^(\S+)(?:\s\S+)?\s+\((.*?)\s+(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\s\+\d{4})/
  );

  if (!match) {
    throw new Error("Couldn't parse blame: " + blame);
  }

  return {
    author: match[2],
    commitId: match[1],
    commitDate: match[3],
  };
}