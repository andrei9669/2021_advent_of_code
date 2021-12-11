import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const data = input.split(',').map(Number);

const min = Math.min(...data);
const max = Math.max(...data);

let best = Number.MAX_SAFE_INTEGER;
for (let i = min; i <= max; i++) {
  const current = data.reduce((acc, cur) => {
    const f = Math.abs(cur - i);
    const fuel = (f ** 2 + f) / 2;
    return acc + fuel;
  }, 0);

  if (best > current) {
    best = current;
  }
}

console.log(best);

export {};
