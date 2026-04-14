Function.prototype.myCall = function (context, ...args) {
  context = context === null ? window : Object(context);
  const fn = Symbol();
  context[fn] = this;
  let result;
  try {
    result = context[fn](...args);
  } finally {
    delete context[fn];
  }
  return result;
};
const obj = { name: "obj" };
function foo(a, b) {
  console.log(this.name, a, b);
}
foo.myCall(obj, 1, 2);
