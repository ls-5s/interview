function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  const newObj = Array.isArray(obj) ? [] : {};
  map.set(obj, newObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key], map);
    }
  }
  return newObj;
}

const arr = [{ name: "小红" }, { name: "小刚" }];

const newArr = deepClone(arr);

newArr[0].name = "小李";

console.log(arr[0].name); // 小红（没变）
console.log(newArr[0].name); // 小李（变了）
