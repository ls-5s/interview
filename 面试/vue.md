# 面试官：有使用过vue吗？说说你对vue的理解？

一、核心设计思想（面试官最想听的 3 点）

1. MVVM 架构（解耦核心）
把项目拆成 Model（数据层）、View（视图层）、ViewModel（Vue 实例） 三部分。
ViewModel 自动做双向绑定：数据变 → 视图自动更新；视图操作（如表单输入）→ 数据自动同步。
好处：彻底告别频繁手动操作 DOM，专注业务逻辑，代码更简洁。
2. 响应式系统（Vue 灵魂）
Vue 会自动监听数据变化，追踪依赖，数据变更时精准触发视图更新。
Vue2 用 Object.defineProperty，Vue3 用 Proxy 代理，支持对象 / 数组全量监听。
好处：不用关心视图更新逻辑，只维护数据状态，框架自动处理渲染。
3. 虚拟 DOM + Diff 算法（性能保障）
用 JS 对象模拟真实 DOM，数据更新时先对比新旧虚拟 DOM，找到最小差异。
只更新变化的节点，避免全量重绘，大幅降低 DOM 操作开销。
好处：复杂页面、大数据列表也能保持流畅。

# Vue 组件间通信方式都有哪些？

1. 父 → 子：defineProps
Vue3 组合式 API 专用，无需导入，直接声明接收父组件数据

```vue
<!-- 父组件 Parent.vue -->
<template>
  <Child :msg="message" />
</template>
<script setup>
import Child from './Child.vue'
const message = 'Vue3 父传子'
</script>

<!-- 子组件 Child.vue -->
<template>
  <p>{{ msg }}</p>
</template>
<script setup>
// 声明props，自动接收父组件传值
const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>
```

1. 子 → 父：defineEmits
Vue3 官方推荐，子触发事件，父监听接收

```vue
<!-- 子组件 Child.vue -->
<template>
  <button @click="sendData">向父组件传值</button>
</template>
<script setup>
// 声明自定义事件
const emit = defineEmits(['send-data'])
const sendData = () => {
  // 触发事件，传递参数
  emit('send-data', 'Vue3 子传父')
}
</script>

<!-- 父组件 Parent.vue -->
<template>
  <Child @send-data="handleData" />
</template>
<script setup>
import Child from './Child.vue'
// 接收子组件数据
const handleData = (val) => {
  console.log(val) // 输出：Vue3 子传父
}
</script>
```

二、跨级组件通信：provide / inject
适用于祖先 → 后代（任意层级），Vue3 组合式 API 写法

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue'
const user = ref('祖先数据')
// 提供数据
provide('userInfo', user)
</script>

<!-- 后代组件（孙子/曾孙） -->
<script setup>
import { inject } from 'vue'
// 注入数据
const userInfo = inject('userInfo')
console.log(userInfo)
</script>

```

三、兄弟组件通信
方式 1：父组件中转（最简单、推荐）

```vue
<!-- 兄弟A → 父 → 兄弟B -->
<BrotherA @send="handleData" />
<BrotherB :msg="data" />
<script setup>
import { ref } from 'vue'
import BrotherA from './BrotherA.vue'
import BrotherB from './BrotherB.vue'
const data = ref('')
const handleData = (val) => data.value = val
</script>
```

四、全局任意组件通信：Pinia（Vue3 官方首选）

```vue
// 1. 安装：npm i pinia
// 2. 定义 store：stores/user.js
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '全局共享数据'
  }),
  actions: {
    updateName(val) {
      this.name = val
    }
  }
})
vue
// 任意组件使用
<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

// 读取数据
console.log(userStore.name)
// 修改数据
userStore.updateName('新数据')
</script>
```

# 说说你对 Vue 生命周期的理解？

1. 初始化阶段
setup 本身
执行时机：组件创建之初，早于所有生命周期
作用：定义响应式数据、方法，执行初始逻辑
替代 Vue2 的 beforeCreate + created

2. 挂载阶段（最常用）
onBeforeMount
组件即将挂载到页面，DOM 还未生成，无法操作真实 DOM。
onMounted
组件挂载完成，DOM 渲染完毕。
✅ 核心场景：发送异步请求、操作 DOM、初始化定时器 /echarts/ 地图等第三方库。

3. 更新阶段
onBeforeUpdate
响应式数据更新，DOM 即将重新渲染。
onUpdated
数据更新完成，DOM 重新渲染完毕。

4. 卸载（销毁）阶段
onBeforeUnmount
组件即将卸载，核心清理时机。
✅ 核心场景：清除定时器、取消事件监听、销毁第三方实例，防止内存泄漏。
onUnmounted
组件完全卸载，实例销毁。

# Vue 中的 v-show 和 v-if 怎么理解？

v-if 和 v-show 都是控制元素显示隐藏的指令，核心区别在渲染方式和性能：
实现原理不同
v-if：真正的条件渲染，条件为 false 时，直接销毁 DOM 节点，不渲染；条件为 true 时重新创建、挂载 DOM。
v-show：基于 CSS 控制，无论条件真假，DOM 始终存在，只是切换 display: none / block 隐藏显示。
编译与性能不同
v-if 有惰性编译，初始条件为假时不会渲染，开销更小；但频繁切换会频繁创建 / 销毁 DOM，性能差。
v-show 初始就渲染 DOM，首次开销稍大，但切换开销极低，适合频繁切换。
使用场景不同
频繁切换（tab 切换、弹窗显隐、下拉菜单）→ 用 v-show
不频繁切换、权限控制、条件很少改变 → 用 v-if
额外注意（加分点）
v-if 可以搭配 v-else / v-else-if，v-show 不可以。
不建议 v-if 和 v-for 同用（v-if 优先级更高，会造成性能问题）。

# 为什么 Vue 中的 v-if 和 v-for 不建议一起用？

1. 优先级规则（关键）
Vue2：v-for 优先级 高于 v-if
Vue3：v-if 优先级 高于 v-for
2. 具体问题
Vue2 场景（性能灾难）每次渲染会先遍历循环整个列表，再执行 v-if 判断。哪怕只需要渲染 1 条数据，也会遍历全部列表，造成大量无用渲染，性能极差。
Vue3 场景（直接报错）v-if 先执行，此时 v-for 的循环变量还未定义，代码直接报错，无法渲染。
通用问题指令耦合在一起，逻辑混乱、可读性差，违背 Vue 编码规范。
3. 官方推荐解决方案（面试加分）
最优解：用 computed 计算属性 先过滤数据，再循环渲染；
<!-- 次优解：用 <template> 标签包裹，将 v-if 写在外层，分离两个指令。 -->

# 说说你对双向绑定的理解？

双向绑定就是数据变 → 视图自动更新，视图输入变 → 数据自动同步，主要用 v-model 实现。它本质是语法糖：原生元素绑定 value + input 事件；自定义组件绑定 modelValue 属性 + update:modelValue 事件。

1. 原生元素 v-model

```vue
<input v-model="msg" />
2. 自定义组件 v-model（Vue3 setup）
vue
<!-- 子组件 -->
<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<!-- 父组件 -->
<Child v-model="msg" />
```

# 说说你对 nextTick 的理解？

核心理解
nextTick 是 Vue 提供的异步方法，核心作用是：等待本次 DOM 异步更新完成后，再执行回调函数。
底层原理
Vue 采用批量异步更新策略：修改响应式数据时，Vue 不会立即更新 DOM，而是将更新操作推入异步队列，等同一事件循环内所有数据修改完成后，再统一批量更新 DOM，以此减少 DOM 操作、提升性能。nextTick 会把回调函数放入微任务队列，在 DOM 更新完成后立即执行，保证能获取到最新的 DOM 结构。
<!-- 用法（Vue3 <script setup>） -->
支持 Promise 写法，可直接用 await 更简洁。

```vue
<script setup>
import { ref, nextTick } from 'vue'
const msg = ref('旧数据')
// 1. 创建ref，绑定DOM元素
const pRef = ref(null)

const changeData = async () => {
  msg.value = '新数据'
  // 2. 用绑定的ref获取DOM（规范写法）
  console.log('DOM未更新', pRef.value.innerText)

  await nextTick()
  console.log('DOM已更新', pRef.value.innerText)
}
</script>

<template>
  <!-- 绑定ref -->
  <p ref="pRef">{{ msg }}</p>
  <button @click="changeData">修改数据</button>
</template>
```

经典使用场景（面试必说）
操作更新后的 DOM：获取最新 DOM 内容、宽高、位置；
表单操作：输入框显示后自动聚焦（input.focus()）；
第三方库渲染：ECharts、地图等依赖 DOM 尺寸的库初始化；
watch 中获取最新 DOM。

# 你知道 Vue 中 key 的原理吗？说说你对它的理解？

key 是 Vue 给虚拟 DOM 节点设置的唯一身份标识，主要配合 v-for 使用，核心服务于 Vue 的 Diff 算法。
一、底层原理
Vue 更新视图时，会通过 **虚拟 DOM（VDOM）** 对比新旧节点的差异（Diff 算法），再最小化更新真实 DOM；
key 就是每个节点的唯一 ID，Vue 会根据 key 精准判断：
新旧节点 key 相同 → 判定是同一个节点，直接复用 DOM，不销毁重建，大幅提升性能；
新旧节点 key 不同 → 判定是新节点，销毁旧 DOM、创建新 DOM；
不写 key 时，Vue 默认用数组下标 index作为 key，采用就地复用策略。
二、核心作用
提升渲染性能：精准复用 DOM 节点，减少不必要的 DOM 销毁与重建；
避免渲染错乱：防止列表增删、排序时，出现输入框内容错位、复选框状态混乱等 BUG。
三、关键禁忌（高频考点）
绝对不能用 index 作为 key因为列表增删 / 排序时，index 会随之改变，Diff 算法会误判节点，不仅失去性能优化意义，还会导致 DOM 渲染错乱。
四、最佳实践
使用列表数据中唯一、不变的值作为 key，比如后端返回的 id、uuid 等。
极简一句话总结
key 是虚拟 DOM 的唯一标识，让 Diff 算法精准识别节点、复用 DOM 提升性能，避免列表渲染错乱，必须用唯一值，不能用 index。

# 为什么 data 属性是一个函数而不是一个对象？

Vue 组件中的 data 必须是函数，目的是防止多个组件实例共享同一份数据，造成数据污染。根组件可以是对象，因为根组件只会被创建一次，无需复用。
一、底层原理
对象是引用类型如果 data 直接写成对象，当组件被多次复用（创建多个实例）时，所有实例会共用同一个内存地址的 data 对象；一个组件实例修改数据，所有实例的数据都会同步改变，出现数据混乱。
函数每次返回新对象data 写成函数时，Vue 每创建一个组件实例，就会调用一次 data 函数，返回一个全新的独立对象；每个实例拥有自己的 data 副本，数据互不干扰。
二、代码演示

1. ❌ 错误写法：data 是对象（组件复用会数据污染）

```js
// 组件定义
const MyComponent = {
  // data 是对象，所有实例共享！
  data: {
    count: 0
  },
  template: `<button @click="count++">{{ count }}</button>`
}

// 页面使用两次该组件
// 点击任意一个按钮，两个 count 都会同步增加！
<MyComponent />
<MyComponent />
```

1. ✅ 正确写法：data 是函数（数据独立，无污染）

```js
const MyComponent = {
  // data 是函数，每次返回新对象
  data() {
    return {
      count: 0
    }
  },
  template: `<button @click="count++">{{ count }}</button>`
}

// 两个组件实例数据完全独立，互不影响
<MyComponent />
<MyComponent />
```

1. Vue3 补充
选项式 API：data 依然必须是函数
<!-- 组合式 API <script setup>：直接用 ref/reactive，不存在这个问题，因为每个组件实例都会重新执行 setup -->

# Vue 中给对象添加新属性界面不刷新？

# 说说你对 SPA（单页应用）的理解？

SPA（Single Page Application）单页应用，指整个项目只有一个主 HTML 页面，初始加载完成后，后续页面切换、内容更新不再刷新整页，而是通过 JavaScript 动态渲染视图、局部更新页面，全程只在一个页面内交互。
二、核心实现原理
基于前端路由实现页面切换：
监听 URL 变化（hash 模式 / history 模式），不向服务器请求新 HTML，只匹配对应前端组件并渲染；
数据交互通过 AJAX/fetch 获取接口数据，前端负责视图渲染；
借助虚拟 DOM、组件化实现页面局部更新，提升渲染效率。
三、SPA 核心优点
用户体验极佳：页面切换无刷新、无白屏，交互流畅接近原生 APP；
前后端完全分离：后端只提供接口，前端负责路由、渲染、交互；
减轻服务器压力：服务器只返回数据，不处理页面模板渲染；
组件化复用：页面拆分为独立组件，复用性、可维护性更高。
四、SPA 核心缺点
首屏加载速度慢：需一次性加载 JS、CSS 等资源，易出现白屏；
SEO 不友好：默认只有一个空 HTML，搜索引擎爬虫难以抓取动态渲染内容；
前进 / 后退管理复杂：浏览器历史记录需前端手动维护；
内存泄漏风险高：长期单页运行，DOM 事件、定时器未清理易导致内存泄漏。

# SPA（单页应用）首屏加载速度慢怎么解决？

SPA 首屏慢的核心原因：首次加载需一次性下载全部 JS/CSS/ 静态资源，bundle 体积大、请求多，导致白屏时间长。

1. 路由懒加载（Vue/React 首选方案）
将路由对应的组件拆分成独立代码块，访问对应路由时才加载，而非首屏全量加载。Vue 实现：

```js
// import Home from '@/views/Home.vue'
// 懒加载：路由切换时才加载
const routes = [
  { path: '/home', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') }
]
```

1. 骨架屏 / Loading 优化体验
首屏白屏时展示骨架屏 / 加载动画，降低用户感知的等待时间，不是提速但优化体验。
2. HTTP 缓存优化
配置强缓存 / 协商缓存，浏览器缓存静态资源，二次访问无需重新下载。
3. 静态资源 CDN 加速
将 Vue、VueRouter、Axios、Element Plus 等第三方库改用 CDN 引入，不打包进项目 bundle，减小包体积。
html
预览
<!-- index.html 引入CDN -->
```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
```

1. 预加载 / 预连接

```html
<link rel="preload"：预加载关键资源；
<link rel="preconnect"：提前建立与服务器 / CDN 的连接。
```

1. 代码分割 & 资源压缩
Webpack/Vite 开启代码分割，拆分公共依赖（chunk 分离）；
压缩 JS/CSS/ 图片（图片转 WebP，小图片转 base64）。

# Vue 实例挂载的过程中发生了什么？

# 说说你对 Vue 的 mixin 的理解，有什么应用场景？

# 说说你对 slot 的理解？slot 使用场景有哪些？

slot 就是插槽，是 Vue 提供的组件内容分发机制。核心作用：子组件提前留出 “占位位置”，父组件可以往这个位置填充自定义的 HTML、组件或模板，让组件只封装逻辑，不固定视图，极大提升组件的复用性和灵活性。
它本质是解决组件封装太死板的问题，实现子管逻辑、父管视图的解耦。

二、3 种插槽 + 极简 Demo（Vue3 <script setup>，面试手写版）

1. 默认插槽（单区域分发）
作用：子组件留一个占位，父组件填充任意内容
子组件 Child.vue

```vue
<template>

  <div>
    <h3>子组件固定内容</h3>
    <!-- 插槽：预留占位符 -->
    <slot></slot>
  </div>
</template>
父组件使用
vue
<template>
  <Child>
    <!-- 内容自动填充到子组件的 slot 位置 -->
    <p>我是父组件传入的自定义内容</p>
  </Child>
</template>
```

1. 具名插槽（多区域分发）
作用：子组件多个占位，父组件指定名称填充（封装弹窗、布局必备）
子组件 Modal.vue（弹窗组件）

```vue
<template>

  <div class="modal">
    <!-- 具名插槽：头部 -->
    <slot name="header"></slot>
    <!-- 具名插槽：内容主体 -->
    <slot name="content"></slot>
    <!-- 具名插槽：底部 -->
    <slot name="footer"></slot>
  </div>
</template>
父组件使用
vue
<template>
  <Modal>
    <template #header>
      <h4>自定义弹窗标题</h4>
    </template>
    <template #content>
      <p>自定义弹窗内容</p>
    </template>
    <template #footer>
      <button>确认</button>
    </template>
  </Modal>
</template>
```

1. 作用域插槽（⭐面试最高频，子传数据给父）
作用：子组件把内部数据暴露给插槽，父组件可以用子组件的数据渲染（表格 / 列表封装核心）
子组件 Table.vue（通用表格）

```vue
<template>

  <div v-for="item in list" :key="item.id">
    <!-- 把子组件数据绑定到插槽，暴露给父组件 -->
    <slot :row="item"></slot>
  </div>
</template>
<script setup>
// 子组件内部数据
const list = [{ id: 1, name: 'Vue课程' }, { id: 2, name: '前端面试' }]
</script>
父组件使用
vue
<template>
  <Table>
    <!-- 接收子组件的 row 数据，自定义渲染 -->
    <template #default="{ row }">
      <span>{{ row.name }}</span>
      <button>操作按钮</button>
    </template>
  </Table>
</template>
```

封装通用 UI 组件
弹窗、卡片、抽屉、步骤条（用具名插槽，分区域定制内容）
表格 / 列表组件封装
自定义单元格、操作按钮、状态标签（用作用域插槽，最常用）

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

# Vue 常用的修饰符有哪些？有什么应用场景？

总述：修饰符是 Vue 提供的语法糖，用来简化事件、表单、组件的原生逻辑处理，不用写原生 JS 代码，更简洁优雅。
Vue 修饰符主要分事件、表单、按键、组件四类：
事件用 .stop 防冒泡、.prevent 阻默认、.once 防重复；
表单用 .lazy 懒更新、.number 转数字、.trim 去空格；
组件用 .native 绑原生事件、.sync 做双向绑定；
核心作用就是简化原生 DOM 逻辑，让代码更简洁。
一、事件修饰符
口诀：.stop 防冒泡、.prevent 阻默认、.once 防重复、.self 点自身才触发

```vue
<!-- 1. .stop 阻止事件冒泡 -->
<div @click="parent">
  <button @click.stop="child">点我不触发父级</button>
</div>

<!-- 2. .prevent 阻止默认行为 -->
<a @click.prevent="go">阻止a标签跳转</a>
<form @submit.prevent="submit">阻止表单自动刷新</form>

<!-- 3. .once 只执行一次（防重复点击） -->
<button @click.once="pay">支付仅触发一次</button>

<!-- 4. .self 只在点击自身时触发 -->
<div @click.self="close" class="mask">点击遮罩关闭，点内容不关闭</div>
```

二、表单修饰符（v-model 专用）
口诀：.lazy 懒更新、.number 转数字、.trim 去空格

```vue
<!-- 1. .lazy 失焦/回车才同步 -->
<input v-model.lazy="username" />

<!-- 2. .number 自动转数字类型 -->
<input v-model.number="age" placeholder="年龄" />

<!-- 3. .trim 自动去除首尾空格 -->
<input v-model.trim="phone" placeholder="手机号" />
```

三、按键修饰符

```vue
<!-- 回车搜索 -->
<input @keyup.enter="search" />

<!-- ESC 关闭弹窗 -->
<div @keyup.esc="closeModal"></div>
```

四、组件修饰符
口诀：.native 绑原生事件、.sync 简化双向绑定

```vue
<!-- 1. .native 给自定义组件绑定原生 DOM 事件 -->
<MyButton @click.native="handle">自定义按钮</MyButton>

<!-- 2. .sync 父子组件快速双向同步 -->
<!-- 父组件 -->
<Dialog :visible.sync="showDialog" />

<!-- 子组件关闭 -->
this.$emit('update:visible', false)
```

# 什么是虚拟 DOM？如何实现一个虚拟 DOM？说说你的思路

- 什么是虚拟 DOM？
虚拟 DOM 就是用一个普通的 JavaScript 对象，来模拟真实 DOM 节点的结构。它不是真正的 DOM，而是真实 DOM 的轻量级 “映射副本”。
性能优化：避免频繁、零散操作真实 DOM 引发的重绘 / 重排，通过 diff 算法找到最小差异，批量、精准更新。
- 如何实现一个虚拟 DOM（核心思路：3 步）？

1. 定义 VNode 结构（创建虚拟节点）
用 JS 对象描述 DOM 节点，固定结构：

```js
// 虚拟 DOM 节点（VNode）
const vnode = {
  tag: 'div', // 标签名
  props: { id: 'box', class: 'container' }, // 属性/事件
  children: [ // 子节点
    { tag: 'p', text: '我是文本', children: [] }
  ]
}
```

1. 实现 render 方法（VNode → 真实 DOM）
递归把虚拟节点转成真实 DOM 元素，挂载到页面：
创建元素 document.createElement(tag)
遍历 props 设置属性 / 事件
递归渲染子节点 children
追加到容器 appendChild
2. 实现 diff + patch（对比差异→更新 DOM）
diff：对比新旧 VNode，找出节点类型、属性、文本、子节点的差异。
patch：根据差异最小化更新真实 DOM（增 / 删 / 改属性 / 改文本），不重新渲染整个树。

虚拟 DOM 是JS 对象模拟 DOM 树，实现思路就是：先造虚拟节点 → 转真实 DOM → diff 找差异 → 批量更新，核心是减少 DOM 操作、跨平台、数据驱动。

# 你了解 Vue 的 diff 算法吗？说说看

Vue diff 算法是对比新旧两棵 VNode 虚拟节点树，找出差异并最小化更新真实 DOM的算法。它借鉴了传统 diff，但做了极致简化：只做同层级对比，不跨层级比较。
传统完整 diff 时间复杂度：O(n³)（不可用）
Vue 优化后：O(n)（线性复杂度，性能极高）

二、核心前提：只同层比较
Vue 认为DOM 跨层级移动操作极少，所以直接规定：
只对比同一层级的 VNode
层级不同 → 直接销毁旧节点、创建新节点，不做复用
这是 Vue diff 快的根本原因。

三、判断两个 VNode 是否 “相同节点”
diff 第一步：先判断新旧节点是不是同一个，不是就直接替换。判断依据（必须同时满足）：
key 相同
tag 标签名相同
都是注释 / 文本节点，或 data 结构一致
不满足 → 直接 patch 替换整个 DOM。
满足 → 继续深度对比子节点（核心 diff 逻辑）。

```js
function sameVNode (a, b) {
  return (
    a.key === b.key &&              // 1. key 必须完全相同
    a.tag === b.tag &&              // 2. 标签名必须相同
    a.isComment === b.isComment &&  // 3. 注释节点状态一致
    isDef(a.data) === isDef(b.data) &&//4. 都有data/都没data（属性、指令、事件）
    sameInputType(a, b)             // 5. input 类型必须一致（特殊处理）
  )
}
```

# Vue 项目中有封装过 axios 吗？主要是封装哪方面的？

封装过，axios 是 Vue 项目标配的请求库，封装核心是统一规范、简化调用、统一处理异常与权限，主要封装以下几方面：
一、基础公共配置
统一设置 baseURL（区分开发 / 生产环境）、请求超时时间 timeout、默认请求头 Content-Type，避免每个接口重复配置。
二、请求拦截器封装
统一在请求头添加 token（身份鉴权）
开启全局 loading 加载动画
格式化请求参数、处理请求签名 / 加密
过滤无效请求参数
三、响应拦截器封装
统一剥离响应数据（直接返回 res.data，不用每层取）
处理业务状态码：如 token 过期 / 无效，自动跳转登录页
关闭全局 loading
四、全局统一错误处理
HTTP 状态码错误：400/401/403/404/500 统一提示
网络错误、请求超时统一捕获
业务异常码统一弹窗提示，无需每个接口单独处理
五、进阶优化封装（面试加分）
重复请求拦截：防止按钮重复点击发送多次请求
请求取消：使用 CancelToken 取消冗余请求（如页面切换）
接口统一管理：按业务模块拆分 API 文件，统一导出调用
文件上传 / 下载、表单请求单独封装

# Vue 项目中你是如何解决跨域的呢？

```js
// 导出 Vite 项目的核心配置对象
export default {
  // 开发服务器配置（仅开发环境生效，打包后失效）
  server: {
    // 代理配置：解决前端开发环境跨域问题的核心
    proxy: {
      // 匹配规则：所有以 /api 开头的接口请求，都会走这个代理
      '/api': {
        // 目标地址：后端真实的接口服务器地址
        target: 'http://后端接口地址:8080',
        // 核心配置：开启跨域代理
        // 作用：伪造请求源，让后端认为请求来自本地，而非前端跨域请求
        changeOrigin: true
      }
    }
  }
}
```

# Vue 要做权限管理该怎么做？如果控制到按钮级别的权限怎么做？

一、Vue 项目整体权限管理怎么做？
核心方案：动态路由 + 全局路由守卫，实现页面级权限控制
路由拆分
将路由分为两类：
静态路由：登录页、404、首页等无需权限的公共页面
动态路由：需要权限校验的业务页面（如用户管理、订单管理）
获取权限
用户登录后，后端返回用户角色（role） 或权限标识列表（permissions），存入 Pinia/Vuex 全局管理。
动态过滤路由
根据用户的权限，从动态路由表中筛选出该用户可访问的路由。
动态挂载路由
通过 router.addRoute() 动态将筛选后的路由添加到路由器中。
全局守卫拦截
在全局路由守卫中判断用户是否有权限访问页面：
有权限 → 正常访问
无权限 → 跳转到 403 无权限页或登录页

二、如果控制到按钮级别权限怎么做？（高频必问）
企业主流方案：自定义指令 + 权限标识判断，精准控制按钮显隐 / 禁用

1. 核心原理
后端返回按钮级权限字符串（如 user:add、user:edit、user:delete），前端通过指令判断是否拥有该权限。
2. 具体实现（最常用：自定义指令 v-permission）
全局注册自定义权限指令

```js
// main.js 全局注册
app.directive('permission', (el, binding) => {
  // 从Pinia/Vuex中获取用户的权限列表
  const userPerms = store.state.permissions
  // 获取按钮上绑定的权限标识
  const needPerm = binding.value
  // 如果没有权限，直接隐藏按钮
  if (!userPerms.includes(needPerm)) {
    el.style.display = 'none'
    // 也可以用 el.parentNode.removeChild(el) 彻底移除DOM
  }
})
```

页面使用

```vue
<!-- 有 user:add 权限才显示新增按钮 -->
<button v-permission="'user:add'">新增用户</button>
<!-- 有 user:edit 权限才显示编辑按钮 -->
<button v-permission="'user:edit'">编辑用户</button>
```

1. 备选方案：函数式判断
封装权限判断方法，用 v-if 控制：

```vue
<button v-if="hasPermission('user:delete')">删除用户</button>
```

三、面试极简背诵版（30 秒说完）
页面权限：用动态路由 + 全局路由守卫，登录后获取用户权限，过滤并动态挂载可访问路由，无权限则拦截。
按钮权限：通过全局自定义指令 v-permission 实现，后端返回按钮权限标识，指令判断权限并控制按钮显隐，精准实现按钮级控制。

# Vue3 有了解过吗？能说说跟 Vue2 的区别吗？
