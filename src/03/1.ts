import { bin2dec, data } from './util';

let binary = '';
const { length } = data[0];
for (let i = 0; i < length; i++) {
  let [val0, val1]: [number, number] = [0, 0];
  data.forEach((arr) => {
    if (arr[i] === 1) {
      val1++;
    } else {
      val0++;
    }
  });
  if (val0 > val1) {
    binary += '0';
  } else {
    binary += '1';
  }
}
const bitFlipped = binary
  .split('')
  .map((el) => (el === '1' ? '0' : '1'))
  .join('');

const gammaRate = bin2dec(binary);
const epsilonRate = bin2dec(bitFlipped);

console.log(gammaRate * epsilonRate);
