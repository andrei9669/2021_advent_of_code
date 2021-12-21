import fs from 'fs';
import path from 'path';

const startPositions = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim()
  .split('\n')
  .map((el) => Number(el.split(': ')[1]));

const rolls: number[] = [];
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    for (let k = 1; k <= 3; k++) {
      const sum = i + j + k;
      rolls[sum] = (rolls[sum] ?? 0) + 1;
    }
  }
}

const move = (start: number, dist: number) => 1 + ((start - 1 + dist) % 10);

const wins = [0, 0];

const run = (
  player: 0 | 1,
  roll: number,
  position: number[],
  score: number[],
  destCount: number,
) => {
  position[player] = move(position[player], roll);
  score[player] += position[player];
  if (score[player] >= 21) wins[player] += destCount;
  else
    rolls.forEach((destOccurrences, rollSum) => {
      run(
        player === 1 ? 0 : 1,
        rollSum,
        [...position],
        [...score],
        destCount * destOccurrences,
      );
    });
};

rolls.forEach((destOccurrences, rollSum) => {
  run(0, rollSum, [...startPositions], [0, 0], destOccurrences);
});

console.log(Math.max(...wins)); // 190897246590017
