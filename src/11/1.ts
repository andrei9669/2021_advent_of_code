import { data, flash } from './util';

const run = (arr: [number, boolean][][]): number => {
  let flashes = 0;
  for (let i = 0; i < 100; i++) {
    arr.forEach((row, y) => {
      row.forEach(([num], x) => {
        arr[y][x] = [num + 1, true];
      });
    });
    arr.forEach((row, y) => row.forEach(flash(y, arr, () => flashes++)));
  }
  return flashes;
};
console.log('finish', run(data));
export {};
