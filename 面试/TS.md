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
