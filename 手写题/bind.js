Function.prototype.myBind = function (context, ...args1) {
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.bind - is not callable");
  }
  const fn = this;
  return function (...args2) {
    if (new.target) {
      return new fn(...args1, ...args2);
    }
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
