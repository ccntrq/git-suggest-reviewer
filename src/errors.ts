import {bugsUrl, version} from './package';

/**
 * An error of this class will be thrown if any of the git operations fail.
 */
export class GitCmdError extends Error {
  /**
   *
   * @param message Error message describing the git failure
   * @param originalError The original error that caused the failure
   */
  constructor(message: string, public readonly originalError: Error) {
    super(message);
  }
}

/**
 * Typeguard to check if an unknown error is an instance of  {@link GitCmdError | `GitCmdError`}.
 * @param error
 */
export function isGitCmdError(error: unknown): error is GitCmdError {
  return error instanceof Error && error.constructor.name === GitCmdError.name;
}

/**
 * Catch all error class to wrap unknown errors. An error of this class popping
 * up is considered a bug
 */
export class UnexpectedError extends Error {
  constructor(error: unknown) {
    super(
      'An unexpected error occured:\n' +
        (error instanceof Error && error.stack ? error.stack : `${error}`)
    );
  }

  /**
   * Use this method to generate a url for an issue containing relevant
   * information for this error.
   * @returns clickable url to create an issue for this error
   */
  newIssueUrl(): string {
    let url = `${bugsUrl}/new?title=`;

    url += encodeURIComponent('Unexpected Error occured');
    url += '&body=';
    url += encodeURIComponent(this.message + '\n\nVersion: ' + version);

    return url;
  }
}

/**
 * Typeguard to check if an unknown error is an instance of  {@link UnexpectedError | `UnexpectedError`}.
 * @param error
 */
export function isUnexpectedError(error: unknown): error is UnexpectedError {
  return (
    error instanceof Error && error.constructor.name === UnexpectedError.name
  );
}
