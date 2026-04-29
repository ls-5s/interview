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
一、核心理解（开场一句话）
nextTick 是 Vue 提供的核心 API，用于等待本次数据更新引发的 DOM 渲染完成后，再执行回调函数，保证我们能拿到最新、真实的 DOM 节点。
二、为什么必须要有 nextTick？（核心考点）
Vue 的响应式更新是异步的：数据发生变化时，Vue 不会立刻更新 DOM，而是把更新操作放进异步更新队列，等同一事件循环里的所有数据变更都完成后，再批量一次性更新 DOM。
如果不使用 nextTick，立刻获取 DOM 拿到的还是更新前的旧节点，拿不到最新内容。
三、实现原理（宏 / 微任务，腾讯必追问）
核心逻辑nextTick 会把回调函数放入任务队列，优先使用微任务，降级使用宏任务，保证在 DOM 更新后执行。
优先级顺序（Vue3 为主）
首选：Promise.then（微任务）
降级：MutationObserver（微任务）
兜底：setImmediate / setTimeout（宏任务）
为什么优先微任务？
微任务执行优先级更高，在浏览器渲染前就会清空队列，能避免多次触发浏览器重绘，性能远优于宏任务。
四、典型使用场景（必须会说）
v-if 控制 DOM 显示后，获取该 DOM 节点
获取更新后 DOM 的尺寸、位置（offsetWidth、scrollTop）
初始化依赖真实 DOM 的第三方库（ECharts、地图、富文本）
父子组件通信后，操作子组件最新 DOM
五、结合 Vue 异步更新机制（完整流程）
数据修改 → 触发响应式更新
组件更新任务加入异步队列
nextTick 回调加入微任务队列
主线程执行完毕 → 清空微任务队列
批量更新 DOM 完成 → 执行 nextTick 回调

# 你知道 vue 中 key 的原理吗？为什么列表渲染必须用 key？（diff 算法延伸必问）

【腾讯关注点】：会追问 key 的 diff 逻辑、用 index 作为 key 会有什么问题（列表更新异常、组件状态混乱）、Vue 中 key 的设计目的。

一、key 的核心原理（diff 算法核心）
key 是 Vue 为每个虚拟 DOM 节点（VNode） 设置的唯一标识。Vue 的 diff 算法做同层子节点对比时，会通过 key 快速匹配新旧 VNode：
找到相同 key 的节点 → 直接复用节点，只更新变化的属性 / 内容
找不到相同 key → 销毁旧节点、新建节点渲染
本质是帮 diff 算法精准定位节点，避免盲目对比和 DOM 操作。
二、为什么列表渲染必须用 key？
保证列表渲染正确性
没有 key，diff 算法只能按下标顺序暴力对比，列表增删 / 排序时极易出现节点错乱、渲染异常。
极大提升 diff 性能
通过 key 快速复用节点，减少真实 DOM 的销毁与重建，批量列表更新性能提升显著。
保留组件自身状态
比如输入框、复选框的状态，靠 key 精准匹配才能正确保留。
三、用 index 作为 key 会出什么问题？（腾讯必坑点）
绝对不能用 index 做 key！列表执行删除、新增、排序时，数组下标 index 会跟着动态改变，导致：
diff 算法错误匹配节点，出现复选框选中错位、输入框内容混乱、组件状态异常
节点无法正确复用，失去 key 优化性能的意义
极端情况会引发页面渲染 bug、数据不一致
正确做法：用后端返回的唯一 id、uuid 等稳定不变的唯一值。
四、key 的设计目的（一句话收尾）
为虚拟 DOM 节点提供唯一标识，辅助 diff 算法高效、精准地完成节点对比与复用，既保证列表渲染正确，又优化更新性能。

# Vue 中给对象添加新属性界面不刷新？为什么？怎么解决？

一、为什么界面不刷新？（Vue2 响应式缺陷根源）
Vue2 是基于 Object.defineProperty() 劫持对象已有属性的 get/set 实现响应式的。新增的属性没有被劫持，没有对应的 getter/setter，数据变化时无法触发依赖收集和视图更新，所以页面不会刷新。
二、怎么解决？（Vue2 三种方案，背前两个即可）
this.$set() / Vue.set()（官方标准方案）
js
this.$set(this.obj, 'newKey', '新值')
直接替换整个对象（简单粗暴）
利用响应式更新整个对象：
js
this.obj = { ...this.obj, newKey: '新值' }
this.$forceUpdate()（强制刷新，不推荐）
强制组件重新渲染，性能差，尽量不用。
三、$set 实现原理（面试官追问必答）
为新增属性手动调用 Object.defineProperty() 定义响应式劫持
触发该对象的依赖更新，通知视图重新渲染
本质就是手动给新属性补上响应式能力。
四、Vue3 如何彻底解决？
Vue3 使用 Proxy 代理整个对象，而非劫持单个属性：
能天然监听对象新增属性、删除属性、数组下标修改等所有操作
不需要 $set，直接赋值就能触发视图更新
从根源上解决了 Vue2 的响应式缺陷。

# 为什么 Vue 组件的 data 属性必须是一个函数而不是对象？（基础细节必问）

【腾讯关注点】：会追问对象和函数的区别、组件复用带来的状态污染问题，甚至让你举例子说明对象形式的 data 会引发什么 bug。
一、核心一句话结论
组件会被多次复用 / 实例化，data 必须是函数，是为了让每个组件实例拥有独立、隔离的数据副本，避免多个组件共用一份数据导致状态污染。
二、根本原因：对象是引用类型（腾讯追问核心）
如果 data 直接是对象对象属于引用类型，多个组件实例会共用同一个内存地址的对象。一个组件修改数据，所有复用的组件数据都会同步变化，出现严重的状态混乱。
如果 data 是函数每次创建组件实例时，都会调用一次函数，返回一个全新的对象。每个实例的 data 都是独立副本，互不干扰，数据完全隔离。
三、举个直白例子（面试官让举例就说这个）
写一个计数器组件：
data 为对象（错误）
页面使用 2 个计数器组件，点击其中一个 + 1，两个计数器数字会一起变，因为共用同一个 data 对象。
data 为函数（正确）
两个计数器各自独立，点击自己只改自己的数字，互不影响。
四、特殊情况：根组件为什么可以是对象？
根组件在整个应用中只会实例化一次，不存在复用、多个实例的情况，所以不会有状态污染，data 可以直接写对象。
五、面试极简背诵版
因为组件会被复用，对象是引用类型，直接用会让多个组件实例共享同一份数据，导致状态污染；data 写成函数，每次实例化都会返回新的独立对象，保证每个组件数据隔离互不影响；只有根组件可直接用对象，因为只实例化一次。

# Vue 中的v-show和v-if怎么理解？区别是什么？为什么不建议和v-for一起用？（性能优化必问）

【腾讯关注点】：会追问两者的底层实现（控制 display vs 控制 DOM 存在）、适用场景、性能对比，以及v-if和v-for一起用的性能浪费问题，如何优化。
一、核心理解与底层区别

1. v-if（真正的条件渲染）
底层：控制 DOM 是否存在，条件为 false 时直接销毁 / 不创建 DOM 节点
特性：惰性渲染，初始条件为假时不执行任何渲染
性能：切换开销大，首次渲染开销小
2. v-show（显示隐藏控制）
底层：DOM 始终渲染，仅通过 CSS display: none / block 控制显示隐藏
特性：无论条件真假，都会渲染 DOM
性能：切换开销小，首次渲染开销大
3. 一句话对比
v-if 管 DOM 死活，v-show 管 CSS 显示
二、适用场景
频繁切换（tab 切换、展开收起）→ 用 v-show
很少切换（权限控制、初始条件渲染）→ 用 v-if
三、为什么不建议 v-if 和 v-for 一起用？（性能必问）
核心原因：优先级问题 + 性能浪费
优先级：Vue 中 v-for 优先级 高于 v-if
执行逻辑：会先遍历整个列表所有节点，再逐个判断 v-if 条件
后果：哪怕大部分节点不需要渲染，也会先完整循环，造成不必要的遍历与虚拟 DOM 生成，严重浪费性能
额外问题：容易导致 key 匹配混乱、渲染异常
四、优化方案（面试官必问怎么改）
方案 1：使用计算属性 computed 提前过滤数据（最优）
先过滤出符合条件的数据，再对结果做 v-for，只循环需要渲染的项

```vue
<template>

  <div v-for="item in filterList" :key="item.id">{{ item.name }}</div>
</template>

<script setup>
const list = ref([...])
const filterList = computed(() => list.value.filter(item => item.flag))
</script>
```

<!-- 方案 2：外层包裹 <template> 做 v-if 判断 -->
先判断整体条件，再执行循环，避免无效遍历

```vue
<template v-if="showList">
  <div v-for="item in list" :key="item.id">{{ item.name }}</div>
</template>
```

面试万能总结
v-if 控制 DOM 销毁 / 创建，v-show 控制 display 显隐；频繁切换用 v-show，否则用 v-if；禁止同用是因为 v-for 优先级更高，会全量循环造成性能浪费，优化用 computed 过滤数据 或 外层 template 先判断再循环。

# Vue 项目中你是如何解决跨域的呢？（高频，工程化基础）

【腾讯关注点】：会追问跨域的原理、常见解决方案（proxy 代理、CORS、JSONP）、你在项目中用的哪种方式、不同方式的适用场景和优缺点。

```js
// vue.config.js 核心配置
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://后端接口域名:端口',
        changeOrigin: true, // 开启跨域
        pathRewrite: { '^/api': '' }
      }
    }
  }
}


Access-Control-Allow-Origin: http://localhost:8080 （允许的前端地址）
Access-Control-Allow-Methods: GET,POST,PUT,DELETE （允许的请求方式）
Access-Control-Allow-Headers: Content-Type,token    （允许的请求头）
Access-Control-Allow-Credentials: true              （允许携带Cookie）
```

# Vue 项目中你是如何封装 axios 的？主要封装了哪些方面？（高频，项目实践）

【腾讯关注点】：会追问封装的细节（请求 / 响应拦截器、统一错误处理、请求取消、baseURL、超时配置）、如何处理 token 和刷新 token、不同环境的配置区分。

基础配置：统一设置 baseURL、请求超时时间、默认请求头
多环境区分：开发 / 测试 / 生产环境自动切换接口地址
请求拦截器：全局携带 Token、开启加载动画
响应拦截器：统一解构数据、关闭加载、处理业务状态码
全局错误处理：网络错误、401/403/500、Token 过期自动处理
安全配置：请求取消（防止重复请求）、凭证携带

```js
import axios from 'axios'
import { ElMessage } from 'element-plus' // 项目UI库提示

// 1. 创建axios实例
const service = axios.create({
  // 基础路径：自动区分环境（开发/生产）
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000 // 超时时间
})

// 2. 请求拦截器（核心：携带Token）
service.interceptors.request.use(
  config => {
    // 从本地存储拿Token，全局携带
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token 
    }
    return config
  },
  error => Promise.reject(error)
)

// 3. 响应拦截器（核心：统一处理数据+错误）
service.interceptors.response.use(
  response => {
    // 统一解构后端返回数据
    const res = response.data
    // 业务状态码判断（后端约定：200=成功）
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res // 直接返回有效数据
  },
  error => {
    // 全局错误处理
    const { status } = error.response || {}
    // 401：Token过期/未登录 → 跳登录
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.clear()
      location.href = '/login'
    }
    // 500：服务器错误
    else if (status === 500) {
      ElMessage.error('服务器异常')
    } else {
      ElMessage.error('网络请求失败')
    }
    return Promise.reject(error)
  }
)

export default service
```

# Vue 组件间通信方式都有哪些？分别适用于什么场景？（高频，组件设计）

【腾讯关注点】：会追问不同通信方式的优缺点（props/$emit、eventBus、vuex/pinia、provide/inject）、跨级通信的方案、大型项目中如何选择合适的通信方式。

1. props / $emit（最基础，父子组件首选）
用法：父组件通过 props 向子组件传值；子组件通过 $emit 触发事件向父组件传值
适用场景：直系父子组件直接通信
优点：简单直观、遵循单向数据流，便于追踪数据流向，官方推荐
缺点：仅支持父子，跨级通信需逐层传递，代码冗余
2. provide /inject（跨级通信 ✅ 爷孙 / 深层嵌套）
祖先组件（顶层提供数据）

```vue

<script setup>
import { provide, ref } from 'vue'
const msg = ref('祖先组件数据')
provide('globalMsg', msg)
</script>
```

后代组件（任意层级注入）

```vue
<script setup>
import { inject } from 'vue'
// 直接获取，无需逐层传递
const msg = inject('globalMsg')
</script>
```

1. Pinia（全局状态管理 ✅ 大型项目首选）
1. 定义 store
js
// stores/user.js
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({ name: '全局用户名' }),
  actions: {
    setName(val) { this.name = val }
  }
})

```vue
<!-- 父组件 App.vue -->
<template>
  <BrotherA @send="getMsg" />
  <BrotherB :msg="brotherMsg" />
</template>

<script setup>
import { ref } from 'vue'
import BrotherA from './BrotherA.vue'
import BrotherB from './BrotherB.vue'

// 接收哥哥传来的值，再传给弟弟
const brotherMsg = ref('')
const getMsg = (val) => {
  brotherMsg.value = val
}
</script>
```

# Vue3 有了解过吗？说说跟 Vue2 的区别？（高频，技术迭代）

【腾讯关注点】：会追问响应式方案的变化、Composition API vs Options API、性能优化（diff 算法、编译优化）、新特性（Teleport、Suspense），以及你是否在项目中使用过 Vue3。
一、响应式方案（最核心差异）
Vue2：基于 Object.defineProperty 劫持对象单个属性
缺陷：监听不到对象新增 / 删除属性、数组下标 /length 修改，需用 $set、重写数组方法弥补。
Vue3：基于 Proxy 代理整个对象
优势：可监听对象 / 数组所有操作（新增、删除、下标修改），无需兼容写法；且是懒劫持，仅访问属性时才监听，性能更高。
二、API 设计模式
Vue2 Options API：按选项拆分代码（data/methods/computed）
问题：复杂逻辑分散在不同选项，复用和维护困难，复用只能靠 mixin（易冲突、来源不明）。
Vue3 Composition API：按业务逻辑聚合代码
优势：逻辑可封装为独立 hooks 复用，代码可读性 / 可维护性大幅提升；完美支持 TypeScript，类型推导更友好。
三、性能优化（面试官重点问）
编译优化
新增 patchFlag 标记动态节点、静态提升、事件缓存，diff 算法只对比动态内容，跳过静态节点，渲染效率提升。
虚拟 DOM 优化
重写 diff 算法，减少无效对比；支持 Fragment 碎片，组件无需根节点。
打包体积
更好的 tree-shaking 支持，未使用的 API 会被剔除，打包体积更小。
四、新增 / 移除特性
新增
Teleport（传送门）：将组件渲染到指定 DOM 节点（如弹窗挂载到 body，避免层级遮挡）；
Suspense：支持异步组件加载，展示 loading / 错误兜底；
组合式函数、defineProps/defineEmits 语法糖。
移除
移除 $on/$off 事件总线、过滤器、mixin 推荐度降低；
废弃 new Vue() 创建实例，改用 createApp。
五、生态与工程化
Vue2 配套：Vue CLI、Vuex；
Vue3 配套：Vite（极速构建）、Pinia（替代 Vuex，更简洁）。
响应式：Vue2 用 defineProperty 劫持属性，有监听缺陷；Vue3 用 Proxy 代理对象，无兼容问题且性能更好。
API：Vue2 是选项式，逻辑分散；Vue3 组合式，按逻辑聚合，复用性强、TS 友好。
性能：编译优化 + diff 优化，只更新动态节点，体积更小。
新特性：多根节点、Teleport、Suspense，配套 Vite+Pinia。
项目中用 Vue3 做过实际开发，组合式和响应式体验更好。

# 说说你对 SPA（单页应用）的理解？首屏加载速度慢怎么解决？（高频，性能优化）

【腾讯关注点】：会追问 SPA 的优缺点、首屏优化的具体方案（路由懒加载、代码分割、CDN、Gzip、预渲染 / SSR）、你在项目中实际用了哪些优化手段，效果如何。

SPA（Single Page Application）单页应用，就是整个项目只有一个主 HTML 文件，页面切换不刷新浏览器，通过前端路由（hash /history 模式） 匹配组件，由 JS 动态渲染虚拟 DOM 来更新视图，实现无刷新的页面交互。
核心特点：一次加载、局部更新、前端控制路由。

- 优点
页面切换无刷新，用户体验流畅，减少服务器请求压力；
前后端完全分离，前端负责视图渲染，后端只提供接口；
组件化复用程度高，适合中后台系统、交互密集型 Web 应用。
- 缺点
首屏加载慢、白屏时间长（所有 JS/CSS 资源首次一次性加载）；
SEO 不友好，搜索引擎爬虫无法抓取 JS 渲染的内容；
首次加载资源体积大，弱网环境体验差。
三、首屏加载慢的解决方案（可落地、面试官最爱）

1. 路由懒加载（最核心、必用）
把路由对应的组件拆分成独立代码块（chunk），访问时才加载，不堆在首屏。Vue 中写法：
js
const Home = () => import('@/views/Home.vue')
2. 代码分割 + Tree-Shaking
拆分第三方依赖（Element Plus、Axios 等），不打包进主入口；
剔除项目中未使用的代码，减小打包体积。
3. 静态资源 CDN 加速
将 Vue、VueRouter、Pinia 等基础库改用 CDN 引入，不参与打包，大幅减少主包体积，同时利用 CDN 缓存加速。
4. 开启 Gzip 压缩
Nginx 或构建工具配置 Gzip，JS/CSS/HTML 压缩后体积可减少 60%~70%，加载速度显著提升。
5. 静态资源优化
图片压缩、图片懒加载、小图转 base64；
移除 console.log、注释、冗余代码。
6. 预渲染 / SSR（解决首屏 + SEO）
预渲染：构建时直接生成首屏静态 HTML，成本低、见效快，适合常规项目；
SSR 服务端渲染：服务端直出 HTML，彻底解决首屏慢和 SEO，但部署成本更高。
7. 骨架屏优化体验
首屏展示骨架屏，降低用户对白屏的感知，视觉体验更友好。

# vue 项目本地开发完成后部署到服务器后报 404 是什么原因？怎么解决？（高频，部署实践）

【腾讯关注点】：会追问路由模式（hash vs history）的区别、history 模式下服务器配置问题、Nginx 的配置方案，考察你对 SPA 部署的理解。
一、核心原因（一句话）
99% 是因为使用了 Vue Router 的 history 路由模式Vue 是 SPA 单页应用，项目里只有 1 个 index.html 入口文件；history 模式的路径是 /home /user 这种无 # 格式，刷新 / 直接访问子路由时，服务器会去查找真实的文件，但根本没有这个文件，直接返回 404。
二、补充：两种路由模式的区别（面试官必追问）
表格
模式 地址格式 部署是否会 404 优点
hash <http://xxx/#/home> ❌ 不会 兼容性极好，部署零配置，永远不 404
history <http://xxx/home> ✅ 会 URL 干净美观，符合标准，但必须服务器配置兜底
三、终极解决方案（Nginx 配置，腾讯必考）
核心思路：让服务器把所有请求，都转发给 Vue 的 index.html，交给前端路由处理。
最简 Nginx 配置（直接复制给运维 / 自己部署）
nginx
server {
  listen 80;
  server_name 你的域名;

<!-- # 项目部署目录 -->

  root /usr/share/nginx/html;
  index index.html;
<!-- 
# 关键配置：所有请求都返回 index.html，解决 404 -->

  location / {
    try_files $uri $uri/ /index.html;
  }
}
其他服务器极简方案
Apache：配置 .htaccess 兜底
Tomcat：配置 web.xml 指向 index.html
主流云服务（OSS/CDN）：开启「SPA 模式」一键解决
四、临时应急方案（不想改配置）
直接把路由模式改回 hash 模式，重启打包部署，立刻解决 404。
极简背诵版（30 秒面试口述）
部署后 404 核心是用了 history 路由，SPA 只有一个 index.html，服务器找不到子路由对应的真实文件；
hash 模式带 #，不会传给服务器，所以不报错；history 模式 URL 美观，但必须服务器配置；
解决方法：Nginx 加 try_files $uri $uri/ /index.html，让所有请求都指向入口 html，交给前端路由处理即可。

# Vue 要做权限管理该怎么做？控制到按钮级别的权限怎么实现？（高频，业务落地）

【腾讯关注点】：会追问权限管理的整体方案（路由权限 + 按钮权限）、按钮级权限的实现方式（自定义指令 / 组件封装）、如何和后端接口配合，甚至会让你手写一个简单的权限指令。
