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
