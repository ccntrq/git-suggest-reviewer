export class GitCmdError extends Error {}

export function isGitCmdError(error: unknown): error is GitCmdError {
  return error instanceof Error && error.constructor.name === GitCmdError.name;
}

export class UnexpectedError extends Error {
  public readonly originalError: string;
  constructor(error: unknown) {
    super('An unexpected error occured');
    this.originalError =
      error instanceof Error && error.stack ? error.stack : `${error}`;
  }

  newIssueUrl(): string {
    let url =
      'https://github.com/ccntrq/git-suggest-reviewer/issues/new?title=';

    url += encodeURIComponent('Unexpected Error occured');
    url += '&body=';
    url += encodeURIComponent(this.originalError);

    return url;
  }
}

export function isUnexpectedError(error: unknown): error is UnexpectedError {
  return (
    error instanceof Error && error.constructor.name === UnexpectedError.name
  );
}
