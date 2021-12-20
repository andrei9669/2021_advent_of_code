import fs from 'fs';
import path from 'path';

const [algoS, input] = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim()
  .split('\n\n');

const algo = algoS.split('');

const getAlgoIndex = (
  array: string[][],
  [x, y]: [number, number],
  iteration: number,
): number => {
  let result = '';
  for (let Y = y - 1; Y <= y + 1; Y++) {
    for (let X = x - 1; X <= x + 1; X++) {
      let val = array?.[Y]?.[X];
      if (val === undefined) {
        if (iteration % 2 === 0 && algo[0] === '#') val = algo[algo.length - 1];
        else [val] = algo;
      }
      result += val === '#' ? '1' : '0';
    }
  }
  return parseInt(result, 2);
};

const pad = (inp: string[][], iteration: number): string[][] => {
  const l = inp[0].length;
  const result: string[][] = [];
  const fill =
    algo[0] === '#' && iteration % 2 === 0 ? algo[algo.length - 1] : algo[0];

  result.push(new Array(l + 2).fill(fill));
  inp.forEach((row) => {
    result.push([fill, ...row, fill]);
  });
  result.push(new Array(l + 2).fill(fill));
  return result;
};

let start = input.split('\n').map((el) => el.split(''));

for (let i = 0; i < 50; i++) {
  const padded = pad(start, i);
  start = [];
  padded.forEach((row, y) =>
    row.forEach((cell, x) => {
      const index = getAlgoIndex(padded, [x, y], i);
      if (start[y] === undefined) {
        start[y] = [];
      }
      start[y][x] = algo[index];
    }),
  );
}

const res = start.reduce(
  (total, row) =>
    row.reduce((acc, cur) => (cur === '#' ? acc + 1 : acc), total),
  0,
);

console.log(res);
// part 1 - 5432
// part 2 - 16016
