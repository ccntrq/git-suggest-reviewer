#!/usr/bin/env node
import {gitSuggestReviewer} from './core';
import {isGitCmdError, isUnexpectedError, UnexpectedError} from './errors';
import {version} from './package';
import {renderTopReviewerTable} from './reviewer-stats';
import {lines, unlines} from './utils';

cli();

function cli(): void {
  const opts = parseArgs(process.argv);

  if (opts?.help) {
    console.log(usage());
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }

  if (opts?.version) {
    console.log(version);
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }

  if (!opts || !opts.baseRevision) {
    console.error(usage());
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  const baseRevision = opts.baseRevision;
  const topReviewers = handleAppErrors(
    () => gitSuggestReviewer(baseRevision),
    opts.verbose
  );

  console.log(renderTopReviewerTable(topReviewers.slice(0, 9)));

  // eslint-disable-next-line no-process-exit
  process.exit(0);
}

export function usage(): string {
  const usage = `git-suggest-reviewers

Suggest candidates for a code review based on git history.

USAGE:
  git-suggest-reviewers [OPTIONS]
  git-suggest-reviewers [OPTIONS] base_revision

Options:
    -h --help       Show this help
    -v --version    Print program version
    --verbose       Be more verbose
`;

  return usage;
}

interface CliOptions {
  baseRevision?: string;
  help: boolean;
  version: boolean;
  verbose: boolean;
}

function defaultCliOptions(): CliOptions {
  return {
    help: false,
    version: false,
    verbose: false,
  };
}

function parseArgs(args: Array<string>): undefined | CliOptions {
  if (args.length < 3) {
    return undefined;
  }

  const options = defaultCliOptions();
  args.slice(2).forEach(arg => {
    switch (arg) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--version':
        options.version = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      default:
        if (!arg.startsWith('-') && !options.baseRevision) {
          options.baseRevision = arg;
        } else {
          console.warn('Invalid argument: ' + arg);
        }
        break;
    }
  });

  return options;
}

function handleAppErrors<T>(action: () => T, verbose: boolean): T {
  try {
    return action();
  } catch (error: unknown) {
    if (isGitCmdError(error)) {
      console.error(error.message);
      if (verbose && error.originalError) {
        console.error('OriginalError:');
        console.error(
          unlines(
            lines(error.originalError.stack ?? `${error.originalError}`).map(
              line => `  ${line}`
            )
          )
        );
      }
      // eslint-disable-next-line no-process-exit
      process.exit(2);
    }

    console.error(
      'An unexpected error occured. Please create a bug report by clicking the\nfollowing link:\n' +
        (isUnexpectedError(error)
          ? error
          : new UnexpectedError(error)
        ).newIssueUrl()
    );
    // eslint-disable-next-line no-process-exit
    process.exit(3);
  }
}
