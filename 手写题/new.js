function mynew(fn, ...agrs) {
  const obj = {};
  obj.__proto__ = fn.prototype;
  let res = fn.apply(obj, agrs);
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
