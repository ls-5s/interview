/**
 * 手写实现 instanceof 关键字
 * 原理：沿着实例的 __proto__ 原型链向上找，看是否能匹配到构造函数的 prototype
 * @param {*} left - 要检测的实例（通常是对象）
 * @param {*} right - 构造函数
 * @returns {boolean} - 是否是该构造函数的实例
 */
function myinstanceof(left, right) {
  // 1. 基础类型直接返回 false（原生 instanceof 对 string/number/boolean 等基础类型全返回 false）
  if (typeof left !== "object" || left === null) {
    return false;
  }

  // 2. 拿到实例的 __proto__（原型链起点）
  let leftProto = left.__proto__;

  // 3. 开启循环，沿着原型链一直往上找
  while (true) {
    // 3.1 找到原型链顶端 null 都没匹配上 → 返回 false
    if (leftProto === null) {
      return false;
    }

    // 3.2 实例的原型 === 构造函数的 prototype → 匹配成功，返回 true
    if (leftProto === right.prototype) {
      return true;
    }

    // 3.3 没匹配上，继续往上找原型（原型链上移）
    leftProto = leftProto.__proto__;
  }
}

// 1. 测试数组
console.log(myinstanceof([], Array)); // true
console.log(myinstanceof([], Object));
