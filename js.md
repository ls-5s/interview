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
