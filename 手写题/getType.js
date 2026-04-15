/**
 * 精准判断数据的类型
 * @param {any} data - 要判断类型的数据
 * @returns {string} 返回小写的类型字符串，如 'array'、'object'、'null' 等
 */
function getType(data) {
  // 调用 Object 原型上的 toString 方法，获取最原始的类型 [object Array]
  let types = Object.prototype.toString.call(data);

  // 截取字符串，从第8位开始到倒数第1位，拿到类型名称：Array / Object / Null ...
  let res = types.slice(8, -1);

  // 转成小写，方便统一使用：array / object / null ...
  return res.toLowerCase();
}

// 1. 判断数组
console.log(getType([1, 2, 3])); // 'array'

// 2. 判断对象
console.log(getType({})); // 'object'
