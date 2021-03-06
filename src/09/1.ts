import * as fs from 'fs';
import * as path from 'path';

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim();
const inputT = `2199943210
3987894921
9856789892
8767896789
9899965678`;

const table = input
  .split('\n')
  .map((row) => row.split('').map((el) => Number(el)));

const data: [number, number][][] = table.map((row) => row.map((el) => [el, 0]));

function* getNextCoordinate() {
  yield [0, -1];
  yield [-1, 0];
  yield [+1, 0];
  yield [0, +1];
}

let res: [number, number][] = [];

const run = (
  arr: [number, number][][],
  x: number,
  y: number,
): [number, number] | undefined => {
  let finalNum: [number, number] | undefined;
  const [curNum] = arr[y][x];
  if (curNum === 9) {
    return undefined;
  }
  let next: undefined | [number, number];
  // eslint-disable-next-line no-restricted-syntax -- generator
  for (const [nextX, nextY] of getNextCoordinate()) {
    const [num] = arr[y + nextY]?.[x + nextX] ?? [
      Number.MAX_SAFE_INTEGER,
      true,
    ];
    if (num < curNum) {
      next = [x + nextX, y + nextY];
      break;
    }
  }
  if (next !== undefined) {
    finalNum = run(arr, next[0], next[1]);
  }
  if (finalNum === undefined) {
    finalNum = [x, y];
  }
  arr[y][x] = [curNum, arr[y][x][1] + 1];
  return finalNum;
};

data.forEach((row, y) => {
  row.forEach((cell, x) => {
    const num = run(data, x, y);
    if (num !== undefined) {
      res.push(num);
    }
  });
});
res = res.filter(
  ([x, y], i) => res.findIndex(([X, Y]) => x === X && y === Y) === i,
);

const basins = res
  .map(([x, y]) => data[y][x][0])
  .reduce((acc, cur) => acc + cur + 1, 0);

console.log(basins);
const result = res.map(([x, y]) => data[y][x][1]).sort((a, b) => b - a);
const [one, two, three] = result;

console.log(one * two * three);
export {};
