import {describe, expect, test} from '@jest/globals';
import {lines} from './utils';

describe('utils', () => {
  test('lines', () => {
    const testText = `
1 Testline
    `;

    const testLines = lines(testText);

    expect(testLines[0]).toBe('');
    expect(testLines[1]).toBe('1 Testline');
    expect(testLines.join('\n')).toBe(testText);
  });
});
