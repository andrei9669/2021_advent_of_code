export type NestedArray = [number | NestedArray, number | NestedArray] & {
  parent: NestedArray;
};

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
