import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const data = input.trim().split('\n').map(Number);

const getElementsSum = (i: number) =>
  data.slice(i, i + 3).reduce((acc, cur) => acc + cur, 0);

let init = getElementsSum(0);
let count = 0;

data.forEach((_, i) => {
  const measurement = getElementsSum(i);
  if (measurement > init) {
    count++;
  }
  init = measurement;
});

console.log(count);

// console.log(getElementsSum(0))
export {};
