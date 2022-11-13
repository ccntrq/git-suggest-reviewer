#!/usr/bin/env node
/* eslint-disable no-process-exit */
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
    process.exit(0);
  }

  if (opts?.version) {
    console.log(version);
    process.exit(0);
  }

  if (!opts || !opts.baseRevision) {
    console.error(usage());
    process.exit(1);
  }

  const baseRevision = opts.baseRevision;
  const topReviewers = handleAppErrors(
    () => gitSuggestReviewer(baseRevision, opts.toRevision),
    opts.verbose
  );

  console.log(renderTopReviewerTable(topReviewers, opts.showEmail));

  process.exit(0);
}

export function usage(): string {
  const usage = `git-suggest-reviewers

Suggest candidates for a code review based on git history.

USAGE:
  git-suggest-reviewers [OPTIONS]
  git-suggest-reviewers [OPTIONS] <commit>
  git-suggest-reviewers [OPTIONS] <commit> <commit>

Options:
    -h --help        Show this help
    -v --version     Print program version
    -e --show-email  Show the authors email
    --verbose        Be more verbose
`;

  return usage;
}

interface CliOptions {
  baseRevision?: string;
  toRevision?: string;
  help: boolean;
  version: boolean;
  verbose: boolean;
  showEmail: boolean;
}

function defaultCliOptions(): CliOptions {
  return {
    help: false,
    version: false,
    verbose: false,
    showEmail: false,
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
      case '-e':
      case '--show-email':
        options.showEmail = true;
        break;
      default:
        if (!arg.startsWith('-') && !options.baseRevision) {
          options.baseRevision = arg;
        } else if (!arg.startsWith('-') && !options.toRevision) {
          options.toRevision = arg;
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
      if (verbose) {
        console.error('OriginalError:');
        console.error(
          unlines(
            lines(
              (error.originalError instanceof Error &&
                error.originalError.stack) ||
                `${error.originalError}`
            ).map(line => `  ${line}`)
          )
        );
      }
      process.exit(2);
    }

    console.error(
      'An unexpected error occured. Please create a bug report by clicking the\nfollowing link:\n' +
        (isUnexpectedError(error)
          ? error
          : new UnexpectedError(error)
        ).newIssueUrl()
    );
    process.exit(3);
  }
}
