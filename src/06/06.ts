import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const fishes = input.split(',').map(Number);
let arr: { total: number; counter: number }[] = fishes.map((num) => ({
  total: 1,
  counter: num,
}));

for (let i = 1; i <= 256; i++) {
  arr = arr.map((obj) => {
    obj.counter -= 1;

    return obj;
  });

  const expired = arr.filter((obj) => obj.counter < 0);
  arr = arr.filter((obj) => obj.counter >= 0);

  if (expired.length > 0) {
    const index = arr.findIndex((obj) => obj.counter === 6);

    expired.forEach((obj) => {
      if (index > -1) {
        arr[index].total += obj.total;
      } else {
        arr.push({
          counter: 6,
          total: obj.total,
        });
      }

      arr.push({
        counter: 8,
        total: obj.total,
      });
    });
  }
}

let total = 0;
arr.forEach((obj) => {
  total += obj.total;
});
console.log(arr.length);
console.log(total);
export {};
