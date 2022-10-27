import {describe, expect, test} from '@jest/globals';
import {spawnSync} from 'child_process';

describe('e2e test git-suggest-reviewer', () => {
  test('prints usage with --help', () => {
    const result = spawnSync('node', ['./dist/cli.js', '--help'], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toMatchSnapshot();
    expect(result.stderr).toEqual('');
  });
  test('prints usage to stderr and sets exitcode to 1 with no arguments', () => {
    const result = spawnSync('node', ['./dist/cli.js'], {
      encoding: 'utf-8',
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toEqual('');
    expect(result.stderr).toMatchSnapshot();
  });
});
