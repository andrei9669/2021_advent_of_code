import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

let x = 0;
let y = 0;
let aim = 0;

const mapData = (el: string): string[] => el.split(' ');
const filterData = (el: string[]): el is [string, string] => el.length === 2;
const mapData2 = ([mov, unit]: [string, string]): [
  'forward' | 'up' | 'down',
  number,
] => [mov as 'forward' | 'up' | 'down', Number(unit)];

input
  .split('\n')
  .map(mapData)
  .filter(filterData)
  .map(mapData2)
  .forEach(([mov, pos]) => {
    switch (mov) {
      case 'down':
        aim += pos;
        break;
      case 'up':
        aim -= pos;
        break;
      case 'forward':
        x += pos;
        y += aim * pos;
        break;
      default:
        throw new Error();
    }
  });

console.log(x * y);

export {};
