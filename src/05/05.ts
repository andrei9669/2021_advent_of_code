import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const data = input
  .split('\n')
  .map((el) => el.split(' -> ').map((el2) => el2.split(',').map(Number)));

const run = () => {
  const map: number[][] = [];
  const mark = (x1: number, y1: number) => {
    if (map[y1] === undefined) {
      map[y1] = [];
    }
    if (map[y1][x1] === undefined) {
      map[y1][x1] = 1;
    } else {
      map[y1][x1]++;
    }
  };

  Object.values(data).forEach((command) => {
    let [[x1, y1], [x2, y2]] = command;
    mark(x1, y1);
    while (x1 !== x2 || y1 !== y2) {
      if (x1 !== x2) {
        x1 += x1 < x2 ? 1 : -1;
      }
      if (y1 !== y2) {
        y1 += y1 < y2 ? 1 : -1;
      }
      mark(x1, y1);
    }
  });
  return map.reduce(
    (total, row) =>
      row.reduce((colTotal, col) => colTotal + (col > 1 ? 1 : 0), total),
    0,
  );
};

console.log(run());

export {};
