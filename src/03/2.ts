import { bin2dec, data } from './util';

const find = (
  arr: number[][],
  comparator = (a: number, b: number) => a > b,
  i = 0,
): number[][] => {
  if (arr.length === 1) {
    return arr;
  }
  let [b0, b1] = [0, 0];
  arr.forEach((el) => {
    const bit = el[i];
    if (bit === 1) {
      b1++;
    } else {
      b0++;
    }
  });
  const filtered = arr.filter((el) => {
    if (comparator(b0, b1)) {
      return el[i] === 0;
    }
    return el[i] === 1;
  });
  return find(filtered, comparator, i + 1);
};
const oxy = find(data).flat().join('');
const co2 = find(data, (a, b) => a <= b)
  .flat()
  .join('');

const oxyDec = bin2dec(oxy);
const co2Dec = bin2dec(co2);
console.log(oxyDec * co2Dec);

export {};
