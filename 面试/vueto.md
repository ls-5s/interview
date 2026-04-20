# 说说你对 Vue 的理解？

1. MVVM 架构：彻底解耦视图与数据
Vue 的核心设计之一是 MVVM（Model-View-ViewModel），和传统 MVC 最大的区别是「数据驱动视图」，而非手动操作 DOM。
Model：业务数据（比如购物车的商品列表、简历筛选的条件）；
View：用户界面（HTML 模板）；
ViewModel：Vue 的核心实例，作为「中间桥梁」—— 监听数据变化、更新视图；监听视图操作、同步数据。
举个实际的逻辑：在我做的「纯前端购物车」项目里，购物车商品列表是 Model，页面上的商品列表是 View。当我修改商品数量（操作 Model），ViewModel 会自动感知变化，直接更新 View 里的数量显示 —— 全程不用写 document.getElementById 这种 DOM 操作代码。这就是 MVVM 的核心价值：让开发者只关注数据逻辑，不用关心视图怎么渲染，彻底解耦，降低代码冗余。
2. 响应式系统：Vue 的「灵魂」
响应式是 Vue 区别于原生 JS 开发的核心，本质是「数据变化自动触发视图更新」，不同版本的实现逻辑有差异，这也是面试高频考点：
Vue2：基于 Object.defineProperty() 实现，通过劫持对象的属性读取 / 修改，触发依赖收集和更新；缺点是无法监听对象新增 / 删除的属性、数组下标修改，需要额外封装 $set 等方法；
Vue3：基于 Proxy 实现，直接代理整个对象，能完美监听对象 / 数组的所有操作（包括新增属性、下标修改），且性能更优（懒监听，只有访问的属性才会被劫持）。

我在项目中的落地：在「AI 简历筛选系统」里，我用 Vue3 的响应式管理「筛选条件状态」（比如工作年限、技能关键词）。当用户在筛选组件修改条件时，数据层的响应式会自动同步到全局状态，触发简历列表组件的重新渲染，无需手动调用接口或刷新页面 —— 既简化了逻辑，又保证了数据一致性。
3. 虚拟 DOM + Diff 算法：平衡性能与开发体验

Vue 不是直接操作真实 DOM，而是先构建虚拟 DOM（VNode）—— 一个描述真实 DOM 结构的 JS 对象。当数据变化时，Vue 会生成新的 VNode，和旧 VNode 做 Diff 对比，只更新「变化的部分」到真实 DOM 上，而非重新渲染整个页面。

# 说说你对 Vue 双向绑定的理解？Vue2 响应式原理是怎么实现的？（底层核心必问）

一、对 Vue 双向绑定的理解
本质：双向绑定 = 数据驱动视图 + 视图同步数据，实现数据与视图的双向自动同步。
核心是语法糖：我们常用的 v-model 本质就是一层语法糖，拆开来就是：
给表单元素绑定 value 属性（数据→视图，响应式生效）
监听 input/change 事件（视图→数据，手动更新数据）
和响应式的关系：
响应式是单向的（数据变 → 视图变）；
双向绑定是在响应式基础上，加了视图反向更新数据的逻辑，是响应式的延伸应用。

```vue
<template>
  <!-- 直接在事件里写 emit，不用单独写方法！ -->
  <input 
    :value="modelValue" 
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
// 只写核心两行，没有多余代码
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```

二、Vue2 响应式原理（底层核心，必背流程）
Vue2 响应式核心就四步：数据劫持 → 依赖收集 → 派发更新 → 视图更新
数据劫持初始化时，Vue 遍历 data 里的所有对象 / 属性，通过 Object.defineProperty() 劫持每个属性的 getter 和 setter，监听属性的读取和修改。
依赖收集当组件渲染时，会读取 data 数据，触发 getter；此时会把当前组件的渲染 Watcher 收集到该属性的依赖列表里，记录 “谁用到了我”。
派发更新当修改 data 数据时，触发 setter；setter 会通知依赖列表里所有 Watcher：“数据变了，需要更新”。
视图更新Watcher 收到通知后，触发组件重新渲染，通过虚拟 DOM + Diff 高效更新真实 DOM。
三、Vue2 响应式的缺陷（面试官必追问，一定要提）
无法监听对象新增 / 删除属性，必须用 Vue.set / this.$set；
无法监听数组下标修改、length 直接修改，Vue 重写了数组 7 个变异方法（push/pop/shift/unshift/splice/sort/reverse）来解决；
初始化时需要递归深度遍历所有属性，层级深时会有一定性能损耗。

# 说说你对 Vue 生命周期的理解？每个阶段分别做了什么？（必问，结合挂载流程）

【腾讯关注点】：会追问beforeCreate/created的区别、mounted一定能拿到 DOM 吗？父子组件生命周期执行顺序、keep-alive下的钩子变化。

1. 创建阶段（组件初始化）
beforeCreate
组件刚实例化，data、methods 还未初始化，拿不到响应式数据，几乎不用。
created
数据已完成响应式绑定，能访问 data、调用 methods，适合发初始接口请求、处理数据初始化。
2. 挂载阶段（渲染真实 DOM）
beforeMount
模板编译完成，虚拟 DOM 生成完毕，但还未挂载到真实页面，拿不到 DOM 节点。
mounted
组件已挂载到真实 DOM 树上，正常情况可获取 DOM，适合操作 DOM、初始化第三方库（ECharts、地图）。
3. 更新阶段（数据变化触发重渲染）
beforeUpdate
数据已改变，虚拟 DOM 重新生成，但页面还未更新。
updated
数据更新完成，页面重新渲染完毕，可获取更新后的 DOM。
4. 销毁阶段（组件移除）
beforeUnmount
组件即将销毁，实例仍可用，适合清除定时器、解绑事件、取消订阅，防止内存泄漏。
unmounted
组件完全销毁，DOM 移除，相关指令、事件监听全部清空。

5. beforeCreate 和 created 核心区别
beforeCreate：无 data、无 methods，无法操作数据；
created：有响应式数据、可调用方法，是发初始请求的最佳时机。
6. mounted 一定能拿到 DOM 吗？
不一定。如果 DOM 由 v-if 控制、或子组件异步渲染，mounted 时可能还未生成真实 DOM；想确保拿到，用 nextTick 包裹 DOM 操作。
7. 父子组件生命周期执行顺序
创建挂载：父先创建 → 子全走完 → 父最后挂载父 beforeCreate → 父 created → 父 beforeMount →子 beforeCreate → 子 created → 子 beforeMount → 子 mounted →父 mounted
销毁：父先触发 → 子先销毁 → 父最后销毁
8. keep-alive 下钩子有什么变化？
组件不会执行销毁 / 重新创建钩子，只触发 activated/deactivated；不会重复执行 created、mounted，可避免重复请求接口。

# 怎么缓存当前的组件？缓存后怎么更新？说说你对 keep-alive 的理解是什么？

一、对 keep-alive 的核心理解
本质
keep-alive 是 Vue 内置抽象组件，不渲染真实 DOM，专门用于缓存不活动的组件实例，避免组件重复创建 / 销毁，大幅提升页面切换性能。
核心作用
缓存组件的实例、data 状态、DOM 结构，组件切换时不会执行 created/mounted/destroyed，只做激活 / 失活切换。
专属生命周期
activated：组件被激活 / 切回时触发（缓存组件专用）
deactivated：组件失活 / 切走时触发

关键配置属性
include：仅缓存匹配组件名的组件（字符串 / 正则 / 数组）
exclude：不缓存匹配组件名的组件
max：最大缓存数，超出用 LRU 算法（最近最少使用）淘汰旧实例
2. 路由组件缓存（最常用）
方式 1：全局缓存所有路由

```vue
<keep-alive>
  <router-view />
</keep-alive>
```

方式 2：按路由元信息精准缓存（推荐）
① 路由配置 meta 标记：

```js
// router/index.js
{
  path: '/home',
  component: Home,
  meta: { keepAlive: true } // 需要缓存
},
{
  path: '/detail',
  component: Detail,
  meta: { keepAlive: false } // 不缓存
}
```

三、缓存后如何更新数据
组件被缓存后，不会触发 mounted/created，需用以下 4 种方案更新：

1. 用 activated 钩子（首选）
每次切回缓存组件都会触发，在这里刷新数据：

```js
export default {
  activated() {
    // 切回组件时，重新请求最新数据
    this.getList()
    this.resetForm()
  }
}
```

1. watch 监听路由变化
路由参数变化时，主动更新：

```js
watch: {
  $route(to) {
    // 详情页参数变化，刷新详情数据
    if(to.path === '/detail') this.getDetail(to.params.id)
  }
}
```

# 你了解 Vue 的 diff 算法吗？虚拟 DOM 是怎么实现的？（性能核心必问）

【腾讯关注点】：会追问 diff 的时间复杂度优化（O (n)）、同层对比 + key 的作用、Vue2 双端 diff 与 Vue3 快速 diff 的区别、key 为什么不能用 index，甚至让你手写一个简易虚拟 DOM。

二、Diff 算法（性能核心）

1. 核心定义
对比新旧虚拟 DOM 树，找出差异，只更新变化的真实 DOM，不重新渲染整个页面。
2. 时间复杂度优化（必问）
原生递归全量对比：O(n³)（性能极差）
Vue Diff 优化：O(n)
优化方案：只做同层对比，不跨层比较，大幅降低计算量。
3. 核心规则：同层对比
根节点不同 → 直接销毁旧节点，新建渲染
根节点相同 → 对比属性，更新属性
子节点对比 → 依赖 key 复用节点
三、key 的作用（高频必问）
给每个虚拟 DOM 节点唯一标识
让 Diff 算法快速识别可复用的节点
避免节点错误复用，保证列表渲染正确
极大提升 Diff 算法执行效率
四、key 为什么不能用 index（坑点题）
面试直接背：列表进行增删 / 排序时，index 会跟着变，Diff 算法会错误识别节点、复用错误的 DOM，导致渲染错乱、数据不一致。必须用唯一且稳定的值（id、唯一编码）。

4. 是什么
用原生 JS 对象模拟真实 DOM 树的结构，是真实 DOM 的轻量级副本（VNode），不直接操作浏览器 DOM。
5. 怎么实现
Vue 通过 h 函数 / render 函数创建虚拟 DOM，结构固定：{ 标签名、属性、子节点、文本内容 }
6. 核心作用
避免频繁操作真实 DOM（性能极差）
跨平台支持（浏览器、小程序、桌面端）
配合 Diff 算法实现最小量更新

```js
/**
 * h 函数：创建虚拟 DOM 对象（VNode）
 * @param {string} tag - 标签名（div/span/input等）
 * @param {object} props - 属性（class/id/style等）
 * @param {string|array} children - 子节点/文本内容
 * @return {object} 虚拟DOM节点
 */
function h(tag, props = {}, children = []) {
  // 返回固定结构的虚拟DOM对象
  return {
    tag,      // 标签名
    props,    // 属性
    children, // 子节点
    text: ''   // 文本内容（子节点是字符串时赋值）
  }
}
```

# 说说你对nextTick的理解？它的实现原理是什么？（异步更新核心必问）

【腾讯关注点】：会追问nextTick的底层实现（宏 / 微任务队列）、为什么需要它、什么场景下必须用nextTick，甚至结合 Vue 的异步更新机制提问。
