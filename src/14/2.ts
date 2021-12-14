import fs from 'fs';
import path from 'path';

const text = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const [templateString, insertions] = text.trim().split('\n\n');

const template = templateString.split('');

const insertionRecord = insertions
  .split('\n')
  .map((row) => row.split(' -> '))
  .reduce((acc, [rule, insert]) => {
    acc[rule] = insert;
    return acc;
  }, {} as Record<string, string>);

let pairs: Record<string, number> = {};

template.forEach((e, i) => {
  const next = template[i + 1];
  if (!next) return;
  const pair = e + next;
  pairs[pair] = (pairs[pair] ?? 0) + 1;
});

for (let step = 0; step < 40; step++) {
  const newPairs: Record<string, number> = {};
  Object.keys(pairs).forEach((pair) => {
    const i = insertionRecord[pair];
    if (i === undefined) return;
    const cur = pairs[pair];
    const [a, b] = pair;
    newPairs[a + i] = (newPairs[a + i] ?? 0) + cur;
    newPairs[i + b] = (newPairs[i + b] ?? 0) + cur;
  });
  pairs = newPairs;
}

const letterCounts = Object.entries(pairs).reduce((acc, [[a, b], num]) => {
  acc[a] = (acc[a] ?? 0) + num;
  acc[b] = (acc[b] ?? 0) + num;
  return acc;
}, {} as Record<string, number>);

letterCounts[template[0]] += 1;
letterCounts[template[template.length - 1]] += 1;

Object.keys(letterCounts).forEach((key) => {
  letterCounts[key] = Math.floor(letterCounts[key] / 2);
});

const values = Object.values(letterCounts);
console.log(Math.max(...values) - Math.min(...values));
