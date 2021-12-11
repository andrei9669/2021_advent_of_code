const input = `3,3,5,1,1,3,4,2,3,4,3,1,1,3,3,1,5,4,4,1,4,1,1,1,3,3,2,3,3,4,2,5,1,4,1,2,2,4,2,5,1,2,2,1,1,1,1,4,5,4,3,1,4,4,4,5,1,1,4,3,4,2,1,1,1,1,5,2,1,4,2,4,2,5,5,5,3,3,5,4,5,1,1,5,5,5,2,1,3,1,1,2,2,2,2,1,1,2,1,5,1,2,1,2,5,5,2,1,1,4,2,1,4,2,1,1,1,4,2,5,1,5,1,1,3,1,4,3,1,3,2,1,3,1,4,1,2,1,5,1,2,1,4,4,1,3,1,1,1,1,1,5,2,1,5,5,5,3,3,1,2,4,3,2,2,2,2,2,4,3,4,4,4,1,2,2,3,1,1,4,1,1,1,2,1,4,2,1,2,1,1,2,1,5,1,1,3,1,4,3,2,1,1,1,5,4,1,2,5,2,2,1,1,1,1,2,3,3,2,5,1,2,1,2,3,4,3,2,1,1,2,4,3,3,1,1,2,5,1,3,3,4,2,3,1,2,1,4,3,2,2,1,1,2,1,4,2,4,1,4,1,4,4,1,4,4,5,4,1,1,1,3,1,1,1,4,3,5,1,1,1,3,4,1,1,4,3,1,4,1,1,5,1,2,2,5,5,2,1,5`;

const fishes = input.split(',').map(Number);
let arr: { total: number; counter: number }[] = fishes.map((num) => ({
  total: 1,
  counter: num,
}));

for (let i = 1; i <= 256; i++) {
  arr = arr.map((obj) => {
    obj.counter -= 1;

    return obj;
  });

  const expired = arr.filter((obj) => obj.counter < 0);
  arr = arr.filter((obj) => obj.counter >= 0);

  if (expired.length > 0) {
    const index = arr.findIndex((obj) => obj.counter === 6);

    expired.forEach((obj) => {
      if (index > -1) {
        arr[index].total += obj.total;
      } else {
        arr.push({
          counter: 6,
          total: obj.total,
        });
      }

      arr.push({
        counter: 8,
        total: obj.total,
      });
    });
  }
}

let total = 0;
arr.forEach((obj) => {
  total += obj.total;
});
console.log(arr.length);
console.log(total);
export {};
