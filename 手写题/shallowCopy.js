function shallowCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const newobj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newobj[key] = obj[key];
    }
  }
  return newobj;
}

const obj = { name: "张三", age: 18 };
const newObj = shallowCopy(obj); // 拷贝

newObj.name = "李四"; // 修改新对象
console.log(obj); // 原对象不变 { name: '张三', age: 18 }
console.log(newObj); // 新对象变了 { name: '李四', age: 18 }
