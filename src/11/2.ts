import { data, flash } from './util';

for (let steps = 1, finished = false; !finished; steps++) {
  data.forEach((row, y) => {
    row.forEach(([num], x) => {
      data[y][x] = [num + 1, true];
    });
  });
  data.forEach((row, y) => row.forEach(flash(y, data)));
  finished = data.every((row) => row.every(([, oct]) => !oct));
  if (finished) console.log('11-2', steps);
}
export {};
