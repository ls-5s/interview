# React 父子组件生命周期调用顺序

👉 React 父子组件生命周期执行顺序：挂载时“先子后父提交”，更新时“先父 render 再子 render，提交阶段子先父后”，卸载时“子先于父卸载”。

【1️⃣ 挂载阶段（Mount）执行顺序】

以函数组件（Hooks）为主：

🔹 Render 阶段（可打断）

👉 执行顺序：父 → 子

Parent render
  ↓
Child render
🔹 Commit 阶段（不可打断）

👉 执行顺序：子 → 父

Child useEffect
  ↓
Parent useEffect
✅ 最终顺序总结

1. Parent render
2. Child render
3. Child useEffect
4. Parent useEffect

【2️⃣ 更新阶段（Update）执行顺序】
🔹 Render 阶段

👉 父 → 子（深度优先）

Parent render
  ↓
Child render
🔹 Commit 阶段

👉 子 → 父

Child useEffect cleanup
Child useEffect
Parent useEffect cleanup
Parent useEffect
✅ 完整顺序

1. Parent render
2. Child render
3. Child cleanup
4. Child effect
5. Parent cleanup
6. Parent effect

【3️⃣ 卸载阶段（Unmount）】

👉 子组件先卸载，再父组件

Child cleanup
  ↓
Parent cleanup

【4️⃣ 为什么是这种顺序（面试加分点🔥）】

核心原因：👉 React Fiber 的深度优先遍历（DFS）+ 双阶段执行机制

🔹 1. Fiber 遍历方式

👉 React 使用 深度优先遍历（DFS）构建 Fiber 树

Parent
  └── Child

Render 阶段：

👉 从上到下（beginWork）
👉 所以：父 → 子

🔹 2. Commit 阶段

👉 提交副作用时是“回溯阶段”（completeWork）

👉 所以变成：

Child → Parent
🔹 3. 为什么 effect 子先执行？

👉 因为 DOM 已经构建完成，React 在“回溯阶段”统一处理副作用

👉 保证：

子节点已经挂载
父节点再处理副作用（更安全）
因为 React 采用 深度优先遍历：先向下把所有子 DOM 全部挂载完成 → 再向上回溯执行 effect
👉 子先执行 = 保证父执行 effect 时，子组件已经完全就绪（100% 安全）

# React 组件通讯方式

👉 React 组件通信本质是“单向数据流”，通过 props、回调函数、上下文（Context）以及外部状态管理来实现不同层级之间的数据传递。
【1️⃣ 父 → 子通信（最基础）】

👉 方式：props

function Parent() {
  return <Child msg="hello" />
}

function Child({ msg }) {
  return <div>{msg}</div>
}

📌 特点：

单向数据流（React 核心思想）
最清晰、最推荐

【2️⃣ 子 → 父通信】

👉 方式：回调函数（函数作为 props）

function Parent() {
  const handle = (data) => {
    console.log(data)
  }

  return <Child onSend={handle} />
}

function Child({ onSend }) {
  return <button onClick={() => onSend('hello')} />
}

📌 本质：

👉 父组件把控制权传给子组件

【3️⃣ 兄弟组件通信】

👉 方式：状态提升（Lifting State Up）

Parent
 ├── ChildA
 └── ChildB

👉 把共享状态放到父组件：

```jsx
// 引入React的useState钩子（代码中省略了导入语句，实际使用需要导入）
import { useState } from 'react';

/**

* 父组件 Parent
* 核心作用：统一管理共享状态，通过props向子组件传递状态和修改状态的方法
* 设计模式：React 状态提升（将子组件需要共享的状态提升到父组件管理）
 */
function Parent() {
  // 1. 使用useState定义响应式状态
  // value：状态变量，存储共享数据，初始值为空字符串
  // setValue：修改状态的专用方法（React规定，必须通过该方法更新状态）
  const [value, setValue] = useState('');

  // 2. 组件返回的UI结构（JSX语法）
  // <> </>：React片段，用于包裹多个子元素，不生成额外的DOM节点
  return (
    <>
      {/*子组件A：接收父组件传递的 setValue 方法
          作用：让子组件A拥有修改父组件状态的能力（触发状态更新）*/}
      <ChildA setValue={setValue} />

      {/* 子组件B：接收父组件传递的 value 状态
          作用：让子组件B实时展示父组件的最新状态数据 */}
      <ChildB value={value} />
    </>
  );
}
```

📌 本质：

👉 通过“共同父组件”中转

【4️⃣ 跨层级通信（重点🔥）】
✅ 方式1：Context（React 内置）

👉 解决“props drilling（层层传递）”

const ThemeContext = createContext()

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}

function Child() {
  const theme = useContext(ThemeContext)
}

📌 适合：

主题
用户信息
全局配置

【7️⃣ ref 通信（特殊场景🔥）】

👉 父直接操作子组件

const ref = useRef()

<Child ref={ref} />

配合：

useImperativeHandle(ref, () => ({
  focus() {}
}))

📌 场景：

表单控制
imperative 操作

# state 和 props 有什么区别？

👉 props 是外部传入、只读的数据，state 是组件内部可变、可管理的数据；props 决定组件“怎么用”，state 决定组件“怎么实现”。
【1️⃣ 本质区别（核心对比🔥）】

| 维度         | props      | state    |
| ------------ | ---------- | -------- |
| 来源         | 父组件传入 | 组件内部 |
| 是否可变     | ❌ 只读     | ✅ 可变   |
| 控制权       | 父组件     | 当前组件 |
| 作用         | 数据传递   | 状态管理 |
| 是否触发更新 | ✅ 会       | ✅ 会     |

【2️⃣ 数据流角度（面试重点🔥）】

👉 React 是单向数据流

Parent (state)
   ↓ props
Child
✅ props：

👉 是数据流的“载体”

从父 → 子
子不能修改（否则会破坏数据一致性）
✅ state：

👉 是数据流的“源头”

数据的“拥有者”
决定 UI 如何变化

【3️⃣ 为什么 props 不能修改？（高频追问🔥）】

👉 如果子组件能改 props：

多个子组件 → 同时修改 → 数据混乱 ❌

👉 React 设计：

✔️ 数据只能由“拥有者”修改
✔️ 保证可预测性（Predictable）

【4️⃣ 使用场景区别】
✅ props 适合：
组件复用
配置驱动 UI
<Button type="primary" size="small" />
✅ state 适合：
用户交互
UI 状态
const [visible, setVisible] = useState(false)

【5️⃣ 面试加分点（高级理解🔥）】
🔹 1. state 可以“提升”为 props

👉 状态提升（Lifting State Up）：

子组件 state → 提到父组件 → 通过 props 传回

👉 本质：

👉 props 和 state 是可以相互转化的

🔹 2. props + state 组合才是完整设计

👉 一个组件：

props → 外部输入
state → 内部变化

👉 类似：

函数 = 输入 + 内部逻辑
❓1：props 变化会触发更新吗？

👉 会（触发重新 render）

❓2：state 更新为什么是异步的？

👉 为了批量更新 + 性能优化（Fiber 调度）
批量合成：合并多次更新，避免重复渲染；
主动执行：React 自主控制更新时机，而非被动等待 JS 异步；
核心目的：性能优化，这就是 state 异步的底层逻辑。

❓3：什么时候用 state，什么时候用 props？

👉 答：

是否需要内部维护 → state
是否来自外部 → props

# 面试官：说说React的事件机制？

👉 React 事件机制本质是“合成事件系统 + 事件委托 + 优先级调度”，通过统一封装原生事件，实现跨浏览器一致性，并结合 Fiber 实现可控更新。

# 是否用过 SSR 服务端渲染？

# 面试官：React中的key有什么作用？
