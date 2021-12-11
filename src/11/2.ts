import { data, flash } from './util';

const run = (arr: [number, boolean][][]): number => {
  let steps = 0;
  let finish = false;
  for (; !finish; steps++) {
    arr.forEach((row, y) => {
      row.forEach(([num], x) => {
        arr[y][x] = [num + 1, true];
      });
    });
    arr.forEach((row, y) => row.forEach(flash(y, arr)));
    finish = arr.every((row) => row.every(([, oct]) => oct));
  }
  return steps;
};
const steps = run(data);
console.log('finish', steps);
export {};
