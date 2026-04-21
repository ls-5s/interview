# vue 和react 的差别 ?

1. 响应式 / 更新原理（最核心差异）
Vue内置自动响应式系统Vue2：Object.defineProperty；Vue3：Proxy数据变更自动收集依赖、精准触发视图更新，无需手动通知更新。
React无内置响应式，是手动状态驱动通过 setState / useState 触发更新，状态变更后组件会重新渲染靠不可变数据 + 调度机制实现更新，更新范围更粗放。
2. 渲染语法：模板 vs JSX
Vue：使用类 HTML 模板语法 + 指令（v-if /v-for/v-model）
学习成本低，贴近原生 HTML，可读性强，新手易上手。
React：使用 JSX（JS 里写 HTML）
完全基于 JavaScript，灵活度极高，逻辑与视图强绑定，适合复杂动态渲染。
3. 数据流设计
Vue：单向数据流为主 + 内置双向绑定（v-model）
表单开发极简便，兼顾规范与效率。
React：严格单向数据流
无原生双向绑定，通过受控组件手动实现，数据流向更清晰、可预测性更强。
4. 组件 API 设计
Vue：Options API（易上手） + Composition API（灵活复用）
新手友好，逻辑组织清晰。
React：Class 组件 + 函数组件 + Hooks
纯函数式编程，复用逻辑更自由，但对 JS 基础要求更高。

三、适用场景（面试官必问：你项目怎么选？）
Vue：
中后台系统、快速迭代项目、中小型应用、追求开发效率、团队新手居多。
React：
大型复杂应用、跨端开发（ReactNative）、高度定制化场景、需要极致逻辑复用的项目。

# 说说对 React Hooks 的理解？解决了什么问题？

追问：useEffect 依赖数组陷阱、useMemo/useCallback 设计、Hooks 实现原理

核心定义
React Hooks 是 React 16.8 推出的全新 API，它的核心使命：让函数组件拥有 Class 组件的全部能力（状态、生命周期、副作用等），彻底让函数组件成为 React 的主流开发方式。

现在：通过 useState/useEffect 等 Hooks，函数组件可以拥有状态、处理副作用、复用逻辑，代码更简洁。

核心规则（必须记）
只能在函数组件 / 自定义 Hooks 中使用；
只能在组件顶层调用（不能放在 if/for/ 嵌套函数里）；
每次组件渲染，Hooks 必须按完全相同的顺序执行（这是实现原理的关键）。

二、Hooks 解决了什么问题？（直击 Class 组件的痛点）

Class 组件在 React 中长期存在 4 个致命问题，Hooks 一次性全部解决：

1. 逻辑复用极其困难
Class 组件只能用 高阶组件 (HOC)、render props 复用逻辑，会导致组件嵌套地狱（Wrapper 套 Wrapper），代码难以维护；Hooks 用自定义 Hooks 就能优雅复用逻辑（比如封装请求、防抖、表单逻辑），无嵌套、无侵入。
2. 生命周期逻辑拆分、臃肿混乱
Class 组件中，同一个业务逻辑会被拆分到 componentDidMount/DidUpdate/WillUnmount 三个生命周期里；而不相关的逻辑又会挤在同一个生命周期中，代码难以阅读。Hooks 用 useEffect 可以按业务聚合逻辑，相关代码写在一起。
一个常见业务：比如定时器 / 窗口 resize 监听 / 订阅事件想要完整实现，必须把代码拆到三个生命周期：
componentDidMount：开启监听、启动定时器
componentDidUpdate：更新时重新处理
componentWillUnmount：清除定时器、取消监听
结果就是：
同一个业务逻辑，被撕成三块，散落在不同生命周期里，很难看懂、很难维护；
多个不相关业务（定时器、请求、监听）挤在同一个生命周期里，几百行代码堆在一起，耦合严重、改一处动全身。
这就是 Class 组件大型项目越来越臃肿混乱的根本原因。
3. Hooks（useEffect）如何解决？
useEffect 不再按 “阶段” 组织代码，而是按业务功能聚合。
同一个业务的：
启动逻辑
更新逻辑
清理逻辑
可以全部写在同一个 useEffect
4. 恶心的 this 指向问题
Class 组件必须手动绑定 this（bind/ 箭头函数），否则会出现上下文丢失；Hooks 是纯函数组件，完全没有 this，彻底告别 this 困扰。
5. 组件难以编译优化
Class 组件因为 this 和生命周期的复杂性，编译器很难优化；函数组件 + Hooks 是纯函数，更利于 Tree Shaking、编译优化。

三、追问 1：useEffect 依赖数组陷阱（新手重灾区）

1. 依赖数组是什么？
useEffect(callback, [依赖]) 的第二个参数，作用：标记副作用依赖的变量，只有依赖变化时，回调才会重新执行。
不传：每次渲染都执行
空数组 []：仅挂载、卸载执行一次
传变量：变量变化才执行
2. 最常见的 4 个依赖陷阱
① 漏写依赖 → 闭包过期（拿到旧值）
组件更新后，依赖变量已经变了，但 useEffect 没感知，依然用旧值。
js
const [count, setCount] = useState(0)
useEffect(() => {
  setInterval(() => console.log(count), 1000)
}, []) // 漏写 count → 永远打印 0
② 引用类型依赖（对象 / 数组 / 函数）→ 无限循环
函数组件每次渲染，引用类型都会创建新的内存地址，依赖数组判断「变化」，无限执行。
js
useEffect(() => {}, [{}]) // 每次渲染都是新对象 → 无限执行
③ 空数组误用 → 闭包陷阱
想让副作用只执行一次，但里面使用了外部变量，永远拿不到最新值。
④ 多写无关依赖 → 不必要的重复执行
增加性能开销。

四、追问 2：useMemo /useCallback 设计思想
这两个 Hooks 是为了解决 React 默认「粗放渲染」的性能优化工具，核心设计：缓存 + 避免无效重渲染 / 重计算。
核心一句话
useCallback：缓存函数引用
useMemo：缓存计算结果

1. useCallback（缓存函数）
为什么需要？
函数组件每次重渲染，内部定义的函数都会重新创建（新引用）。如果把这个函数传给子组件，子组件（用 React.memo 优化）会认为 props 变化，被迫重渲染。
作用
缓存函数的引用地址，让函数跨渲染保持同一个引用，配合 memo 阻止子组件无效渲染。
js
// 缓存函数，只有 count 变化才更新
const handleClick = useCallback(() => setCount(count+1), [count])
2. useMemo（缓存计算值）
为什么需要？
组件每次渲染，都会重新执行所有逻辑。如果有昂贵计算（如大数据过滤、排序），会重复计算浪费性能。
作用
缓存函数的返回值，只有依赖变化时才重新计算，跳过无用计算。
js
// 昂贵计算：只有 list 变化才重新计算
const expensiveValue = useMemo(() => {
  return list.filter(...).map(...)
}, [list])

五、追问 3：Hooks 实现原理（极简通俗版）
不用看源码，记住 3 个核心点，就能彻底理解 Hooks：

1. 底层基石：闭包
Hooks 利用 JavaScript 闭包 保存组件状态。函数组件执行完，Hooks 内部的状态不会被销毁，闭包让函数「记住」了数据。
2. 存储结构：单向链表
React 内部会给每个组件维护一个单向链表：
组件第一次渲染：按顺序调用 useState → useEffect → ...，依次创建链表节点；
组件更新渲染：按相同顺序遍历链表，取出对应的状态 / 副作用。
3. 为什么 Hooks 不能用在 if/for 里？（原理核心）
因为 Hooks 完全靠调用顺序匹配链表节点！如果放在条件判断里，顺序乱了 → 链表节点对应错误 → 状态混乱。
4. 状态更新原理
调用 setState → 标记组件需要更新 → 组件重新渲染 → 按顺序执行 Hooks → 从链表中取最新状态 → 视图更新。

# React 中组件之间如何通信？

追问：跨级通信方案、全局状态管理选型、兄弟组件通信

1. 父子组件通信（最常用）

```jsx
// 子组件
const Child = (props) => {
  // 子→父：调用回调函数传参
  const send = () => props.onChange("子组件数据");
  return <div>{props.msg} <button onClick={send}>传值</button></div>;
};

// 父组件
const Parent = () => {
  const [childMsg, setChildMsg] = useState("");
  // 父→子：通过 props 传值
  return <Child msg="父传子数据" onChange={setChildMsg} />;
};
```

1. 兄弟组件通信（父组件中转）

```jsx
// 兄弟A：发送数据
const BrotherA = ({ send }) => {
  return <button onClick={() => send("A传给B的数据")}>发送</button>;
};

// 兄弟B：接收数据
const BrotherB = ({ msg }) => <div>{msg}</div>;

// 父组件（中转）
const Parent = () => {
  const [data, setData] = useState("");
  return (
    <>
      <BrotherA send={setData} />
      <BrotherB msg={data} />
    </>
  );
};
```

1. 跨级组件通信（Context API）

```jsx
// 1. 创建上下文
const Context = createContext();

// 2. 孙子组件（接收数据）
const Grandson = () => {
  const value = useContext(Context);
  return <div>跨级数据：{value}</div>;
};

// 3. 父/子/孙嵌套
const Parent = () => {
  return (
    // 祖先提供数据
    <Context.Provider value="跨级共享数据">
      <Child />
      <Grandson />
    </Context.Provider>
  );
};
```

1. 全局通信（全局状态管理 Zustand 最简版）

```jsx
// 1. 创建全局仓库
import { create } from "zustand";
const useStore = create((set) => ({
  globalData: "",
  setGlobalData: (val) => set({ globalData: val })
}));

// 2. 任意组件直接使用
const Com = () => {
  const { globalData, setGlobalData } = useStore();
  return <div>{globalData}</div>;
};
```

# 说说 React diff 算法的原理是什么？

追问：为什么是 O (n) 复杂度、双端对比过程、key 的作用

二、追问 1：为什么复杂度是 O (n)？
传统的 DOM 树深度递归 Diff 算法，需要对比每一个节点 + 子节点 + 跨层级移动，时间复杂度是 O(n³)（n 为节点总数），大型页面直接卡顿。
React 基于前端 DOM 操作的实际场景，做了三个大胆的优化策略，直接把复杂度降到 O(n)：

1. 【核心策略】只对比同层级节点，绝不跨层级对比
React 认为：DOM 节点跨层级移动极少，可以直接忽略。
只按树的层级，从上到下、逐层对比；
一旦发现节点被移除 / 新增，直接销毁旧子树、重建新子树，不递归对比内部。
2. 不同类型的节点，直接销毁重建
比如 <div> 变成 <p>、组件标签改变，React 判定为完全不同的树，直接删掉旧节点，新建节点，不做多余对比。
3. 用 key 标识同层级子节点，快速匹配
给列表节点加唯一 key，让算法一眼找到「新旧虚拟 DOM 中是同一个节点」，避免盲目遍历。

三、追问 2：双端对比过程（子节点列表 Diff 核心）
当同层级的子节点是列表（比如多个 <li>）时，React 用双端对比算法高效匹配节点，这是 Diff 最精细的部分。
核心概念
四个指针：旧头、旧尾、新头、新尾
旧列表：更新前的子节点
新列表：更新后的子节点
完整对比步骤（循环执行，直到指针相遇）
旧头 ↔ 新头
节点相同（key + 类型一致）→ 匹配成功，指针向后移动；
旧尾 ↔ 新尾
节点相同 → 匹配成功，指针向前移动；
旧头 ↔ 新尾
节点相同 → 说明节点是移动过来的，把旧头节点移到旧尾后面，移动指针；
旧尾 ↔ 新头
节点相同 → 说明节点是移动过来的，把旧尾节点移到旧头前面，移动指针；
以上 4 步都不匹配
用 key 在旧列表中查找节点：
找到 → 移动节点到对应位置；
没找到 → 新建节点；
循环结束
旧列表有剩余节点 → 删除；
新列表有剩余节点 → 新增。
优势
全程只遍历一次列表，只做移动、新增、删除，不做无用销毁重建，极致高效。

四、追问 3：key 的作用
key 是给 同层级列表节点 的唯一身份标识，是 Diff 算法的「身份证」。
核心作用
让双端对比算法快速识别「同一个节点」
没有 key，React 只能按索引顺序盲目对比，列表增删 / 排序时，会误判节点；
避免节点错误销毁 / 重建
有 key，节点可以直接复用 + 移动，无需重新创建 DOM，性能提升巨大；
避免组件状态错乱
比如列表中的 input、复选框，无 key 会导致状态绑定错误（值乱跳）。
致命坑：不要用索引 index 作为 key
列表排序、删除时，索引会改变，key 失效；
等同于没有 key，依然会出现节点误判、状态错乱。
正确用法
用唯一、稳定、不变的值：后端返回的 id、uuid 等。

# 说说对 Fiber 架构的理解？解决了什么问题？

追问：时间切片、优先级调度、可中断渲染、Fiber 数据结构

一、核心总述（面试开篇必答）
Fiber 是 React 16 重构的核心协调器（Reconciler），本质是把 React 原本同步递归的 Diff 渲染流程，改造成可中断、可恢复、可按优先级调度的异步渲染架构。它的核心目标是解决大型应用渲染卡顿、主线程阻塞的问题，让页面交互始终保持流畅。

二、Fiber 解决的核心问题
React 16 之前用 Stack Reconciler（栈协调器）：
采用同步递归深度遍历做 Diff，一旦组件数量多、Diff 耗时过长（超过浏览器一帧 16ms），就会独占主线程；
浏览器主线程是单线程，JS 执行会阻塞 DOM 渲染、用户交互（点击 / 输入 / 滚动），导致页面卡顿、掉帧、交互无响应；
递归一旦开始无法中断，必须从头到尾执行完，无法兼顾用户体验。
Fiber 彻底解决了这个问题：把长渲染任务拆成小任务，按需调度，不阻塞主线程。
三、追问核心知识点（逐点通俗解释）

1. 时间切片（Time Slicing）
核心解释：把原本一整个长 Diff 任务，切分成多个 5ms 左右的微小任务单元（每个单元对应一个 Fiber 节点）。浏览器每一帧（16ms）会留出空闲时间，Fiber 只在空闲时间执行小任务，执行完一个就主动让出主线程，让浏览器先处理渲染、交互等紧急任务，下一帧空闲时再继续执行。一句话：化整为零，挤空闲时间干活，不抢主线程。
2. 可中断渲染
核心解释：Diff 遍历过程不再是一次性跑完的递归，而是基于链表遍历，执行完一个小任务单元后：
检查主线程是否空闲 → 不空闲就暂停渲染；
等浏览器空闲后 → 恢复渲染，从暂停的位置继续执行，不用从头重来；
完全避免了长任务阻塞，用户操作永远优先。
3. 优先级调度
核心解释：React 会给不同的更新任务分配不同优先级：
高优先级：用户交互（点击、输入、滚动）、动画；
低优先级：数据请求、列表渲染、后台数据更新；
调度器会优先执行高优先级任务，高优先级任务可以打断低优先级任务，保证用户交互永远流畅，不会被后台渲染卡住。
4. Fiber 数据结构
核心解释：Fiber 本质是一个链表结构的对象，每个 Fiber 节点对应一个组件 / 真实 DOM 节点，替代了原来的递归遍历。关键属性：
return：指向父 Fiber 节点；
child：指向第一个子 Fiber 节点；
sibling：指向兄弟 Fiber 节点；
priority：记录当前任务的优先级；
stateNode：对应组件实例或 DOM 节点；
作用：用单向链表遍历替代递归，实现渲染的中断、恢复、跳转，这是 Fiber 所有能力的基础。

# 如何提高组件渲染效率？如何避免不必要的 render？

追问：React.memo 的使用限制、useMemo/useCallback 优化场景

一、核心回答：如何提高渲染效率、避免不必要 render
核心思路：减少重复渲染、缩小渲染范围、缓存易变内容，从「减少触发时机」和「优化渲染过程」两方面入手。

1. 组件层面优化
拆分细粒度组件
大组件拆成小组件，让状态更新只影响最小范围，避免一处更新全组件重渲染。
避免无效状态更新
不修改状态时不调用 setState，状态只存渲染必需数据，减少更新触发。
列表渲染优化
使用稳定唯一 key（不用 index），配合 Diff 算法最大化复用节点。
2. API 缓存优化（核心手段）
React.memo：缓存函数组件，浅比较 props，props 不变则跳过重渲染
useCallback：缓存函数引用，避免函数作为 props 时每次生成新引用
useMemo：缓存复杂计算结果，避免每次渲染重复执行高开销计算
React.lazy + Suspense：组件懒加载，首屏不加载非关键组件
3. 传参优化
不把匿名函数、新对象 / 数组直接作为 props 传递（每次渲染引用都会变）
复杂 props 用 useMemo 缓存，函数 props 用 useCallback 缓存
二、追问 1：React.memo 的使用限制
仅浅比较 props
只对比基本类型（数字 / 字符串）和引用地址，嵌套对象 / 数组内部变化无法感知，依然会触发渲染。
不缓存 state/context 变化
组件自身 state 或使用的 context 更新，memo 无法阻止渲染。
有额外性能开销
浅比较本身需要耗时，简单组件使用 memo 会负优化，只适合频繁重渲染的复杂组件。
仅作用于函数组件
类组件对应 PureComponent，memo 对类组件无效。
无法跳过强制更新
调用 forceUpdate 会强制渲染，不受 memo 控制。
三、追问 2：useMemo / useCallback 优化场景
4. useCallback 适用场景
核心作用：缓存函数引用，配合 React.memo 阻止子组件重渲染
函数作为 props 传递给被 memo 包裹的子组件
函数作为其他 Hooks（useEffect/useMemo）的依赖项
高频触发的回调函数（如滚动、输入事件），避免频繁创建新函数

```jsx
// 父组件
const Parent = () => {
  // 缓存函数，引用不变
  const handleClick = useCallback(() => {}, []);
  // 子组件被memo包裹，props不变则不渲染
  return <Child onClick={handleClick} />
};
const Child = React.memo(({ onClick }) => <button onClick={onClick}>子组件</button>);
```

1. useMemo 适用场景
核心作用：缓存计算结果，避免重复执行高开销计算
大量数据的过滤、排序、遍历、格式转换等昂贵计算
缓存引用类型 props（对象 / 数组），配合 memo 防止子组件重渲染
依赖项少、计算成本高的场景，简单计算无需使用

```jsx
const List = ({ data }) => {
  // 缓存排序结果，data不变不会重新计算
  const sortedList = useMemo(() =>
    [...data].sort((a,b) => b.time - a.time),
  [data]);
  return <div>{sortedList.map(item => <div key={item.id}>{item.name}</div>)}</div>
};
```

四、面试精简背诵版（30 秒）
优化组件渲染核心是减少无效重渲染：拆分组件、用稳定 key、通过React.memo缓存组件，useCallback缓存函数、useMemo缓存复杂计算，避免匿名函数 / 新对象作为 props。React.memo只浅比较 props、不拦截 state/context 更新，简单组件使用会负优化；useCallback用于缓存函数引用配合 memo，useMemo用于缓存高开销计算结果，二者都只在有性能瓶颈时使用，避免滥用。

# 说说 React 中 setState 的执行机制 ?

追问：异步更新原理、批量更新规则、同步更新的场景

一、核心总述
setState 是 React 更新组件状态的核心方法，默认不会同步、立即更新 state，而是采用异步入队 + 批量合并更新的执行机制，核心目的是减少重复渲染、提升页面性能。

二、setState 完整执行流程
更新入队
调用 setState 时，React 不会立刻修改 state，而是把本次更新（对象 / 更新函数）放入更新队列。
批量合并
短时间内多次调用 setState，React 会将多个更新合并为一次，避免频繁触发组件重渲染。
调度执行
React 在合适的时机（如合成事件结束、生命周期阶段完成）统一处理队列，计算最新 state。
触发重渲染
生成最新 state 后，触发组件 render，更新视图。

三、追问 1：异步更新原理

1. 为什么是异步？
核心目的是性能优化：如果每次 setState 都同步更新 state、立刻重渲染，频繁调用会导致组件反复渲染，严重消耗性能。React 故意把更新设计为异步，攒够一批更新再一次性执行，把多次渲染合并为一次。
2. 异步本质
并非宏任务 / 微任务，而是 React 在合成事件、生命周期中，通过内部调度机制控制更新时机，将更新延迟到当前执行上下文结束后再处理。

3. React 18 之后（全局自动批量）
所有场景全部自动批量更新：无论在合成事件、异步回调（定时器 / Promise）、原生事件中，多次 setState 都会合并为一次更新，彻底统一更新规则。
4. 合并规则
对象式 setState：进行浅合并，相同字段覆盖，不同字段保留。
函数式 setState：按调用顺序依次执行，基于上一次 state 计算新值。
5. React 18 之后
默认全批量，无天然同步场景；若需要强制同步更新，必须使用 React 提供的 flushSync 包裹：

```jsx
import { flushSync } from 'react'
flushSync(() => {
  setState(新值) // 立刻同步更新，不批量
})
```

# React 中的 key 有什么作用？

结合 diff 算法追问：key 重复 / 缺失的后果、列表渲染中 key 的选择

key 是列表节点的唯一标识，用于辅助 Diff 算法精准识别节点、复用 DOM，提升渲染性能。key 缺失会导致 DOM 重建、页面错乱；key 重复会造成节点误判、产生严重 BUG。列表渲染必须使用唯一稳定的 ID作为 key，严禁使用数组 index。

# 说说对受控组件和非受控组件的理解？应用场景？

追问：表单最佳实践、两者混用的问题、useRef 在非受控组件中的应用

1. 受控组件
表单的value/checked 由 React state 完全控制，通过 onChange 把用户输入同步到 state，视图和状态实时绑定、双向同步，React 是唯一数据源。

```jsx
const [value, setValue] = useState('')
<input value={value} onChange={e => setValue(e.target.value)} />
```

1. 非受控组件
表单数据由 DOM 自身管理，不绑定 state，React 不参与值的同步，通过 useRef 获取 DOM 节点，在提交等时机一次性读取值。

```jsx
const inputRef = useRef(null)
const submit = () => console.log(inputRef.current.value)
<input ref={inputRef} />
```

二、应用场景
✅ 受控组件
需要实时校验、格式化、拦截输入内容
表单元素之间数据联动（级联选择、动态禁用）
复杂表单、多步骤表单、需要实时监听数据变化
需持久化 / 实时提交表单数据
✅ 非受控组件
简单表单、仅提交时取值，无需实时控制

```jsx
文件上传 <input type="file" />（天生非受控，无法受控）
```

第三方原生表单组件集成
追求极简代码，不想维护大量 state

# 说说对 React 的理解？有哪些核心特性？

一、整体理解
React 是 Meta（原 Facebook）开源的专注于视图层渲染的 JavaScript 库，核心设计理念是组件化、声明式编程，通过虚拟 DOM 与高效 Diff 算法实现高性能 UI 更新，主打「一次学习，多端编写」，是目前前端生态最主流的框架之一。
它不做路由、状态管理等全框架工作，只聚焦页面视图渲染，生态灵活可搭配各类第三方库，同时通过 Hooks、Fiber 架构解决了复杂组件的开发与性能问题。
二、核心特性
组件化开发将页面拆分为独立、可复用的组件，形成树状结构，高内聚低耦合，是 React 最基础的组织形式，函数组件为当前主流。
声明式编程只需描述 UI 的最终状态，无需手动命令式操作 DOM，React 自动完成 DOM 更新，代码更直观、易维护。
虚拟 DOM用 JS 对象模拟真实 DOM 结构，操作轻量的虚拟 DOM 替代昂贵的真实 DOM 操作，大幅减少 DOM 重绘重排，提升渲染性能。
高效 Diff + Fiber 架构双端 Diff 算法实现虚拟 DOM 精准比对，最小化 DOM 更新；Fiber 架构将渲染任务切片，支持可中断、可优先级调度的异步渲染，解决长任务卡顿问题。
单向数据流数据仅能自上而下从父组件流向子组件，数据流向清晰、可追踪，避免多层级数据混乱，便于调试。
JSX 语法允许在 JS 中编写类 HTML 语法，通过 Babel 编译为 JS，直观描述 UI 结构，兼顾 JS 逻辑与视图，提升开发效率。
Hooks 体系React 16.8 推出，让函数组件拥有状态、副作用等能力，解决类组件生命周期臃肿、逻辑复用难的问题，是现代 React 开发核心。
跨平台能力基于 React 可衍生 React Native（移动端）、React Desktop（桌面端），实现一套语法多端复用。

React 是专注视图层的开源 JS 库，以组件化、声明式编程为核心。核心特性包括：组件化拆分 UI、虚拟 DOM 减少 DOM 操作、高效 Diff+Fiber 保证渲染性能、单向数据流让数据更清晰、JSX 简化开发、Hooks 优化函数组件，同时支持跨平台开发。

# Real DOM 和 Virtual DOM 的区别？优缺点？

一、核心区别

1. 本质不同
Real DOM（真实 DOM）：浏览器渲染引擎生成的真实 DOM 树节点，是页面实际渲染的结构，由浏览器原生提供。
Virtual DOM（虚拟 DOM）：用普通 JS 对象模拟真实 DOM 的层级、标签、属性，是轻量级的「DOM 映射副本」，不直接参与浏览器渲染。
2. 操作开销不同
操作 Real DOM 极其昂贵，任何增删改查都会触发浏览器重排（回流）/ 重绘，频繁操作会严重卡顿。
操作 Virtual DOM 只是修改 JS 对象，无任何浏览器渲染开销，速度极快。
3. 更新机制不同
Real DOM：手动操作时需直接修改节点，全量更新，哪怕只改一个文字也可能重建整棵子树。
Virtual DOM：状态更新后生成新虚拟 DOM，通过 Diff 算法对比新旧差异，只把最小变化部分更新到真实 DOM，实现精准更新。
4. 跨平台能力
Real DOM：只能在浏览器环境使用，依赖浏览器渲染引擎。
Virtual DOM：与平台无关，可映射到移动端（React Native）、桌面端等，实现一次编写多端运行。
二、优缺点对比
Virtual DOM
✅ 优点
大幅减少真实 DOM 操作，避免频繁重排重绘，提升页面性能；
Diff 算法实现增量更新，只修改变化部分；
无需手动操作 DOM，开发者只需关注数据 / 状态，开发效率更高；
跨平台性强，不绑定浏览器环境。
❌ 缺点
首次渲染需要额外创建虚拟 DOM 树，有轻微性能开销；
简单页面 / 少量 DOM 操作时，反而比直接操作真实 DOM 慢；
需占用一定内存存储虚拟 DOM 对象。
Real DOM
✅ 优点
直观直接，无需中间层，简单场景操作效率更高；
无需额外编译、映射，原生支持，无学习成本。
❌ 缺点
操作性能极差，频繁修改易造成页面卡顿、掉帧；
手动维护 DOM 繁琐，代码冗余、难以维护；
无法跨平台，只能用于浏览器。
