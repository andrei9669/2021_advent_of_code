import fs from 'fs';
import * as path from 'path';

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .split('\n');
input.pop();

export const data: [number, boolean][][] = input.map((row) =>
  row.split('').map((oct) => [Number(oct), false]),
);

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

export const flash =
  (y: number, arr: [number, boolean][][], flashCountCallback?: () => void) =>
  ([oct]: [number, boolean], x: number): void => {
    if (oct > 9) return;
    flashCountCallback?.();
    arr[y][x] = [0, false];
    // eslint-disable-next-line no-restricted-syntax -- using generator
    for (const [Y, X] of coords()) {
      const [num, notFlashed] = arr[y + Y]?.[x + X] ?? [0, false];
      if (num + 1 > 9 && notFlashed) {
        flash(y + Y, arr, flashCountCallback)([num + 1, true], x + X);
      } else if (notFlashed) {
        arr[y + Y][x + X] = [num + 1, true];
      }
    }
  };
