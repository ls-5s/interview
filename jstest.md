##  回流和重绘是什么？有什么区别区别？
**回流**
当元素的几何属性发生变化时（例如宽度、高度、位置等），浏览器需要重新计算元素的位置和大小，这个过程称为回流（Reflow）。
- 回流会触发重绘
  
**重绘**
当元素的外观属性发生变化时（例如颜色、背景、边框等），浏览器需要重新绘制元素，这个过程称为重绘（Repaint）。
- 重绘不会触发回流

**触发场景**
1. 触发回流的场景（几何属性变化）
- 直接修改元素的几何样式：如 width、height、margin、padding、border、top、left 等。例：div.style.width = "200px"（宽高变化，需重新计算布局）。
- 改变元素的布局结构：如添加 / 删除 DOM 元素、隐藏 / 显示元素（display: none 会触发回流，因为元素从布局中移除）。
- 浏览器窗口尺寸变化：如用户缩放窗口（resize 事件），此时整个页面布局需要重新计算。
- 改变元素的字体相关属性：如 font-size、font-family（字体大小变化可能导致元素宽高变化）。


**触发重绘的场景（外观变化，几何不变）**
- 修改元素的非几何样式：如 color、background-color、border-color、box-shadow、opacity（不配合 transform 时）等。例：div.style.color = "red"（颜色变化，无需改布局，仅重绘）。
- 部分 CSS 属性变化：如 visibility: hidden（元素仍占据布局空间，仅隐藏，只触发重绘）。

**差别**
回流成本更高：回流需要重新计算整个布局树，可能引发连锁反应（父元素、子元素、兄弟元素的布局都可能受影响），性能消耗远大于重绘。
重绘成本较低：仅需重新绘制元素的视觉部分，不涉及布局计算。

## 怎么实现响应式数据？那你说说ref和reactive()区别？
**先说ref 和 reactive() 区别？**
1. 处理数据类型不同
- reactive：只能处理引用类型（对象、数组、Map、Set 等），无法直接处理基本类型（如 reactive(123) 会无效）。原理：reactive 内部通过 Proxy 直接代理整个对象，递归监听所有属性的读写。
- ref：主要用于处理基本类型（字符串、数字、布尔值等），但也支持引用类型（会自动转换为 reactive 代理）。原理：ref 会创建一个「包装对象」，该对象包含 value 属性，通过拦截 value 的读写实现响应式（基本类型存在 value 中；引用类型时，value 会被 reactive 代理）。

2. 访问 / 修改方式不同

- reactive：直接通过「属性名」访问 / 修改，无需额外操作。例：
```js
const obj = reactive({ name: 'foo' })
console.log(obj.name) // 访问：直接用属性名
obj.name = 'bar' // 修改：直接赋值属性
```
- ref：必须通过「.value」访问 / 修改（模板中会自动解包，无需 .value）。例：
```js
const count = ref(0)
console.log(count.value) // 访问：必须用 .value
count.value = 1 // 修改：必须赋值 .value
// 若 ref 包装引用类型
const user = ref({ age: 18 })
console.log(user.value.age) // 需 .value 访问内部对象
user.value.age = 19 // 修改内部属性
```
3. 解构后的响应式表现不同
- reactive：解构后会丢失响应式。原因：reactive 的响应式依赖 Proxy 代理，解构会将属性值提取为普通值（脱离代理）。例：
```js
const obj = reactive({ a: 1, b: 2 })
const { a, b } = obj // 解构后 a、b 是普通值，修改不会触发更新
a = 3 // 无响应式
```
- ref：解构后仍能保持响应式（需配合 toRefs）。原因：ref 本身是包装对象，通过 toRefs 可以将其转换为「属性级别的 ref」，解构后仍可通过 .value 保持响应式。例：
```js
const obj = reactive({ a: 1, b: 2 })
const refs = toRefs(obj) // 将 reactive 对象转为 ref 集合
const { a, b } = refs // 解构后 a、b 是 ref 对象
a.value = 3 // 仍会触发响应式更新
```
4. 对「整个对象替换」的支持不同
- reactive：无法直接替换整个对象，否则会丢失响应式。原因：reactive 的代理是针对「初始对象」的，若直接替换为新对象，新对象不会被代理，响应式失效。例：
```js
const obj = reactive({ name: 'foo' })
obj = { name: 'bar' } // 错误：替换后 obj 不再是响应式代理
ref：可以直接替换整个 .value，响应式依然有效。原因：ref 的响应式基于 value 属性的拦截，无论 value 是基本类型还是新对象，都会被重新监听。例：
```
```js
const user = ref({ name: 'foo' })
user.value = { name: 'bar' } // 有效：新对象会被自动代理，响应式保留
```

============================

实际开发中，推荐优先使用 ref（更通用，尤其处理基本类型或需要整体替换的场景），仅在明确操作复杂对象且无需替换整体时使用 reactive。