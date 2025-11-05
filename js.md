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
```js
/**
 * 手写浅拷贝函数（支持对象和数组）
 * 核心：只拷贝表层属性，基本类型复制值，引用类型复制地址（不递归处理嵌套）
 * @param {*} target - 要拷贝的目标（可以是对象、数组、基本类型等）
 * @returns {*} 拷贝后的新值
 */
function shallowClone(target) {
  // 1. 边界处理：非对象类型（基本类型、null）直接返回（无需拷贝）
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  // 2. 根据目标类型创建对应容器（数组→新数组，对象→新对象）
  const cloneTarget = Array.isArray(target) ? [] : {};

  // 3. 遍历目标的表层属性，复制值（区分数组和对象的遍历逻辑）
  if (Array.isArray(target)) {
    // 数组：遍历索引，复制元素
    for (let i = 0; i < target.length; i++) {
      cloneTarget[i] = target[i];
    }
  } else {
    // 对象：遍历自身可枚举属性（过滤原型链属性）
    for (const key in target) {
      // 只拷贝自身属性（避免复制原型链上的继承属性）
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = target[key];
      }
    }
  }

  // 4. 返回拷贝结果
  return cloneTarget;
}
```

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
大部分主流场景
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
================

**constructor** 是原型对象（Prototype Object）上的一个默认属性，它的核心作用是指向该原型对象所关联的构造函数
```js
// 定义构造函数
function Person(name) {
  this.name = name;
}
// 构造函数的原型对象（Person.prototype）默认有 constructor 属性，指向 Person
console.log(Person.prototype.constructor === Person); // true
```

=================================

**总结**
根据图片内容，提取出的信息如下：

---

**原型（prototype）与 `__proto__` 对比总结表**

| 属性        | 存在于               | 用途                                         | 关系说明                                          |
| ----------- | -------------------- | -------------------------------------------- | ------------------------------------------------- |
| prototype   | 构造函数（Function） | 作为“蓝图”，定义所有实例共享的属性和方法。   | 实例的 `__proto__` 指向其构造函数的 `prototype`。 |
| `__proto__` | 对象实例（Object）   | 作为“链接”，指向实例的原型对象，构成原型链。 |                                                   |

---
## this 的指向在不同场景下（普通函数、箭头函数、构造函数、bind/call/apply）有何不同？
- 默认绑定
```js
function showThis() {
  console.log(this);
}
showThis();
执行 showThis() 时，控制台会输出全局对象（如浏览器的 window）。
全局直接调用（默认绑定）：非严格模式下 this 指向全局对象（window/global），严格模式下指向 undefined。
```
- 隐式绑定：
```js
const obj = {
  name: "obj",
  showThis, // 等价于 showThis: showThis
};
obj.showThis();
// 执行 obj.showThis() 时，控制台会输出 obj 对象（因为 showThis 方法是在 obj 上调用的）。
```
- new绑定
1.创建一个新的对象obj
2.将对象与构建函数通过原型链连接起来
3.将构建函数中的this绑定到新建的对象obj上
4.根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理
```js
// 定义构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 用 new 关键字调用构造函数，创建实例
const person1 = new Person("Alice", 25);
console.log(person1); // 输出：Person { name: 'Alice', age: 25 }
```
- 手写new绑定 
```js
// 手写 new 绑定
function myNew(constructor, ...args) {
  // 1. 创建一个新的对象 obj
  const obj = {};
  // 2. 将对象与构建函数通过原型链连接起来
  obj.__proto__ = constructor.prototype;
  // 3. 将构建函数中的 this 绑定到新建的对象 obj 上
  const result = constructor.apply(obj, args);
  // 4. 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理
  return result instanceof Object ? result : obj;
}

```
- 箭头函数的 this 是词法绑定，不能通过 call、apply、bind 等方法改变 this 指向。
  
- 硬绑定（call、apply、bind）
call：打电话，一个一个说（参数逐个传递）
apply：应用，把东西整理好一起给（参数数组传递）
bind：绑定，先准备好，稍后使用（返回新函数）
```js
// 不同对象共享方法
const car = {
    brand: 'Toyota',
    showInfo: function(year, color) {
        console.log(`这是一辆${year}年的${this.brand}，颜色：${color}`);
    }
};

const bike = {
    brand: 'Giant'
};

// 使用 call
car.showInfo.call(bike, 2023, '红色');
// 输出: 这是一辆2023年的Giant，颜色：红色

// 使用 apply
car.showInfo.apply(bike, [2023, '蓝色']);
// 输出: 这是一辆2023年的Giant，颜色：蓝色

// 使用 bind
const bikeInfo = car.showInfo.bind(bike, 2023);
bikeInfo('绿色');
// 输出: 这是一辆2023年的Giant，颜色：绿色
```
## BigInt 的出现解决了什么问题？它和 Number 类型在使用上有什么注意事项？

JavaScript 中 `Number` 类型基于 IEEE 754 标准，最大安全整数为 `2^53 - 1`（即 `9007199254740991`），超过该范围的整数无法被精确表示和计算（会出现精度丢失）。**BigInt 专门用于处理任意长度的大整数**，解决了大整数精确计算的问题，适用于密码学、区块链、大数据分析等需要高精度整数运算的场景。  


**与 Number 类型的使用注意事项**  
1. **不可直接混合运算**  
   BigInt 与 Number 不能直接进行算术运算（如 `10n + 5` 会报错），必须显式转换类型（如 `10n + BigInt(5)` 或 `Number(10n) + 5`）。  

2. **相等性判断差异**  
   - 宽松相等（`==`）会自动转换类型（如 `10n == 10` 结果为 `true`）；  
   - 严格相等（`===`）会区分类型（如 `10n === 10` 结果为 `false`）。  

3. **方法支持不同**  
   BigInt 不支持 `Math` 对象的方法（如 `Math.sqrt(10n)` 会报错），仅 `Number` 类型可使用 `Math` 相关方法。  

4. **创建方式限制**  
   - 字面量形式：需在整数后加 `n`（如 `123n`）；  
   - 函数形式：`BigInt()` 可接收整数或整数字符串（如 `BigInt("123")` 有效），但不能转换浮点数（如 `BigInt(123.5)` 会报错）。  

5. **特殊场景限制**  
   - 无法直接用于 JSON 序列化（需手动转为字符串）；  
   - 部分内置 API（如 `Date` 构造函数、`RegExp` 等）不支持 BigInt 类型。

## EventLoop 事件循环
JavaScript 是单线程的（同一时间只能执行一段代码），如果所有代码都同步执行，遇到耗时操作（如网络请求、定时器）时，页面会 “卡死”（阻塞）。为了避免这种情况，JS 将任务分为同步任务和异步任务，通过 EventLoop 机制 来协调它们的执行顺序。

**EventLoop** 是 JavaScript 运行时的一个机制，用于协调同步任务和异步任务的执行。它是避免单线程处理异步任务时阻塞页面的关键。

同步任务 > 微任务（异步）> 宏任务（异步）

以下是对常见宏任务、微任务的详细说明，包括它们的触发逻辑、在事件循环中的处理时机及具体示例，帮助理解它们在事件循环中的角色：

**一、宏任务（Macro Task）** 
宏任务是事件循环中“粒度较粗”的异步任务，每次事件循环只会从宏任务队列中取**一个**执行，执行完毕后会立即清空微任务队列，再进入下一轮循环。  


**1. DOM 事件（浏览器环境）**  
- **触发逻辑**：当用户操作DOM（如点击、滚动、输入）或DOM状态变化（如加载完成）时，浏览器会将事件回调函数放入宏任务队列。  
- **处理时机**：同步代码执行完、微任务队列清空后，才会从宏任务队列中取出DOM事件回调执行。  
- **示例**：  
  ```javascript
  console.log("同步任务"); // 同步执行
  document.getElementById("btn").addEventListener("click", () => {
    console.log("点击事件回调（宏任务）");
  });
  // 点击按钮后，回调会被放入宏任务队列，等待当前同步任务和微任务执行完后才触发
  ```  


**2. 网络请求（Ajax/Fetch，浏览器环境）**  
- **触发逻辑**：当发起异步网络请求（如 `XMLHttpRequest` 或 `fetch`）时，JS引擎会将请求交给浏览器的网络线程处理，待请求完成（成功/失败）后，回调函数会被放入宏任务队列。  
- **注意**：`fetch` 的 `then` 回调属于**微任务**（因为基于Promise），但“网络请求完成后将回调加入队列”这个动作本身是宏任务的调度逻辑。  
- **示例**：  
  ```javascript
  console.log("同步开始");
  fetch("https://api.example.com")
    .then(res => res.json())
    .then(data => console.log("请求结果（微任务）")); // then回调是微任务
  // 网络请求完成后，会先触发宏任务调度，再将then回调放入微任务队列
  console.log("同步结束");
  ```  

**3. setTimeout/setInterval（浏览器/Node环境）**  
- **触发逻辑**：定时器的回调函数会在指定延迟（`setTimeout`）或周期（`setInterval`）后，被放入宏任务队列。  
- **注意**：延迟时间是“最早执行时间”，而非“精确执行时间”——如果前面有同步任务或其他宏任务未执行完，回调会被延后。  
- **示例**：  
  ```javascript
  console.log("1（同步）");
  setTimeout(() => {
    console.log("2（宏任务）");
  }, 0); // 延迟0ms，仍会被放入宏任务队列
  console.log("3（同步）");
  // 执行顺序：1 → 3 → 2（同步完→微任务空→执行宏任务）
  ```  


**4. Node 环境的 I/O 操作（如 fs.readFile）**  
- **触发逻辑**：Node.js 中，文件读写、数据库操作等I/O任务会由libuv库（负责异步I/O的底层库）处理，操作完成后，回调函数会被放入宏任务队列。  
- **与浏览器的差异**：Node的宏任务队列更细分（如 `timers`、`poll`、`check` 等阶段），但对开发者而言，核心逻辑仍是“执行一个宏任务→清空微任务”。  
- **示例**：  
  ```javascript
  const fs = require('fs');
  console.log("同步开始");
  fs.readFile('test.txt', (err, data) => {
    console.log("文件读取完成（宏任务）");
  });
  console.log("同步结束");
  // 执行顺序：同步开始→同步结束→（等待文件读取完成）→ 文件读取完成（宏任务）
  ```  


**二、微任务（Micro Task）**  
微任务是“粒度较细”的异步任务，优先级高于宏任务。每次同步任务执行完后，会**立即清空所有微任务队列**（按加入顺序执行），再执行下一个宏任务。  
**1. Promise.then/catch/finally（浏览器/Node环境）**  
- **触发逻辑**：当Promise的状态从“pending”变为“fulfilled”（成功）或“rejected”（失败）时，其关联的 `then`/`catch`/`finally` 回调会被放入微任务队列。  
- **注意**：`Promise` 构造函数中的 executor 函数（`(resolve, reject) => {}`）是**同步执行**的，只有回调函数才是微任务。  
- **示例**：  
  ```javascript
  console.log("1（同步）");
  new Promise((resolve) => {
    console.log("2（同步，executor函数）");
    resolve();
  }).then(() => {
    console.log("3（微任务）");
  });
  console.log("4（同步）");
  // 执行顺序：1 → 2 → 4 → 3（同步完→清空微任务）
  ```  


**2. async/await（浏览器/Node环境）**  
- **触发逻辑**：`async` 函数返回一个Promise，`await` 关键字后面的表达式执行完后，**await之后的代码块会被包装成微任务**（本质是Promise的 `then` 回调）。  
- **执行细节**：  
  - `await` 会先执行右侧的表达式（同步执行）；  
  - 然后将 `await` 之后的代码放入微任务队列，暂停当前 `async` 函数，先执行外部同步代码；  
  - 同步代码执行完后，再执行该微任务，恢复 `async` 函数执行。  
- **示例**：  
  ```javascript
  async function fn() {
    console.log("2（同步）");
    await Promise.resolve(); // 等价于 Promise.resolve().then(...)
    console.log("4（微任务）"); // 这行被包装成微任务
  }
  console.log("1（同步）");
  fn();
  console.log("3（同步）");
  // 执行顺序：1 → 2 → 3 → 4（同步完→执行微任务）
  ```  


**3. 其他微任务（补充）**  
- **Node 环境**：`process.nextTick`（优先级高于其他微任务，属于“微任务中的微任务”）。  
- **浏览器环境**：`MutationObserver`（监听DOM变化的回调，属于微任务）。  


**核心总结** 
在事件循环中，这些任务的执行逻辑是：  
**同步任务 → 所有微任务（按顺序）→ 一个宏任务 → 所有微任务（按顺序）→ 下一个宏任务……**  
理解这些任务的分类和触发时机，是分析异步代码执行顺序的关键（比如面试中常见的“输出顺序题”）。

# 10.30
## 如和区分数组和对象
根据你提供的表格内容，以下是三种 JavaScript 类型判断方法的优缺点总结：
 **typeof**
- **优点**：能够快速区分基本数据类型（如 `string`、`number`、`boolean`、`undefined`、`symbol`、`function`）。
- **缺点**：不能区分 `Object`、`Array` 和 `Null`（都会返回 `"object"`）。
---
 **instanceof**
- **优点**：能够区分 `Array`、`Object` 和 `Function` 等引用类型。
- **缺点**：不能判断 `Number`、`Boolean`、`String` 等基本数据类型。
---
 **Object.prototype.toString.call()**
- **优点**：精准判断所有数据类型（返回如 `[object Array]`、`[object Null]` 等）。
- **缺点**：写法繁琐，不易记忆，通常需要封装成函数使用。
---
=====================================
代码实现
```js
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
null        → 最特殊的情况，需要优先排除
array       → 特殊的对象，需要明确区分  
function    → 特殊情况（虽然很少出现）
object      → 最一般的情况，放在最后
```
## 数组去重
**如何获取页面上所有使用过的 HTML 标签并去重。**
```js
/**
 * 获取HTML页面中所有不重复的标签名
 * 这是一个数组去重的实际应用场景，用于分析页面使用的HTML标签
 * @returns {string[]} 返回包含所有不重复标签名的数组，标签名为小写形式
 */
function getUniqueHtmlTags() {
    // 第一步：获取页面中的所有DOM元素
    // document.querySelectorAll('*') 使用CSS通配符选择器选中文档中的所有元素
    // 返回的是一个NodeList对象（类数组对象，包含所有匹配的元素节点）
    const allElements = document.querySelectorAll('*');
    
    // 第二步：处理元素集合，提取标签名
    // Array.from(allElements) 将NodeList类数组对象转换为真正的数组
    // 这样才能使用数组的map等高阶方法进行遍历处理
    // .map() 方法遍历每个元素，执行回调函数并返回新数组
    // element.tagName 获取元素的标签名（返回的是大写形式，如 'DIV', 'P'）
    // .toLowerCase() 将标签名统一转换为小写，保证一致性（如 'div', 'p'）
    const tagNames = Array.from(allElements).map(element => 
        element.tagName.toLowerCase()
    );
    
    // 第三步：使用Set数据结构进行数组去重
    // new Set(tagNames) 创建Set实例，自动去除数组中的重复项
    // Set是ES6新增的数据结构，特点是成员值都是唯一的
    // [...new Set(tagNames)] 使用扩展运算符将Set转换回数组
    // 这样就得到了一个包含所有不重复标签名的纯净数组
    const uniqueTags = [...new Set(tagNames)];
    
    // 返回最终的不重复标签名数组
    return uniqueTags;
}

// 使用示例：
// 假设页面中有：<div><p></p><span></span><div><p></p></div></div>
// 调用函数将返回：['html', 'head', 'body', 'div', 'p', 'span'] 等不重复标签

// 函数调用演示：
// const uniqueTags = getUniqueHtmlTags();
// console.log(uniqueTags); // 输出页面中所有不重复的HTML标签
```
**js数组去重**
“数组去重的方法选择要看具体场景：如果是现代项目，我会用[...new Set(arr)]，因为简洁高效，依赖 ES6 的Set特性，适合支持新语法的环境；如果需要兼容旧浏览器（比如 IE8），就用手动遍历 +indexOf的方法，虽然代码长一点，但兼容性有保障；如果是复杂场景（比如对象去重），手动方法的扩展性更好，可以自定义判断规则。这两种方法的核心都是利用‘唯一性’，只是实现方式和适用环境不同。”
```js
方法一
var arr1 = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10]
function unique(arr) {
  return [...new Set(arr)]
}
console.log(unique(arr1))
方法二
var arr1 = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10]
function unique(arr) {
  let res = []
  for(let i = 0; i < arr.length; i++) {
    if(res.indexOf(arr[i]) === -1) {
      res.push(arr[i])
    }
  }
  return res
}
console.log(unique(arr1))
res.indexOf(arr[i]) === -1 的意思是：当前元素 arr[i] 不在结果数组 res 中。
```

## 面试题：sort 背后原理是什么？(看下基础的排序方法)
JavaScript 中 sort() 方法的底层原理可结合默认行为、比较函数逻辑及代码示例理解，核心要点如下：
**一、基础特性：直接修改原数组**
sort() 会对原数组元素进行排序，并返回排序后的数组（原数组会被直接修改）。
```js
const arr = [3, 1, 2];
arr.sort(); 
console.log(arr); // [1, 2, 3]（原数组已被修改）
```
**二、默认排序规则（无比较函数时）**
若不传入参数，sort() 会按以下逻辑排序：
先将所有元素转为字符串（无论原类型是数字、布尔值等）；
按字符串的 Unicode 码点顺序排序。
代码示例与问题：
```js
const numArr = [10, 2, 5];
numArr.sort(); 
console.log(numArr); // [10, 2, 5]（不符合数字大小直觉）
```
原因：元素被转为字符串后，"10" 的 Unicode 码点（49）小于 "2"（50），因此 "10" 排在 "2" 前面。→ 结论：对非字符串类型（如数字、对象）排序时，必须手动传入比较函数。
**三、比较函数：自定义排序规则**
sort() 接收一个可选的比较函数（通常命名为 (a, b)），用于定义排序逻辑。
a 和 b 代表数组中相邻的两个元素；
返回值决定排序顺序：
负数：a 排在 b 前面；
0：a 与 b 相对位置不变（但 sort() 是不稳定排序，实际可能微调）；
正数：b 排在 a 前面。
常见场景代码示例：
数字升序排序
```js
const numArr = [10, 2, 5];
numArr.sort((a, b) => a - b); // a - b 为负数时，a 在前（升序）
console.log(numArr); // [2, 5, 10]
数字降序排序
js
numArr.sort((a, b) => b - a); // b - a 为负数时，b 在前（降序）
console.log(numArr); // [10, 5, 2]
对象数组按属性排序
js
const userArr = [
  { name: '张三', age: 25 },
  { name: '李四', age: 20 },
  { name: '王五', age: 30 }
];
// 按 age 升序排序
userArr.sort((a, b) => a.age - b.age); 
console.log(userArr); 
// 输出：[{name: '李四', age: 20}, {name: '张三', age: 25}, {name: '王五', age: 30}]
```
四、底层算法（以 V8 引擎为例）
sort() 并非单一算法，会根据数组长度优化：
数组长度 ≤ 10：用插入排序（短数组效率高，时间复杂度接近 O (n)）；
数组长度 > 10：用双枢轴快速排序（变种快速排序，平均时间复杂度 O (n log n)，更高效）。
总结：sort() 的核心是 “默认按字符串 Unicode 排序，通过比较函数自定义规则”，结合动态算法优化，兼顾灵活性与性能。实际开发中，非字符串排序必须使用比较函数避免默认行为的坑。
##  说说 Javascript 数字精度丢失的问题，如何解决？
**小数计算异常：**
```js
0.1 + 0.2 === 0.3 // false
```
大数字计算异常：
```js
9007199254740993 === 9007199254740992; // true（实际应为 false）
```
原因：JavaScript 中所有数字（无论整数还是小数）都采用 IEEE 754 双精度浮点数 标准存储，该标准用 64 位表示一个数字：
1 位符号位（正数 / 负数）；
11 位指数位（表示数字的量级）；
52 位尾数位（表示数字的精度，即有效数字）。
============================
核心限制:
**1.小数精度的有限**
十进制小数（如 0.1）转换为二进制时可能是无限循环小数，但尾数位只有 52 位，只能保留近似值。例如：
0.1 的二进制是 0.0001100110011...（循环 “0011”），存储时会截断为 52 位近似值，导致精度丢失。
**2.整数范围的有限(这个使用bigint解决)**
52 位尾数位最多能精确表示 2^53（即 9007199254740992）以内的整数。超过这个范围的整数，二进制表示会超出 52 位，导致精度丢失（如 9007199254740993 无法精确存储，会被舍入为 9007199254740992）
bigint 表示任意精度的整数，可用于存储和操作超过 52 位整数范围的数值。

============================

**小数计算异常怎么解决**
```js
function add(a,b) {
  const a2 = (a.toString().split('.')[1] || '').length;
  const b2 = (b.toString().split('.')[1] || '').length;
  const base = Math.pow(10,Math.max(a2,b2))
  return (a * base + b * base) / base
}
```
**大数字计算异常怎么解决**
```js
使用bigint 表示任意精度的整数，可用于存储和操作超过 52 位整数范围的数值。
```
## 你是怎么理解ES6中 Promise的？使用场景？

Promise 是ES6引入的一个内置的对象，用于表示一个异步操作的最终完成（或失败）及其结果值。
它是为了解决回调地狱（callback hell）问题，提供了一种更优雅的异步编程方式。

=========================================

回调地狱是因异步操作有依赖，导致回调函数多层嵌套的情况。确实，一层出问题会直接中断后续操作，且嵌套越深，修改时牵一发而动全身，非常麻烦。

========================================

它有以下几个状态：
pending：初始状态，不是成功或失败。
fulfilled：操作成功完成，有一个成功值。
rejected：操作失败，有一个失败原因（错误对象）。

**关键特性**
状态不可逆：一个 Promise 的状态一旦从 Pending 变为 Fulfilled 或 Rejected，就永久保持这个状态，不会再改变。
值不可变：一旦状态落定，Promise 的结果值（value）或失败原因（reason）就是不可变的。
**基本使用**
```js
// 模拟用户登录
function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        resolve({ token: 'abc123', user: { name: '管理员' } });
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 1000);
  });
}

// 使用示例
login('admin', '123456')
  .then((userInfo) => {
    console.log('登录成功:', userInfo);
    localStorage.setItem('token', userInfo.token);
  })
  .catch((error) => {
    console.error('登录失败:', error.message);
    alert('登录失败，请重试');
  })
  .finally(() => {
    console.log('登录流程结束');
  });
```

=========================

**Promise构造函数存在以下方法**

**all()**
Promise.all() 是 Promise 构造函数的静态方法，用于并行处理多个异步操作，等待所有操作都完成（成功）后再统一处理结果；如果有任何一个操作失败，会立即返回失败的原因。
**race()**
Promise.race() 在多个异步操作中采用最先完成的那一个结果，无论成功还是失败。

=========================

**使用场景**
1. 网络请求
```js
fetch('/api/user/data')
  .then(response => response.json())
  .then(data => {
    console.log('获取数据成功:', data);
    updateUI(data);
  })
  .catch(error => {
    console.error('请求失败:', error);
    showError('数据加载失败');
  });
```
2. 解决回调地狱
```js
// 替代多层嵌套回调
login(user, pass)
  .then(userInfo => getPosts(userInfo.id))
  .then(posts => getComments(posts[0].id)) 
  .then(comments => renderPage(comments))
  .catch(error => handleError(error)); // 一个 catch 处理所有错误
```
3. 并行处理多个异步操作
```js
// 同时发起多个请求，等待所有完成
Promise.all([
  fetchUserInfo(),
  fetchUserOrders(),
  fetchUserSettings()
])
.then(([user, orders, settings]) => {
  renderDashboard(user, orders, settings);
})
.catch(error => {
  // 只要有一个请求失败，就会执行这里（比如网络错误、接口返回失败）
  console.error('加载失败：', error.message);
});
```
## 什么是防抖和节流？有什么区别？如何实现？
**防抖**
概念：在事件被触发 n 秒后再执行函数，如果在这 n 秒内又被触发，则重新计时。
通俗理解：等待用户"完成"操作后再执行
适用场景：
- 搜索框输入建议（等待用户停止输入）
- 窗口 resize（调整完成后计算布局）
- 表单验证（输入停止后再验证）

**节流**
概念：在单位时间内，无论事件触发多少次，只执行一次函数。
通俗理解：保证在一定时间内只执行一次
适用场景：
- 滚动加载（滚动过程中定期检查位置)
- 按钮点击（防止重复提交）
- 鼠标移动（限制执行频率）

==================================

**代码实现**

**防抖**
```javascript
// 防抖函数：用于限制高频触发的函数在指定时间内只执行一次（停止触发后延迟执行）
// 参数：
// - func：需要被防抖处理的原始函数（业务逻辑函数）
// - wait：等待时间（毫秒），表示停止触发后延迟多久执行原始函数
function debounce(func, wait) {
  // 声明一个变量存储定时器ID，用于后续清除定时器（控制延迟执行的关键）
  let timeout;

  // 返回一个"包装函数"，这个函数会替代原始函数被调用（实际触发时执行的是它）
  return function (...args) {
    // 保存当前上下文的this指向（确保原始函数执行时，this能指向正确的对象）
    const context = this;

    // 清除上一次设置的定时器：如果在等待时间内再次触发，就取消上一次的延迟执行计划（重新计时）
    clearTimeout(timeout);

    // 重新设置定时器：等待wait毫秒后，通过apply调用原始函数
    // apply的作用：1. 让原始函数的this指向context（保存的上下文）；2. 将收集到的参数args传递给原始函数
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
```
**节流**
```javascript
function throttle(func, limit) {
  let lastCall = 0;
  // 保存上一次执行的时间戳，初始值为0（第一次调用时会更新）
  return function(...args) {
    // 保存当前上下文的this指向（确保原始函数执行时，this能指向正确的对象）
    const context = this;
    // 获取当前时间戳（毫秒级），用于计算时间差
    const now = Date.now();
    // 检查是否超过时间限制
    if (now - lastCall >= limit) {
      func.apply(context, args);
      lastCall = now;
    }
  };
}
```

# 10.31
## 面试官：解释下什么是事件代理？应用场景？
事件代理（Event Delegation）是一种事件处理模式，它利用事件冒泡的机制，将事件处理函数绑定在父元素上，而不是直接绑定在子元素上。
当子元素触发事件时，事件会冒泡到父元素，从而触发绑定在父元素上的事件处理函数。
原理：
DOM 事件触发后，会经历捕获，目标，冒泡三个阶段。
- 捕获阶段：事件从 window 开始，逐级向下传递到目标元素。
- 目标阶段：事件到达目标元素。
- 冒泡阶段：事件从目标元素开始，逐级向上传递到 window。
其中冒泡阶段是事件代理的关键。它利用事件冒泡的机制，将事件处理函数绑定在父元素上，而不是直接绑定在子元素上。

**优势**
1.减少事件监听数量：没有必要给每一个子元素事件绑定，只需要给父元素绑定一次即可，大幅度减少内存占用。
2.动态添加元素：如果后续有新的子元素添加到父元素中，也不需要重新绑定事件，因为事件会冒泡到父元素。

===========================

**应用场景**

子元素数量多、或子元素动态增减
1. 列表项操作（如ul中的li）：当列表有大量项（如 1000 个li），或需要动态添加 / 删除li时，无需给每个li绑定click事件，而是给ul绑定一次事件，通过event.target判断点击的是哪个li。
```js
<ul id="list">
  <li>项目1</li>
  <li>项目2</li>
  <!-- 可能动态添加更多li -->
</ul>
<script>
  const list = document.getElementById('list');
  // 父元素ul代理所有li的点击事件
  list.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') { // 判断触发事件的是li
      console.log('点击了：', e.target.textContent);
    }
  });
</script>
```
2. 表格单元格操作：表格（table）中的单元格（td）数量多且可能动态更新时，给table绑定事件，代理所有td的点击 /hover 等事件。
3.导航菜单：导航栏（nav）中的多个菜单项（a或div），通过nav代理点击事件，判断具体点击的菜单项并执行跳转逻辑。

注意:不适合无冒泡特性的事件（如focus、blur），这类事件无法通过父元素代理。

## 面试官：如何判断一个元素是否在可视区域中？
**getBoundingClientRect() 方法**
**原理**:通过获取元素相当于视口（viewport）的位置信息，结合视口判断元素是否在可视区域内。
**适用场景**
- 简单场景(如偶尔判断一次元素是否在可视区域内)
- 配合srcoll/resize 事件实现基础监听
**代码实现**
```js
function isviewport(element) {
  const rect = element.getBoundingClientRect();
  const viewh = window.innerHeight;
  const vieww = window.innerWidth;
  return rect.top <= viewh && rect.left >= 0 && rect.bottom >= 0 && rect.right <= vieww;
}
```
**Intersection Observer API**
**原理**
是浏览器提供的原生 API，能自动监测元素与视口（或指定根元素）的交叉状态（进入 / 离开、交叉比例），通过创建 “观察者” 实例，在状态变化时自动触发回调，无需手动监听滚动或视口变化事件，高效且异步，简化了元素可见性相关的开发。

**适用场景**
- 高频监听场景(图片加载，无限滚动，曝光统计)
- 需要自动处理元素动态出现/消失的场景
**代码实现**
```js
// 创建交叉观察器实例，用于监测元素是否进入或离开可视区域
// 构造函数接收一个回调函数，该函数在监测的元素可见性变化时触发
const observer = new IntersectionObserver((entries) => {
  // entries 是一个数组，包含所有被观察元素的交叉状态信息
  entries.forEach((entry) => {
    // 检查元素是否与视口相交（进入可视区域）
    if (entry.isIntersecting) {
      console.log('元素进入可视区域');
      // 在这里可以添加元素进入可视区域时的处理逻辑
      // 例如：加载图片、播放视频、触发动画等
    } else {
      console.log('元素离开可视区域');
      // 在这里可以添加元素离开可视区域时的处理逻辑
      // 例如：暂停视频、隐藏元素、释放资源等
    }
  });
});

// 开始观察指定的DOM元素（element需要是一个有效的DOM节点）
// 当该元素的可见性状态发生变化时，上面定义的回调函数将被触发
observer.observe(element);
```
**总结**
若需兼容性优先或简单场景：选 getBoundingClientRect()；
若需性能优先或高频监听：选 Intersection Observer（现代项目首选）。
这两个方法覆盖了 90% 以上的 “判断元素是否在可视区域” 需求，是前端开发中最常用的方案。

# 11.3
##  那你说说什么是跨域问题？怎么解决？
**什么跨域问题**
浏览器为了保证用户数据的安全：会执行「同源策略」：只有当两个页面(协议、域名、端口号)完全相同，才允许进行交互。
比如：
```js
前端页面地址：http://localhost:3000（协议 http，域名localhost，端口 3000）
后端接口地址：http://localhost:4000/api（端口不同） → 跨域
后端接口地址：https://localhost:3000/api（协议不同） → 跨域
```
**为什么会有跨域问题？**
同源策略是浏览器的核心安全机制，目的是防止恶意网站窃取用户数据。例如：如果没有同源策略，A网站可以直接访问B网站的资源，而B网站的用户数据就会被泄露。

**常见的跨域解决方案**
根据场景不同，解决方案可分为「后端主导」「前端辅助」「代理转发」等类型，常用的有以下几种：

- 后端主导
```js
app.use(cors({
  // 允许所有域名跨域访问
  origin:"*",
  // 允许所有 HTTP 方法跨域访问,这里默认是加了预检请求
  methods:["GET","POST","PUT","DELETE"],
  // 允许所有请求头跨域访问
  allowedHeaders:["Content-Type","Authorization"],
}))
优点：支持所有 HTTP 方法，安全可控，是现代项目的首选。
```
1. 设置 Content-Type（如 JSON 格式）
```js
// Axios
axios.post('https://后端域名/api', { name: 'test' }, {
  headers: {
    'Content-Type': 'application/json' // 声明JSON格式（会触发预检请求）
  }
});

// Fetch
fetch('https://后端域名/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'test' })
});
```
2. 自定义请求头（如 X-Token）
```js
// Axios
axios.get('https://后端域名/api', {
  headers: {
    'X-Token': 'user123-token' // 自定义令牌头
  }
});

// Fetch
fetch('https://后端域名/api', {
  headers: {
    'X-Token': 'user123-token'
  }
});
```
## 什么时候会触发预检请求？()
## 说一下CSS有哪些选择器？优先级是怎样的？
1. 通用选择器：'*'
```css
* {
  margin: 0;
  padding: 0;
}
```
权重：0,0,0,1
2. 类型选择器：根据元素类型匹配（如 div、p、span 等）
```css
div {
  color: red;
}
```
权重：0,0,1,0
3. 属性选择器：根据元素的属性值匹配（如 [type="text"]）
```css
[type="text"] {
  border: 1px solid #ccc;
}
```
权重：0,0,1,0
4. 类选择器：根据元素的 class 属性匹配（如 .class-name）
```css
.class-name {
  font-size: 16px;
}
```
权重：0,0,1,0
5.伪类选择器：根据元素的状态或位置匹配（如 :hover、:first-child 等）
```css
a:hover {
  color: blue;
}
```
权重：0,0,1,0
6.Id选择器：根据元素的 id 属性匹配（如 #id-name）
```css
#id-name {
  background-color: #f0f0f0;
}
```
权重：0,1,0,0
7.伪元素选择器：根据元素的特殊位置匹配（如 ::before、::after 等）
```css
p::first-letter {
  font-size: 24px;
}
```
权重：0,0,1,0
**组合选择器**
1.后代选择器：根据元素的嵌套关系匹配（如 div p）
```css
div p {
  color: green;
}
```
权重：0,0,1,0
2. 子选择器：根据元素的直接子元素匹配（如 div > p）
```css
div > p {
  font-weight: bold;
}
```
权重：0,0,1,0
3. 相邻兄弟选择器：根据元素的紧跟关系匹配（如 p + p）
```css
p + p {
  margin-top: 10px;
}
```
权重：0,0,1,0
4. 通用兄弟选择器：根据元素的同级关系匹配（如 p ~ p）
```css
p ~ p {
  text-indent: 20px;
}
```
权重：0,0,1,0

** 优先级**
优先级： !important > 内联样式 > ID选择器 > 类选择器 > 类型(标签)选择器 > 通用选择器 

## CSS中如果一个img 设置了width： 600 ！important，再设置min-width 会怎么样？
当 img 同时设置 width: 600px !important 和 min-width 时，最终宽度由 min-width 的值与 width 的值的大小关系 决定：
如果 min-width 的值 大于 600px（例如 min-width: 800px）：min-width 的 “最小宽度约束” 会生效，img 的实际宽度会是 min-width 的值（800px），忽略 width: 600px !important。（因为 min-width 的核心作用是 “不允许元素宽度小于此值”，无论 width 如何设置，只要小于 min-width 就会被覆盖。）
如果 min-width 的值 小于或等于 600px（例如 min-width: 400px）：width: 600px !important 会生效，img 的实际宽度为 600px（因为 600px 满足 min-width: 400px 的约束，无需调整）。
核心逻辑：min-width 和 max-width 是对元素宽度的 “硬性约束”，width 只是 “基础设定”。当 width 与 min-width 冲突时，min-width 会优先保证元素宽度不低于其设定值，不受 width 的 !important 影响。

##  回流和重绘是什么？有什么区别区别？(在看看)
**回流**
当元素的几何属性发生变化时（例如宽度、高度、位置等），浏览器需要重新计算元素的位置和大小，这个过程称为回流（Reflow）。
- 回流会触发重绘
  
**重绘**
当元素的外观属性发生变化时（例如颜色、背景、边框等），浏览器需要重新绘制元素，这个过程称为重绘（Repaint）。
- 重绘不会触发回流

**触发场景**
1. 触发回流的场景（几何属性变化）
- 直接修改元素的几何样式：如 width、height、margin、padding、border、top、left 等。例：div.style.width = "200px"（宽高变化，需重新计算布局）。
- 改变元素的布局结构：如添加 / 删除 DOM 元素、隐藏 / 显示元素（display: none 会触发回流，因为元素从布局中移除）。
- 浏览器窗口尺寸变化：如用户缩放窗口（resize 事件），此时整个页面布局需要重新计算。
- 改变元素的字体相关属性：如 font-size、font-family（字体大小变化可能导致元素宽高变化）。


**触发重绘的场景（外观变化，几何不变）**
- 修改元素的非几何样式：如 color、background-color、border-color、box-shadow、opacity（不配合 transform 时）等。例：div.style.color = "red"（颜色变化，无需改布局，仅重绘）。
- 部分 CSS 属性变化：如 visibility: hidden（元素仍占据布局空间，仅隐藏，只触发重绘）。

**差别**
回流成本更高：回流需要重新计算整个布局树，可能引发连锁反应（父元素、子元素、兄弟元素的布局都可能受影响），性能消耗远大于重绘。
重绘成本较低：仅需重新绘制元素的视觉部分，不涉及布局计算。

## 面试官： 你能说说vue2和vue3的区别吗
**1.核心api:从选择式到组合式，更灵活的代码组织**
vue2 选择式api:代码按照data,methods,computed等选项划分，
负责分散在不同选项，复杂组件(表单，数据可视) 容易出现，代码碎片化，
（比如一个功能的逻辑可能分布在data 和methods 里面），造成维护成本高
2.vue3 是组合式api:按照功能逻辑：组织代码（比如把表单验证相关的变量，方法
，监听写在一起，更适合大型项目，复用逻辑也更简单，无需依赖 mixin，可直接用自定义 Hooks）。
**2. 性能优化：编译和运行时双提升**
- Vue3 编译模板时会标记 “静态节点”（如纯文本、固定样式的元素），更新时跳过这些节点的对比，减少虚拟 DOM 计算量；Vue2 每次更新都会全量对比虚拟 DOM。
- vue3 支持 （多根节点模板，无需外层包裹 div）、Teleport（组件内容可渲染到任意 DOM 位置，如弹窗挂载到 body）、Suspense（异步组件加载时的占位逻辑），既提升性能，又简化复杂场景开发。
**3. 响应式系统：更彻底的监听能力**
vue3：原生支持监听对象新增 / 删除属性、数组索引 / 长度变化，无需额外 API，响应式更彻底，也更符合直觉。
Vue2:只能监听对象的已有属性，对新增属性（如 obj.newKey = 1）或数组索引 / 长度变化（如 arr[0] = 1）无法监听，需要手动用 this.$set 触发更新，有明显局限性。

**4. 其他关键差异**
**生命周期**：Vue3 调整了部分钩子（如 beforeCreate/created 合并到 setup，mounted 对应 onMounted 等），需在 setup 中通过导入使用，更符合组合式逻辑。
**TypeScript** 支持：Vue3 原生用 TS 开发，类型定义完善，对 TS 支持更友好；Vue2 需通过 vue-class-component 等库兼容，体验较差。

## 怎么实现响应式数据？那你说说ref和reactive()区别？
**先说ref 和 reactive() 区别？**
1. 处理数据类型不同
- reactive：只能处理引用类型（对象、数组、Map、Set 等），无法直接处理基本类型（如 reactive(123) 会无效）。原理：reactive 内部通过 Proxy 直接代理整个对象，递归监听所有属性的读写。
- ref：主要用于处理基本类型（字符串、数字、布尔值等），但也支持引用类型（会自动转换为 reactive 代理）。原理：ref 会创建一个「包装对象」，该对象包含 value 属性，通过拦截 value 的读写实现响应式（基本类型存在 value 中；引用类型时，value 会被 reactive 代理）。

2. 访问 / 修改方式不同

- reactive：直接通过「属性名」访问 / 修改，无需额外操作。例：
```js
const obj = reactive({ name: 'foo' })
console.log(obj.name) // 访问：直接用属性名
obj.name = 'bar' // 修改：直接赋值属性
```
- ref：必须通过「.value」访问 / 修改（模板中会自动解包，无需 .value）。例：
```js
const count = ref(0)
console.log(count.value) // 访问：必须用 .value
count.value = 1 // 修改：必须赋值 .value
// 若 ref 包装引用类型
const user = ref({ age: 18 })
console.log(user.value.age) // 需 .value 访问内部对象
user.value.age = 19 // 修改内部属性
```
3. 解构后的响应式表现不同
- reactive：解构后会丢失响应式。原因：reactive 的响应式依赖 Proxy 代理，解构会将属性值提取为普通值（脱离代理）。例：
```js
const obj = reactive({ a: 1, b: 2 })
const { a, b } = obj // 解构后 a、b 是普通值，修改不会触发更新
a = 3 // 无响应式
```
- ref：解构后仍能保持响应式（需配合 toRefs）。原因：ref 本身是包装对象，通过 toRefs 可以将其转换为「属性级别的 ref」，解构后仍可通过 .value 保持响应式。例：
```js
const obj = reactive({ a: 1, b: 2 })
const refs = toRefs(obj) // 将 reactive 对象转为 ref 集合
const { a, b } = refs // 解构后 a、b 是 ref 对象
a.value = 3 // 仍会触发响应式更新
```
4. 对「整个对象替换」的支持不同
- reactive：无法直接替换整个对象，否则会丢失响应式。原因：reactive 的代理是针对「初始对象」的，若直接替换为新对象，新对象不会被代理，响应式失效。例：
```js
const obj = reactive({ name: 'foo' })
obj = { name: 'bar' } // 错误：替换后 obj 不再是响应式代理
ref：可以直接替换整个 .value，响应式依然有效。原因：ref 的响应式基于 value 属性的拦截，无论 value 是基本类型还是新对象，都会被重新监听。例：
```
```js
const user = ref({ name: 'foo' })
user.value = { name: 'bar' } // 有效：新对象会被自动代理，响应式保留
```

============================

实际开发中，推荐优先使用 ref（更通用，尤其处理基本类型或需要整体替换的场景），仅在明确操作复杂对象且无需替换整体时使用 reactive。

**如何实现响应式数据？**
响应式数据的核心目标：当数据发生变化时，依赖该数据的代码(计算逻辑等))能够自动执行更新。
**1.监听数据读写**
通过拦截数据的读取和修改操作，实现对对数据变化的感知
对于对象/数组：
- 利用 Proxy 代理对象，拦截对属性的读取和赋值操作。
对于基本类型：
- 利用 包装对象 持有它，通过拦截包装对象的value属性的读取和赋值操作。

**2. 依赖收集和触发更新**
- 依赖收集：当数据被读取时（如在模板中使用、在计算属性中引用），记录当前「使用该数据的代码」（称为「依赖」）。
- 触发更新：当数据被修改时，通知所有收集到的「依赖」执行更新（如重新渲染视图、重新计算）

## 面试官：数组的常用方法有哪些？
**1. 增**
- push(改变原数组)
它是在末尾添加一个或多个元素，并返回新的长度。
```js
arr.push(5,6)
```
- unshift(改变原数组)
它是在在数组开头添加 1 个或多个元素
```js
arr.unshift(2)（改变原数组）
```
- concat(...arrays)(不改变原数组)
  它是在合并多个数组或值，返回新数组。
```js
const arr1 = [1, 2];
const arr2 = [3, 4];

// 合并两个数组
const newArr1 = arr1.concat(arr2); 
console.log(newArr1); // [1, 2, 3, 4]
console.log(arr1); // [1, 2]（原数组未变）
```
2. 删
- pop(改变原数组)
它是在删除数组的最后一个元素，并返回该元素。
```js
arr.pop()（改变原数组）
```
- shift(改变原数组)
它是在删除数组的第一个元素，并返回该元素。
```js
arr.shift()（改变原数组）
```
- splice(start, deleteCount, ...items)(改变原数组)
它是在删除从 start 索引开始的 deleteCount 个元素，并在该位置插入 ...items 元素。
```js
arr.splice(1, 2, 5, 6)（改变原数组）
```
slice(start, end)(不改变原数组)
它是在返回从 start 索引开始到 end 索引（不包含 end）的新数组。
```js
arr.slice(1, 3)（不改变原数组）
```
3.改
- splice(start, deleteCount, ...items)（替换功能）
功能：删除元素的同时，在start位置插入新元素（删除 + 添加结合）
原数组：改变
示例：
```js
const arr = [1, 2, 3, 4];
// 从索引1开始，删除2个元素，插入'x','y'
arr.splice(1, 2, 'x', 'y'); 
console.log(arr); // [1, 'x', 'y', 4]（原数组改变）

// 只插入不删除（deleteCount=0）
arr.splice(2, 0, 'z'); 
console.log(arr); // [1, 'x', 'z', 'y', 4]
```
- reverse()
功能：反转数组元素顺序
原数组：改变
返回值：反转后的原数组（引用不变）
```js
const arr = [1, 2, 3];
const reversed = arr.reverse(); 
console.log(arr); // [3, 2, 1]（原数组改变）
console.log(reversed === arr); // true（返回原数组引用）
```
4. 查
- indexOf(item, fromIndex)
功能：从fromIndex开始，查找item首次出现的索引（严格相等===）
返回值：找到则返回索引，否则-1
```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.indexOf(3)); // 2
console.log(arr.indexOf(6)); // -1（未找到）
```
- includes(item, fromIndex)
功能：判断数组是否包含item（支持NaN检测，弥补indexOf缺陷）
返回值：布尔值
```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.includes(3)); // true
console.log(arr.includes(6)); // false（未找到）
console.log(arr.includes(NaN)); // true（NaN 被正确检测）
```
5.迭代（遍历 / 处理元素）
- forEach(callback)
功能：遍历每个元素，执行callback（无返回值，无法用break中断）
原数组：不改变（除非回调内手动修改）
```js
const arr = [1, 2, 3];
// 遍历打印每个元素和索引
arr.forEach((item, index) => {
  console.log(`索引${index}的值：${item}`); 
  // 输出：
  // 索引0的值：1
  // 索引1的值：2
  // 索引2的值：3
});
```
- map(callback)
功能：对每个元素执行callback，返回新数组（长度与原数组一致，元素为处理后的值）
原数组：不改变
```js
const arr = [1, 2, 3];
// 每个元素乘2
const doubled = arr.map(item => item * 2); 
console.log(doubled); // [2, 4, 6]
console.log(arr); // [1, 2, 3]（原数组未变）
```
- filter(callback)
功能：筛选出满足callback条件的元素，返回新数组（仅包含符合条件的元素）
原数组：不改变
```js
const arr = [1, 2, 3, 4, 5];
// 筛选偶数
const evens = arr.filter(item => item % 2 === 0); 
console.log(evens); // [2, 4]
console.log(arr); // [1, 2, 3, 4, 5]（原数组未变）
```
- reduce(callback, initialValue)
功能：从左到右遍历，通过callback累计计算为单个值（万能方法：求和、求最值、扁平化等）
参数：callback(累计值, 当前元素, 索引, 数组)，initialValue为初始累计值（可选）
```js
const arr = [1, 2, 3, 4];
// 求和（初始值为0）
const sum = arr.reduce((acc, cur) => acc + cur, 0); 
console.log(sum); // 10

// 求最大值
const max = arr.reduce((acc, cur) => Math.max(acc, cur), -Infinity); 
console.log(max); // 4

// 数组扁平化（一层）
const nestedArr = [1, [2, 3], 4];
const flatArr = nestedArr.reduce((acc, cur) => acc.concat(cur), []); 
console.log(flatArr); // [1, 2, 3, 4]
console.log(nestedArr); // [1, [2, 3], 4]（原数组未变）
```
- some(callback)
功能：判断是否至少有一个元素满足callback条件（找到即返回true，中断遍历）
返回值：布尔值
```js
const arr = [1, 3, 5, 7];
// 判断是否有偶数
const hasEven = arr.some(item => item % 2 === 0); 
console.log(hasEven); // false（全是奇数）

const arr2 = [1, 2, 3];
console.log(arr2.some(item => item % 2 === 0)); // true（有2）
```
- every(callback)
功能：判断是否所有元素满足callback条件（有一个不满足即返回false）
返回值：布尔值
```js
const arr = [2, 4, 6];
// 判断是否全是偶数
const allEven = arr.every(item => item % 2 === 0); 
console.log(allEven); // true

const arr2 = [2, 3, 4];
console.log(arr2.every(item => item % 2 === 0)); // false（3是奇数）
``` 
# 11.4
## 面试官：typeof 与 instanceof 区别
**1. 检测的目标不一样：**
 typeof：主要用于检测基本数据类型（如 number、string 等），对部分引用类型（如 function）也能识别，但无法区分具体的引用类型（如数组、日期等）。
instanceof:主要用于检测引用类型（对象），判断一个对象是否是某个构造函数的实例（基于原型链），无法直接检测基本数据类型（除非用包装对象）。
**2. 返回值不同**
typeof：返回一个字符串，表示数据的类型。可能的值有：'number'、'string'、'boolean'、'undefined'、'symbol'、'bigint'、'function'、'object'。
instanceof：返回一个布尔值（true 或 false），表示左侧对象是否是右侧构造函数的实例。

instanceof 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型
而typeof 也存在弊端，它虽然可以判断基础数据类型（null 除外），但是引用数据类型中，除了function 类型以外，其他的也无法判断
**3. 原理不同**
typeof：通过判断数据的类型标识（底层类型标签）来返回结果。JavaScript 引擎会为不同类型的数据分配一个标签（如 0 表示数字、6 表示对象等），typeof 读取这个标签并返回对应字符串。
instanceof：通过原型链查找实现。判断右侧构造函数的 prototype 属性是否存在于左侧对象的原型链上（即 obj.__proto__ === Constructor.prototype 或原型链上游是否匹配）。

## 面试官：大文件上传如何做断点续传？
**核心原理**
将文件分成小块，分批上传，通过记录已上传的块，中断后可以从断点继续上传
**步骤**
1. 文件分片：将大文件分割为固定大小的二进制块（如每块 5MB），单独上传每个块。
2. 唯一标识：为文件生成唯一的ID，确保同一个文件的标识一样，用于后端识别文件并关联其分片。
3. 断点记录：后端记录每个文件已上传成功分片分片索引，前端上传前先查询已传分片，只传未完成的部分。
4. 合并文件：所以的分片上传完后，后端安分片的顺序拼接为完整文件


===============================
## 面试官：如何实现两栏布局，右侧自适应？三栏布局中间自适应呢？
**两栏布局**
1.flex弹性布局
```html
<style>
    .box{
        display: flex;
    }
    .left {
        width: 100px;
    }
    .right {
        flex: 1;
    }
</style>
<div class="box">
    <div class="left">左边</div>
    <div class="right">右边</div>
</div>
```
2. 浮动（float）+ margin
```html
<style>
  .box {
    overflow: hidden; /* 清除浮动影响（避免父元素高度塌陷） */
  }
  .left {
    width: 100px;
    float: left;
  }
  .right {
    margin-left: 100px; /* 等于左侧宽度，让出空间 */
  }
</style>
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```
3.绝对定位
```html
<style>
  .box {
    position: relative;
    min-height: 50px; /* 避免内容为空时高度丢失 */
  }
  .left {
    position: absolute;
    width: 100px;
    height: 100%; /* 与父元素等高 */
  }
  .right {
    margin-left: 100px; /* 让出左侧空间 */
  }
</style>
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```
4.Grid 布局
```html
<style>
  .box {
    display: grid;
    grid-template-columns: 100px 1fr; /* 第一列100px，第二列自适应 */
  }
</style>
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```
**三栏布局**
1.flex
```html
    .wrap {
        display: flex;
        justify-content: space-between;
    }

    .left,
    .right,
    .middle {
        height: 100px;
    }

    .left {
        width: 200px;
        background: coral;
    }

    .right {
        width: 120px;
        background: lightblue;
    }

    .middle {
        background: #555;
        width: 100%;
        margin: 0 20px;
    }
</style>
<div class="wrap">
    <div class="left">左侧</div>
    <div class="middle">中间</div>
    <div class="right">右侧</div>
</div>
```
2. Grid 布局
更简单直接，直接定义三列宽度：
```html
grid-template-columns: 200px 1fr 120px; 
```
## 面试官：元素水平垂直居中的方法有哪些？如果元素不定宽高呢？
1.元素水平垂直居中
- flex布局
- grid布局
- 利用定位+margin:负值
```js
<style>
    .father {
        position: relative;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left:-50px;
        margin-top:-50px;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>

```
- 利用定位+margin:auto
```js
<style>
    .father{
        width:500px;
        height:300px;
        border:1px solid #0a3b98;
        position: relative;
    }
    .son{
        width:100px;
        height:40px;
        background: #f0a238;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```
**没有宽度和高度**
flex布局
grid布局

## 面试官：什么是HTTP? HTTP 和 HTTPS 的区别?
**HTTP**
HTTP(超文本传输协议)它是客户端(浏览器)与服务器之间传输数据的协议，基于TCP协议工作，组要是使用传输超文本(如HTML ,图片) ，明文传输，没有加密和身份验证，安全性底

**HTTP 和 HTTPS 的区别**
1.端口
http默认是：80
https 默认是 443
2.开销(网络传输和数据处理过程中消耗的资源（时间、计算能力等)
http:无加密加密过程，传输效率高
https：需握手协商加密算法、验证证书，增加额外开销，传输效率略低。
3.底层协议
http：它是TCP 协议
https:是SSL/TLS + TCP(加密 + 传输)
4.安全性
http：明文传输，数据易被窃听、篡改，无身份验证，安全性差。
https: 在 HTTP 基础上加入 SSL/TLS 加密层，数据传输加密，且通过证书验证服务器身份，安全性高。

# 11.5
## 如果要做优化，CSS提高性能的方法有哪些？
**为什么要优化**
每一个网页都离不开css,但是很多人又认为，css 是主要完成页面的布局，
像一些细节的优化，就不怎么考虑，这个是错误的。
作为页面渲染和内容展现的重要环节，css影响着用户对整个网站的第一体验
**优化的方式**
**1.内联屏幕关键css**
而通过内联css关键代码能够使浏览器在下载完html后就能立刻渲染
而如果外部引用css代码，在解析html结构过程中遇到外部css文件，才会开始下载css代码，再渲染
所以，CSS内联使用使渲染时间提前
**注意**：但是较大的css代码并不合适内联（初始拥塞窗口、没有缓存），而其余代码则采取外部引用方式
**2.资源压缩**
利用webpack、gulp/grunt、rollup等模块化工具，将css代码进行压缩，使文件变小，大大降低了浏览器的加载时间
**3.合理使用选择器**
css匹配的规则是从右往左开始匹配，例如#markdown .content h3匹配规则如下：
所以我们在编写选择器的时候，可以遵循以下规则：

不要嵌套使用过多复杂选择器，最好不要三层以上
使用id选择器就没必要再进行嵌套
通配符和属性选择器效率最低，避免使用
**4.减少使用昂贵的属性**
在页面发生重绘的时候，昂贵属性如box-shadow/border-radius/filter/透明度/:nth-child等，会降低浏览器的渲染性能
**5.不要使用@import**
css样式文件有两种引入方式，一种是link元素，另一种是@import
@import会影响浏览器的并行下载，使得页面在加载时增加额外的延迟，增添了额外的往返耗时
比如一个css文件index.css包含了以下内容：@import url("reset.css")

那么浏览器就必须先把index.css下载、解析和执行后，才下载、解析和执行第二个文件reset.css
**6.异步加载CSS**
在CSS文件请求、下载、解析完成之前，CSS会阻塞渲染，浏览器将不会渲染任何已处理的内容
前面加载内联代码后，后面的外部引用css则没必要阻塞浏览器渲染。这时候就可以采取异步加载的方案，主要有如下：
## 面试官：什么是响应式设计？响应式设计的基本原理是什么？如何做？

**是什么**

响应式设计是一种网络设计和开发方法，核心是同一网页在不同设备的各种屏幕尺寸、分辨率下，都能自动调整布局、内容展示方式和交互逻辑，从而为用户提供一致且良好的浏览体验（避免用户手动缩放、横向滚动等操作）。
**基础原理**
根据设备特性动态调整网页表现，主要依赖三个关键技术支撑：
**1.流式网格（Fluid Grids）**
摒弃传统固定像素（px）布局，改用相对单位（如百分比、em、rem、vw/vh 等）定义元素尺寸，使容器和内容能随屏幕宽度成比例缩放，确保布局在不同尺寸下保持协调性。

===================================

- 百分比（%）：百分比是相对于父元素的相同属性来计算的。例如，如果设置一个元素的宽度为50%，那么它的宽度就是父元素宽度的50%。
- em :em是相对于当前元素字体大小的单位。如果当前元素没有设置字体大小，则继承父元素的字体大小。1em等于当前字体大小。它也可以用于其他属性，如宽度、高度等，但这时是相对于当前元素的字体大小。
- rem : rem是相对于根元素（html）字体大小的单位。1rem等于根元素的字体大小。如果根元素的字体大小是16px，那么1rem就是16px。
- vw/vh：：vw（视窗宽度的百分比）和vh（视窗高度的百分比）是相对于视窗（浏览器窗口）尺寸的单位。1vw等于视窗宽度的1%，1vh等于视窗高度的1%。

=====================================

**2.灵活媒体（Flexible Media）**
灵活媒体（Flexible Media）图片、视频等媒体元素需能自适应容器尺寸，避免因屏幕变小而溢出。通过设置相对尺寸（如max-width: 100%），让媒体按比例缩放，适配不同屏幕。

核心原理：使用max-width: 100%和height: auto确保媒体元素不会溢出容器并保持宽高比
**3.媒体查询（Media Queries）**

======================================

核心语法：@media 规则
```css
@media [媒体类型] and (媒体特性条件) {
  /* 满足条件时应用的 CSS 样式 */
}
```
- 媒体类型：可选，常见值为 screen（屏幕设备，如手机 / 电脑）、print（打印设备）等，默认可省略（等价于 all，适用于所有设备）。
- 媒体特性条件：必须用括号 () 包裹，常用的是 屏幕宽度相关（如 min-width、max-width），其他还有 orientation（方向）、resolution（分辨率）等。

====================================== 

**实现响应式设计的关键步骤**
1. 设计视口(Viewport)
这是响应式设计的基础，需在 HTML 头部添加<meta>标签，告诉浏览器以设备实际宽度渲染页面，避免默认缩放：
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
2.使用相对单位定义尺寸
3.采用弹性布局方案
Flexbox（弹性盒）：通过display: flex让子元素自动分配空间，支持方向（row/column）、对齐方式的动态调整，适合一维布局（如导航栏、列表）；
Grid（网格布局）：通过display: grid定义二维网格，可灵活控制行列数量和尺寸，适合复杂布局（如卡片网格、多列内容）。
4.通过媒体查询设置断点
```css
/* 默认移动端样式（单列） */
.container {
  display: block;
  padding: 10px;
}

/* 平板设备（≥768px）：双列布局 */
@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* 桌面设备（≥1200px）：三列布局 */
@media (min-width: 1200px) {
  .container {
    grid-template-columns: 1fr 1fr 1fr;
    max-width: 1400px; /* 限制最大宽度，避免桌面过宽 */
    margin: 0 auto;
  }
}
```
5.处理响应式媒体（图片 / 视频）
基础适配：对图片设置max-width: 100%; height: auto;，确保其按比例缩放且不溢出容器；
6.优化细节与测试

## 面试官问:那你在说说当后端传给你很多数据的时候，你该怎么处理？
当后端返回大量数据时，前端处理的核心目标是避免性能阻塞（如页面卡顿、崩溃） 并保证用户体验（如加载流畅、交互响应快）
**处理**
**1.请求阶段：减少一次性加载的数据量**
核心思路是 “按需加载”，避免一次性将所有数据拉取到前端，从源头降低数据量：
- 分页加载
与后端约定分页参数（如page页码、pageSize每页条数），每次只请求当前页的数据。
例如列表页默认加载第 1 页 20 条数据，用户点击 “下一页” 或滚动到页尾时，再请求第 2 页数据。
优势：逻辑简单，可控性强，适合数据总量明确的场景（如表格、搜索结果）。
注意：需要后端配合支持分页接口，前端维护当前页码、总页数等状态。
- 滚动加载（无限滚动）
监听页面滚动事件（或容器滚动），当用户滚动到接近底部时，自动请求下一批数据并追加到列表中（类似朋友圈、微博的加载逻辑）。
实现：通过IntersectionObserver监听底部 “加载触发区” 元素，进入可视区域时触发请求，避免使用scroll事件频繁触发（性能更好）。
注意：需限制最大加载次数（如最多加载 10 页），避免数据累积过多导致内存溢出。
- 按需字段请求
与后端协商，只请求当前视图需要的字段（如列表页只需要id、name、imgUrl，不需要详情字段），减少冗余数据传输。
例如通过接口参数fields=id,name,imgUrl指定返回字段。

**2.数据处理阶段：优化数据存储与计算**
即使按需加载后的数据量仍较大（如单页 1000 + 条），也需要优化数据处理逻辑，避免阻塞主线程：
- 数据筛选与过滤
前端用户只保留当前需要展示/交付的数据，去掉无用的信息，
用户搜索时，在前端对已加载数据进行本地筛选（避免频繁请求后端）；
对嵌套过深的对象进行 “扁平化” 处理（如{ user: { name: 'xxx' } }转为{ userName: 'xxx' }），减少渲染时的属性查找成本。
- 数据缓存
对已加载的数据进行缓存（避免重复请求），常用缓存策略：
内存缓存：用Map或对象存储已加载的分页数据（如cache = { page1: [...], page2: [...] }），切换页码时直接从缓存读取；

- Offscreen 数据计算（Web Workers）
若需要对大量数据进行复杂计算（如排序、统计、格式化），将计算逻辑放入Web Worker中执行，避免阻塞主线程（JS 是单线程，大量计算会导致 UI 卡顿）。
例如：对 10000 条数据按多个条件排序，在 Worker 中处理完成后，再将结果发送给主线程渲染。
**3.视图渲染阶段：减少 DOM 操作成本**
大量数据的核心性能瓶颈往往是 “DOM 渲染”（浏览器渲染 10000 个 DOM 节点会明显卡顿），需通过优化渲染逻辑减少 DOM 数量：

================================

- 虚拟列表（Virtual List）(到时候提出来重新看一遍)
问题：当列表数据量极大（如 10 万条）时，若全部渲染会导致：
- DOM 节点过多，浏览器解析和渲染成本剧增（初始加载慢）；
- 滚动时频繁触发重排重绘，导致卡顿。
核心思路：核心思想是只渲染可视区域内的 DOM 节点，而非全部数据，从而减少 DOM 数量，提升页面加载速度和滚动流畅度。
虚拟列表的解决思路：
1.只渲染可视区域内容：通过计算滚动位置，动态确定 “当前能看到的几条数据”，只渲染这部分数据；
2. 模拟总高度：用占位空间（如paddingTop/paddingBottom）模拟列表总高度，保证滚动条长度正常（用户感知不到内容被 “截断”）；
3. DOM 复用：滚动时不销毁旧节点，而是更新已有节点的内容，进一步减少性能损耗。

===================================

- 减少重渲染
利用框架的优化机制，避免不必要的组件重渲染
Vue:用v-memo 缓存DOM 片段，computed属性缓存计算结果
原理：接收一个依赖数组，若数组中所有值与上一次一致，则跳过该 DOM 片段的更新（包括子节点）。
原理：computed属性会追踪其内部依赖的响应式数据，当依赖未变化时，直接返回缓存结果；仅当依赖变化时，才重新计算并更新缓存。

- 延迟渲染（懒渲染）
对非首屏或非核心数据（如列表中的图片、详情信息），延迟到用户需要时再渲染。例如：
图片懒加载：用IntersectionObserver监听图片元素，进入可视区域再设置src；
折叠面板：默认只渲染标题，用户点击展开时再渲染内容。

**用户体验兜底：降低等待焦虑**
即使做了性能优化，数据加载过程中仍需通过交互设计让用户感知流畅：

## 箭头函数的this 问题

**箭头函数**：无自己的 this，继承外层作用域的 this
它没有自己的this 绑定，它的this 完全继承 定于所在的外层作用域(即声明箭头函数时，它外部最近的那个非箭头函数或全局作用域的 this)，且一旦确定就无法被修改（无论用什么方式调用，this 都不会变）。
**总结**
箭头函数的 this 是 “定义时定死，调用时不变”，而普通函数的 this 是 “调用时动态决定”。

==========================

**案例 1：全局环境中的箭头函数**
箭头函数定义在全局作用域时，外层作用域是全局，所以 this 继承全局的 this（浏览器中是 window）。
```js
// 普通函数：this 由调用者决定（这里调用者是 window）
function normalFunc() {
  console.log('普通函数 this：', this); // window
}
normalFunc();

// 箭头函数：this 继承外层作用域（全局）的 this
const arrowFunc = () => {
  console.log('箭头函数 this：', this); // window（和外层全局 this 一致）
};
arrowFunc();
```

**案例 2：作为对象方法的箭头函数**
箭头函数作为对象的方法时，this 不会指向当前对象，而是继承外层作用域的 this（通常是全局）。
```js
const obj = {
  name: '小明',
  // 普通函数作为方法：this 指向调用者（obj）
  normalSay: function() {
    console.log('普通方法 this：', this.name); // 输出：小明
  },
  // 箭头函数作为方法：this 继承外层作用域（全局）的 this
  arrowSay: () => {
    console.log('箭头方法 this：', this.name); // 输出：undefined（window 没有 name 属性）
  }
};

obj.normalSay(); // 调用者是 obj，this 指向 obj
obj.arrowSay();  // 箭头函数定义时外层是全局，this 继承 window
```

**案例 3：嵌套函数中，箭头函数继承外层函数的 this**

```js
const user = {
  name: '小红',
  fetchData: function() {
    // 外层普通函数：this 指向 user（因为被 user 调用）
    console.log('外层函数 this：', this.name); // 输出：小红

    // 普通函数作为内层函数：this 指向 window（无调用者）
    function normalInner() {
      console.log('普通内层 this：', this.name); // 输出：undefined
    }
    normalInner();

    // 箭头函数作为内层函数：this 继承外层 fetchData 的 this（即 user）
    const arrowInner = () => {
      console.log('箭头内层 this：', this.name); // 输出：小红
    };
    arrowInner();
  }
};

user.fetchData();
```
**案例 4：箭头函数的 this 无法被修改**
```js
const obj1 = { name: 'obj1' };
const obj2 = { name: 'obj2' };

// 普通函数：this 可以被 call 修改
function normalFunc() {
  console.log(this.name);
}
normalFunc.call(obj1); // 输出：obj1（this 被改为 obj1）

// 箭头函数：this 继承全局（window），无法被 call 修改
const arrowFunc = () => {
  console.log(this.name);
};
arrowFunc.call(obj1); // 输出：undefined（this 仍为 window，未被修改）
```

## 面试官：说说你对盒子模型的理解?
定义:每个 HTML 元素都可以被看作一个 盒子,由4个部分组成
内容区（content）、内边距（padding）、边框（border）、外边距（margin）

=============================

**两种盒子模型：标准模型 vs IE 模型**
关键区别在于：width 和 height 包含的范围不同，由 box-sizing 属性控制。

- 标准盒子模型（默认，box-sizing: content-box）
width 和 height 仅包含内容区，盒子总宽度 = width + 左右 padding + 左右 border。例：
```css
.box {
  width: 200px;
  padding: 10px;
  border: 5px solid #000;
  /* 总宽度 = 200 + 10*2 + 5*2 = 230px */
}
```
- IE 盒子模型（怪异模式，box-sizing: border-box）
width 和 height 包含内容区 + 内边距 + 边框，盒子总宽度 = width（固定），内容区会自动缩减。
```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 10px;
  border: 5px solid #000;
  /* 总宽度固定为200px，内容区宽度= 200 - 10*2 -5*2 = 170px */
}
```
## 面试官：如何理解UDP 和 TCP? 区别? 应用场景?(没有看完，接着看)
**TCP**
定义：TCP(传输控制协议)，它的核心目标是：在不可靠的网络环境中（如互联网，可能出现丢包、延迟、乱序），确保数据能**完整、有序、不重复**地从发送方传递到接收方。

**TCP 的核心特性**
1. 面向连接
TCP 通信前必须先 “建立连接”，通信结束后必须 “断开连接”，类似 “打电话” 的流程（拨号→通话→挂电话）。

=======================================

- 三次握手（建立连接）
1.**第一次握手**：客户端→服务器，发送 SYN 报文（同步报文），并携带 “初始序号（seq=x）”，表示 “我想连接你，我的起始序号是 x”。此时客户端进入 “SYN_SENT”（等待确认） 状态，等待服务器确认。
2. **第二次握手**：服务器→客户端，发送 SYN+ACK 报文（同步 + 确认），携带 “服务器的初始序号（seq=y）” 和 “确认号（ack=x+1）”，表示 “我收到了你的连接请求（已收到 x 及之前的所有数据），我也准备好连接了，我的起始序号是 y”。此时服务器进入 “SYN_RCVD”（收到SYN） 状态。
3. **第三次握手**：客户端→服务器，发送 ACK 报文（确认），携带 “确认号（ack=y+1）”，表示 “我收到了你的准备信号（已收到 y 及之前的所有数据），连接正式建立”。此时双方都进入 “ESTABLISHED” （表示连接已经成功建立）状态，开始传输数据。

=======================================

=======================================

- 四次挥手（断开连接）
TCP 断开连接的 “四次挥手” 是为了确保双方都已完成数据传输，避免数据丢失。

1.**第一次挥手**：客户端→服务器，发送 FIN 报文（结束报文），表示 “我已完成数据发送，准备断开连接”。客户端进入 “FIN_WAIT_1” (连接终止过程中)状态。
2. **第二次挥手**：服务器→客户端，发送 ACK 报文，确认号为 “客户端 FIN 序号 + 1”，表示 “我收到你的断开请求，正在处理剩余数据”。此时服务器进入 “CLOSE_WAIT”(等待应用程序关闭连接”) 状态，客户端进入 “FIN_WAIT_2(等待被动关闭方发送关闭请求)” 状态，等待服务器剩余数据传输完毕。
3.**第三次挥手**：服务器→客户端，发送 FIN 报文，表示 “我也完成数据发送，准备断开连接”。服务器进入 “LAST_ACK”(最后确认) 状态。
4.**第四次挥手**：客户端→服务器，发送 ACK 报文，确认号为 “服务器 FIN 序号 + 1”，表示 “我收到你的断开信号，确认断开”。客户端进入 “TIME_WAIT” 状态（等待一段时间，确保服务器收到 ACK），服务器收到 ACK 后进入 “CLOSED” 状态，客户端等待超时后也进入 “CLOSED”。

=======================================

**UDP**
一种 “无连接、不可靠” 的传输协议。它像 “发短信”—— 发送方直接把数据打包成 “数据报”，不确认接收方是否在线，也不保证数据能到达、到达顺序是否正确，发完就完事，开销极小，速度快。

## 面试官：说一下 GET 和 POST 的区别？
**一、设计用途（语义区别）**
- GET:  “获取” 资源，用于从服务器请求已存在的资源（如查询数据、加载网页）。
- POST：“提交” 资源，用于向服务器发送数据，通常会导致服务器上的资源被创建或修改（产生副作用）

**二、参数传递方式**
- GET：参数通过URL 传递，以 “键值对” 形式拼接在 URL 末尾，用 ? 分隔 URL 和参数，多个参数用 & 连接。例：https://example.com/search?keyword=java&page=1，其中 keyword=java 和 page=1 是 GET 参数。
- POST：参数通过请求体（Request Body） 传递，不会出现在 URL 中。例：请求体中可能是 { "username": "admin", "password": "123" }（JSON 格式），或表单数据 username=admin&password=123。

**三、参数长度限制**
- GET：参数长度受限于URL 长度（不是 HTTP 协议规定，而是浏览器 / 服务器的限制）。例如：IE 浏览器对 URL 长度限制约 2048 字符，超过会被截断；服务器（如 Nginx）也可能配置 URL 长度上限。因此 GET 不适合传递大量数据。
- POST：参数放在请求体中，理论上没有长度限制（但服务器可能会设置请求体大小上限，比如 Nginx 默认限制 1M，可通过配置修改），适合传递大量数据（如表单提交、文件上传）。

**四、安全性（相对概念）**
- GET：参数暴露在 URL 中，会被记录在浏览器历史、服务器日志、代理日志中，安全性较低。例：如果用 GET 传递密码，别人可能通过查看 URL 或历史记录获取密码。
- POST：参数在请求体中，不会直接暴露在 URL 或历史记录中，相对更安全。但注意：这只是 “相对安全”，POST 数据本身不会加密，若要真正安全，需通过 HTTPS 协议加密传输（GET 和 POST 都可配合 HTTPS）。

**五、缓存机制**
- GET：请求可以被缓存（浏览器、CDN 等会缓存结果），下次相同请求可直接使用缓存，减少服务器压力。例：浏览器访问 https://example.com/logo.png（GET 请求），会缓存图片，下次打开无需重新请求。
- POST：请求默认不被缓存（因为 POST 通常用于提交数据，重复提交可能产生副作用，如重复下单），浏览器一般不会缓存 POST 结果。

**六、幂等性（关键区别）**
幂等性：指 “多次执行相同请求，是否对服务器资源产生相同影响”。
- GET：幂等。多次执行相同的 GET 请求，不会改变服务器资源（只是重复读取）。
例：多次调用 GET /api/users/1，每次返回的用户信息相同，不会修改用户数据。
- POST：非幂等。多次执行相同的 POST 请求，可能会对服务器资源产生不同影响（如重复创建数据）。
例：多次调用 POST /api/orders，可能会创建多个相同订单（除非服务器做了去重处理）。