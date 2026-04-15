// 给 Function 原型添加自定义 myBind 方法
Function.prototype.myBind = function (context, ...args1) {
  // 判断调用 myBind 的是不是函数，不是就抛出错误
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.bind - is not callable");
  }

  // 保存原函数（谁调用 bind，this 就指向谁）
  const fn = this;

  // 返回一个新的绑定函数
  return function (...args2) {
    // 判断是否是通过 new 调用这个绑定函数
    if (new.target) {
      // new 调用时，忽略绑定的 this，直接 new 原函数，并合并参数
      return new fn(...args1, ...args2);
    }
    // 普通调用：用 apply 把 this 绑定到 context，并合并两次参数
    return fn.apply(context, [...args1, ...args2]);
  };
};

const person = {
  name: "张三",
};

// 普通函数
function say(age, city) {
  console.log(this.name + "，" + age + "岁，来自" + city);
}
// 绑定 this 为 person，得到一个新函数
const boundSay = say.myBind(person);

// 调用时才执行
boundSay(18, "北京");
