export function lines(s: string): Array<string> {
  return s.split(/\n/);
}

export function unlines(lines: Array<string>): string {
  return lines.join('\n');
}

export function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
