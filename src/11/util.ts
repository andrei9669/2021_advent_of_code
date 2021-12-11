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
  (y: number, callback?: () => void) =>
  ([oct]: [number, boolean], x: number, arr: [number, boolean][][]): void => {
    if (oct > 9) {
      callback?.();
      arr[y][x] = [0, false];
      // eslint-disable-next-line no-restricted-syntax -- using generator
      for (const [Y, X] of coords()) {
        const [num, bool] = arr[y + Y]?.[x + X] ?? [0, false];
        if (bool) {
          if (num + 1 > 9) {
            flash(y + Y, callback)([num + 1, true], x + X, arr);
          } else {
            arr[y + Y][x + X] = [num + 1, true];
          }
        }
      }
    }
  };
