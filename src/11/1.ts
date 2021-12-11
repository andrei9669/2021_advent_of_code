import { data, flash, increment } from './util';

const run = (arr: string[][]): number => {
  let flashes = 0;

  for (let i = 0; i < 100; i++) {
    arr.forEach(increment);
    arr.forEach((row, y) =>
      row.forEach((oct, x) => {
        if (Number(oct) > 9) {
          flash(arr, x, y, () => {
            flashes++;
          });
        }
      }),
    );
  }
  return flashes;
};
const flashes = run(data);
console.log('finish', flashes);
export {};
