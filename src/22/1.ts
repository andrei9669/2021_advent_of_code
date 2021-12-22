import fs from 'fs';
import path from 'path';

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim()
  .split('\n')
  .map((row) => row.split(' '));

const t = input.map(([commandStr, area]) => {
  const planes = area
    .split(',')
    .map((plane) => plane.split('').slice(2).join('').split('..').map(Number));
  const command = commandStr === 'on';
  return { command, planes };
});
const res: Record<string, boolean> = {};

t.forEach(
  (
    { command, planes: [[xStart, xEnd], [yStart, yEnd], [zStart, zEnd]] },
    i,
  ) => {
    console.log(i);
    for (let x = xStart; x <= xEnd; x++) {
      if (x <= 50 && x >= -50) {
        for (let y = yStart; y <= yEnd; y++) {
          if (y <= 50 && y >= -50) {
            for (let z = zStart; z <= zEnd; z++) {
              if (z <= 50 && z >= -50) {
                res[`${x}_${y}_${z}`] = command;
              }
            }
          }
        }
      }
    }
  },
);

const on = Object.values(res).filter(Boolean);
console.log('fin', on.length);
