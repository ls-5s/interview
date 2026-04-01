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

# 面试官：说说对 React 的理解？有哪些特性？和vue3 的差别 ?

 react 是一个声明式，组件化的 UI 框架，基于虚拟 DOM 渲染，支持服务端渲染。
声明式 ： 声明式：UI = f(state)，数据驱动视图 视图是状态的函数，数据驱动视图更新。
组件化：提升了复用性和可维护性
单线数据流：数据单向流动，避免数据混乱

在实现上，React 有几个关键特性：

Virtual DOM（虚拟 DOM）用 JS 对象模拟真实 DOM，通过 diff 算法对比新旧节点，只更新变化的部分，最小化真实 DOM 操作，大幅提升性能。
Fiber 架构（React 16+ 核心）把渲染更新过程拆分成微小的可中断任务，实现时间分片。浏览器空闲时执行任务，避免 JS 长任务阻塞渲染，解决页面卡顿、掉帧问题。
Hooks让函数组件可以拥有状态、副作用、逻辑复用能力，替代类组件，让代码更简洁、更易维护。

和 Vue3 的核心区别是：

👉 一句话总结：

React 是“重新渲染”，Vue3 是“依赖追踪”

展开三点：

响应式机制
React：setState 触发组件重新执行
Vue3：基于 Proxy 精确追踪依赖，按需更新
开发方式
React：JSX，更灵活但偏工程化
Vue3：template，更直观
2. 开发范式与语法
React：JSX 全 JS，UI 与逻辑合一，灵活度极高，更贴近原生 JS 思维。
Vue3：Template 模板 + Script，分离结构与逻辑，语法更直观、上手更快。
设计理念
React：偏底层 + 生态驱动，适合复杂系统
Vue3：提供完整方案，开发效率更高

# 面试官：说说 Real DOM 和 Virtual DOM 的区别？优缺点？

real DOM：真实 DOM，浏览器原生的 DOM API，通过 JS 操作，实现页面更新。
virtual DOM：虚拟 DOM，React 创建的 JS 对象，通过 diff 算法对比新旧节点，只更新变化部分，最小化真实 DOM 操作，提升性能。

👉 核心区别
Real DOM
直接操作浏览器 DOM
修改成本高（会触发重排、重绘）
Virtual DOM
先在内存中计算（diff）
最后批量更新真实 DOM

👉 优缺点
✅ Virtual DOM 优点
减少真实 DOM 操作 → 提升性能
批量更新 → 避免频繁重排重绘
跨平台能力（如 React Native）
❌ Virtual DOM 缺点
有 diff 计算开销
小规模更新时不一定比直接操作快
✅ Real DOM 优点
简单直接，无额外计算
小操作性能更好
❌ Real DOM 缺点
频繁操作会导致性能问题
不易维护复杂 UI
🔥 加分一句（一定要说）

Virtual DOM 的优势不在于“更快”，而在于在复杂场景下保持稳定性能和可维护性。

# 重排、重绘

1. 元素尺寸，位置，结果的变化，会导致浏览器重新计算布局，重新排列页面，
触发条件，宽度，高度，增减DOM， 窗口变化
2. 元素外观改变了，位置没有， 重新颜色，背景透明度等
重排一定触发重绘重绘不一定触发重排
重排成本 >> 重绘

# 为何 dev 模式下 useEffect 执行两次？

在 React 的 开发模式（StrictMode） 下，useEffect 执行两次，是刻意设计的行为，不是 bug。

👉 目的有两个：

检测副作用是否安全
是否有未清理的副作用（比如定时器、订阅）
模拟组件卸载 + 重新挂载
执行流程是：
👉 mount → effect → cleanup → 再 mount → effect

✅ 本质一句话（面试金句🔥）

React 通过“故意执行两次”来帮助开发者发现副作用问题，保证代码在未来并发渲染下是安全的。

useEffect(() => {
  let ignore = false;

  fetch('/api/data').then(res => {
    if (!ignore) {
      setData(res);
    }
  });

  return () => {
    ignore = true;
  };
}, []);

# React 中的 key 有什么作用？

✅ 1️⃣ Key 的作用
React 中的 key 是用来标识列表中每个元素的唯一身份，主要作用：
帮助 React 识别哪些元素被新增、删除或移动
优化 diff 算法性能
避免不必要的 DOM 删除和重建
React 更新页面时，会对比 “旧列表” 和 “新列表”（这个对比过程叫 diff）。
如果没有 key，React 只能从头到尾一个个对比，很慢。
如果有 key，React 直接按身份证号匹配，一秒找到变化。
保持组件状态
比如列表中有 input 输入框，key 相同可以保留输入内容

key 必须唯一且稳定
不要用索引作为 key（除非列表不会改变顺序）
key 是 React diff 的核心，直接影响渲染性能和状态保持

# 说说对 React 中类组件和函数组件的理解？有什么区别？

# 说说对受控组件和非受控组件的理解？应用场景？

✅ 1️⃣ 定义
受控组件（Controlled Component）
表单元素的 值由 React state 控制
每次用户输入都会触发 onChange 更新 state
React 是“数据源”，DOM 只是视图
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

非受控组件（Uncontrolled Component）
表单元素 自己维护值，React 不直接控制
通过 ref 获取 DOM 值

非受控组件（Uncontrolled Component）
表单元素 自己维护值，React 不直接控制
通过 ref 获取 DOM 值
function UncontrolledInput() {
  const inputRef = useRef();

  const handleClick = () => {
    console.log(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>提交</button>
    </>
  );
}

✅ 3️⃣ 应用场景
受控组件
需要实时校验或联动表单
表单数据要统一提交/保存
复杂表单（如动态增删项）
非受控组件
简单表单（只在提交时获取值）
与第三方库整合（如文件上传 input）
性能要求较高且无需频繁更新 UI

# 说说对 React Hooks 的理解？解决了什么问题？

副作用 = 组件渲染（UI = f (state)）之外的所有操作React 组件本身只负责一件事：
根据 state 输出 UI只要不是「计算 UI」的操作，全都是副作用！
✅ 纯函数（无副作用，组件本职工作）
jsx
// 只根据数据算UI → 纯渲染，无副作用
function App() {
  const [name] = useState("张三")
  return <div>{name}</div>
}
拥有 state = 函数组件从「只能展示」变成「能存、能改、能更新」

✅ 2️⃣ Hooks 解决的问题
函数组件无法管理 state 和生命周期（类组件才有）
类组件存在以下痛点：
this 指向复杂，需要 bind
生命周期函数零散，逻辑复用难
高阶组件 / render props 写法复杂

Hooks 解决：

去掉 this
. 直接去掉 this，永无指向问题
Hooks 只用于函数组件，函数组件本身就没有 this！不用 bind、不用箭头函数绕弯，代码极简，永远不会报 this is undefined 错误。
逻辑复用更简单（自定义 Hook）
自定义 Hook：逻辑复用简单到极致
想复用逻辑？直接封装一个自定义 Hook（以 use 开头的函数）：
无嵌套、无冗余代码
哪个组件要用，直接调用就行
比高阶组件 /render props 简单 10 倍，可读性拉满
函数式组件也可以完全替代类组件

# . 说说你是如何提高组件的渲染效率的？在 React 中如何避免不必要的 render？

简单说：React 默认是自上而下渲染，所以要控制不必要的渲染。
