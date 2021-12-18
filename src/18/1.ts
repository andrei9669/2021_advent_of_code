import fs from 'fs';
import path from 'path';

import type { NestedArray } from './util';

const input = fs
  .readFileSync(path.join(__dirname, 'input.txt'), 'utf-8')
  .trim()
  .split('\n');

function getNumbers(index: number): NestedArray;
function getNumbers(index?: undefined): NestedArray[];
function getNumbers(index?: number): NestedArray | NestedArray[] {
  const compose = (parent: NestedArray) => {
    if (!Array.isArray(parent)) return;
    parent.forEach((child) => {
      if (Array.isArray(child)) {
        child.parent = parent;
        compose(child);
      }
    });
  };
  if (index !== undefined) {
    const el = JSON.parse(input[index]);
    compose(el);
    return el as NestedArray;
  }
  const parsed: NestedArray[] = input.map((el) => JSON.parse(el));
  parsed.forEach((row) => {
    if (Array.isArray(row)) compose(row);
  });

  return parsed as NestedArray[];
}

const calcAnswer = (inp: NestedArray): number[] => {
  const [A, B] = inp.flatMap((el) => {
    if (Array.isArray(el)) {
      let [a, b] = el;
      if (Array.isArray(a)) [a] = calcAnswer(a);
      if (Array.isArray(b)) [b] = calcAnswer(b);
      return [a * 3 + b * 2];
    }
    return [el];
  });
  return [A * 3 + B * 2];
};

const childrenAreNumbers = (
  n: (NestedArray | number)[],
): n is [number, number] =>
  n.every((el): el is number => typeof el === 'number');

const addToArray = (inp: NestedArray, val: number, left: boolean): boolean => {
  const i = left ? 1 : 0;
  if (!Array.isArray(inp)) return false;
  const child = inp[i];
  if (Array.isArray(child)) {
    const added = addToArray(child, val, left);
    if (!added) {
      child[i] = val;
      return true;
    }
    return added;
  }
  inp[i] = child + val;
  return true;
};

const addTo = (
  current: NestedArray,
  val: number,
  left: boolean,
  prev?: NestedArray,
): boolean => {
  const i = left ? 0 : 1;
  const { parent } = current;
  if (parent === undefined) {
    const currentLastChild = current[i];
    if (prev === currentLastChild) return false;
    if (Array.isArray(currentLastChild))
      return addToArray(currentLastChild, val, left);

    current[i] = val + currentLastChild;
    return true;
  }
  const firstChild = parent[i];
  if (current !== firstChild && Array.isArray(firstChild))
    return addToArray(firstChild, val, left);
  if (typeof firstChild === 'number') {
    parent[i] = firstChild + val;
    return true;
  }
  return addTo(parent, val, left, current);
};

const explode = (current: NestedArray) => {
  const indexInParent = current.parent?.indexOf(current);
  if (!childrenAreNumbers(current)) return;
  const [a, b] = current;
  const right = current.parent[indexInParent + 1];
  if (typeof right === 'number') current.parent[indexInParent + 1] = right + b;
  else if (Array.isArray(right)) addToArray(right, b, false);
  else addTo(current, b, false);

  const left = current.parent[indexInParent - 1];
  if (typeof left === 'number') current.parent[indexInParent - 1] = left + a;
  else if (Array.isArray(left)) addToArray(left, a, true);
  else addTo(current, a, true);

  current.parent[indexInParent] = 0;
};

const split = (current: NestedArray) => {
  const [a, b] = current;
  if (typeof a === 'number' && a >= 10) {
    const left = Math.floor(a / 2);
    const right = Math.ceil(a / 2);
    const arr = [left, right];
    (arr as NestedArray).parent = current;
    current[0] = arr as NestedArray;
  } else if (typeof b === 'number' && b >= 10) {
    const left = Math.floor(b / 2);
    const right = Math.ceil(b / 2);
    const arr = [left, right];
    (arr as NestedArray).parent = current;
    current[1] = arr as NestedArray;
  }
};

const canExplode = (inp: NestedArray, depth = 0): NestedArray | undefined => {
  let isAllNumbers = true;
  let res: NestedArray | undefined;
  inp.some((el) => {
    if (!Array.isArray(el)) return false;
    res = canExplode(el, depth + 1);
    isAllNumbers = false;
    return res !== undefined;
  });
  if (isAllNumbers && depth > 3) return inp;
  return res;
};

const canSplit = (inp: NestedArray): NestedArray | undefined => {
  let res: NestedArray | undefined;
  const run = (el: NestedArray | number): boolean => {
    if (typeof el === 'number') return el >= 10;
    const found = el.some(run);
    if (found && res === undefined) res = el;
    return found;
  };
  if (Array.isArray(inp)) inp.some(run);
  return res;
};

const main = (nestedArray: NestedArray): NestedArray => {
  let toExplode: null | undefined | NestedArray = null;
  let toSplit = canSplit(nestedArray);
  while (toSplit !== undefined || toExplode !== undefined) {
    if (toSplit) split(toSplit);

    toExplode = canExplode(nestedArray);
    if (toExplode)
      for (; toExplode !== undefined; toExplode = canExplode(nestedArray)) {
        explode(toExplode);
      }

    toSplit = canSplit(nestedArray);
  }
  return nestedArray;
};
// part 1
// const numbers = getNumbers();
// const first = numbers[0];
// const fin = numbers.slice(1).reduce((acc, el) => {
//   const res = [acc, el];
//   acc.parent = res as NestedArray;
//   el.parent = res as NestedArray;
//   main(res as NestedArray);
//   return res as NestedArray;
// }, first);
// console.log('fin');
// console.log(log(fin), calcAnswer(fin));

// part 2
const t1 = performance.now();
const rows = input.length;
let result = 0;
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
    if (i !== j) {
      const left = getNumbers(i);
      const right = getNumbers(j);
      const temp = [left, right];
      left.parent = temp as NestedArray;
      right.parent = temp as NestedArray;
      const res = main(temp as NestedArray);
      const [calcRes] = calcAnswer(res);
      if (calcRes > result) {
        result = calcRes;
      }
    }
  }
}
const t2 = performance.now();
console.log(result, t2 - t1);

export {};
