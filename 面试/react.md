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
