import { data, flashUtil, increment } from './util';

const run = (arr: string[][]): number => {
  let steps = 0;
  let finish = false;

  while (!finish) {
    steps++;
    arr.forEach(increment);
    arr.forEach((row, y) =>
      row.forEach((oct, x) => {
        if (Number(oct) > 9) {
          flashUtil(arr, x, y);
        }
      }),
    );
    finish = arr.every((row) => row.every((oct) => oct.split('')[1] === 'x'));
  }
  return steps;
};
const steps = run(data);
console.log('finish', steps);
export {};
