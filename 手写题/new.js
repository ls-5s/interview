// 手写实现 new 关键字
// fn：构造函数，...args：传给构造函数的参数列表
function mynew(fn, ...args) {
  // 1. 创建一个空的对象
  const obj = {};

  // 2. 将空对象的 __proto__ 指向构造函数的 prototype
  // 实现原型链继承，obj 能访问到 fn.prototype 上的方法
  obj.__proto__ = fn.prototype;

  // 3. 执行构造函数，把 this 绑定到 obj 上，并传入参数
  // apply 第二个参数是数组，刚好对应 ...args 收集的数组
  let res = fn.apply(obj, args);

  // 4. 如果构造函数返回了对象/函数，就用这个返回值
  // 否则返回我们创建的新对象 obj
  return res instanceof Object ? res : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name, this.age);
};
let p = mynew(Person, "lucy", 18);
console.log(p);
p.sayName();
