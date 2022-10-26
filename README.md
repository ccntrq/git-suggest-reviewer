# git-suggest-reviewer

## Suggest candidates for a code review based on git history

Often the best possible code reviewers are the people who wrote or previously
touched the code that has been modified by the changes to review.

This tool generates a top-10 of these people based on the git history of the
files touched between two revisions. The top-10 is ranked by the number of
changed lines of each previous author.

## Example

```
~/Code/sample-project$ git suggest-reviewer 1.7.13

Author         Changed Lines  Last Commit Date
Peter Pan      87             2022-08-19
Captain Hook   62             2022-09-19
Wendy Darling  12             2022-02-10
Tinker Bell    8              2021-09-15
```

## Install

You can either download this repository and build the code yourself, or grab the
latest release from `npm`:

```
npm i --global git-suggest-reviewer
```

## How to use

### CLI

After globally installing you can invoke this like a normal git subcommand:

```
git suggest-reviewer COMMIT_OR_TAG_OF_BASE_REVISION
```

Alternatively you can use the full command:

```
git-suggest-reviewer COMMIT_OR_TAG_OF_BASE_REVISION
```

### Library

You can also use this as a library inside of your TS/JS projects.

```ts
import {gitSuggestReviewer, renderTopReviewerTable} from 'git-suggest-reviewer';

const baseRevision = '1.7.13';
const topReviewer = await gitSuggestReviewer(baseRevision);
const formerColleagues = ['Captain Hook'];
const withoutFormerColleaguesAndAboveTenChangedLines = topReviewer.filter(
  reviewer =>
    !formerColleagues.includes(reviewer.author) && reviewer.changedLines > 10
);

console.log(
  renderTopReviewerTable(withoutFormerColleaguesAndAboveTenChangedLines)
);
```

## Documentation

You can find documentation for the public interface [here](https://ccntrq.github.io/git-suggest-reviewer/)

## Dependencies

This package runs on `node` and depends on an `git` executable to be available.

- `node` '>=v14.0.0'
- `git` executable on your `$PATH`
