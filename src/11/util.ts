import fs from 'fs';
import * as path from 'path';

export const increment = (row: string[], y: number, arr: string[][]): void => {
  row.forEach((oct, x) => {
    arr[y][x] = (Number(oct.split('')[0]) + 1).toString();
  });
};

function* coords() {
  yield [-1, -1];
  yield [-1, 0];
  yield [-1, +1];
  yield [0, -1];
  yield [0, +1];
  yield [+1, -1];
  yield [+1, 0];
  yield [+1, +1];
}

export const flashUtil = (
  arr: string[][],
  x: number,
  y: number,
  callback?: () => void,
): void => {
  callback?.();
  arr[y][x] = `${0}x`;
  // eslint-disable-next-line no-restricted-syntax -- using generator
  for (const [Y, X] of coords()) {
    if (
      arr[y + Y]?.[x + X] !== undefined &&
      arr[y + Y][x + X].split('')[1] !== 'x'
    ) {
      const num = Number(arr[y + Y][x + X]) + 1;
      if (num > 9) {
        flashUtil(arr, x + X, y + Y, callback);
      } else {
        arr[y + Y][x + X] = num.toString();
      }
    }
  }
};

export const data = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .split('\n')
  .map((row) => row.split('').map((oct) => `${oct}x`));
