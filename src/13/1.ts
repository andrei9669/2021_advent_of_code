import fs from 'fs';
import path from 'path';

const text = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const input = text.trim();

const [dots, instructions] = input
  .split('\n\n')
  .map((section) => section.split('\n'));

const { width, height } = dots.reduce(
  (acc, cur) => {
    const curWidth = Number(cur.split(',')[0]);
    const curHeight = Number(cur.split(',')[1]);
    if (curWidth > acc.width) {
      acc.width = curWidth;
    }
    if (curHeight > acc.height) {
      acc.height = curHeight;
    }
    return acc;
  },
  { width: 0, height: 0 },
);

const table = new Array(height + 1)
  .fill('')
  .map(() => new Array(width + 1).fill('.'));

const dotTable = dots.reduce((acc, dot) => {
  const [x, y] = dot.split(',');
  acc[Number(y)][Number(x)] = '#';
  return acc;
}, table);

instructions.forEach((instruction) => {
  const [foldAxis, fold] = instruction.split('fold along ')[1].split('=');
  const foldNum = Number(fold);
  if (foldAxis === 'y') {
    for (let y = 0; y < dotTable.length - foldNum; y++) {
      dotTable[foldNum + y]?.forEach((dot, x) => {
        if (dot === '#') dotTable[foldNum - y][x] = dot;
      });
    }
    dotTable.splice(foldNum, dotTable.length);
  } else if (foldAxis === 'x')
    dotTable.forEach((row, y) => {
      for (let x = 0; x < row.length - foldNum; x++) {
        const dot = row[foldNum + x];
        if (dot === '#') dotTable[y][foldNum - x] = dot;
      }
      dotTable[y].splice(foldNum, dotTable[y].length);
    });
});
console.log(dotTable.map((row) => row.join('')).join('\n'));
