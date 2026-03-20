# typeof 能判断哪些类型

Object.prototype.toString.call(value)

# == 和 === 有什么区别？

NaN == NaN 为什么是 false？

👉 Object.is 和 === 区别（高频🔥）

👉 0 == '' 为什么是 true？

👉 [] == [] 为什么是 false？

# 值类型和引用类型的区别

# 箭头函数和普通函数的区别

箭头函数是“无 this 的函数”，this 在定义时就确定；普通函数的 this 取决于调用方式

【1️⃣ 核心区别（最重要🔥）】
✅ 1. this 指向（面试必考点）
普通函数：

this 在调用时决定

谁调用，this 指向谁

const obj = {
  name: 'A',
  fn() {
    console.log(this.name)
  }
}
obj.fn() // A

箭头函数：

this 在定义时决定（词法作用域）

永远指向外层作用域的 this

const obj = {
  name: 'A',
  fn: () => {
    console.log(this.name)
  }
}
obj.fn() // undefined（不是 obj）

👉 面试加分一句：

“箭头函数没有自己的 this，会捕获外层 this”

✅ 2. 是否可以作为构造函数

普通函数：✅ 可以 new

箭头函数：❌ 不可以

const A = () => {}
new A() // 报错

👉 原因：

箭头函数没有 prototype

1. arguments 对象

普通函数：✅ 有 arguments

箭头函数：❌ 没有

function fn() {
  console.log(arguments)
}

const fn2 = () => {
  console.log(arguments) // 报错
}

👉 替代方案：使用 ...rest

✅ 4. this 是否可被改变

普通函数：可以用 call / apply / bind

箭头函数：❌ 无法改变

const fn = () => {}
fn.call(obj) // 无效

👉 为什么要有箭头函数？

为了解决：

❗ this 混乱问题

setTimeout(function () {
  console.log(this) // window
}, 1000)

👉 用箭头函数：

setTimeout(() => {
  console.log(this) // 外层 this
}, 1000)

# 什么时候不能使用箭头函数

❌ 不能用的 5 大场景

1️⃣ 需要 this 的场景
👉 对象方法 / 事件回调 / Vue methods
（箭头函数 this 是静态的 ❌）

2️⃣ 构造函数（new）
👉 箭头函数不能 new，没有 prototype ❌

3️⃣ 需要 arguments
👉 箭头函数没有 arguments ❌（只能用 ...args）

4️⃣ 需要改变 this（call / apply / bind）
👉 箭头函数 this 绑定死了 ❌

5️⃣ 面向对象 / 原型链
👉 箭头函数没有 prototype ❌

# for...in 和 for...of 的区别

【0️⃣ 一句话结论】
👉 for...in 遍历“键（key）”，for...of 遍历“值（value）”。

【3️⃣ 为什么数组不推荐用 for...in？（重点🔥）】

👉 因为：

key 是字符串（"0"、"1"）

可能遍历到原型链上的属性

顺序不一定可靠

👉 面试可以这样说：

“for...in 更适合对象，数组应该用 for...of 或 forEach”

👉 如果面试官追问：

❓ 为什么对象不能用 for...of？
👉 回答：

“因为普通对象没有实现 Symbol.iterator，不是可迭代对象”

# JS 作用域和作用域链

👉 作用域决定变量在哪里能访问，作用域链决定变量查找的路径。

JS 中主要有三种作用域：

1️⃣ 全局作用域（Global Scope）

在最外层定义

浏览器中挂在 window 上

var a = 1
2️⃣ 函数作用域（Function Scope）

函数内部定义的变量

外部无法访问

function fn() {
  var b = 2
}
3️⃣ 块级作用域（Block Scope）

let / const 产生

{} 内有效

{
  let c = 3
}

【2️⃣ 作用域链（Scope Chain）】
🔹 核心概念

当访问一个变量时：

👉 当前作用域找
👉 找不到 → 去外层作用域
👉 一直找到全局作用域
👉 还没有 → 报错

【3️⃣ 本质原理（How）🔥】
🔹 作用域在什么时候确定？

👉 函数定义时（静态作用域 / 词法作用域）

不是调用时！！！

# JS 自由变量，如何理解

自由变量 = 在当前作用域中未声明、需要通过作用域链向上查找的变量。

# JS 闭包，如何理解

【1️⃣ 基础概念（What）】
🔹 什么是闭包？

👉 当一个函数**访问了外部作用域的变量（自由变量）**时
👉 就形成了闭包

【2️⃣ 本质理解（How）🔥】
🔹 闭包本质到底是什么？

👉 本质就一句话：

函数在定义时，会“记住”它的作用域（词法作用域）

🔹 闭包情况：
function outer() {
  let a = 1

  return function () {
    console.log(a)
  }
}

👉 a 被引用了！

👉 GC（垃圾回收）规则：

只要变量还被引用，就不会被释放

# 同步和异步有什么区别？异步的意义是什么？

✅ 同步 vs 异步（大厂标准答案）
【0️⃣ 一句话结论】

同步：任务按顺序执行，会阻塞后续代码
异步：任务不会阻塞主线程，通过回调/Promise等机制在未来执行

【1️⃣ 基础概念（What）】
🔹 同步（Synchronous）

👉 代码一行一行执行，前面的没做完，后面的必须等待

console.log(1)
console.log(2)
console.log(3)

👉 输出：

1 2 3

🔹 异步（Asynchronous）

👉 不会立即执行，而是“先挂起”，等时机到了再执行

console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

console.log(3)

👉 输出：

1 3 2

【3️⃣ JS 为什么需要异步？（必考🔥）】

👉 核心原因：JS 是单线程！

🔹 什么是单线程？

👉 JS 同一时间只能做一件事

❌ 如果全是同步，会发生什么？
function sleep() {
  const start = Date.now()
  while (Date.now() - start < 3000) {}
}

sleep()
console.log('done')

👉 页面会：

卡死 3 秒 ❌

无法点击 ❌

无法响应 ❌

【4️⃣ 异步的意义（重点🔥）】
✅ 1. 不阻塞主线程（核心）

👉 UI 渲染、用户操作不会被卡住

✅ 2. 提升性能（并发能力）

👉 可以同时处理多个任务

例如：

网络请求

定时器

DOM 事件

✅ 3. 更符合现实场景

👉 很多操作本来就“慢”：

请求服务器

读取文件

用户点击
