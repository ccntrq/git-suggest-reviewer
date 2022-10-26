/* eslint-disable @typescript-eslint/no-explicit-any */
import {jest} from '@jest/globals';

const child_process = jest.createMockFromModule('child_process') as any;

let mockThrow = false;
function __setMockThrow(value: boolean): void {
  mockThrow = value;
}

function execSync(...args: any[]): any[] {
  if (mockThrow) {
    throw new Error('MockError');
  }
  return args;
}

child_process.__setMockThrow = __setMockThrow;
child_process.execSync = execSync;

module.exports = child_process;
