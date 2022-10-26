export function lines(s: string): Array<string> {
  return s.split(/\n/);
}

export function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
