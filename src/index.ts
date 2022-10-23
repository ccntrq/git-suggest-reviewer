import {execSync} from 'child_process';
import {cpuUsage} from 'process';

cli();

/* CLI */

interface CliOptions {
  baseRevision: string;
}

function cli(): void {
  const opts = parseArgs(process.argv);

  if (!opts) {
    usage();
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  const diff = gitDiff(opts.baseRevision);
  const diffChanges = getDiffChanges(diff);
  const diffBlames = collectBlames(opts.baseRevision, diffChanges);
  const diffBlameInfo = collectBlameInfo(diffBlames);
  const summary = summarizeBlameInfos([...diffBlameInfo.values()].flat());

  console.log(
    renderTable(summary.slice(0, 9), [
      'author',
      'changedLines',
      'lastCommitDate',
    ])
  );

  // eslint-disable-next-line no-process-exit
  process.exit(0);
}

function usage() {
  console.error('USAGE:\n  git-suggest-reviewers [baseRevision]');
}

function parseArgs(args: Array<string>): undefined | CliOptions {
  if (args.length < 3) {
    return undefined;
  }

  return {
    baseRevision: args[2],
  };
}

function renderTable<T extends object>(
  values: Array<T>,
  headings: Array<keyof T>
): string {
  const columns = headings.map(h => values.map(value => String(value[h])));
  columns.forEach((c, i) => c.unshift(String(headings[i])));
  const columnWidths: Array<number> = columns.map(column =>
    Math.max(...column.map(entry => entry.length))
  );

  return columns[0]
    .map((_, row) => {
      return columns
        .map((column, columnNumber) => {
          const val = column[row];
          return val + ' '.repeat(columnWidths[columnNumber] - val.length);
        })
        .join(' ');
    })
    .join('\n');
}

/* CORE */

type FilePath = string;

type DiffChanges = Map<FilePath, Array<Range>>;
type DiffBlames = Map<FilePath, Array<string>>;
type DiffBlameInfo = Map<FilePath, Array<BlameInfo>>;

interface BlameInfo {
  author: string;
  commitId: string;
  commitDate: string;
}

interface ReviewerStats {
  author: string;
  changedLines: number;
  lastCommitId: string;
  lastCommitDate: string;
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

function gitBlame(
  baseRevision: string,
  file: string,
  startLine: number,
  lineCount: number
): string {
  return runGitCmd('blame', [
    baseRevision,
    file,
    `-L${startLine},+${lineCount}`,
  ]);
}
function gitDiff(baseRevision: string): string {
  return runGitCmd('diff', [baseRevision]);
}

function runGitCmd(cmd: string, opts: Array<string>): string {
  const fullCmd = ['git', cmd, ...opts].join(' ');

  const result = execSync(fullCmd);

  return result.toString();
}

function lines(s: string): Array<string> {
  return s.split(/\n/);
}
