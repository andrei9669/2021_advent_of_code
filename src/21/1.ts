import fs from 'fs';
import path from 'path';

const position = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim()
  .split('\n')
  .map((el) => Number(el.split(': ')[1]));

const score = [0, 0];
let playerTurn = 1;
let die = 0;
let rolls = 0;
while (score[playerTurn] < 1000) {
  playerTurn = playerTurn === 0 ? 1 : 0;
  die += 3;
  rolls += 3;
  die %= 100;
  die = die === 0 ? 100 : die;
  const n1 = (die ** 2 + die) / 2;
  const n2 = ((die - 3) ** 2 + (die - 3)) / 2;
  const n3 = (n1 - n2) % 10;
  const n4 = n3 + position[playerTurn];
  const n5 = n4 % 10;

  position[playerTurn] = n5 === 0 ? 10 : n5;

  score[playerTurn] += position[playerTurn];
}

console.log(score, playerTurn, rolls, die);

const loserScore = Math.min(...score);
console.log(loserScore * rolls);
