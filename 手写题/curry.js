// 通用柯里化函数
// fn：需要被柯里化的原函数
function curry(fn) {
  // 返回一个柯里化后的 curried 函数
  return function curried(...args) {
    // args：本次调用时传入的所有参数（数组）

    // 判断：当前收集的参数数量 是否 大于等于 原函数需要的参数数量
    // fn.length 是原函数声明的形参个数
    if (args.length >= fn.length) {
      // 参数够了 → 执行原函数，绑定正确的 this，并传入所有参数
      return fn.apply(this, args);
    }

    // 参数不够 → 返回一个新函数，继续接收剩余参数
    return function (...args2) {
      // args2：新接收的参数
      // 递归调用 curried，继续收集参数
      // 同时把 this 传递下去，保证不丢失上下文
      return curried.apply(this, args.concat(args2));
    };
  };
}

// 1. 原函数：接收 3 个参数
function sum(a, b, c) {
  console.log("a =", a, "b =", b, "c =", c);
  return a + b + c;
}

// 2. 柯里化
let curriedSum = curry(sum);

// 3. 各种调用方式都可以
console.log(curriedSum(1)(2)(3)); // 6
