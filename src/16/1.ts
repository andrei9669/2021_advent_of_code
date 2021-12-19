import fs from 'fs';
import path from 'path';

const input = fs
  .readFileSync(path.join(__dirname, 'inputT.txt'), 'utf-8')
  .trim();

const hexToBin = (str: string): string =>
  str
    .split('')
    .map((el) => parseInt(el, 16).toString(2).padStart(4, '0'))
    .join('');

const getChunk = (str: string, size = 5): string[] => {
  const { length } = str;
  const chunks = Array(Math.ceil(length / size));
  for (let i = 0, index = 0; index < length; i++) {
    chunks[i] = str.slice(index, (index += size));
  }
  return chunks.filter((el) => el.length === size);
};

const sum = (acc: number, cur: number): number => acc + cur;
const product = (acc: number, cur: number): number => acc * cur;
const min = (numbers: number[]): number => Math.min(...numbers);
const max = (numbers: number[]): number => Math.max(...numbers);
const greaterThan = ([a, b]: number[]): number => (a > b ? 1 : 0);
const lessThan = ([a, b]: number[]): number => (a < b ? 1 : 0);
const equalTo = ([a, b]: number[]): number => (a === b ? 1 : 0);

const calc = (type: number, values: number[]): number => {
  switch (type) {
    case 7:
      return equalTo(values);
    case 6:
      return lessThan(values);
    case 5:
      return greaterThan(values);
    case 3:
      return max(values);
    case 2:
      return min(values);
    case 1:
      return values.reduce(product, 1);
    default:
    case 0:
      return values.reduce(sum, 0);
  }
};

const run = (binary: string): { packetLength: number; value: number } => {
  const versionB = binary.slice(0, 3);
  const typeB = binary.slice(3, 6);

  const type = parseInt(typeB, 2);
  if (type === 4) {
    const literalB = binary.slice(6);
    const chunks = getChunk(literalB);
    let num = '';
    let packet = versionB + typeB;
    chunks.some((str) => {
      const [limit, ...chunk] = str;
      num += chunk.join('');
      packet += str;
      return limit === '0';
    });
    return {
      packetLength: packet.length,
      value: parseInt(num, 2),
    };
  }
  const lengthType = binary.slice(6, 7);
  if (lengthType === '1') {
    const packetCountB = binary.slice(7, 18);
    const packetCount = parseInt(packetCountB, 2);
    let bData = binary.slice(18);
    let totalLength = 0;
    const values: number[] = [];
    for (let i = 0; i < packetCount; i++) {
      const { packetLength, value } = run(bData);
      bData = bData.slice(packetLength);
      totalLength += packetLength;
      values.push(value);
    }
    return { packetLength: totalLength + 18, value: calc(type, values) };
  }
  const totalLengthB = binary.slice(7, 22);
  const totalLength = parseInt(totalLengthB, 2);
  let packetsB = binary.slice(22, 22 + totalLength);
  const values: number[] = [];
  while (packetsB.length > 0) {
    const res = run(packetsB);
    const { packetLength, value } = res;
    values.push(Number(value));
    packetsB = packetsB.slice(packetLength);
  }
  return {
    packetLength: 22 + totalLength,
    value: calc(type, values),
  };
};

const results = input
  .split('\n')
  .map(hexToBin)
  .map(run)
  .map((el) => el.value);
console.log(results);
export {};
