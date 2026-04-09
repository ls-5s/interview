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

# 数组的常用方法有哪些？

✅ 1️⃣ 修改数组（变更数组内容）

push()
向数组的末尾添加一个或多个元素，并返回新数组的长度。

```js
let arr = [1, 2];
arr.push(3); // [1, 2, 3]
```

pop()
删除数组的最后一个元素，并返回被删除的元素。

```js
let arr = [1, 2, 3];
arr.pop(); // 3, arr => [1, 2]
```

shift()
删除数组的第一个元素，并返回被删除的元素。

```js
let arr = [1, 2, 3];
arr.shift(); // 1, arr => [2, 3]
```

unshift()
向数组的开头添加一个或多个元素，并返回新数组的长度。

```js
let arr = [1, 2];
arr.unshift(0); // [0, 1, 2]
```

✅ 2️⃣ 查找与过滤（获取符合条件的元素）

indexOf()
返回指定元素在数组中首次出现的索引，没有找到则返回 -1。

```js
let arr = [1, 2, 3];
arr.indexOf(2); // 1
```

includes()
判断数组是否包含某个元素，返回 true 或 false。

```js
let arr = [1, 2, 3];
arr.includes(2); // true
```

find()
返回数组中第一个符合条件的元素，如果没有符合条件的元素，返回 undefined。

```js
let arr = [5, 12, 8, 130];
arr.find(num => num > 10); // 12
```

findIndex()
返回数组中第一个符合条件的元素的索引，如果没有符合条件的元素，返回 -1。

```js
let arr = [5, 12, 8, 130];
arr.findIndex(num => num > 10); // 1
```

filter()
返回一个新数组，包含所有符合条件的元素。

```js
let arr = [5, 12, 8, 130];
arr.filter(num => num > 10); // [12, 130]
```

转换与合并（修改数组结构或合并）
map()
创建一个新数组，其中每个元素是原数组元素经过函数处理后的结果。

```js
let arr = [1, 2, 3];
arr.map(num => num * 2); // [2, 4, 6]
```

reduce()
对数组中的所有元素执行指定的操作，返回一个单一的值。

```js
let arr = [1, 2, 3];
arr.reduce((acc, num) => acc + num, 0); // 6
```

reduceRight()
类似于 reduce()，但是从数组的右端开始执行操作。

```js
let arr = [1, 2, 3];
arr.reduceRight((acc, num) => acc + num, 0); // 6
```

concat()
合并两个或多个数组，返回一个新数组。

```js
let arr1 = [1, 2];
let arr2 = [3, 4];
arr1.concat(arr2); // [1, 2, 3, 4]
```

✅ 4️⃣ 排序与排序（排序与反转）

sort()
对数组中的元素进行排序，默认为字母排序，如果需要按照数字排序，需要传入比较函数。

```js
let arr = [10, 2, 5, 1];
arr.sort((a, b) => a - b); // [1, 2, 5, 10]
```

reverse()
反转数组中元素的顺序。

```js
let arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]
```

# 说说你对作用域链的理解 ?

全局作用域
任何不在函数中或是大括号中声明的变量，都是在全局作用域下，全局作用域下声明的变量可以在程序的任意位置访问

```js
// 全局变量
var greeting = 'Hello World!';
function greet() {
  console.log(greeting);
}
// 打印 'Hello World!'
greet();
```

<!-- # 函数作用域 -->

函数作用域也叫局部作用域，如果一个变量是在函数内部声明的它就在一个函数作用域下面。这些变量只能在函数内部访问，不能在函数以外去访问

```js
function greet() {
  var greeting = 'Hello World!';
  console.log(greeting);
}
// 打印 'Hello World!'
greet();
// 报错： Uncaught ReferenceError: greeting is not defined
console.log(greeting);
```

可见上述代码中在函数内部声明的变量或函数，在函数外部是无法访问的，这说明在函数内部定义的变量或者方法只是函数作用域

<!-- # 块级作用域 -->

ES6引入了let和const关键字,和var关键字不同，在大括号中使用let和const声明的变量存在于块级作用域中。在大括号之外不能访问这些变量

```js
{
  // 块级作用域中的变量
  let greeting = 'Hello World!';
  var lang = 'English';
  console.log(greeting); // Prints 'Hello World!'
}
// 变量 'English'
console.log(lang);
// 报错：Uncaught ReferenceError: greeting is not defined
console.log(greeting);
```

三、作用域链
当在Javascript中使用一个变量的时候，首先Javascript引擎会尝试在当前作用域下去寻找该变量，如果没找到，再到它的上层作用域寻找，以此类推直到找到该变量或是已经到了全局作用域

如果在全局作用域里仍然找不到该变量，它就会在全局范围内隐式声明该变量(非严格模式下)或是直接报错

这里拿《你不知道的Javascript(上)》中的一张图解释：

把作用域比喻成一个建筑，这份建筑代表程序中的嵌套作用域链，第一层代表当前的执行作用域，顶层代表全局作用域

变量的引用会顺着当前楼层进行查找，如果找不到，则会往上一层找，一旦到达顶层，查找的过程都会停止

# 说说 new 操作符具体干了什么？

```js
function mynew(Func,...args) {
  const obj = {}
  obj.__proto__ = Func.prototype
  let res = Func.apply(obj,args)
  return res instanceof Object ? res : obj
}
```

# 面试官：说说 Javascript 数字精度丢失的问题，如何解决？

# 说说你对事件循环的理解 ？

事件循环是 JavaScript 单线程非阻塞异步模型的核心机制，用来协调调用栈、任务队列、微任务与宏任务，让 JS 既能执行同步代码，又能处理异步操作不阻塞主线程。
二、核心执行流程（必须讲清楚）

整个流程可以总结为👇

1️⃣ 同步代码进入 调用栈（Call Stack）执行

2️⃣ 遇到异步任务（如 setTimeout / Promise / DOM 事件）：

不会立即执行
会交给浏览器 / Node 的异步环境处理

3️⃣ 异步任务完成后，回调进入任务队列：

宏任务队列（Macrotask Queue）
微任务队列（Microtask Queue）

4️⃣ Event Loop 开始调度：

👉 执行顺序核心规则：
同步 → 清空所有微任务 → 执行一个宏任务 → 再清空微任务 → 再执行一个宏任务 → …… 循环

三、宏任务 vs 微任务（面试必问🔥）
1️⃣ 宏任务（Macrotask）

常见：

setTimeout
setInterval
setImmediate（Node）
I/O
UI 渲染
2️⃣ 微任务（Microtask）

常见：

Promise.then / catch / finally
MutationObserver
queueMicrotask

```js
<!DOCTYPE html>
<body>
  <button id="btn">点击触发DOM宏任务</button>

  <script>
    // ============== 同步代码（script 宏任务内部） ==============
    console.log('1. 同步代码开始');

    // 1. 微任务：queueMicrotask
    queueMicrotask(() => {
      console.log('2. 微任务 queueMicrotask');
    });

    // 2. 微任务：Promise.then / catch / finally
    Promise.resolve()
      .then(() => {
        console.log('3. 微任务 Promise.then');
      })
      .catch(() => {})
      .finally(() => {
        console.log('4. 微任务 Promise.finally');
      });

    // 3. 微任务：async/await（本质 Promise 微任务）
    async function asyncFn() {
      console.log('5. async 函数内同步代码');
      await Promise.resolve();
      console.log('6. 微任务 async/await 后续');
    }
    asyncFn();

    // ============== 宏任务 ==============
    // 宏任务1：setTimeout
    setTimeout(() => {
      console.log('7. 宏任务 setTimeout');
    }, 0);

    // 宏任务2：fetch 网络请求
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(() => {
        console.log('8. 宏任务 fetch 回调');
      });

    // 宏任务3：DOM 点击事件
    document.getElementById('btn').addEventListener('click', () => {
      console.log('9. 宏任务 DOM点击事件');
    });

    console.log('10. 同步代码结束');
  </script>
</body>
</html>
```

# 说说 JavaScript 中的事件模型& 解释下什么是事件代理？应用场景？
  
👉 事件从触发到被处理，经历的完整流程。

二、事件模型三大阶段（核心🔥）

DOM 事件传播分为三个阶段：

捕获阶段 → 目标阶段 → 冒泡阶段
1️⃣ 捕获阶段（Capture Phase）

👉 事件从 window → document → html → body → 目标元素

从外到内
默认不会触发（除非显式开启）
2️⃣ 目标阶段（Target Phase）

👉 事件到达目标元素本身

触发绑定在目标上的事件
3️⃣ 冒泡阶段（Bubbling Phase）🔥

👉 事件从目标元素向外传播：

目标 → 父元素 → body → html → document → window

👉 默认事件处理都发生在冒泡阶段（重点！）

```js
三、代码示例（必须会讲🔥）
<div id="parent">
  <button id="child">点击</button>
</div>
parent.addEventListener('click', () => {
  console.log('parent');
});

child.addEventListener('click', () => {
  console.log('child');
});

👉 点击按钮输出：

child
parent

👉 原因：

默认是冒泡阶段
子元素 → 父元素

```

四、如何控制事件阶段（面试必问🔥）
addEventListener 第三个参数
element.addEventListener(type, handler, useCapture);
false（默认）👉 冒泡阶段
true 👉 捕获阶段

👉 示例：

parent.addEventListener('click', () => {
  console.log('parent capture');
}, true);

👉 输出顺序变为：

parent capture
child
parent

五、事件冒泡的应用 & 控制（高频🔥）
1️⃣ 阻止冒泡
event.stopPropagation();

👉 常见场景：

弹窗点击
子组件不影响父组件
2️⃣ 阻止默认行为
event.preventDefault();

👉 例如：

阻止 <a> 跳转
阻止表单提交

六、事件委托（超级高频🔥）

👉 本质：

利用事件冒泡，把事件绑定到父元素上

示例：
ul.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('点击了 li');
  }
});
优点（一定要说！）
减少事件绑定次数，避免大量循环绑定，提升页面性能
支持动态新增元素，无需重新绑定事件
降低内存占用，减少事件监听器数量，避免内存泄漏

长列表点击（ul/li、表格行）商品列表、导航菜单、表格操作，只给父元素绑一次事件。
动态新增元素（AJAX / 分页加载）异步加载、下拉刷新出来的新元素，不用重新绑定事件。
多个相似按钮（删除 / 编辑 / 选中）同一区域内功能相同的按钮，统一委托父级处理。

# 什么是防抖和节流？有什么区别？如何实现？

```js
高频触发事件时，延迟 n 秒后执行回调；若 n 秒内再次触发，清空定时器重新计时，最终只执行最后一次。
2. 经典场景
搜索框输入联想（输完停一下才发请求）
窗口 resize、scroll 停止后执行
按钮防重复点击
3. 极简实现（面试背诵版）
javascript
运行
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    // 再次触发，清除上一次定时器
    clearTimeout(timer);
    // 重新计时
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
}
1. 核心定义
高频触发事件时，规定 n 秒内只执行一次回调，强制稀释事件触发频率，每隔一段时间执行一次。
2. 经典场景
滚动加载更多、滚动监听位置
鼠标拖拽、mousemove 高频移动
高频点击、游戏技能冷却
3. 极简实现（时间戳版，面试首选）
javascript
运行
function throttle(fn, interval) {
  let last = 0; // 上次执行时间
  return function(...args) {
    const now = Date.now();
    // 超过时间间隔才执行
    if (now - last >= interval) {
      fn.apply(this, args);
      last = now;
    }
  }
}

```

# DOM 常见的操作有哪些？

查询节点
创建节点
插入节点
删除 / 替换节点
修改节点（属性 / 内容 / 样式）

1. 查询节点

```js
document.getElementById('id')
document.getElementsByClassName('class')
document.getElementsByTagName('div')
document.querySelector('.box')
document.querySelectorAll('.item')
```

👉 querySelector vs getElementById

querySelector：支持 CSS 选择器（更灵活）
getElementById：性能更好（直接查找）

1. 创建节点

```js
const div = document.createElement('div');
const text = document.createTextNode('hello');
div.appendChild(text);
```

插入节点

```js
parent.append(child)   // 父内部 → 最后
parent.prepend(child)  // 父内部 → 最前
child.before(node)     // 子前面 → 插入
child.after(node)      // 子后面 → 插入
```

五、删除 / 替换节点

```js
parent.removeChild(child)
child.remove()
```

1️⃣ 修改内容
el.innerHTML = '<span>hello</span>'
el.textContent = 'hello'

# 说说你对 BOM 的理解，常见的 BOM 对象你了解哪些？

BOM 是浏览器提供的一套操作浏览器窗口的 API，让 JavaScript 可以和浏览器本身进行交互。

```js
1️⃣ location（URL 操作必考🔥）

👉 location

👉 作用：操作当前 URL

location.href        // 当前地址
location.reload()    // 刷新页面
location.assign('<https://xxx.com>') // 跳转

👉 面试点：

修改 href 会跳转页面
常用于重定向
```

2️⃣ history（前进后退🔥）

👉 history

```js
history.back()
history.forward()
history.go(-1)
```

👉 场景：

SPA 路由控制（比如 React Router）
4️⃣ screen（屏幕信息）

```js
👉 screen

screen.width
screen.height

👉 场景：

响应式布局判断
```

5️⃣ localStorage / sessionStorage（重点🔥）

```js
👉 localStorage
👉 sessionStorage

localStorage.setItem('key', 'value')
localStorage.getItem('key')
localStorage.removeItem('key')
```

# 如何判断一个元素是否在可视区域中？

# 如何实现上拉加载，下拉刷新？

# 说说 JavaScript 中内存泄漏的几种情况？

内存泄漏（Memory Leak）：程序不再使用的内存没有被释放，导致浏览器占用越来越多，可能引起页面卡顿甚至崩溃。

二、JavaScript 常见内存泄漏情况
1️⃣ 全局变量泄漏（最经典🔥）
未用 var/let/const 声明变量 → 自动成为全局变量
全局对象引用一直存在
function foo() {
  bar = 1; // 未声明，隐式全局
}

2️⃣ 闭包导致的内存泄漏（面试必考🔥）
闭包持有外部变量引用，导致内存不能释放
function outer() {
  const bigData = new Array(1000000).fill('*')
  return function inner() {
    console.log(bigData.length)
  }
}
const fn = outer()  // bigData 不会被 GC
3️⃣ 定时器 / 回调未清理
**解决方案：**及时解除引用 fn = null
setInterval、setTimeout、事件回调持续引用 DOM 或数据
const el = document.getElementById('btn')
setInterval(() => {
  el.textContent = 'hello'
}, 1000)

**问题：**DOM 删除后，定时器依然持有引用 → 内存泄漏

解决方案：clearInterval(timer) / removeEventListener

# Javascript 本地存储的方式有哪些？区别及应用场景？

常见 4 种👇

Cookie
localStorage
sessionStorage
IndexedDB
1️⃣ Cookie（最早的存储方式）

👉 特点：

存储在浏览器中
每次 HTTP 请求都会携带（关键点🔥）
容量小（约 4KB）
document.cookie = "name=xxx"

👉 应用场景：

登录态（Session / Token）
用户身份认证

👉 缺点：

性能差（请求都会带）
有安全风险（CSRF）

2️⃣ localStorage（最常用🔥）

👉 localStorage

👉 特点：

持久存储（不手动删就一直在）
同源共享
容量较大（5MB 左右）
localStorage.setItem('key', 'value')
localStorage.getItem('key')

👉 应用场景：

用户信息缓存
主题（暗黑模式）
前端缓存数据

3️⃣ sessionStorage

👉 sessionStorage

👉 特点：

会话级存储（关闭页面就没了）
不同标签页不共享
sessionStorage.setItem('key', 'value')

👉 应用场景：

表单临时数据
页面状态（如多步骤流程）

IndexedDB（高级🔥）

👉 IndexedDB

👉 特点：

浏览器内置数据库（NoSQL）
可存储大量数据（几十 MB+）
支持索引、事务

👉 应用场景：

离线应用（PWA）
大数据缓存（如图片、文件）
本地数据库

✅ 用 Cookie：
需要和服务端通信
比如登录态（但现在很多用 Token + Storage）
✅ 用 localStorage：
持久化数据
不敏感数据缓存
✅ 用 sessionStorage：
临时状态（页面级）
✅ 用 IndexedDB：
大数据存储
离线能力（PWA）

# Javascript 中如何实现函数缓存？函数缓存有哪些应用场景？

👉 函数缓存：把函数的计算结果缓存起来，下次相同输入直接返回缓存结果。

👉 一句话总结：

用空间换时间，避免重复计算

```js
function memoize(fn) {
  const cache = { }
  return function(...args) {
    const key = JSON.stringify(args)
    if(chache[key])
    {
      return cache[key]
    }
    const result = fn.apply(this, args)
    cache[key] = result
    return result
   }

}

function add(a, b) {
  console.log('执行计算...')
  return a + b
}

const memoAdd = memoize(add)

memoAdd(1, 2) // 计算
memoAdd(1, 2) // 走缓存 ✅
```

四、函数缓存应用场景（重点🔥）
1️⃣ 复杂计算（最经典）

👉 比如：

递归（斐波那契）
大量数学计算
const fib = memoize(function (n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
})
2️⃣ 接口缓存（非常实用🔥）

👉 相同请求直接返回缓存：

const fetchCache = memoize(fetch)

👉 场景：

搜索建议
数据查询
4️⃣ 防止重复计算（表单 / UI）

👉 比如：

表单计算
数据转换（格式化）
5️⃣ 计算属性（Vue / 状态管理）

👉 类似：

Vue computed
Redux selector（reselect）

五、注意点（面试加分🔥）
1️⃣ 内存泄漏风险

👉 缓存不清理 → 内存越来越大

3️⃣ 只适用于“纯函数”

👉 必须：

相同输入 → 相同输出
无副作用

# 举例说明你对尾递归的理解，有哪些应用场景 ?

👉 尾递归（Tail Recursion）：
在函数的最后一步直接返回递归调用本身，没有额外计算。
函数的最后一步是调用自己，并且直接 return

三、为什么尾递归更优（面试关键🔥）
普通递归依赖调用栈保存每一层的变量和等待关系；
尾递归把计算结果通过参数提前累积，把原本存在栈里的中间状态，变成了参数传递，
所以栈不会增长，避免栈溢出。
