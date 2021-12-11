import { data, flash } from './util';

const log = (arr: [number, boolean][][]) => {
  arr.forEach((row) => {
    console.log(row.map(([e]) => e).join(''));
  });
  console.log('--------------');
};
const run = (arr: [number, boolean][][]): number => {
  let flashes = 0;

  log(arr);
  for (let i = 0; i < 100; i++) {
    arr.forEach((row, y) => {
      row.forEach(([num], x) => {
        arr[y][x] = [num + 1, true];
      });
    });
    arr.forEach((row, y) =>
      row.forEach((oct, x) => {
        flash(y, () => flashes++)(oct, x, arr);
      }),
    );
    // log(arr);
  }
  return flashes;
};
const flashes = run(data);
console.log('finish', flashes);
export {};
