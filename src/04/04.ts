import * as fs from 'fs';
import path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const [numbersString, ...boardsStrings] = input.split(/[\n]{2}/gm);
const numbers = numbersString.split(',');
const boards = boardsStrings.map((boardString) =>
  boardString
    .split('\n')
    .map((rowString) => rowString.split(' ').filter((string) => string !== '')),
);

const getBoardsLeft = (arr: string[][][]) => arr.reduce((acc) => acc + 1, 0);

let winBoard: string[][] | undefined;
let lastNumber: number | undefined;

numbers.some((num) => {
  lastNumber = Number(num);
  return boards.some((board, i) => {
    let coords: [x: number, y: number] | undefined;

    board.some((row, y) =>
      row.some((col, x) => {
        if (col === num) {
          board[y][x] = 'X';
          coords = [y, x];
          return true;
        }
        return false;
      }),
    );
    if (coords) {
      const [x, y] = coords;
      const winRow = board[x].every((el) => el === 'X');
      const winCol = board.every((row) => row[y] === 'X');
      const win = winRow || winCol;
      if (win) {
        delete boards[i];
        winBoard = board;
      }
      if (getBoardsLeft(boards) === 0) {
        return true;
      }
    }
    return false;
  });
});
const boardPoints = winBoard?.reduce(
  (rowAcc, row) =>
    row.reduce((colAcc, col) => {
      const num = Number(col);
      if (Number.isFinite(num)) {
        return colAcc + num;
      }
      return colAcc;
    }, rowAcc),
  0,
);
console.log(boardPoints, lastNumber);
console.log(numbers);
console.log(boards);
console.log((boardPoints ?? 0) * (lastNumber ?? 0));
