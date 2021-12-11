import { data, flash } from './util';

for (let i = 0, flashes = 0; i < 100; i++) {
  data.forEach((row, y) => {
    row.forEach(([num], x) => {
      data[y][x] = [num + 1, true];
    });
  });
  data.forEach((row, y) => row.forEach(flash(y, data, () => flashes++)));
  if (i === 99) console.log('11-1', flashes);
}

export {};
