# ts 优点和缺点加使用场景

ts 是js 的超集，
通过静态类型系统提升代码可读性和工程可靠性，通常在中大型项目
优点:
编译阶段发现错误
减小运行的bug
传输类型直接报错，而不是等于线上炸掉

可维护性强
明确数据结构
更容易理解和重新构建代码

4️⃣ 面向对象能力更强
接口（interface）
泛型（Generics）
枚举（enum）

👉 更适合复杂业务建模

缺点

学习成本
新人上手慢
开发成本真加
需要写定义类型
初期开发成本慢
类型并非完全可靠

any 会绕过类型检测
类型在运行时会被擦除

使用场景

✅ 1. 中大型项目（强烈推荐）
多人协作
业务复杂

👉 减少沟通成本 + 降低 bug

✅ 2. 框架开发 / 工具库
比如 React 组件库
SDK / 工具函数库

👉 提供类型提示给使用者

✅ 3. 长期维护项目
代码需要不断迭代

👉 TS 能提高可读性和可维护性

✅ 4. 前后端协作（接口约束）
配合接口定义（如 API 类型）

👉 减少“接口对不上”问题

# interface和type 区别（高频🔥）

定义范围
interface: 只能定义对象类型/ 函数类型
type: 万能类型

1. 【重复定义】自动合并 vs 报错
interface：重复定义 → 自动合并（非常实用）
ts
interface User { name: string }
interface User { age: number }
// 最终合并为：{ name: string; age: number }
const user: User = { name: "张三", age: 18 }
type：重复定义 → 直接报错
ts
type User = { name: string }
type User = { age: number } // ❌ 报错：重复定义

2. 【继承方式】语法不同
interface 用 extends 继承
ts
interface Animal { name: string }
interface Dog extends Animal { bark: void }
type 用 &（交叉类型）继承
ts
type Animal = { name: string }
type Dog = Animal & { bark: void }

extends = 儿子继承爸爸
& = 两个箱子合二为一

interface：天生适合做 对象接口、API 类型、库类型定义（支持自动合并）
type：天生适合做 类型别名、组合类型、联合类型

# TS 为什么在运行时没有类型？

因为 ts 是在编译时检查类型，在编译成js 时，类型被擦除，所以运行时不会存在类型。

【1️⃣ 现象说明（先举例）】

👉 TS 代码：

function add(a: number, b: number): number {
  return a + b
}

👉 编译后 JS：

function add(a, b) {
  return a + b
}

👉 可以看到：

number 类型全部消失 ❌
运行时完全是普通 JS

【2️⃣ 本质原因（面试重点🔥）】

【2️⃣ 本质原因（面试重点🔥）】
① JavaScript 本身没有类型系统
JS 是动态类型语言
运行时不会检查类型

👉 TS 必须编译成 JS 才能运行

② TS 是“编译时类型系统”

👉 TS 的定位是：

开发工具（类型检查）
而不是运行时系统
③ 保证零运行时开销（关键🔥）

👉 如果 TS 保留类型：

会增加运行时性能开销
破坏 JS 的轻量特性

👉 所以设计成：

类型只在编译阶段存在，运行时全部删除

【3️⃣ 升维理解（拉开差距🔥）】

TypeScript 的类型系统本质是一种“静态分析工具”，而不是运行时约束机制。

【4️⃣ 面试加分补充（很关键🔥）】

👉 如果面试官继续问：

❓“那运行时怎么做类型校验？”

你可以答：

手动校验（typeof / instanceof）
使用运行时校验库（如 Zod / Joi）
后端校验（接口兜底）
🚀 最后一击总结（建议背🔥）

TypeScript 的类型只存在于编译阶段，通过类型擦除保证运行时仍然是纯 JavaScript，从而实现零运行时成本和完全兼容 JS 生态。

# TS 基础类型有哪些

number
string
boolean
null
undefined
symbol

object
array
function
元组
特殊类型
any
unknown
void
never

# 数组 Array 和元组 Tuple 的区别是什么

Array 是同类型元素的集合（长度不固定），Tuple 是固定长度、固定类型的数组（每个位置类型已确定）。

# 枚举 enum 是什么？有什么使用场景？

enum（枚举）是一种定义一组具名常量的类型，用于提高代码可读性和可维护性。
enum Status {
  Loading,
  Success,
  Error
}

👉 用于：

请求状态
UI 状态
✅ 2. 固定选项
enum Role {
  Admin,
  User,
  Guest
}

👉 用于：

权限控制
用户角色

# any void never unknown 有什么区别

✅ 【1️⃣ any（完全放弃约束）】

👉 可以是任意类型，且不会进行类型检查

let a: any = 123
a.foo() // ✅ 不报错（但运行可能炸）
✔ 特点
不做类型检查 ❌
可以做任何操作 ❌
会破坏 TS 类型系统 ❌

👉 结论：

any = 关闭类型系统（不推荐）

✅ 【2️⃣ unknown（安全版 any）】

👉 可以是任意类型，但使用前必须做类型判断

let b: unknown = "hello"

// b.toUpperCase() ❌ 报错

if (typeof b === "string") {
  b.toUpperCase() // ✅
}
✔ 特点
不能直接操作 ✅
必须类型收窄 ✅
类型安全 ✅

👉 结论：

unknown = 安全版 any

✅ 【3️⃣ void（没有返回值）】

👉 表示函数没有返回值

function fn(): void {
  console.log("hello")
}
✔ 特点
常用于函数返回值
不是“没有值”，而是“忽略返回值”

👉 注意：

let v: void
v = undefined // ✅
✅ 【4️⃣ never（永远不会有值🔥）】

👉 表示不可能出现的值

function error(): never {
  throw new Error()
}
✔ 出现情况
抛异常
死循环
类型穷尽检查

# 什么是泛型，如何使用它？

0️⃣ 一句话结论】

泛型是指在定义函数、接口或类时不预先指定具体类型，而是在使用时再指定类型，从而实现类型复用和类型安全。
① 泛型函数（最常考🔥）
function getValue<T>(value: T): T {
  return value
}

调用：

getValue<string>("hello")
getValue(123) // 自动推导 number
② 泛型接口

# 什么是交叉类型和联合类型

【0️⃣ 一句话结论】

联合类型（|）表示“或”，值可以是多个类型之一；
交叉类型（&）表示“且”，值必须同时满足多个类型。

# TS 这些符号 ? ?. ?? ! _ & | # 分别什么意思

参考答案
