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

# 面试官：说说JavaScript中的数据类型？存储上的差别？

1️⃣ 基本数据类型（Primitive）
Number
String
Boolean
Null
Undefined
Symbol（ES6）
BigInt（ES11）

👉 特点：值不可变

2️⃣ 引用数据类型（Reference）
Object
Array
Function
Date
RegExp 等

👉 特点：存的是引用（地址）
1️⃣ 基本类型 —— 存在“栈内存（Stack）”

特点：

直接存储值
占用空间小
访问速度快
let a = 10
let b = a

b = 20

console.log(a) // 10

👉 解释：

a 和 b 是两个独立的值
修改 b 不影响 a

2️⃣ 引用类型 —— 存在“堆内存（Heap）”

特点：

实际数据存堆里
变量中存的是内存地址（引用）
let obj1 = { name: '张三' }
let obj2 = obj1

obj2.name = '李四'

console.log(obj1.name) // 李四

👉 解释：

obj1 和 obj2 指向同一块内存
修改其中一个，会影响另一个
👉 基本类型存值在栈中，引用类型存地址指向堆中的对象

# 面试官：谈谈this对象的理解&面试官：bind、call、apply 区别？如何实现一个bind?

this 是 JavaScript 在函数执行时自动绑定的一个上下文对象，指向当前函数的调用者。

👉 关键点就一句话：
“this 指向谁，取决于函数如何被调用，而不是在哪里定义”

👉 面试官最想听的就是这 4 条规则：

1️⃣ 默认绑定（全局调用）
function fn() {
  console.log(this)
}

fn()

👉 非严格模式：

浏览器中 → window

👉 严格模式：

undefined

2️⃣ 隐式绑定（对象调用）
const obj = {
  name: '张三',
  fn() {
    console.log(this.name)
  }
}

obj.fn() // 张三

👉 规则：

👉 谁调用函数，this 就指向谁
3️⃣ 显式绑定（call / apply / bind）
function fn() {
  console.log(this.name)
}

const obj = { name: '张三' }

fn.call(obj)

👉 this 被手动指定

4️⃣ new 绑定（构造函数）
function Person(name) {
  this.name = name
}

const p = new Person('张三')

👉 this 指向：

👉 新创建的实例对象
new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定
⚠️ 1️⃣ this 丢失
const obj = {
  name: '张三',
  fn() {
    console.log(this.name)
  }
}

const f = obj.fn
f() // undefined

👉 原因：

函数被“单独调用” → 变成默认绑定

⚠️ 2️⃣ 箭头函数（重点🔥）
const obj = {
  name: '张三',
  fn: () => {
    console.log(this.name)
  }
}

obj.fn() // undefined

👉 规则：

箭头函数没有自己的 this，继承外层作用域的 this

call：立即执行 + 参数逐个传
apply：立即执行 + 参数数组传
bind：不执行，返回新函数
function fn(a, b) {
  console.log(this.name, a, b)
}

const obj = { name: '张三' }

// call
fn.call(obj, 1, 2)

// apply
fn.apply(obj, [1, 2])

// bind
const newFn = fn.bind(obj, 1, 2)
newFn()
call 和 apply 是立即执行函数，区别在于参数形式；bind 返回一个新函数，不会立即执行，并且可以实现参数预置，同时在实现时需要考虑 new 调用和原型链问题。

# 面试官：说说你对闭包的理解？闭包使用场景 $ 面试官：说说 JavaScript 中内存泄漏的几种情况？

👉 一句话翻译：

👉 函数 + 它能访问的外部变量 = 闭包
function outer() {
  let count = 0

  return function inner() {
    count++
    console.log(count)
  }
}

const fn = outer()

fn() // 1
fn() // 2
👉 为什么这是闭包？
inner 用到了 outer 的变量 count
outer 执行完本该销毁 ❗
但 count 被保留下来了

👉 原因：

inner 持有对 outer 作用域的引用
闭包的本质是：函数在执行时，会形成作用域链，并保留对外部变量的引用，从而导致这些变量不会被垃圾回收。
1️⃣ 数据私有化（最常用🔥）
function createCounter() {
  let count = 0

  return {
    increment() {
      count++
    },
    getCount() {
      return count
    }
  }
}

👉 外部无法直接访问 count
2️⃣ 防抖 / 节流（面试必提🔥）
function debounce(fn, delay) {
  let timer

  return function () {
    clearTimeout(timer)
    timer = setTimeout(fn, delay)
  }
}

👉 timer 被闭包保存

3️⃣ 函数工厂 / 柯里化
function add(a) {
  return function (b) {
    return a + b
  }
}
1️⃣ 内存泄漏风险

👉 因为变量不会被释放

❗ 2️⃣ 不合理使用会占用内存

👉 特别是：

大对象
DOM 引用
内存泄漏是指不再使用的内存没有被及时释放，导致内存持续占用，最终可能引发性能下降甚至崩溃。
🔥 1️⃣ 意外的全局变量
function fn() {
  a = 10 // ❌ 没有声明
}

👉 问题：

挂到全局对象（浏览器是 window）
生命周期 = 页面整个周期
🔥 2️⃣ 闭包导致的内存泄漏
function outer() {
  let bigData = new Array(1000000)

  return function () {
    console.log(bigData)
  }
}

👉 问题：

bigData 一直被引用
无法被垃圾回收

👉 ⚠️ 注意：

闭包本身不是问题，滥用才是问题
🔥 3️⃣ 定时器未清除
setInterval(() => {
  console.log('running')
}, 1000)

👉 问题：

一直执行
引用一直存在

👉 正确：

clearInterval(timer)
🔥 4️⃣ 事件监听未移除
element.addEventListener('click', handler)

👉 问题：

DOM 被删除了
事件还在 → 引用没断

👉 正确：

element.removeEventListener('click', handler)

# 面试官：说说你对事件循环的理解

# 面试官：深拷贝浅拷贝的区别？如何实现一个深拷贝？

浅拷贝只复制对象的第一层属性，如果属性是引用类型，复制的是引用地址；
深拷贝会递归复制所有层级，生成一个完全独立的新对象。

# 类型转换 & ==/=== 区别

一、先给核心定义（开场）

JavaScript 是弱类型语言，在不同运算场景下会发生隐式或显式的类型转换。

👉 两种方式：

显式转换（主动）
隐式转换（自动）
二、显式类型转换（简单带过）
✅ 常见方式
Number('123')
String(123)
Boolean(0)

👉 这部分不用讲太多，点到即可
三、隐式类型转换（重点🔥🔥🔥）

👉 面试官最想听的是这个
🔥 1️⃣ 转 Boolean（哪些是假）

👉 以下为 false：

false
0
-0
''
null
undefined
NaN

👉 其他都为 true
🔥 1️⃣ + 运算符（最容易考）
1 + '2' // "12"

👉 规则：

只要有字符串 → 转成字符串拼接

1 + true // 2

👉 true → 1
🔥 1️⃣ + 运算符（最容易考）
1 + '2' // "12"

👉 规则：

只要有字符串 → 转成字符串拼接

1 + true // 2

👉 true → 1
🔥 2️⃣ 比较运算符（==）（经典坑🔥）
'5' == 5 // true

👉 规则：

👉 字符串 → Number

null == undefined // true

👉 特殊规则（重点记）

[] == 0 // true

👉 过程：

[] → '' → 0
== 是抽象相等比较，会进行类型转换；
=== 是严格相等比较，不会进行类型转换，要求类型和值都相同。

# new 操作符原理 & 手写实现

new 关键字主要用于调用构造函数，创建实例对象。其内部原理分为四步：
创建一个全新的空对象；
将该对象的原型链（__proto__）连接到构造函数的原型对象（prototype）；
将构造函数内部的 this 绑定到这个新对象上，并执行函数体；
如果构造函数显式返回一个引用类型（对象 / 函数），则返回该对象；否则默认返回新创建的对象。

```js
function mynew(Func,...args) {
 const obj = {}
 obj.__proto__ = Func.prototype
 let res = Func.apply(obj,agrs)
 return res instanceof Object ? res: obj
}
```

# typeof & instanceof 区别

一、typeof：基本类型判断，存在致命局限

1. 核心作用
用于判断基本数据类型，返回对应类型的字符串，共 8 种合法返回值：undefined、boolean、number、string、bigint、symbol、function、object
2. 核心局限（面试必背）
typeof 对null、所有引用类型的判断完全失效，统一返回object：
js
typeof null          // 'object'（JS历史遗留bug，null本质是原始值）
typeof []             // 'object'（数组无法区分）
typeof {}             // 'object'（普通对象）
typeof new Date()     // 'object'（日期对象）
typeof /abc/          // 'object'（正则对象）
✅ 唯一例外：typeof function(){} // 'function'，能正确识别函数类型

二、instanceof：引用类型判断，基于原型链查找

1. 核心原理（面试必说）
A instanceof B 的本质逻辑：沿着 A 的原型链（__proto__）向上遍历，看是否能找到 B 的prototype属性
找到匹配项 → 返回true
遍历到原型链顶端（null）仍未找到 → 返回false
2. 核心特点
仅能判断引用类型，对基本类型（如123 instanceof Number）直接返回false
结果依赖原型链，若手动修改原型链，判断结果会发生变化

```js
console.log("======== 1. 基础引用类型判断 ========");
const obj = {};
const arr = [];
const fn = function () {};

// 沿着__proto__找对应构造函数的prototype
console.log(obj instanceof Object); // true
console.log(arr instanceof Array);  // true
console.log(arr instanceof Object); // true（数组原型链最终指向 Object.prototype）
console.log(fn instanceof Function); // true
======== 1. 基础引用类型判断 ========
true
true
true
true
```

# 面试官：说说JavaScript中的事件模型

1. 捕获阶段 (Capture Phase) 🔻
方向：由外向内（Window → document → html → body → 父元素 → 目标元素）
触发：通过 addEventListener 的第三个参数为 true 时触发。
用途：最早拦截事件，常用于全局事件监听或阻止事件冒泡前的预处理。
2. 目标阶段 (Target Phase) 🎯
方向：到达真正触发事件的 DOM 节点（Target）。
触发：无论是否捕获，此阶段都会执行。
考点：event.target 是真正触发的元素，event.currentTarget 是当前绑定事件的元素。
3. 冒泡阶段 (Bubbling Phase) 🔺
方向：由内向外（目标元素 → 父元素 → ... → body → document → window）。
触发：默认触发（第三个参数为 false 或不填）。
考点：事件委托（Event Delegation）就是利用冒泡机制。
二、事件委托（事件代理）🔥
4. 核心原理
「不给子元素绑定事件，给父元素绑定事件，利用冒泡机制统一处理。」因为事件会冒泡到父元素，父元素的事件处理函数可以通过 event.target 找到具体触发的子元素。
5. 为什么要用？（应用场景）
表格
痛点 解决方案
动态列表（新增 / 删除元素） 不用每次新增元素都重新绑定事件，父元素一直存在
大量按钮 / 子元素（如 ul 下几十个 li） 减少 DOM 绑定次数，节省内存，提高性能
复用逻辑 统一管理一类元素的事件逻辑
6. 实战代码（面试必写）

```js
运行
// 获取父元素
document.getElementById('list').addEventListener('click', function (e) {
  // 核心：判断触发的元素是否是我们想要的目标（如li）
  // matches 匹配选择器，兼容性好
  if (e.target && e.target.matches('li.item')) {
    console.log('点击了列表项:', e.target.textContent)
    // 执行具体业务逻辑
  }
})
```

1. 关键技巧
e.target vs e.currentTarget：
target：真正点击的那个元素（最底层）。
currentTarget：绑定事件的那个元素（这里是 ul）。
区分元素：使用 tagName、className 或 matches 来筛选子元素。

# 面试官：解释下什么是事件代理？应用场景？

不给子元素逐个绑定事件，而是将事件统一绑定到它们的父元素上，由父元素的事件处理函数统一处理所有子元素的事件。
JS 的事件流包含「捕获→目标→冒泡」三个阶段，当子元素触发事件时，事件会沿着 DOM 树向上冒泡到所有父级元素。父元素可以通过两个关键属性识别并处理事件：
event.target：事件的触发源，即真正被点击 / 操作的那个子元素（最底层 DOM 节点）
event.currentTarget：事件的绑定者，即当前绑定事件的父元素
父元素通过判断event.target的类型 / 标识，就能精准执行对应子元素的业务逻辑，完美替代子元素的独立绑定。
表格
直接绑定子元素 事件代理（绑定父元素）
给 N 个子元素绑 N 次事件，内存占用高 只给父元素绑 1 次事件，大幅降低内存开销
动态新增子元素需重新绑定，删除需解绑 子元素新增 / 删除无需操作，父元素监听永久生效
事件逻辑分散在多个子元素，维护成本高 逻辑统一在父元素，代码简洁、便于维护
