import {describe, expect, test} from '@jest/globals';
import {lines, toISODateString, unlines} from '../src/utils';

describe('utils', () => {
  test('lines', () => {
    const testText = `
1 Testline
    `;

    const testLines = lines(testText);

    expect(testLines.length).toBe(3);
    expect(testLines[0]).toBe('');
    expect(testLines[1]).toBe('1 Testline');
    expect(testLines[2]).toBe('    ');
  });
  test('unlines', () => {
    const testLines = ['1 line', '2 line', '3 line'];

    expect(unlines(testLines)).toBe(`1 line
2 line
3 line`);
  });
  test('lines . unlines = id', () => {
    const testText = `
1 Testline
2 Testline
    `;

    expect(unlines(lines(testText))).toBe(testText);
  });
  test('toIsoDateString', () => {
    const testDate = new Date(Date.UTC(2022, 9, 23));
    expect(toISODateString(testDate)).toBe('2022-10-23');
  });
});
