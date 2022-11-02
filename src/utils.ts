export function lines(s: string): Array<string> {
  return s.split(/\n/);
}

export function unlines(lines: Array<string>): string {
  return lines.join('\n');
}

export function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function bracketString(
  leftBracket: '<' | '(' | '{' | '[',
  s: string
): string {
  let rightBracket;
  switch (leftBracket) {
    case '<':
      rightBracket = '>';
      break;
    case '(':
      rightBracket = ')';
      break;
    case '{':
      rightBracket = '}';
      break;
    case '[':
      rightBracket = ']';
      break;
    default:
      assertPatternMatchIsExhaustive('bracketString', leftBracket);
  }

  return [leftBracket, s, rightBracket].join('');
}

function assertPatternMatchIsExhaustive(
  caller: string,
  _: 'ERROR: Pattern match not exhaustive'
): never {
  throw new Error(
    `UNEXPECTED: Non-exhaustive patterns in function ${caller}. Patterns not matched: ${`'${
      _ ?? (_ === undefined ? 'undefined' : 'null')
    }'`}\nThis is a bug and should have been a reported at compile!`
  );
}
