/* eslint-disable @typescript-eslint/no-explicit-any */
import {jest} from '@jest/globals';
import type {SpawnSyncReturns} from 'child_process';

const child_process = jest.createMockFromModule('child_process') as any;

type MockOpts = {
  mockThrow?: string;
  mockError?: string;
};

let mockOpts: MockOpts = {};
function __setMockOpts(opts: Partial<MockOpts>): void {
  mockOpts = {...mockOpts, ...opts};
}

function spawnSync(cmd: string, args: string[]): SpawnSyncReturns<string> {
  const out: SpawnSyncReturns<string> = {
    pid: 1,
    output: [],
    stderr: '',
    stdout: '',
    status: null,
    signal: null,
  };

  if (mockOpts.mockThrow) {
    out.error = new Error(mockOpts.mockThrow);
  } else if (mockOpts.mockError) {
    out.stderr = mockOpts.mockError;
  } else {
    out.stdout = [cmd, ...args].join(' ');
  }

  return out;
}

child_process.__setMockOpts = __setMockOpts;
child_process.spawnSync = spawnSync;

module.exports = child_process;
