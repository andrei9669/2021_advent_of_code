import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const data = input.split('\n').map((el) =>
  el
    .split('')
    .map(Number)
    .filter((num): num is 1 | 0 => num === 1 || num === 0),
);

const bin2dec = (binStr: string) =>
  Array.from(binStr).reduceRight(
    (total, currValue, index, arr) =>
      currValue === '1' ? total + 2 ** (arr.length - 1 - index) : total,
    0,
  );

const part1 = () => {
  // let binary = '';
  //
  // for (let i = 0; i < length; i++) {
  //   let [val0, val1]: [number, number] = [0, 0];
  //   data.forEach((arr) => {
  //     if (arr[i] === 1) {
  //       val1++;
  //     } else {
  //       val0++;
  //     }
  //   });
  //   if (val0 > val1) {
  //     binary += '0';
  //   } else {
  //     binary += '1';
  //   }
  // }
  // const bitFlipped = binary
  //   .split('')
  //   .map((el) => (el === '1' ? '0' : '1'))
  //   .join('');
  //
  // const gammaRate = bin2dec(binary);
  // const epsilonRate = bin2dec(bitFlipped);
};

const part2 = (): number => {
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
  return oxyDec * co2Dec;
};
const p2 = part2();
console.log(p2);

export {};
