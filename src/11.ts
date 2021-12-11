const input = `4525436417
1851242553
5421435521
8431325447
4517438332
3521262111
3331541734
4351836641
2753881442
7717616863`;
const data = input
  .split('\n')
  .map((row) => row.split('').map((oct) => `${oct}x`));

function* coords() {
  yield [-1, -1];
  yield [-1, 0];
  yield [-1, +1];
  yield [0, -1];
  yield [0, +1];
  yield [+1, -1];
  yield [+1, 0];
  yield [+1, +1];
}
const logData = (arr: string[][]) => {
  arr.forEach((row) => {
    console.log(row.map((oct) => oct.split('')[0]).join(''));
  });
  console.log('-----------------');
};

const run = (arr: string[][]): number => {
  let steps = 0;
  let finish = false;

  const flash = (x: number, y: number) => {
    arr[y][x] = `${0}x`;
    // eslint-disable-next-line no-restricted-syntax -- using generator
    for (const [Y, X] of coords()) {
      if (
        arr[y + Y]?.[x + X] !== undefined &&
        arr[y + Y][x + X].split('')[1] !== 'x'
      ) {
        const num = Number(arr[y + Y][x + X]) + 1;
        if (num > 9) {
          flash(x + X, y + Y);
        } else {
          arr[y + Y][x + X] = num.toString();
        }
      }
    }
  };
  while (!finish) {
    steps++;
    arr.forEach((row, y) =>
      row.forEach((oct, x) => {
        arr[y][x] = (Number(oct.split('')[0]) + 1).toString();
      }),
    );
    arr.forEach((row, y) =>
      row.forEach((oct, x) => {
        if (Number(oct) > 9) {
          flash(x, y);
        }
      }),
    );
    logData(arr);
    finish = arr.every((row) => row.every((oct) => oct.split('')[1] === 'x'));
  }
  return steps;
};
const flashes = run(data);
console.log('finish', flashes);
// guesses
// 195
export {};
