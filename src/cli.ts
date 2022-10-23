import {gitSuggestReviewer} from './core';

export function cli(): void {
  const opts = parseArgs(process.argv);

  if (!opts) {
    usage();
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  const summary = gitSuggestReviewer(opts.baseRevision);

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

interface CliOptions {
  baseRevision: string;
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
