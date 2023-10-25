import {GitCmdError} from '../../src/errors';

export function gitBlame(
  _baseRevision: string,
  _file: string,
  _startLine: number,
  lineCount: number
): string {
  const gens = [
    (line: string) =>
      `1313abee1bda1f19199e9f999b999e9119919191 ${line} ${line}
author Captain Hook
author-mail <captain@hook.de>
author-time 1666793860
author-tz +0200
author Captain Hook
author-mail <captain@hook.de>
author-time 1666793860
author-tz +0200
summary Add sturrgg
filename ${_file}
	- stuff`,
    (line: string) =>
      `1313abee1bda1f19199e9f999b999e9119919191 ${line} ${line}
author Kapitän Hook
author-mail <captain@hook.de>
author-time 1666793860
author-tz +0200
author Captain Hook
author-mail <captain@hook.de>
author-time 1666793860
author-tz +0200
summary Add sturrgg
filename ${_file}
	- stuff`,
    (line: string) =>
      `412f4b84ed2840a6312fdb45bf6f29834e36aba4 ${line} ${line}
author Peter Pan
author-mail <peter@pan.de>
author-time 1666793860
author-tz +0200
commiter Peter Pan
commiter-mail <peter@pan.de>
commiter-time 1666793860
commiter-tz +0200
summary Add dependencies to README
filename ${_file}
	- \`git\` executable on your \`$PATH\``,
  ];

  const out: string[] = [];
  for (let i = 0; i < lineCount; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out.push(gens[i % gens.length]!(i.toString()));
  }

  return out.join('\n');
}

export function gitDiff(baseRevision: string): string {
  if (baseRevision === 'invalid') {
    throw new GitCmdError('invalid', new Error('orig'));
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
