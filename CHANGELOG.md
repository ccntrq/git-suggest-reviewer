# Changelog

All notable changes to this project since `v1.0.0` will be documented in this
file.

This project adheres to [Semantic
Versioning](https://semver.org/spec/v2.0.0.html). For commit guidelines see
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

## [3.0.0](https://github.com/ccntrq/git-suggest-reviewer/compare/v2.1.0...v3.0.0) (2023-10-25)


### ⚠ BREAKING CHANGES

* node 14 not supported anymore
    - Bump version for @types/node
    - Add volta section to package.json and pin node to v20
    - remove .nvmrc

### Features

* Bump minimum node version to 16 and add node 20 to build matrix ([0f59e6a](https://github.com/ccntrq/git-suggest-reviewer/commit/0f59e6af2e6712701f5a454901a3e10d82ed5f12))
* Export SuggestedReviewers type ([8dab435](https://github.com/ccntrq/git-suggest-reviewer/commit/8dab435748935487a276b3d8613fe955cd8fac21))

## [2.1.0](https://github.com/ccntrq/git-suggest-reviewer/compare/v2.0.1...v2.1.0) (2022-11-13)


### Features

* Add possibility to pass in additional _to_ commit ([6a288b0](https://github.com/ccntrq/git-suggest-reviewer/commit/6a288b0d9f69ca461122d56b923d07c73275e0c5))

## [2.0.1](https://github.com/ccntrq/git-suggest-reviewer/compare/v2.0.0...v2.0.1) (2022-11-04)


### Bug Fixes

* **cli:** correct the description for `-e/--show-email` option ([6989e6d](https://github.com/ccntrq/git-suggest-reviewer/commit/6989e6df2decce5d230a56b3a1b1257b44552bff))

## [2.0.0](https://github.com/ccntrq/git-suggest-reviewer/compare/v1.0.2...v2.0.0) (2022-11-03)


### ⚠ BREAKING CHANGES

* Assume authors with same email are the same person

### Features

* Add authorEmail to ReviewerStats ([23821fc](https://github.com/ccntrq/git-suggest-reviewer/commit/23821fcfe6c49cec4a35487da49ef2c2f62a905a))
* Add option to show the email of an author ([e2de943](https://github.com/ccntrq/git-suggest-reviewer/commit/e2de943c7a5c8770d22d981319446ffbacde1fa5))
* Assume authors with same email are the same person ([a91b086](https://github.com/ccntrq/git-suggest-reviewer/commit/a91b086487a8b0447f8d7a2422e39793a1bfb9c3))

## [1.0.2](https://github.com/ccntrq/git-suggest-reviewer/compare/v1.0.1...v1.0.2) (2022-10-31)


### Miscellaneous Chores

* release v1.0.2 (only ci changes) ([e238345](https://github.com/ccntrq/git-suggest-reviewer/commit/e23834580b47a010428831e95b1b5cad908e36b8))

## [1.0.1](https://github.com/ccntrq/git-suggest-reviewer/compare/v1.0.0...v1.0.1) (2022-10-31)


### Miscellaneous Chores

* release v1.0.1 ([9084c11](https://github.com/ccntrq/git-suggest-reviewer/commit/9084c1105bfdb26c77c8f52fb0f16f85287343d3))

## [1.0.0](https://github.com/ccntrq/git-suggest-reviewer/compare/v1.0.0...c0e2210667d588d10804905db51752ee12d149a4) (2022-10-30)

### Added 

- First stable release with cli and library
