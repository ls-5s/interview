# 延迟加载js的方式用哪些方式
defer async

情景题：一个电商网站首页加载缓慢，经分析发现是因为引入了多个大型 JS 库（包括轮播图、商品推荐、评论组件、支付 SDK 等），请设计优化方案。
===========================
区分核心与非核心脚本：首屏轮播图是核心，需优先加载；评论、支付等可延迟
对核心脚本使用 defer 确保执行顺序和不阻塞解析
对非核心脚本采用动态加载，在用户需要时才加载
对位于页面下方的组件（如评论区），使用 IntersectionObserver 在用户滚动到附近时加载

# js 的数据类型有哪些，存储上的差别？(类型转换多看看)
基础数据类型：number string boolean null underfined symbol
引用数据类型：object array function

写一个函数来判断所有的数据类型
// 先判断基本类型（除 null 外，typeof 可区分基本类型）
function getDataType(data) {
    const dataType = typeof data
    if(dataType === 'object') {
        if(data === null) {
            return 'null'
        } else if(Array.isArray(data)) {
            return 'array'
        } else if(data instanceof Function) {
            return 'function'
        } else {
            return 'object'
        }
    } else {
        return dataType
    }
}

这里会考显式转换、隐式转换、复杂场景转换

// [] 的 ToPrimitive 过程：
// 1. 先调用 valueOf()
let valueOfResult = [].valueOf();  // 返回 [] 本身（仍是对象）

// 2. valueOf 返回非原始值，继续调用 toString()
let toStringResult = [].toString(); // 返回 ""

// 所以 [] → ""解释

underfined NaN 
NaN 是一个特殊的数值类型，用于表示“不是一个数字”。它表示一个无效的或未定义的数字操作结果。

# null 和 underfined 的区别
null 表示“空值”，表示变量已被赋值但无实际内容。转换为数字时为 0。
underfined 表示“未定义”，表示变量已声明但未被赋值。转换为数字时为 NaN。
null	'object'	历史遗留 bug，因最初被设计为 “空对象指针”
undefined	'undefined'	类型识别准确

# == 和=== 的区别
== 是抽象相等运算符，会进行类型转换后再比较值是否相等。
=== 是严格相等运算符，不进行类型转换，要求值和类型都相等。


# 10.28
## 什么闭包？它可能导致那些问题？如果避免内存泄漏？
简单的说,它是一个函数可以记住，并访问它被创建时所处的外部作用域，即使它(这个函数)在那个作用域之外执行
闭包的核心：- 函数本身 指向词法环境的引用：inner 函数持有对 createCounter 作用域（词法环境）的引用，这个环境里包含了局部变量 count。
即便 createCounter 执行完毕（其作用域理论上应销毁），inner 依然能通过这个 “引用” 访问并修改 count—— 这就是闭包能 “记住变量” 的关键原因。

**经典案例计数器**
```js
function createCounter() {
    let count = 0
   function inner() {
        count++
        return count
    }
    return inner
}
const counter = createCounter()
console.log(counter()) // 1
console.log(counter()) // 2
```
**变量私有化**：count 是 createCounter 的局部变量，外部无法直接访问（避免了全局变量污染）。
**闭包保存状态**: inner 函数作为闭包，引用了 count；当 createCounter 执行完毕后，count 不会被销毁（因为闭包还在使用它）。
**持续更新**：每次调用 counter()（即 inner）时，都会基于上一次的 count 进行累加，实现 “计数” 功能。
===========================
**内存泄漏**:
**原因**:闭包会引用外部函数的作用域，若闭包长期存在（如事件处理函数、定时器回调等），则会导致外部作用域的变量无法被垃圾回收，从而内存泄漏。
** 解决办法**:
1. 及时销毁闭包：若闭包不再需要，手动将其引用设为 null，触发垃圾回收。
```js
function createClosure() {
  // 假设这是一个占用大量内存的变量（如大数组、大对象）
  const largeData = new Array(1000000).fill('占用内存的数据');

  // 内部函数（闭包），引用了外部的 largeData
  return function closure() {
    console.log(largeData); // 依赖外部变量
  };
}

// 生成闭包，并通过变量持有引用
let closureRef = createClosure();

// 使用闭包
closureRef(); // 输出：[ '占用内存的数据', ... ]


// 当闭包不再需要时：
closureRef = null; // 手动解除对闭包的引用
```
2.  “事件监听器 / DOM 引用清理”
  beforeDestroy() {
    // 组件销毁前移除监听器
    this.$refs.myBtn.removeEventListener('click', this.handleClick);
  }

==================
**总结**
定义：是一个函数和其词法环境的组合，允许函数访问其外部作用域的变量。
优点：可创建私有变量、实现数据封装、支持柯里化等高级函数式编程模式。
潜在问题：易引发内存泄漏（外部变量因被闭包引用无法回收），还存在循环中的变量引用问题。
避免内存泄漏的方法：不需要时手动解除引用（将引用设为null），及时移除事件监听器。
```js
// 普通多参数函数
function add(a, b, c) {
  return a + b + c;
}

// 柯里化后的函数
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// 使用方式
const add5 = curriedAdd(5);    // 固定第一个参数a=5
const add5And3 = add5(3);     // 固定第二个参数b=3
const result = add5And3(2);   // 传入最后一个参数c=2，最终执行：5+3+2=10
console.log(result); // 输出：10
```
## var、let 和 const 的区别（作用域、变量提升、暂时性死区）
var,let,const是javaScript 中声明变量的三种方式。let,const是在ES6中引入的。是为了解释解决var的一些问题而引入的。
**作用域**
var 是函数作用域{var a = 0} 外部可以访问，let 和 const 是块级作用域。
**变量提升**
var 存在变量提升（hoisting）现象，即变量可以在声明之前访问（值为 undefined）。let 和 const 不存在变量提升，必须先声明后使用。
**暂时性死区**
let 和 const 存在暂时性死区（TDZ），即在块级作用域内，变量声明前访问会报错。var 不存在暂时性死区。是undefined。暂时性死区的设计是为了强制开发者在声明变量后再使用，避免使用未初始化的变量。
```js
// 使用var声明变量的for循环，结合setTimeout异步执行
for (var a = 0; a < 3; a++) {
  setTimeout(function() {
    console.log(a); // 最终打印三次 3
  }, 1000);
}
```
**重复声明**
var 可以重复声明同一个变量，而 let 和 const 不允许重复声明。

**修改值**
const 声明的变量是常量，不能被修改。let，var声明的变量可以被修改。

=======================
**总结与最佳实践**
优先使用 const：默认情况下应总是使用 const，可保证数据不可变性，使代码更可预测。
当变量需重新赋值时使用 let：例如循环中的计数器、需要改变状态的变量等场景。
避免在现代 JavaScript 中使用 var：var 的函数作用域和变量提升行为（尤其是初始化为 undefined）是许多常见 bug 的根源，在 ES6+ 项目中应完全放弃使用 var。

## JavaScript 类型转换规则及==、===区别，[] ==![]分析
javaScript 是一种弱类型语言，可以在运行根据需要自动转换
类型转换分为两种：隐式类型转换和显式类型转换。
**显示转换**
他是开发者主动触发的类型转换，通过调用函数或运算符实现。
比如：
```js
// 字符串转换为数字
let str = '123';
let num = Number(str); // 123
console.log(typeof num); // 'number'

// 数字转换为字符串
let num2 = 456;
let str2 = String(num2); // '456'
console.log(typeof str2); // 'string'
```
**隐式转换**
他是在javaScript 运行时自动触发的类型转换，无需开发者显式调用。
比如：
```js
// 字符串与数字相加时，字符串会被转换为数字
let str = '123';
let num = 456;
let result = str + num; // '123456'（字符串拼接）
console.log(result);

// 比较运算符（如 ==）在比较时会进行隐式类型转换
console.log(1 == '1'); // true（字符串 '1' 会被转换为数字 1）
```
============================
**valueof**
```js
// 重写字符串的 valueOf 方法，使其返回 0
String.prototype.valueOf = function() {
  return 0;
};

// 场景1：数字与字符串运算（因字符串 valueOf 被改写）
console.log(2 - '1000'); // 输出 2（实际为 2 - 0）


// 重写数字的 valueOf 方法，使其返回 100
Number.prototype.valueOf = function() {
  return 100;
};

// 场景2：1 + 1 因数字 valueOf 被改写，结果不等于2
console.log(1 + 1); // 输出 200（实际为 100 + 100）
```
======================
== 与 === 区别
```js
// 数组（对象）与数字比较
console.log([] == 0); // true
// 解析：
// 1. 调用 [].valueOf() → 返回数组自身（仍为对象）
// 2. 调用 [].toString() → 返回空字符串 ""
// 3. 空字符串 "" 转数字为 0 → 0 == 0 → true
console.log(`[] ==![]`, [] ==![]);
// [] = false
// [] = 0
// "" = 0
```
**== 运算符**
== 运算符用于比较两个值是否相等，会进行类型转换后再比较。
**=== 运算符**
=== 运算符用于比较两个值是否严格相等，不进行类型转换。

## 浅拷贝（Shallow Copy）与深拷贝（Deep Copy）解析及深拷贝函数实现
**浅拷贝（Shallow Copy）**
```js
const original = {
  name: "Tom",
  age: 10,
  pet: {
    name: "Jerry",
    type: "Mouse"
  }
};

// 浅拷贝：仅复制第一层属性
const shallowCopy = { ...original };

// 场景1：修改嵌套对象（引用类型）
shallowCopy.pet.name = "Spike";
console.log(original.pet.name); // 输出 "Spike" → 原始对象的嵌套对象被同步修改

// 场景2：修改基本类型属性
shallowCopy.age = 12;
console.log(original.age); // 输出 10 → 原始对象的基本类型属性不受影响
```
**浅拷贝（Shallow Copy）** 是指复制对象时，仅复制对象的第一层属性。对于属性值为基本类型（如数字、字符串、布尔值等），会直接复制其值；但对于属性值为引用类型（如对象、数组、函数等），复制的是其引用地址（即新旧对象共享同一份引用类型数据）。
**核心特点**
只复制第一层：无论原对象有多少层嵌套，浅拷贝仅处理最外层属性。
基本类型独立：第一层的基本类型属性，新旧对象各自拥有独立的值，修改一方不影响另一方。
引用类型共享：第一层的引用类型属性（如嵌套对象、数组），新旧对象共享同一份数据，修改一方会同步影响另一方。

=====================
**深拷贝（Deep Copy)**
定义：深拷贝是指完全复制对象的所有层级结构，包括嵌套的引用类型（如对象、数组、函数等）。新旧对象完全独立，修改其中一个对象的任何属性（包括深层嵌套的属性），都不会影响另一个对象。
这段代码通过 **JSON.stringify + JSON.parse** 实现了深拷贝：序列化 - 反序列化
```js
const original = {
  name: "Tom",
  age: 10,
  pet: {
    name: "Jerry",
    type: "Mouse"
  }
};

// 使用 JSON 方法进行简单的深拷贝
const deepCopy = JSON.parse(JSON.stringify(original));

// 修改拷贝后对象的嵌套对象属性
deepCopy.pet.name = "Spike";

// 观察原始对象的变化
console.log(original.pet.name); // 输出: "Jerry"
// 原始对象没有受到任何影响

deepCopy.age = 12;
console.log(original.age); // 输出: 10
```
=====================
**深拷贝（Deep Copy）** 自己实现
```js
/**
 * 深拷贝函数：递归复制对象的所有层级（包括嵌套引用类型），确保新旧对象完全独立
 * @param {*} target - 要深拷贝的目标对象（可是任意类型：基本类型、对象、数组、特殊对象等）
 * @param {WeakMap} [map=new WeakMap()] - 用于缓存已拷贝对象的WeakMap，解决循环引用问题（默认自动创建）
 * @returns {*} 与目标对象完全独立的深拷贝结果
 */
function deepClone(target, map = new WeakMap()) {
    // 处理特殊对象：Date（日期对象）
    // 若目标是Date实例，直接创建新的Date实例并返回（保证类型正确且值相同，与原对象独立）
    if (target instanceof Date) return new Date(target);

    // 处理特殊对象：RegExp（正则表达式对象）
    // 若目标是RegExp实例，直接创建新的RegExp实例并返回（保留正则的模式和修饰符，与原对象独立）
    if (target instanceof RegExp) return new RegExp(target);

    // 处理循环引用：检查当前对象是否已被拷贝过
    // 若WeakMap中已缓存该对象，直接返回之前的拷贝结果（避免无限递归和重复拷贝）
    if (map.has(target)) {
        return map.get(target);
    }

    // 初始化拷贝结果：根据原对象类型创建对应结构
    // 若原对象是数组，初始化空数组；否则视为普通对象，初始化空对象
    const cloneTarget = Array.isArray(target) ? [] : {};

    // 缓存当前拷贝关系：将原对象和刚创建的拷贝对象存入WeakMap
    // 用于后续遇到同一对象时直接返回拷贝结果（解决循环引用）
    map.set(target, cloneTarget);

    // 遍历原对象的所有自身属性（包括字符串键、Symbol键、不可枚举键）
    // Reflect.ownKeys能获取对象所有自身属性，比for...in更全面
    for (const key of Reflect.ownKeys(target)) {
        // 递归拷贝当前属性的值，并赋值给拷贝对象的对应属性
        // 传入map参数确保整个拷贝过程中缓存共享，循环引用能被正确处理
        cloneTarget[key] = deepClone(target[key], map);
    }

    // 返回最终的深拷贝对象
    return cloneTarget;
}
```
# 10.29

## Symbol 这种基本数据类型有什么独特的用途？它和字符串作为对象属性键有什么区别？
他是es6引入的一种全新的数据类型，它的核心：每一个symbol值都是唯一的，不会与其他symbol值冲突。
**symbol** 的设计初衷是为了解决大项目和库之间的全局命名冲突问题。
symbol 作为对象的属性键时，有以下区别：
1. **唯一性**：symbol 值是唯一的，不会与其他 symbol 值冲突，也不会与字符串冲突。
```js
const myInternalID = Symbol('id');

let thirdPartyObject = {
  id: 'user-123',
  name: 'Some Library Object'
};

thirdPartyObject[myInternalID] = 'my-unique-internal-id-456';

console.log(thirdPartyObject.id); // 输出: "user-123"
console.log(thirdPartyObject[myInternalID]); // 输出: "my-unique-internal-id-456"
console.log(thirdPartyObject);
// 输出类似: { id: 'user-123', name: 'Some Library Object', [Symbol(id)]: 'my-unique-internal-id-456' }
```
2. **模拟类的私有属性和方法**
在 JavaScript 的 # (hash) 私有字段语法正式普及之前，Symbol 是实现 “伪私有” 属性的常用模式。通过将 Symbol 定义在模块或类的作用域内，外部无法直接访问这个 Symbol，从而也就无法访问到对应的属性。
```js
const passwordSymbol = Symbol('password');

class User {
  constructor(username, password) {
    this.username = username;
    this[passwordSymbol] = password; // 使用 Symbol 存储“私有”密码
  }

  checkPassword(pwd) {
    return this[passwordSymbol] === pwd;
  }
}
```
3. **参与并定制 JavaScript 的内部机制**
ES6 引入了一系列 “众所周知的符号”（Well-known Symbols），它们作为 Symbol 对象的静态属性存在（例如 Symbol.iterator，Symbol.toStringTag 等）。JavaScript 引擎会通过这些特殊的 Symbol 来寻找对象上的特定方法，从而让开发者能够 “重载” 语言的默认行为。
示例：使用 Symbol.iterator 使对象可被 for...of 遍历
for...of 循环的底层机制就是寻找对象的 [Symbol.iterator] 方法。
```js
const myIterableObject = {
  items: ['a', 'b', 'c'],
  // 实现迭代器协议
  [Symbol.iterator]: function* () {
    for (const item of this.items) {
      yield item;
    }
  }
};

for (const value of myIterableObject) {
  console.log(value); // 依次输出: 'a', 'b', 'c'
}
```
===============================
**总结**
- 使用字符串键，当你需要一个公开的、易于访问和序列化的常规属性时。
- 使用 Symbol 键，当你需要一个唯一的、防止冲突的属性键时，尤其适合用于添加元数据、实现内部逻辑或模拟私有成员，并且不希望这个属性被常规的迭代或序列化操作所干扰。


## Array.prototype.map 和 Array.prototype.forEach 的区别是什么？map 可以被 forEach 替代吗？为什么？
**map 和 forEach**都是js数组内置的方法，它们都用于遍历数组的每个元素。
区别：设计目的，返回值和使用场景上有本质的区别。
1. **返回值**：
   - map 方法返回一个新数组，数组中的每个元素都是对原数组元素的处理结果。
   - forEach 方法没有返回值，它只是对数组的每个元素执行一次回调函数。
2. **是否改变原数组**：
   - map 方法不会改变原数组，它返回的是一个新数组。
   - forEach 方法也不会改变原数组，它只是对数组的每个元素执行回调函数。
3. **核心用途**
   - 对数组元素进行 “映射转换”，生成新数组
   - 对数组元素进行 “遍历执行操作”（如打印、修改外部变量等）
4. **链式调用支持**
   - map 方法支持链式调用，因为它返回一个新数组，你可以在返回的数组上继续调用其他数组方法。
   - forEach 方法不支持链式调用，因为它没有返回值，你不能在它的返回值上继续调用其他数组方法。
===========================
**map 可以被 forEach 替代吗？为什么？**
- 当需要生成新数组（基于原数组转换） 时，必须用 map，forEach 虽然能模拟，但会导致代码冗余且语义不清晰。
- 当仅需要遍历数组执行操作（无返回值需求） 时，用 forEach 更合适。
- 因此，map 和 forEach 是互补关系，而非替代关系，应根据具体场景选择。

## 什么是原型链（Prototype Chain）？__proto__ 和 prototype 的关系与区别是什么？
**原型**: 每个对象在创建时，都会隐式关联另一个对象，这个被关联的对象就是它的 “原型”。
**原型对象**: 原型对象是一个普通的对象，它包含了属性和方法，用于被其他对象继承。
**原型链**: 对象通过内部属性 __proto__ 指向其原型对象；而原型对象本身也是对象，它也有自己的 __proto__，指向更上层的原型对象…… 这种由 __proto__ 层层串联形成的 “对象链”，就是原型链。
原型链的核心作用是**实现属性和方法的查找与继承**：当访问一个对象的属性或方法时，JavaScript 会先在对象自身查找；若找不到，就沿着原型链向上查找其原型对象，再查找原型的原型，直到找到目标或到达链的顶端（null，此时返回 undefined）。

====================================
**__proto__ 和 prototype 的关系与区别是什么？**
-  核心关系
当通过构造函数创建实例时，实例的 __proto__ 会直接指向构造函数的 prototype。这是原型链建立的关键，也是实例能继承构造函数原型成员的根本原因。
```js
// 定义构造函数（函数对象）
function Person(name) {
  this.name = name;
}

// 构造函数的 prototype 指向一个原型对象（供实例继承）
Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};

// 创建实例（普通对象）
const alice = new Person('Alice');

// 核心关系：实例的 __proto__ === 构造函数的 prototype
console.log(alice.__proto__ === Person.prototype); // true
```
- 核心区别（从归属、指向、作用划分）
归属：
- __proto__ 是每个对象都有的属性，它指向该对象的原型对象。
- prototype 是函数对象（构造函数）才有的属性，它指向该构造函数的原型对象。
指向：
- __proto__ 指向实例的原型对象，用于实现实例的属性查找与继承。
- prototype 指向构造函数的原型对象，用于实现构造函数创建的实例的属性查找与继承。
作用：
- __proto__ 是实例的 “指针”，用于实现实例的属性查找与继承。
- prototype 是构造函数的 “指针”，用于实现构造函数创建的实例的属性查找与继承。