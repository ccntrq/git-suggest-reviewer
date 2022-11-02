import {bracketString, toISODateString} from './utils';

export interface ReviewerStats {
  author: string;
  authorEmail: string;
  changedLines: number;
  lastCommitId: string;
  lastCommitDate: Date;
}

export type SuggestedReviewers = Array<ReviewerStats>;

/**
 * Creates a nicely formatted table from the given {@link ReviewerStats} for
 * printing on a terminal or other devices.
 *
 * @param suggestedReviewers
 */
export function renderTopReviewerTable(
  suggestedReviewers: SuggestedReviewers,
  showEmail = false
): string {
  return renderTable(
    suggestedReviewers.slice(0, 10).map(r => {
      return {...r, lastCommitDate: toISODateString(r.lastCommitDate)};
    }),
    [
      v =>
        v.author + (showEmail ? ' ' + bracketString('<', v.authorEmail) : ''),
      v => v.changedLines.toString(),
      v => v.lastCommitDate,
    ],
    ['Author', 'Changed Lines', 'Last Commit Date']
  );
}

function renderTable<T extends Record<string, unknown>>(
  values: Array<T>,
  accessorFns: Array<(value: T) => string>,
  headings?: Array<string>
): string {
  if (headings && headings.length !== accessorFns.length) {
    throw new Error('Headings and accessorFns must have same length.');
  }
  const columns = accessorFns.map(fn => values.map(fn));
  if (headings) {
    columns.forEach((c, i) => c.unshift(String(headings[i])));
  }
  const columnWidths: Array<number> = columns.map(column =>
    Math.max(...column.map(entry => entry.length))
  );

  return (columns[0] ?? [])
    .map((_, row) => {
      return columns
        .map((column, columnNumber) => {
          const val = column[row] ?? '';
          return (
            val + ' '.repeat((columnWidths[columnNumber] ?? 0) - val.length)
          );
        })
        .join('  ');
    })
    .join('\n');
}
