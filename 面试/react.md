# React 有哪些内置 Hooks ？

一、基础 Hooks 面试问题
useState

1️⃣ useState 是干什么的？

2️⃣ 下面代码最终 count 是多少？为什么？

```js
const [count, setCount] = useState(0)

setCount(count + 1)
setCount(count + 1)
```

（考点：React 批量更新）

useEffect

3️⃣ useEffect 和 componentDidMount 的区别是什么？

4️⃣ 下面代码会执行几次？

```js
useEffect(() => {
  console.log("effect")
})
```

5️⃣ 下面代码和上面的区别是什么？

```js
useEffect(() => {
  console.log("effect")
}, [])
```

6️⃣ 为什么 React18 中 useEffect 会执行两次？

（考点：StrictMode / 副作用检测）

useRef

7️⃣ useRef 和 useState 的区别是什么？

8️⃣ 为什么 useRef 修改值不会触发组件重新渲染？

9️⃣ useRef 的两个常见用途是什么？

useContext

🔟 useContext 主要解决什么问题？

11️⃣ 什么是 props drilling（props 逐层传递问题）？

二、性能优化 Hooks 面试问题
useMemo

12️⃣ useMemo 是干什么的？

13️⃣ 什么情况下需要使用 useMemo？

useCallback

14️⃣ useMemo 和 useCallback 的区别是什么？

15️⃣ 为什么子组件会发生重复渲染？

16️⃣ 如何避免子组件重复渲染？

useReducer

17️⃣ useReducer 和 useState 的区别是什么？

18️⃣ 在什么场景下应该使用 useReducer？

三、React Hooks 原理问题（大厂高频）

19️⃣ 为什么 Hooks 不能写在条件语句中？

例如：

```js
if (a) {
  useEffect(() => {})
}
```

20️⃣ React 是如何知道 哪个 Hook 对应哪个 state 的？

21️⃣ useEffect 为什么是 异步执行 的？

# useEffect 和 useLayoutEffect 的区别

## ① 核心结论

**useLayoutEffect 是同步执行的，会在 DOM 更新后、浏览器绘制前执行；
useEffect 是异步执行的，会在浏览器绘制完成后执行，不会阻塞页面渲染。**

简单理解：

* **useLayoutEffect → 同步执行，可能阻塞渲染**
* **useEffect → 异步执行，不阻塞渲染**

---

## ② 解释

React 更新组件的大致流程：

```
Render（计算虚拟 DOM）
↓
Commit（更新真实 DOM）
↓
useLayoutEffect
↓
浏览器 Paint（页面绘制）
↓
useEffect
```

执行时机对比：

| Hook            | 执行时机                 |
| --------------- | ------------------------ |
| useLayoutEffect | DOM 更新后、浏览器绘制前 |
| useEffect       | 浏览器绘制完成后         |

因此：

* `useLayoutEffect` **同步执行**
* `useEffect` **异步执行**

---

## ③ 面试加分点

### 1️⃣ 使用场景区别

**useEffect（默认推荐）**

适合：

* 请求接口
* 事件监听
* 定时器
* 日志上报

```js
useEffect(() => {
  fetchData()
}, [])
```

---

**useLayoutEffect**

适合：

* 读取 DOM
* 修改 DOM
* 避免布局闪烁

```js
useLayoutEffect(() => {
  const height = ref.current.offsetHeight
}, [])
```

常见场景：

* tooltip 定位
* 获取元素尺寸
* scroll 控制
* 动画初始化

---

## 1️⃣ useEffect 为什么是异步执行？

### ① 核心结论

**因为 React 希望副作用不会阻塞浏览器渲染，所以把 useEffect 放在浏览器绘制之后执行。**

---

### ② 解释

执行流程：

```
render
↓
commit DOM
↓
browser paint
↓
useEffect
```

如果同步执行：

```
DOM更新
↓
执行副作用
↓
浏览器绘制
```

就可能导致：

* 页面卡顿
* 首屏变慢

---

### ③ 面试加分点

React 把 effect 分为：

* **layout effect → useLayoutEffect**
* **passive effect → useEffect**

`useEffect` 属于 **passive effect**。

---

## 2️⃣ useLayoutEffect 为什么不建议多用？

### ① 核心结论

**因为 useLayoutEffect 是同步执行的，会阻塞浏览器渲染。**

---

### ② 解释

执行流程：

```
render
↓
commit DOM
↓
useLayoutEffect
↓
浏览器 paint
```

如果里面逻辑很多：

* 浏览器必须等它执行完
* 才能绘制页面

可能导致 **页面卡顿**。

---

### ③ 面试加分点

React 官方建议：

```
优先使用 useEffect
只有需要同步 DOM 操作时使用 useLayoutEffect
```

---

## 3️⃣ useEffect cleanup 什么时候执行？

### ① 核心结论

**cleanup 会在组件卸载时执行，以及下一次 effect 执行前执行。**

---

### ② 解释

示例：

```js
useEffect(() => {
  console.log("effect")

  return () => {
    console.log("cleanup")
  }
}, [count])
```

执行流程：

```
第一次 render
↓
effect 执行

count 改变
↓
cleanup 执行
↓
effect 再执行
```

组件卸载：

```
cleanup 执行
```

---

### ③ 面试加分点

cleanup 的作用是 **清理副作用**：

例如：

* 移除事件监听
* 清除定时器
* 取消订阅

否则可能导致：

```
内存泄漏
```

---

# React state 为什么是异步更新？

## ① 核心结论

**React 的 state 更新不是立即执行的，而是会进入更新队列，由 React 统一进行批量更新（Batching），从而减少渲染次数，提高性能。**

---

## ② 解释

### 1️⃣ React 会进行批量更新（Batching）

例如：

```js
const [count, setCount] = useState(0)

setCount(count + 1)
setCount(count + 1)
```

最终结果是：

```
count = 1
```

原因是：

两次 `setCount` 读取的 **都是同一个旧 state**：

```
count = 0

setCount(0 + 1)
setCount(0 + 1)
```

React 会把更新 **放入更新队列**，最后统一执行一次渲染。

---

### 2️⃣ 正确写法（函数式更新）

如果希望基于 **最新 state** 更新：

```js
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

执行流程：

```
prev = 0 → 1
prev = 1 → 2
```

最终：

```
count = 2
```

---

## ③ 面试加分点

### 1️⃣ React 为什么要批量更新？

如果每次 `setState` 都立即渲染：

```
setState
↓
render
↓
setState
↓
render
```

会导致：

* 多次 DOM 更新
* 性能下降

因此 React 会：

```
setState
setState
setState
↓
合并更新
↓
一次 render
```

这就是 **Batching（批量更新）**。

---

## 1️⃣ React18 为什么扩展自动批处理？

### ① 核心结论

**React18 把批量更新扩展到更多异步场景，以减少不必要的渲染。**

---

### ② 解释

在 **React18 之前**：

只有 **React 事件** 才会批处理，例如：

```js
onClick={() => {
  setCount(1)
  setCount(2)
}}
```

但以下情况不会批处理：

```js
setTimeout(() => {
  setCount(1)
  setCount(2)
})
```

在 **React18** 中，这些场景也会自动批处理：

* Promise
* setTimeout
* async / await
* 原生事件

---

### ③ 面试加分点

React18 引入：

```
Automatic Batching
```

减少渲染次数，提高性能。

---

## 2️⃣ 什么时候 state 更新是同步的？

### ① 核心结论

**可以通过 flushSync 强制 React 同步更新 state。**

---

### ② 解释

示例：

```js
import { flushSync } from "react-dom"

flushSync(() => {
  setCount(1)
})
```

此时 React 会 **立即更新 state 并重新渲染**。

---

### ③ 面试加分点

`flushSync` 常用于：

* 需要立即读取 DOM
* 与第三方库交互

但 **不建议频繁使用**。

---

## 3️⃣ React 内部如何实现 state 更新？

### ① 核心结论

**React 会把 state 更新存入更新队列（Update Queue），在 render 阶段统一计算新的 state。**

---

### ② 解释

React Fiber 结构中：

```
Fiber
 ↓
updateQueue
 ↓
state updates
```

每一次 `setState` 都会生成一个 **update 对象**。

---

### ③ 面试加分点

React 在 render 阶段会遍历更新队列：

```
oldState
↓
apply updates
↓
newState
```

最终得到新的 state。

---

## 4️⃣ 为什么 React 不设计成同步更新？

### ① 核心结论

**如果 state 同步更新，会导致频繁渲染和性能问题，因此 React 采用批量更新机制。**

---

### ② 解释

如果同步更新：

```
setState
↓
render
↓
setState
↓
render
↓
setState
↓
render
```

会导致：

* 多次 DOM 更新
* 页面性能下降

而 React 现在的策略是：

```
setState
setState
setState
↓
合并更新
↓
一次 render
```

---

### ③ 面试加分点

React 的设计目标是：

```
减少渲染次数
提高性能
保证 UI 一致性
```

因此选择 **异步批量更新**。

---

* 一句话面试总结（强烈建议背）

**React 的 state 更新是异步的，因为 React 会把多个 setState 放入更新队列进行批量更新，从而减少渲染次数，提高性能。**

---

如果你在准备 **前端实习 / 大厂面试**，其实这里还有一个 **非常经典的连环问题**（很多人会被问懵）：

```
setState(count + 1)
setState(count + 1)
setState(count + 1)
```

**最终 count 是多少？为什么？**

这个题其实是 **字节 / 腾讯 React 面试必考题**。我可以给你整理一个 **面试官最喜欢的回答方式**。
