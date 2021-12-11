import fs from 'fs';
import path from 'path';

export const data = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .split('\n')
  .map((el) =>
    el
      .split('')
      .map(Number)
      .filter((num): num is 1 | 0 => num === 1 || num === 0),
  );

export const bin2dec = (binStr: string): number =>
  Array.from(binStr).reduceRight(
    (total, currValue, index, arr) =>
      currValue === '1' ? total + 2 ** (arr.length - 1 - index) : total,
    0,
  );
