import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const data = input.split('\n');

const incomplete = data.flatMap((row) => {
  const map: string[] = [];
  const corrupted = row.split('').some((letter) => {
    const l = map.length - 1;
    switch (letter) {
      case '(':
        map.push('(');
        break;
      case '[':
        map.push('[');
        break;
      case '{':
        map.push('{');
        break;
      case '<':
        map.push('<');
        break;
      default:
        if (
          (letter === ']' && map[l] !== '[') ||
          (letter === ')' && map[l] !== '(') ||
          (letter === '}' && map[l] !== '{') ||
          (letter === '>' && map[l] !== '<')
        ) {
          return true;
        }
        map.pop();
    }
    return false;
  });
  if (!corrupted) {
    return [map];
  }
  return [];
});
const pointMap = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
} as const;
const result = incomplete
  .map((inc) =>
    inc
      .reverse()
      .reduce(
        (acc, cur) => acc * 5 + (pointMap[cur as keyof typeof pointMap] ?? 0),
        0,
      ),
  )
  .sort((a, b) => a - b);

console.log(result[Math.floor(result.length / 2)]);

export {};
