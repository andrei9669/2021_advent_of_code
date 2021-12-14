import fs from 'fs';
import path from 'path';

const text = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const [templateString, insertions] = text.trim().split('\n\n');

const template = templateString.split('');

const insertionStrings = insertions
  .split('\n')
  .map((row) => row.split(' -> '))
  .reduce((acc, [[A, B], insert]) => {
    if (acc[A] === undefined) {
      acc[A] = {};
    }
    acc[A][B] = insert;
    return acc;
  }, {} as Record<string, Record<string, string>>);

for (let step = 0; step < 40; step++) {
  const insertIndex: string[] = [];
  let insertion = 0;
  template.forEach((e, i) => {
    insertIndex[i + 1 + insertion++] = insertionStrings?.[e]?.[template[i + 1]];
  });
  insertIndex.forEach((insert, index) => {
    if (insert !== undefined) {
      template.splice(index, 0, insert);
    }
  });
  console.log(step, template.length);
}
const polymerCount: Record<string, number> = {};
template.forEach((polymer) => {
  if (polymerCount[polymer] === undefined) {
    polymerCount[polymer] = 0;
  }
  polymerCount[polymer]++;
});
let mostCommon = Number.MIN_SAFE_INTEGER;
let leastCommon = Number.MAX_SAFE_INTEGER;
Object.values(polymerCount).forEach((count) => {
  if (count < leastCommon) {
    leastCommon = count;
  }
  if (count > mostCommon) {
    mostCommon = count;
  }
});
console.log(mostCommon - leastCommon);
// console.log(template.join(''));
