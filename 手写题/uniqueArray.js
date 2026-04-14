function uniqueArray(arr) {
  return [...new Set(arr)];
}
let arr = [1, 2, 3, 4, 5, 5, 6];
console.log(uniqueArray(arr));
function un(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!res.includes(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}
console.log(un(arr));
