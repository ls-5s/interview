function fl(arr) {
  let res = [];
  for (let k of arr) {
    if (Array.isArray(k)) {
      res = res.concat(fl(k));
    } else {
      res.push(k);
    }
  }
  return res;
}
console.log(fl([1, [2, [3, 4], 5], 6]));
