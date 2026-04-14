Function.prototype.myApply = function (context, args) {
  context = context === null ? window : Object(context);
  const fn = Symbol("fn");
  context[fn] = this;
  let result;
  try {
    result = args ? context[fn](...args) : context[fn]();
  } finally {
    delete context[fn];
  }
  return result;
};
const obj = { name: "李四" };

function say(age, city) {
  console.log(this.name + "，" + age + "岁，来自" + city);
}

// apply 必须传 数组！！！
say.myApply(obj, [20, "上海"]);
