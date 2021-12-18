import fs from 'fs';
import path from 'path';

type NestedArray = [number | NestedArray, number | NestedArray] & {
  parent: NestedArray;
};
const input = fs
  .readFileSync(path.join(__dirname, 'inputT.txt'), 'utf-8')
  .trim()
  .split('\n');

function getNumbers(index: number): NestedArray;
function getNumbers(index?: undefined): NestedArray[];
function getNumbers(index?: number): NestedArray | NestedArray[] {
  const compose = (parent: NestedArray) => {
    if (Array.isArray(parent)) {
      parent.forEach((child) => {
        if (Array.isArray(child)) {
          child.parent = parent;
          compose(child);
        }
      });
    }
  };
  if (index !== undefined) {
    const el = JSON.parse(input[index]);
    compose(el);
    return el as NestedArray;
  }
  const parsed: NestedArray[] = input.map((el) => JSON.parse(el));
  parsed.forEach((row) => {
    if (Array.isArray(row)) {
      compose(row);
    }
  });

  return parsed as NestedArray[];
}

// region Logger
const log = (nestedArray: NestedArray): string => {
  let res = '';
  const logInput = (inp: NestedArray) => {
    res += '[';
    if (Array.isArray(inp)) {
      inp.forEach((el, i, arr) => {
        if (Array.isArray(el)) {
          logInput(el);
        } else {
          res += el.toString();
        }
        if (arr.length - 1 !== i) {
          res += ',';
        }
      });
    }
    res += ']';
  };
  logInput(nestedArray);
  return res;
};
// endregion

const calcAnswer = (inp: NestedArray): number[] => {
  const [A, B] = inp.flatMap((el) => {
    if (Array.isArray(el)) {
      let [a, b] = el;
      if (Array.isArray(a)) {
        [a] = calcAnswer(a);
      }
      if (Array.isArray(b)) {
        [b] = calcAnswer(b);
      }
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

const addToRightArray = (inp: NestedArray, val: number): boolean => {
  if (Array.isArray(inp)) {
    const child = inp[0];
    if (Array.isArray(child)) {
      const added = addToRightArray(child, val);
      if (!added) {
        child[0] = val;
        return true;
      }
      return added;
    }
    inp[0] = child + val;
    return true;
  }
  return false;
};
// const addToArray =(inp: NestedArray, val: number, i:1|0): boolean{
//
// }
const addToLeftArray = (inp: NestedArray, val: number): boolean => {
  if (Array.isArray(inp)) {
    const child = inp[1];
    if (Array.isArray(child)) {
      const added = addToLeftArray(child, val);
      if (!added) {
        child[1] = val;
        return true;
      }
      return added;
    }
    inp[1] = child + val;
    return true;
  }
  return false;
};
const addToLeft = (
  current: NestedArray,
  val: number,
  prev?: NestedArray,
): boolean => {
  const { parent } = current;
  if (parent === undefined) {
    const currentLastChild = current[0];
    if (prev === currentLastChild) {
      return false;
    }
    if (Array.isArray(currentLastChild)) {
      return addToLeftArray(currentLastChild, val);
    }
    current[1] = val + currentLastChild;
    return true;
  }
  const firstChild = parent[0];
  if (current !== firstChild && Array.isArray(firstChild)) {
    return addToLeftArray(firstChild, val);
  }
  if (typeof firstChild === 'number') {
    parent[0] = firstChild + val;
    return true;
  }
  return addToLeft(parent, val, current);
};

const addToRight = (
  current: NestedArray,
  val: number,
  prev?: NestedArray,
): boolean => {
  const { parent } = current;
  if (parent === undefined) {
    const currentLastChild = current[1];
    if (currentLastChild === prev) {
      return false;
    }
    if (Array.isArray(currentLastChild)) {
      return addToRightArray(currentLastChild, val);
    }
    current[1] = currentLastChild + val;
    return true;
  }
  const firstChild = parent[1];
  if (current !== firstChild && Array.isArray(firstChild)) {
    return addToRightArray(firstChild, val);
  }
  if (typeof firstChild === 'number') {
    parent[1] = firstChild + val;
    return true;
  }
  return addToRight(parent, val, current);
};

const explode = (current: NestedArray) => {
  const indexInParent = current.parent?.indexOf(current);
  if (childrenAreNumbers(current)) {
    const [a, b] = current;

    const right = current.parent[indexInParent + 1];
    if (typeof right === 'number') {
      current.parent[indexInParent + 1] = right + b;
    } else if (Array.isArray(right)) {
      addToRightArray(right, b);
    } else {
      addToRight(current, b);
    }

    const left = current.parent[indexInParent - 1];
    if (typeof left === 'number') {
      current.parent[indexInParent - 1] = left + a;
    } else if (Array.isArray(left)) {
      addToLeftArray(left, a);
    } else {
      addToLeft(current, a);
    }

    current.parent[indexInParent] = 0;
  }
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
    if (Array.isArray(el)) {
      res = canExplode(el, depth + 1);
      isAllNumbers = false;
      return res !== undefined;
    }
    return false;
  });
  if (isAllNumbers && depth > 3) {
    return inp;
  }
  return res;
};

const canSplit = (inp: NestedArray): NestedArray | undefined => {
  let res: NestedArray | undefined;
  const run = (el: NestedArray | number): boolean => {
    if (typeof el === 'number') {
      return el >= 10;
    }
    const found = el.some(run);
    if (found && res === undefined) {
      res = el;
    }
    return found;
  };
  if (Array.isArray(inp)) {
    inp.some(run);
  }
  return res;
};

const main = (nestedArray: NestedArray): NestedArray => {
  let toExplode: null | undefined | NestedArray = null;
  let toSplit = canSplit(nestedArray);
  console.log(log(nestedArray));
  while (toSplit !== undefined || toExplode !== undefined) {
    if (toSplit) {
      split(toSplit);
      console.log(log(nestedArray), 'split');
    }

    toExplode = canExplode(nestedArray);
    if (toExplode) {
      for (; toExplode !== undefined; toExplode = canExplode(nestedArray)) {
        explode(toExplode);
        console.log(log(nestedArray), 'explode');
      }
    }
    toSplit = canSplit(nestedArray);
  }
  return nestedArray;
};
const numbers = getNumbers();
const first = numbers[0];
const fin = numbers.slice(1).reduce((acc, el) => {
  const res = [acc, el];
  acc.parent = res as NestedArray;
  el.parent = res as NestedArray;
  main(res as NestedArray);
  return res as NestedArray;
}, first);
console.log('fin');
console.log(log(fin), calcAnswer(fin));

const rows = input.length;
let result = 0;
// for (let i = 0; i < rows; i++) {
//   for (let j = 0; j < rows; j++) {
//     if (i !== j) {
//       const left = getNumbers(i);
//       const right = getNumbers(j);
//       const res = main([left, right] as NestedArray);
//       const [calcRes] = calcAnswer(res);
//       if (calcRes > result) {
//         result = calcRes;
//         console.log('------------------------------');
//         console.log(log(left));
//         console.log(log(right));
//         console.log(i, j);
//         console.log('------------------------------');
//       }
//     }
//   }
// }
const left = getNumbers(8);
const right = getNumbers(0);
const res = main([left, right] as NestedArray);
const [calcRes] = calcAnswer(res);
if (calcRes > result) {
  result = calcRes;
  console.log('------------------------------');
  console.log(log(left));
  console.log(log(right));
  console.log(8, 0);
  console.log('------------------------------');
}

console.log(result);

export {};
