# 面试官：说说对 React 的理解？有哪些特性？

👉
React 是由 Meta Platforms 开源的一个用于构建用户界面的 JavaScript 库，本质是一个声明式、组件化、以虚拟 DOM 为核心的 UI 渲染方案。

核心设计思想（面试官最想听的）

1️⃣ 声明式编程（Declarative）

👉 你只需要描述 UI “是什么”，而不是“怎么做”

```jsx
{isLogin ? <Home /> : <Login />}
```

对比原生 JS：

React：描述状态 → 自动更新 UI
传统：手动操作 DOM

📌 本质：
UI = f(state)
状态一变，React 自动执行 f，重新算出新 UI。
2️⃣ 组件化（Component-Based）

👉 把 UI 拆成一个个独立组件

特点：

可复用
易维护
易组合

📌 面试加分点：

高内聚、低耦合
类似“函数式 UI”

React 的组件化，就是把整个页面 UI，拆分成一个个独立、可复用、可组合的 “零件”，每个零件负责自己的样式、结构、逻辑，最后拼装成完整页面

3️⃣ 单向数据流（One-way Data Flow）

👉 数据从父组件流向子组件（props）

优点：

可预测
易调试
状态清晰

📌 对比 Vue：

React：单向数据流（更偏函数式）
Vue：双向绑定（v-model）

4️⃣ 虚拟 DOM（Virtual DOM）

👉 React 不直接操作真实 DOM，而是：

流程：

state 变化
生成新的 Virtual DOM
Diff 算法对比新旧
最小化更新真实 DOM

📌 面试加分点：

批量更新（batching）
提升性能（减少重排重绘）

# 面试官：说说 Real DOM 和 Virtual DOM 的区别？优缺点？

一、先一句话总述
Real DOM（真实 DOM）：浏览器渲染的实际 DOM 节点树，操作它会触发重排重绘，性能开销大。
Virtual DOM（虚拟 DOM）：用普通 JS 对象模拟 DOM 结构，是真实 DOM 的 “轻量级副本”，不直接操作浏览器。

# state 和 props 区别？

props 是组件外/ 父组件向子组件传递的数据， 使用组件之间的通信。

state 是组件内部私有可变的数据， 是使用与组件内部的动态的自省交互。

2️⃣ 是否可变（重点🔥）
props
❌ 只读（immutable）
React 设计原则：单向数据流
state
✅ 可变（通过 setState / useState 更新）
更新会触发重新渲染

👉 面试加分说法：

props 不允许修改，是为了保证数据流的可预测性

3️⃣ 是否影响组件更新
props 改变
✅ 会触发子组件重新渲染
state 改变
✅ 会触发当前组件重新渲染

👉 延伸：

React 的本质是：状态驱动视图（State → View）

4️⃣ 使用场景不同
props
组件复用
父子通信
配置组件行为
state
表单数据
UI 状态（开关、loading）
用户交互数据

1. 什么时候用 props vs state（面试官爱问）

👉 判断标准：

多个组件共享 → 用 props（或状态提升）
组件自己用 → 用 state

# setState 执行机制？

在 React 中，setState 本质不是直接修改状态，而是提交一次状态更新请求，由 React 进行调度、批处理，并最终触发视图更新。

一、执行机制主线（必须讲流程🔥）
1️⃣ 调用 setState
setState({ count: 1 })

👉 React 不会立刻改 state

2️⃣ 生成 update 对象，进入更新队列
每次 setState 都会创建一个 update
挂到当前组件对应的 Fiber 的 updateQueue 上

👉 关键点：

state 是“算出来的”，不是“立刻改的”

3️⃣ 调度（Scheduler）

React 会决定：

什么时候更新
要不要合并更新（批处理）
更新优先级（React 18）

4️⃣ Render 阶段（可中断）
根据最新 state 生成新的虚拟 DOM
和旧的做 diff（协调）

👉 特点：

可以被打断（并发特性）

5️⃣ Commit 阶段（不可中断）
更新真实 DOM
执行副作用（useEffect / 生命周期）

二、为什么 setState 看起来是“异步”？（必问🔥）

👉 本质原因：

为了做批处理（Batching），减少重复渲染，提高性能

✅ 举个经典例子
setCount(count + 1)
setCount(count + 1)

👉 结果可能是：+1（不是 +2）

原因：

多次更新被合并
闭包拿到旧值
✅ 正确写法（函数式更新）
setCount(prev => prev + 1)
setCount(prev => prev + 1)

👉 结果：+2

四、什么时候是同步的？（再加一层）
import { flushSync } from 'react-dom'

flushSync(() => {
  setCount(1)
})

👉 强制立即更新

# React 事件机制？

⭐ 一句话总起（先稳住）
在 React 中，事件机制基于合成事件（SyntheticEvent）和事件委托实现，目的是统一浏览器行为并提升性能。

一、什么是 React 事件机制（基础）

React 并没有直接把事件绑在 DOM 上，而是做了一层封装：

👉 合成事件（SyntheticEvent）

特点：

统一不同浏览器的事件行为（抹平差异）
提供一致的 API（和原生事件类似）
早期有事件池（React 17 已移除）一、什么是 React 事件机制（基础）

React 并没有直接把事件绑在 DOM 上，而是做了一层封装：

👉 合成事件（SyntheticEvent）

特点：

统一不同浏览器的事件行为（抹平差异）
提供一致的 API（和原生事件类似）
早期有事件池（React 17 已移除）

# 面试官：React事件绑定的方式有哪些？区别？

⭐ 一句话总起（先给结论）

在 React 中，事件绑定主要有两种方式：JSX 合成事件绑定和原生 DOM 事件绑定（addEventListener），两者在实现机制、执行时机和使用场景上都有明显区别。

1️⃣ JSX 方式（React 推荐）
<button onClick={handleClick}>点击</button>

👉 特点：

使用 驼峰命名（onClick）
绑定的是 函数引用（不是字符串）
实际触发的是 SyntheticEvent（合成事件）
底层是 事件委托
2️⃣ 原生 DOM 方式
button.addEventListener('click', handleClick)

👉 特点：

直接绑定在真实 DOM 上
使用浏览器原生事件
不走 React 事件系统

1️⃣ 实现机制不同
JSX 事件：
基于 合成事件 + 事件委托
统一绑定在 root 容器
原生事件：
直接绑定在 DOM 节点上

执行顺序不同（高频🔥）

👉 结论：

原生事件先执行，React 合成事件后执行

原因：

React 是在事件冒泡到 root 后才处理

3️⃣ 性能不同
JSX 事件：
✅ 事件委托 → 减少绑定数量 → 性能更好
原生事件：
❌ 每个节点都要绑定 → 成本更高

5️⃣ 与 React 更新机制的关系（加分点🔥）
JSX 事件：
✅ 会触发 React 的更新调度（如 setState 批处理）
原生事件：
❌ 不在 React 体系内（早期不会自动批处理）

三、使用场景（面试一定要说🔥）
✅ 推荐用 JSX 事件
组件内部交互
表单、按钮点击
大部分业务场景
✅ 必须用原生事件
操作非 React 管理的 DOM
监听 window / document（如滚动、resize）
与第三方库集成

# 面试官：React中组件之间如何通信？

⭐ 一句话总起（先定调）

在 React 中，组件通信本质是数据在组件树中的流动，React 通过单向数据流来保证数据的可预测性。

一、常见通信方式（按场景分类🔥）

1️⃣ 父 → 子（最基础）

👉 使用 props

<Child name="张三" />

👉 特点：

单向数据流（只读）
最常用方式

2️⃣ 子 → 父

👉 本质：通过函数回调

<Child onChange={(value) => setValue(value)} />

子组件：
props.onChange('new value')
👉 本质一句话：
父组件把“修改权”通过函数传给子组件
父组件把「修改数据的权限」封装成回调函数，通过 props 交给子组件，子组件调用函数完成通信。

3️⃣ 兄弟组件通信

👉 两种方式：

✅ 方式一：状态提升（推荐）
Parent（state）
  ├── ChildA
  └── ChildB

👉 把共享状态放到父组件

二、完整代码示例

1. 父组件（中转站）

```jsx
import { useState } from 'react';
import ChildA from './ChildA';
import ChildB from './ChildB';

function Parent() {
  // 状态提升：把兄弟共享的数据存在父组件
  const [msg, setMsg] = useState('默认消息');

  return (
    <div>
      {/*ChildA：传修改状态的函数（子→父） */}
      <ChildA sendMsg={setMsg} />
      {/* ChildB：传共享状态（父→子）*/}
      <ChildB showMsg={msg} />
    </div>
  );
}

export default Parent;
2. ChildA（发送方）
jsx
// 子组件调用函数，把数据传给父组件
function ChildA({ sendMsg }) {
  return (
    <button onClick={() => sendMsg('来自兄弟A的数据')}>
      给兄弟B发消息
    </button>
  );
}

export default ChildA;
3. ChildB（接收方）
jsx
// 子组件通过 props 接收父组件同步的数据
function ChildB({ showMsg }) {
  return <p>兄弟B接收：{showMsg}</p>;
}

export default ChildB;
```

兄弟不直接对话，找共同老爸中转；状态提升到父组件，父子通信实现兄弟互通。

5️⃣ 全局状态管理（复杂场景🔥）

👉 常见方案：

Redux
Zustand
MobX

👉 适用于：

多组件共享复杂状态
大型项目

4️⃣ 跨层级通信（避免 props drilling）

👉 使用 Context

const ThemeContext = React.createContext()

👉 特点：

跨多层传递数据
避免层层传 props

```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. 创建上下文
const CountContext = createContext();

// 最底层：孙组件（直接拿数据）
const Grandson = () => {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      孙组件：{count} 
      <button onClick={() => setCount(count+1)}>+1</button>
    </div>
  );
};

// 子组件（中间层，无props）
const Child = () => <div><Grandson /></div>;

// 父组件（中间层，无props）
const Parent = () => <div><Child /></div>;

// 顶层组件（提供数据）
const App = () => {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Parent />
    </CountContext.Provider>
  );
};

export default App;

```

Context 不推荐滥用的主要原因是它的更新是广播式的，当 Provider 的 value 发生变化时，所有消费该 Context 的组件都会重新渲染，即使它们没有使用变化的部分数据。

本质上是因为 Context 无法做细粒度的依赖收集，只能基于 value 的引用是否变化来判断更新，因此容易引发性能问题。

优化方式包括拆分 Context、使用 useMemo 缓存 value、以及结合 React.memo 等手段。

一般来说，Context 更适合低频更新的全局数据，而复杂或高频状态更适合使用 Redux 或 Zustand 等状态管理方案。

# 面试官：React中的key有什么作用？

⭐ 一句话总起（先拿分）
在 React 中，key 的作用是在虚拟 DOM diff 过程中唯一标识节点，从而帮助 React 更高效、准确地复用和更新 DOM。

一、key 的核心作用（本质🔥）
👉 React 在做 diff（协调）时：
通过 key 判断“这个节点是不是同一个”
✅ 没有 key 时

React 只能：

按顺序一一对比（index）
容易误判节点变化
✅ 有 key 时

React 可以：

精确找到对应节点
复用已有 DOM
只更新变化的部分

index 只是元素的位置编号，不是这个元素本身的身份证。列表一删、一加、一排序，位置就全变了，React 会认错节点：
该删的没删，不该变的状态乱了（比如输入框内容串位置）
也没法复用旧 DOM，性能白瞎

# 说说你对 Redux 的理解？其工作原理？

Redux 是一个基于 Flux 架构的 JavaScript 全局状态管理库，专为 React 等单页应用（SPA）设计，解决两大核心痛点：
组件间跨层级 / 跨路由共享状态（如用户信息、主题、购物车）；
复杂应用中状态变更混乱、不可追踪、难以调试的问题。
它的核心设计哲学：严格的单向数据流 + 可预测的状态变更，让全局状态完全可控。
补充：一个应用只有一个 Redux Store（单一数据源），所有全局状态集中管理。

二、Redux 五大核心概念（必背，原理的基础）
理解原理前，必须先搞懂这 5 个角色，缺一不可：

理解原理前，必须先搞懂这 5 个角色，缺一不可：
Store
应用唯一的状态容器，存储整个应用的所有全局状态，提供 dispatch、getState、subscribe 核心方法。
State
Store 中存储的原始状态数据，只读，不能直接修改（保证状态安全）。
Action
一个普通 JS 对象，描述「发生了什么」，是修改 State 的唯一信号。
必须包含 type 属性（标识动作类型），可携带 payload 传递数据：
js
{ type: 'UPDATE_USER', payload: { name: '腾讯' } }
Reducer
一个纯函数，接收参数：(旧State, Action)，计算并返回全新的 State。
✅ 纯函数规则：相同输入必返回相同输出，无副作用（不操作 DOM、不发请求）。
✅ 核心：不修改原 State，永远返回新对象（不可变更新）。
Dispatch
Store 的核心方法，派发 Action，是触发状态更新的唯一入口：dispatch(action)。

三、Redux 工作原理（单向数据流，面试核心！）
Redux 遵循严格的单向数据流，整个流程闭环、可追踪，分 5 步 清晰描述：
plaintext
视图组件 → dispatch(Action) → Reducer → 新State → Store更新 → 组件重新渲染
详细流程：
视图触发动作
用户操作组件（点击按钮、输入框），组件调用 dispatch() 派发一个 Action 对象；
Store 传递数据
Store 自动将 当前旧 State 和 派发的 Action 一起传给 Reducer；
Reducer 计算新状态
Reducer 根据 Action 的 type 匹配逻辑，不修改原 State，通过拷贝生成全新的 State并返回；
Store 更新状态
Store 用 Reducer 返回的新 State，替换掉旧 State；
组件更新视图
订阅了状态变化的组件，收到 State 更新通知后，读取新 State 并重新渲染页面。
四、Redux 三大核心原则（灵魂，加分项）
这是 Redux 设计的底层规则，面试必问：
单一数据源
全局状态只存在一个 Store 中，方便调试、状态持久化、服务端渲染；
State 只读
唯一修改 State 的方式是派发 Action，杜绝直接篡改状态，保证变更可追溯；
纯函数修改状态
Reducer 必须是纯函数，输入确定则输出确定，极易测试、回溯状态。

# 说说 React 生命周期有哪些不同阶段？每个阶段对应的方法是？Hooks 如何对应生命周期？

# 说说对受控组件和非受控组件的理解？应用场景？

1. 受控组件
表单元素的值由 React state 全权管理，value/checked 绑定 state，通过 onChange 同步更新 state，组件的展示完全受 React 控制，叫受控组件。
jsx
// 输入框受控
<input value={val} onChange={e => setVal(e.target.value)} />
2. 非受控组件
表单元素值由 DOM 自身维护，React 不管理状态，通过 ref 直接从 DOM 节点获取值，类似原生 DOM 操作，叫非受控组件。
jsx
// 输入框非受控
<input ref={inputRef} />

// 获取值：inputRef.current.value
二、核心区别
表格
维度 受控组件 非受控组件
数据来源 React state DOM 自身
数据更新 onChange + setState 同步 无需手动更新
获取值方式 直接读 state ref 取 DOM 值
实时控制 支持实时校验、格式化、禁用 不支持实时控制
三、应用场景
受控组件（React 推荐）
表单需要实时校验、输入格式限制（手机号、密码强度）
表单元素联动（下拉选框联动输入框）
动态控制表单禁用 / 隐藏、提交前数据处理
复杂表单、多字段联动场景
非受控组件
简单表单、一次性提交，追求代码简洁
文件上传 <input type="file" />（必须非受控，value 只读无法受控）
集成第三方 DOM 表单库、不想用 state 管理
无需实时校验，只在提交时获取一次值
四、面试加分一句话
受控组件是单向数据流的体现，数据可预测易调试；非受控组件更轻量，适合简单场景或 DOM 不可控的场景（如文件上传），实际开发优先用受控组件。

# 说说你对 React Router 的理解？常用的 Router 组件 / API 有哪些？

👉 React Router 是一个用于 React 应用中的声明式路由管理库，提供了基于组件的方式来管理应用的 URL 与视图之间的映射。它使得开发者能够轻松地控制路由、路由变化以及页面跳转。

二、常用的 Router 组件（重点🔥）

1️⃣ BrowserRouter（最常用的 Router）
import { BrowserRouter as Router } from 'react-router-dom';

<Router>
  <App />
</Router>

👉 功能：

使用 HTML5 History API 来处理路由。
适用于现代浏览器（支持推送和替代历史记录栈）。

👉 适用场景：

单页应用（SPA）中常用，适合没有 hash 路径的应用。

2️⃣ HashRouter
import { HashRouter as Router } from 'react-router-dom';

<Router>
  <App />
</Router>

👉 功能：

使用 URL 中的 # 符号来管理路由。
不依赖 HTML5 History API，而是通过修改 window.location.hash 来管理路由状态。

👉 适用场景：

适用于旧版浏览器或部署在不支持服务器配置的环境下（比如 GitHub Pages）。

3️⃣ Route
import { Route } from 'react-router-dom';

<Route path="/home" component={Home} />

👉 功能：

用来定义路径和视图组件的映射关系。
当 URL 匹配 path 时，渲染对应的组件。

👉 常用属性：

path: 匹配 URL 路径。
component: 要渲染的组件。
exact: 确保路径完全匹配。

👉 用法示例：

<Route path="/" exact component={Home} />

4️⃣ Switch
// 导入 v6 核心组件

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 3个页面组件
function Home() {
  return <h2>🏠 首页 /</h2>;
}

function About() {
  return <h2>ℹ️ 关于页 /about</h2>;
}

// 404 兜底页面
function NotFound() {
  return <h2>❌ 404 页面不存在</h2>;
}

function App() {
  return (
    <Router>
      {/*🔥 v6 用 Routes 替代 旧版 Switch*/}
      <Routes>

        {/* 1. 默认精确匹配，不用写 exact！ */}
        <Route path="/" element={<Home />} />

        {/* 2. 匹配 /about */}
        <Route path="/about" element={<About />} />

        {/* 3. 兜底路由：匹配所有未定义路径 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
```

<Routes> = 只让一个页面显示的路由控制器没有它，路由会乱套、多个页面一起显示！

5️⃣ Link

```jsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
```

👉 功能：

提供导航功能，替代传统的 <a> 标签。
支持客户端路由跳转，而不会重新加载整个页面。

👉 用法：

可以传递 to 属性来指定跳转的目标路径。

<NavLink> → 导航专用（你写的代码）
jsx
// v5 写法（你这段）
<NavLink to="/home" activeClassName="active">首页</NavLink>

// v6 最新写法（你现在用的版本）
<NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>首页</NavLink>
7️⃣ Redirect
import { Redirect } from 'react-router-dom';

<Redirect to="/login" />

👉 功能：

用于路由重定向。
当某些条件不满足时，可以重定向到其他页面。

👉 适用场景：

比如用户未登录时，自动跳转到登录页。

# 说说你是如何提高组件的渲染效率的？在 React 中如何避免不必要的 render？

👉 React 中每次渲染都会重新计算组件的状态、属性、DOM 更新等，过多的渲染会导致性能瓶颈，尤其是在组件树庞大、频繁更新的情况下。因此，避免不必要的渲染是提高 React 应用性能的关键。

二、React 组件渲染原理（确保面试官认可你的理解）

React 渲染的核心流程：

状态变化（state 或 props）
当组件的 state 或 props 发生变化时，React 会触发重新渲染。
虚拟 DOM diff 算法
React 使用虚拟 DOM（Virtual DOM）来跟踪组件树的变化。它通过 diff 算法计算出两次渲染结果的差异，然后只更新需要变更的部分，而不是重新渲染整个 DOM。
实际 DOM 更新
在 diff 算法计算完成后，React 会更新实际的 DOM，最小化了性能消耗。
核心问题：
渲染过程中，如果某些组件并不需要重新渲染，就会浪费性能。因此，如何减少不必要的渲染至关重要。

三、避免不必要渲染的策略（这是面试的核心🔥）
React.memo 高阶组件:

```js
const my = React.memo(MyComponent )

```

通过对比props, 如果props没有变化，则不会重新渲染组件。

```js
4️⃣ Lazy Loading / Suspense
const LazyComponent = React.lazy(() => import('./LazyComponent'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

👉 作用：

延迟加载非核心组件，只在需要时加载它们。这可以减轻初次渲染的负担，提升应用加载性能。

👉 适用场景：

用于页面中一些不常见的组件或资源，可以通过懒加载延迟加载，提高初次加载性能。>

3️⃣ 避免匿名函数和对象作为 props
问题：
在组件内部，每次渲染时，匿名函数和对象都会被重新创建，导致父组件重新渲染并传递新 props。
解决方案：
避免在 render 中定义匿名函数或对象，改为定义在外部或使用 useCallback 和 useMemo。
const handleClick = useCallback(() => { console.log('clicked'); }, []);
const memoizedObject = useMemo(() => ({ key: 'value' }), []);

👉 作用：

useCallback 用来缓存函数，useMemo 用来缓存对象，避免在每次渲染时创建新对象/函数，从而避免引起不必要的渲染。

# 说说 React 的事件机制？（合成事件、事件池、与原生事件的区别）

👉 React 的事件机制是基于合成事件（SyntheticEvent）来实现的，旨在统一浏览器差异、提升性能以及方便跨平台开发。React 通过合成事件和事件池（Event Pool）来管理事件，确保事件的高效和灵活。

- 合成事件（SyntheticEvent）
1️⃣ 什么是合成事件？

👉 合成事件是 React 为了处理浏览器差异、性能优化而实现的事件封装。它是对原生 DOM 事件的一个跨浏览器的包装，可以在不同的浏览器中提供一致的 API。

合成事件基于原生事件，但它是 React 封装后的一层事件对象。

<button onClick={handleClick}>Click Me</button>

👉 在上面的例子中，onClick 事件并不是直接操作原生的 click 事件，而是通过 React 的合成事件机制来处理。

只要是 React 里用驼峰写法的事件（onClick、onChange、onSubmit…），全都是合成事件。

三、事件池（Event Pool）

1️⃣ 事件池的作用

React 使用 事件池（Event Pool）来 复用事件对象，避免频繁创建新的事件对象，从而减少内存消耗。

👉 事件对象在事件触发后会被放入池中，等待被重用。它会在事件回调函数执行后被回收，确保每次事件处理时不会产生多余的内存开销。

2️⃣ 事件池的工作流程
当事件触发时，React 会从事件池中取出一个事件对象。
事件对象会在事件处理函数中被使用。
事件处理函数执行完毕后，事件对象被重置并返回到事件池，等待下次使用。

3️⃣ 为什么要使用事件池？

👉 性能优化：

避免了每次事件触发时都创建新的事件对象。
减少了内存开销。

👉 避免内存泄漏：

React 确保每个事件对象在使用后都会被重置和回收，防止不必要的内存泄漏。
React 通过事件委托，把所有事件绑在根节点统一管理；触发时冒泡到根节点 → 封装合成事件 → 执行回调 → 回收复用，最终实现跨浏览器兼容 + 极致性能优化。

# 说说对高阶组件的理解？应用场景？

一、什么是高阶组件（HOC）？

👉 高阶组件（Higher-Order Component，简称 HOC）是一种函数，它接收一个组件作为参数，返回一个新的增强版组件。

HOC 本质上是一个函数，它将一个组件作为参数，返回一个新的组件，并且可以向这个新组件注入额外的功能或改变它的行为。

二、高阶组件的特点
不修改原组件： HOC 不会直接修改原组件，而是通过包装原组件，返回一个新的组件。
返回新的组件： 高阶组件返回的是一个增强版的组件，它可以拥有原组件的所有功能，同时增加新的功能。
可以传递 props： HOC 可以传递新的 props 给原组件，也可以改变原组件的行为。
可以实现代码复用： HOC 主要用于功能增强和逻辑复用，它可以封装多个组件共享的功能，避免代码重复。

```js
import React from 'react';

// 你写的高阶组件
const withFeature = (WrappedComponent) => {
  return (props) => {
    // 这里可以加额外逻辑、样式、数据
    return <WrappedComponent {...props} />;
  };
};

// 1. 写一个普通组件
function MyComponent(props) {
  return (
    <div>
      <h3>我是普通组件</h3>
      <p>姓名：{props.name}</p>
    </div>
  );
}

// 2. 用 HOC 包装一下 → 得到增强组件
const MyComponentWithFeature = withFeature(MyComponent);

// 3. 在页面里使用
function App() {
  return (
    <div>
      {/* 使用增强后的组件，正常传 props */}
      <MyComponentWithFeature name="小明" />
    </div>
  );
}

export default App;
```

四、高阶组件的应用场景

2️⃣ 权限控制 / 鉴权

HOC 可以用于封装访问权限控制的逻辑，判断用户是否有权限访问某些组件，如果没有权限可以跳转到登录页面或显示无权限提示。

示例：权限控制
const withAuth = (Component) => {
  return function WithAuth(props) {
    if (!props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return <Component {...props} />;
  };
};

复用数据请求

```js
import React, { useState, useEffect } from 'react';

// 🔥 高阶组件：封装【公共数据获取逻辑】
// 所有组件用它，都能自动拿到数据，不用重复写代码
const withDataFetching = (WrappedComponent) => {
  // 返回新的增强组件
  return (props) => {
    // 公共逻辑：数据加载
    const [data, setData] = useState(null);
    
    // 模拟获取数据（代替接口请求）
    useEffect(() => {
      setTimeout(() => {
        setData({ name: "React小白", age: 20 });
      }, 1000);
    }, []);

    // 把数据传给原组件
    return <WrappedComponent {...props} data={data} />;
  };
};

// --------------- 普通组件1：需要使用数据 ---------------
function UserInfo(props) {
  if (!props.data) return <div>加载中...</div>;
  return <div>用户姓名：{props.data.name}</div>;
}

// --------------- 普通组件2：也需要使用数据 ---------------
function UserAge(props) {
  if (!props.data) return <div>加载中...</div>;
  return <div>用户年龄：{props.data.age}</div>;
}

// --------------- 用 HOC 增强两个组件（复用逻辑）---------------
const UserInfoWithData = withDataFetching(UserInfo);
const UserAgeWithData = withDataFetching(UserAge);

// --------------- 页面使用 ---------------
function App() {
  return (
    <div>
      <UserInfoWithData />
      <UserAgeWithData />
    </div>
  );
}

export default App;
```

3️⃣ UI 增强 / 状态注入

高阶组件常用于增强 UI 组件的功能，例如注入状态、提供动画、包装样式等。

示例：样式增强
const withBorder = (Component) => {
  return function WithBorder(props) {
    return (
      <div style={{ border: '2px solid red' }}>
        <Component {...props} />
      </div>
    );
  };
};
 阶组件（HOC）是一种用于增强和复用组件功能的设计模式。通过接受一个组件并返回一个新的增强版组件，HOC 可以封装公共逻辑，提升代码复用性。常见的应用场景包括数据获取、权限控制、UI 增强等。虽然 HOC 提供了强大的功能复用能力，但也有一些局限性，例如 props 透传问题和组件嵌套过深的挑战，这时候可以考虑使用 Hooks 作为替代方案。

# 说说对 Fiber 架构的理解？解决了什么问题？（可中断渲染、时间切片）

# 面试官：说说React Jsx转换成真实DOM过程？

1️⃣ JSX 转化为 JavaScript

在 React 中，JSX 只是一个语法糖，它在编译时会被转换成 React.createElement 调用。JSX 看起来像是 HTML，但实际上它是 JavaScript 代码，最终会变成如下的形式：

示例：JSX
const element = <h1>Hello, world!</h1>;
转换后的 React.createElement
const element = React.createElement('h1', null, 'Hello, world!');
解释：
React.createElement 是一个核心 API，用来创建一个包含组件或元素的虚拟 DOM 对象。
它的第一个参数是元素类型（如 h1），第二个参数是元素的属性（如 props），第三个及后续的参数是元素的子节点（如文本或其他组件）。

这个过程通常由 Babel 转换器在编译时完成。

2️⃣ 虚拟 DOM 创建

React 在接收到 JSX 后，会将其转换成一个 虚拟 DOM 对象。虚拟 DOM 是一个 轻量级的 JavaScript 对象，它描述了真实 DOM 中的结构和状态，但并不直接修改浏览器的 DOM。

虚拟 DOM 是 React 的核心之一，它可以帮助 React 更加高效地处理 DOM 更新。虚拟 DOM 对象是 JavaScript 对象，包含元素类型、属性和子元素等信息。

示例：
const virtualDOM = {
  type: 'h1',
  props: {
    children: 'Hello, world!',
  },
};
3️⃣ 虚拟 DOM 比较（Diff）

在 React 中，当组件的 state 或 props 发生变化时，React 会根据新的虚拟 DOM 和上一次的虚拟 DOM 进行对比，这个过程称为 Diffing（虚拟 DOM 比较）。

React 会通过 最小化差异（即只更新变化的部分），来决定需要进行哪些 DOM 操作。这个比较过程的目标是 避免不必要的 DOM 操作，提升性能。

如何 Diff？

React 会根据节点的 key 值、类型、属性等信息来进行比对。只有在真实 DOM 需要更新时，React 才会执行相应的 DOM 操作。

4️⃣ 渲染更新为真实 DOM

一旦 React 确定了虚拟 DOM 和真实 DOM 的差异（也就是更新的部分），它会 批量执行 DOM 更新，并将 虚拟 DOM 中的变化同步到浏览器的 真实 DOM 中。

React 会通过 DOM 批处理机制来更新 DOM，这意味着它会尽量减少操作 DOM 的次数，以提升性能。

执行过程：
React 会在浏览器中执行最小的 DOM 更新，改变实际页面上需要更新的部分。
更新后的真实 DOM 会根据虚拟 DOM 中的状态和结构进行渲染。

三、React 渲染流程的核心步骤

1️⃣ 调用 React.createElement 生成虚拟 DOM
React 会将 JSX 转化成 React.createElement 的调用，创建虚拟 DOM 对象。
2️⃣ React 在内部维护一个虚拟 DOM 树
每个组件的渲染结果会生成虚拟 DOM 树，React 会在内部维护这个树状结构。
3️⃣ React 比较虚拟 DOM 和真实 DOM（Diffing）
React 使用虚拟 DOM 的 diff 算法，比较新的虚拟 DOM 和上一个渲染的虚拟 DOM 之间的差异。
4️⃣ 计算差异并更新真实 DOM
只对需要更新的部分进行修改，React 会最小化更新，提高性能。
5️⃣ 更新后再次渲染（可中断）
React 通过 Fiber 架构等机制，可以分步进行渲染任务，避免一次性操作导致界面卡顿。

React 的 JSX 会在编译时通过 Babel 转换为 React.createElement 调用，生成虚拟 DOM 对象。React 使用虚拟 DOM 对象和真实 DOM 进行比较，通过 Diff 算法计算最小的更新差异，只修改必要的 DOM，避免了大量的 DOM 操作，从而提高了性能。这个过程是 React 高效渲染的核心，通过虚拟 DOM 的引入，React 能够提供更高效的 UI 更新和更流畅的用户体验。

1️⃣ 提高性能

虚拟 DOM 使得 React 能够 最小化对真实 DOM 的操作，通过高效的 diff 算法计算差异并进行局部更新，从而提升了性能，尤其是在复杂的 UI 更新中。

2️⃣ 跨平台能力

虚拟 DOM 使得 React 可以在多个平台之间迁移，开发者可以在不同平台（如 Web、React Native）上使用相同的 React 代码，虚拟 DOM 抽象了平台特定的 DOM 操作。

3️⃣ 避免浏览器重绘重排

虚拟 DOM 通过减少对真实 DOM 的直接操作，避免了浏览器的频繁重绘和重排，从而提升了 UI 的渲染效率。

# 说说 React render 方法的原理？在什么时候会被触发？

# 说说对 React refs 的理解？应用场景？（createRef/useRef/forwardRef）
