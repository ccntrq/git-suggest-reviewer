import {GitCmdError} from '../errors';

export function gitBlame(
  _baseRevision: string,
  _file: string,
  _startLine: number,
  lineCount: number
): string {
  const gens = [
    (line: string) =>
      `e732a1a5 (Captain Hook 2022-10-24 13:54:38 +0200   ${line})`,
    (line: string) =>
      `e732a1a5 (Captain Hook 2022-10-23 15:05:50 +0200   ${line})`,
    (line: string) =>
      `bd3261a5 (Peter Pan 2020-10-24 19:21:39 +0200   ${line})`,
  ];

  const out = [];
  for (let i = 0; i < lineCount; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out.push(gens[i % gens.length]!(i.toString()));
  }

  return out.join('\n');
}

export function gitDiff(baseRevision: string): string {
  if (baseRevision === 'invalid') {
    throw new GitCmdError('invalid');
  }
  if (baseRevision === 'error') {
    throw new Error('error');
  }
  return `diff --git a/src/core.ts b/src/core.ts
index f95bb33..72985c5 100644
--- a/src/core.ts
+++ b/src/core.ts
@@ -1,18 +1,68 @@`;
}
