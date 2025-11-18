一边http,一边vue,一边复习js,css
# 11.10
## 面试官：v-show和v-if有什么区别？使用场景分别是什么？
**差别**
- 渲染机制不一样
**v-show**:是条件显示：无论条件为 true 还是 false，元素始终会被渲染到 DOM 中，只是通过 CSS 的 display 属性控制显示（display: block）或隐藏（display: none）。
**v-if**：是条件渲染：当条件为 false 时，元素不会被渲染到 DOM 中（相当于从 DOM 树中移除）；只有条件为 true 时，才会创建元素并插入 DOM。

- 性能开销不同
**v-if**：有更高的切换开销：每次条件变化时，会触发元素的创建 / 销毁（包括内部子组件的生命周期、事件监听器的绑定 / 解绑），适合条件不频繁切换的场景。
**v-show**：有更高的初始渲染开销：因为无论条件如何，元素都会被渲染，但其切换开销极低（仅修改 CSS），适合条件需要频繁切换的场景。

- 语法限制不同
**v-if**： 可以和 v-else、v-else-if 搭配使用，形成条件分支逻辑（需相邻摆放，否则失效）。
**v-show** 不支持 v-else，只能单独使用。

- 批量渲染
v-if 可以直接作用于标签（用于 “分组条件渲染”，避免额外 DOM 节点），比如：
```vue
<template v-if="flag">
  <div>内容1</div>
  <div>内容2</div>
</template>
```
但 v-show不能作用于（因为本身不会被渲染为真实 DOM，而 v-show 依赖修改 DOM 的display属性）。

**使用场景**
**v-if**：当条件很少变化
- 如权限控制：未登录用户看不到 “个人中心” 按钮

**v-show**:频繁切换显示 / 隐藏
- 如 tabs 标签切换、弹窗的显示 / 隐藏

## 面试官：SPA首屏加载速度慢的怎么解决？
- 什么是首屏加载
首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

- 加载慢的原因

================================================

网络延时问题
资源文件体积是否过大
资源是否重复发送请求去加载了
加载脚本的时候，渲染内容堵塞了
 
===============================================

- 解决方案

===============================================

- 减小入口文件体积(采用动态加载路由的形式)
常用的手段是路由懒加载，把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加
```vue
routes:[ 
    path: 'Blogs',
    name: 'ShowBlogs',
    component: () => import('./components/ShowBlogs.vue')
]
以函数的形式加载
```
以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件

- 使用SSR
SSR（Server side ），也就是服务端渲染，组件或页面通过服务器生成html字符串，再发送到浏览器
从头搭建一个服务端渲染是很复杂的，vue应用建议使用Nuxt.js实现服务端渲染

- 图片资源的压缩
图片资源虽然不在编码过程中，但它却是对页面性能影响最大的因素
对于所有的图片资源，我们可以进行适当的压缩
对页面上使用到的icon，可以使用在线字体图标，或者雪碧图，将众多小图标合并到同一张图上，用以减轻http请求压力。

- 组件重复打包

假设A.js文件是一个常用的库，现在有多个路由使用了A.js文件，这就造成了重复下载
解决方案：在webpack的config文件中，修改CommonsChunkPlugin的配置
```js
minChunks: 3
```
minChunks为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

- UI框架按需加载
- 开启GZip压缩



==============================================

## 如果前端要接受很多图片资源，你该如何让优化？

## 面试官：说说你对keep-alive的理解是什么？
定义：keep-alive它是一个内置组件，作用:缓存包裹的组件实例，避免组件在切换时被频繁创建和注销，提高页面的性能并保留组件状态

=================================================

**核心作用**
- 缓存组件实例: 被keep-alive 包裹的组件，在第一次渲染后被缓存到内存中，后续切换时不会重新执行初始化（如created、mounted等钩子），而是直接复用缓存的实例。
- 保留组件状态：例如表单输入内容、列表滚动位置等状态，在组件切换后不会丢失。
- 优化性能： 减少DOM 操作和组件初始化开销，尤其适合频繁切换的场景（如标签页、路由切换）
  
**使用场景**
- 列表页 → 详情页：返回列表页时保持之前的滚动位置和筛选状态。
- 多标签页切换：缓存每个标签页的内容，避免重复加载。
- 表单页面：切换到其他页面后返回，保留已输入的表单数据。

**实现原理**
keep-alive 本质是一个抽象的组件(不会渲染DOM元素)
1. 组件首次渲染时，将组件实例存入内部缓存对象,并记录键名
2. 当组件再次渲染，直接从缓存中读取实例，跳过初始化过程
3. 当组件被影藏(如切换到其他组件)，会被标记为缓存状态
**核心属性**
- include：指定需要缓存的组件（值为字符串、正则、数组，匹配组件name）。
- exclude：指定不需要缓存的组件（规则同include，优先级高于include）。
- max：限制缓存的组件实例数量（类型为 Number），超出时会删除 “最久未使用” 的实例（LRU 策略）。

**注意事项**
仅对动态组件（<component :is="xxx">）或路由组件（配合<router-view>）有效。
缓存的组件若依赖外部数据变化，需在activated中手动更新（避免显示旧数据）。
若组件内有定时器、事件监听等，需在deactivated中清除（避免内存泄漏）。

## 面试官：你知道vue中key的原理吗？说说你对它的理解 ?
帮助 Vue 的虚拟 DOM Diff 算法更高效、更准确地识别节点的变化
**核心原理：**
Vue在跟新DOM 时，会通过虚拟DOM diff 对比新老虚拟节点树的差异，在映射到真的DOM上
key的作用是让Vue 能快速判断两个节点是否是同一个节点。
- 如果两个节点的key不同，Vue 会判断他们不是同一个节点，会销毁老的节点创建新的节点
- 如果key是一样的，而且标签名也相同，Vue会认为他们是同一个节点，进度只跟新节点的内容，
避免重新创造DOM 元素
**为什么需要key?**
我这边就直接举一个例子吧
有一个列表[A,B,C],渲染为三个输入框，用户A的输入框输入了内容，如果删除A,列表变成了[B,C]
- 没有key时，Vue 会复用原来的第一个节点(A的位置来渲染B),第二个节点（B 的位置）渲染 C。这会导致 A 输入框的内容被错误地 “继承” 到 B 的输入框中（因为节点被就地复用了）。
- 有key的话，假如A，B,C 的key 分别为1，2，3 ，Vue 会识别到key=1的节点被删除，key=2和key=3的节点需要保留并移动位置，输入框的状态会正确保留。
**key的正确使用方式**
- 用唯一且稳定的标识作为Key：通常是后端返回的id
- 避免使用index作为key:如果列表发生排序，删除等问题，index会发生改成(比如删除第一个元素，后面元素的index都会减 1),导致key失效。此时 Vue 会认为节点被替换，反而会增加 DOM 操作，降低性能，甚至重现 “就地复用” 的问题。
# 11.11
## 面试官：什么是虚拟DOM？如何实现一个虚拟DOM？说说你的思路
**什么是虚拟的DOM?**
- 本质：它是一个真实DOM 节点 的js 对象，包含节点的标签名，属性，子节点，key等核心信息。
- 作用：作为数据和真实DOM 之间是中间层，避免直接频繁操作真实DOM(真实 DOM 操作耗时且耗性能)。
- 核心流程： 数据更新 → 生成新虚拟 DOM → 与旧虚拟 DOM 对比（diff）→ 只把差异同步到真实 DOM。
**如何实现一个虚拟DOM**
- 定义VNode 结构(虚拟节点的数据模型)
tag：节点标签名（如 div、span）。
props：节点属性（如 class、style、onClick）。
children：子节点数组（可能是 VNode 或文本节点）。
key：节点唯一标识（用于 diff 算法）。
text：文本节点内容（若为文本节点）。
el：对应的真实 DOM 元素（用于后续挂载 / 更新）。
- 实现render 函数(VNode -> 真实DOM)
将 VNode 对象转换为真实 DOM 元素，挂载到页面上：
若为文本节点：直接创建文本 DOM（document.createTextNode）。
若为元素节点：创建对应标签的 DOM（document.createElement），递归处理子节点并挂载。
- 实现 diff 算法（对比新旧 VNode，找差异）
- 实现 patch 函数（应用差异到真实 DOM）
根据 diff 算法找到的差异，修改真实 DOM：

## 你对SPA单页面的理解，它的优缺点分别是什么？如何实现SPA应用呢
**定义**：SPA,他是前端应用的架构模式，核心特点是整个应用页面只加载一个主的HTML 页面，后面内容的切换
数据的跟新通过JavaScript 动态渲染DOM 完成，无需重新请求和加载HTML页面。
**对于spa的核心理解**
- 核心逻辑："前端路由 + 动态试图渲染"
- 初始加载时，浏览器请求并加载唯一的主页面（如index.html），同时加载应用所需的 JavaScript、CSS 等资源；
- 当用户页面跳转，前端路由拦截URL变化，不向服务器发送新的页面请求。
- 前端框架（如 Vue、React）根据路由规则，动态渲染对应的组件 / 视图，并通过 AJAX/HTTP 请求获取数据，更新页面内容；
- 整个过程中，页面不会刷新，URL 的变化仅通过前端逻辑管理（如 hash 值变化或 HTML5 History API）。

**SPA 的优点**
1.用户体验更流畅
避免了传统多页面应用中 “跳转 - 白屏 - 加载” 的过程，视图切换瞬间完成，减少用户等待感，接近原生 App 的体验。
2.前后端分离彻底
后端仅需提供 API 接口（负责数据处理），前端专注于视图渲染和交互逻辑，职责清晰，便于团队分工（前端、后端可并行开发）
3.减少服务器压力
4.缓存友好
静态资源（JS、CSS、图片）可被浏览器缓存，再次访问时无需重新加载，提升加载速度。

**SPA 的缺点**
1. 首页加载速度可能较慢
初始加载需一次性下载整个应用的核心 JS/CSS 资源（尤其是大型应用），若资源体积大，可能导致首屏白屏时间过长。
2. SEO（搜索引擎优化）不友好
3. 前进 / 后退功能需要手动处理
4. 内存占用较高

**如何实现一个 SPA 应用?**

# 11.12
## 面试官：Vue组件之间的通信方式都有哪些？
1. 父子组件通信
- 父传子(props)
父组件通过v-bind像子组件传递数据
```js
<template>
  <!-- 父组件向子组件传递数据，仍使用 v-bind（或简写 `:`） -->
  <Child :message="parentMsg" />
</template>

<script setup>
import { ref } from 'vue'
const parentMsg = ref('这是父组件传递的消息')
</script>
```
```js
<script setup>
import { defineProps } from 'vue'

// 声明接收的 props（支持指定类型、默认值等）
const props = defineProps({
  message: {
    type: String, // 指定类型
    required: true // 可选：标记为必填
  }
})

// 直接访问 props 中的数据
console.log(props.message)
</script>
```
- 子传父emit触发自定义事件，父组件通过v-on 监听事件并接收数据。
```js
<template>
  <button @click="handleClick">发送数据</button>
</template>

<script setup>
// 引入 defineEmits 定义可触发的事件
const emit = defineEmits(['send-data']);

const handleClick = () => {
  emit('send-data', '子组件的数据'); // 触发事件并传递参数
};
</script>
<template>
  <Child @send-data="receiveData" />
</template>

<script setup>
import Child from './Child.vue'; // 引入子组件

const receiveData = (data) => {
  console.log(data); // 输出：子组件的数据
};
</script>
```
- ref 一般是子传父
Vue3 中为了增强组件封装性，默认不暴露组件内部的方法 / 数据，需通过 defineExpose 显式暴露才能被父组件访问。
```js
子
<script setup>
import { ref } from 'vue';

// 子组件内部数据
const childData = ref('子组件的私有数据');

// 子组件内部方法
const childMethod = () => {
  console.log('子组件的方法被调用了！');
};

// 🔴 关键：显式暴露给父组件访问的内容
defineExpose({
  childData,
  childMethod
});
</script>

父组件（通过 ref 访问子组件实例）<template>
  <div>
    <!-- 子组件 -->
    <Child ref="childRef" />
    <!-- 按钮触发函数 -->
    <button @click="callChildMethod">调用子组件方法</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Child from './Child.vue';

// 绑定子组件实例的ref
const childRef = ref(null);

// 封装调用子组件逻辑的函数
const callChildMethod = () => {
  // 安全校验：确保子组件实例已挂载（避免null报错）
  if (childRef.value) {
    // 调用子组件暴露的方法
    childRef.value.childMethod();
    // 访问子组件暴露的数据
    console.log('子组件数据：', childRef.value.childData);
  } else {
    console.log('子组件尚未挂载');
  }
};
</script>

```
- 祖孙与后代组件之间的通信
结合ref/reactive实现响应式，顶层组件用provide函数，后代用inject函数。
```vue
<!-- 祖父组件 -->
<script setup>
import { ref, provide } from 'vue';
const theme = ref('light'); // 响应式数据
// 提供响应式数据和修改方法
provide('theme', theme);
provide('setTheme', (newTheme) => { theme.value = newTheme; });
</script>

<!-- 孙子组件 -->
<script setup>
import { inject } from 'vue';
const theme = inject('theme'); // 直接注入响应式数据
const setTheme = inject('setTheme'); // 注入方法

console.log(theme.value); // 'light'
</script>
```
- 非关系组件间之间的通信(pinia)
- 兄弟组件之间的通信(EventBus)
创建一个中央事件总线EventBus
兄弟组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
另一个兄弟组件通过$on监听自定义事件

## 面试官：为什么data属性是一个函数而不是一个对象？
组件的data必须是一个函数而不是对象,是为了保证组件的复用性和独立性
**具体原因避免数据共享导致的副作用**
- Vue 组件是可复用的实例。如果data是一个对象，那么所有复用该组件的实例会共享同一个 data 对象的引用。这意味着当其中一个组件实例修改 data 中的数据时，其他所有实例的 data 会被同步修改（因为它们指向同一块内存），这显然不符合组件 “独立复用” 的设计初衷。
- 而如果data是一个函数，每次创建组件实例时，函数都会被调用并返回一个全新的对象（每个实例都拥有自己独立的 data 副本）。这样一来，多个组件实例之间的 data 互不干扰，各自的状态修改只会影响自身，保证了组件的独立性。

## 面试官：说说对WebSocket的理解？应用场景？
**对WebSocket的核心理解**
1. 与http的区别(核心优势)
- 效率：HTTP 每次通信需重新建立连接（包含三次握手等开销），且头部信息冗余；WebSocket 仅在握手阶段使用 HTTP 协议，之后直接通过 TCP 传输数据，头部开销极小，实时性更高。
- 通信方式：HTTP 是 “请求 - 响应” 模式的单向通信（客户端主动请求，服务器被动响应），且每次通信后连接关闭；WebSocket 建立连接后，客户端和服务器可双向主动发送数据，连接长期保持。
2. 关键特点
- 全双工：客户端和服务器可同时向对方发送数据，无需等待对方响应。
- 持久连接：一旦握手成功，连接会持续保持，直到某一方主动关闭。
- 无同源限制：客户端可与任意服务器建立 WebSocket 连接（不同于 AJAX 的同源策略限制）。
- 协议标识：使用 ws://（非加密）或 wss://（加密，类似 HTTPS）作为协议前缀。
3. 工作流程(握手阶段)
- 客户端发起连接请求：通过 HTTP 协议发送握手请求，请求头包含特殊字段：
Upgrade: websocket（声明要升级为 WebSocket 协议）
Connection: Upgrade（确认升级连接）
Sec-WebSocket-Key（随机字符串，用于服务器验证）
Sec-WebSocket-Version（协议版本）。
- 服务器响应握手：服务器验证请求后，返回 HTTP 101 状态码（Switching Protocols），并通过 Sec-WebSocket-Accept 字段返回加密后的 Sec-WebSocket-Key 结果，确认协议切换。
- 双向通信：握手成功后，HTTP 连接升级为 WebSocket 连接，双方通过 TCP 直接交换数据（数据帧格式遵循 WebSocket 协议）。

**应用场景**
WebSocket最适合延迟底，高频次双向数据交换，传统 HTTP 轮询（定时请求）或长轮询（阻塞等待响应）在此类场景中效率极低（频繁建立连接、服务器压力大），而 WebSocket 能显著优化性能。
- 实时聊天 / 社交应用：如即时通讯工具（微信网页版）、弹幕系统、在线客服，需要双方实时收发消息。实时聊天 / 社交应用：如即时通讯工具（微信网页版）、弹幕系统、在线客服，需要双方实时收发消息。
- 实时数据监控：如股票行情、期货价格、实时交通流量（需服务器主动推送最新数据给客户端）。
- 在线协作工具：如多人编辑文档（Google Docs）、协同绘图，用户操作需实时同步给其他参与者。
- 实时游戏：尤其是多人在线游戏（如实时对战），玩家操作和游戏状态需毫秒级同步。

## 面试官：为什么说HTTPS比HTTP安全? HTTPS是如何保证安全的？
**Http 是超本文传输协议，其中是明文传输，有三个巨大的问题**
- 窃听风险：数据在传输途中，可能被第三方拦截并读取
- 篡改风险：第三方可能篡改传输的数据(比如订单金额)
- 冒充风险: 第三方可能冒充服务器或客户端（比如 “钓鱼网站” 冒充银行网站骗取用户信息）。
而 HTTPS（HTTP + SSL/TLS）通过 SSL/TLS 协议对数据进行加密处理，并加入身份验证和完整性校验机制，从根本上解决了这三大风险，因此更安全。
**二、HTTPS 如何保证安全？（核心机制）**
1. 数据加密：防止窃听
HTTPS 采用 “非对称加密 + 对称加密” 结合的方式加密数据，兼顾安全性和传输效率：
- 对称加密：客户端和服务器使用同一把密钥对数据进行加密和解密（比如 AES 算法）。优点是加密效率极高，适合大量数据传输；缺点是 “密钥如何安全传给对方”—— 如果直接传输密钥，可能被窃听。
- 非对称加密：使用 “公钥 - 私钥” 对（比如 RSA 算法）。公钥可公开，私钥仅服务器持有；用公钥加密的数据，只能用私钥解密，反之亦然。优点是无需担心密钥传输安全；缺点是加密效率低，不适合大量数据传输。
2. 数据完整性校验：防止篡改
HTTPS 通过 “消息认证码（MAC）” 或 “哈希算法（如 SHA）” 确保数据在传输中未被篡改：
- 发送方在传输数据时，会对数据进行哈希计算，生成一个 “哈希值”（相当于数据的 “指纹”），并将哈希值加密后和数据一起发送。
- 接收方收到数据后，对数据重新计算哈希值，与解密后的 “指纹” 对比：如果一致，说明数据未被篡改；如果不一致，则判定数据被篡改，拒绝接收。
3. 身份认证：防止冒充
HTTPS 通过 “数字证书 + CA 机构” 验证服务器身份，防止 “中间人冒充服务器”：
- 服务器的公钥需要向权威 CA 机构（如 Let's Encrypt、Verisign）申请 “数字证书”。证书中包含：服务器的公钥、服务器域名、证书有效期、CA 机构的签名（用 CA 私钥加密的证书信息哈希值）。
- 客户端连接服务器时，服务器会先发送数字证书。客户端会：
- 验证证书是否由可信 CA 机构颁发（操作系统 / 浏览器内置了可信 CA 的公钥）。
1. 用 CA 公钥解密证书中的 “CA 签名”，得到证书信息的哈希值，再与自己计算的证书信息哈希值对比，确认证书未被篡改。
2. 验证证书中的域名是否与当前访问的域名一致（防止 “钓鱼网站” 用其他域名的证书冒充）。
- 只有证书验证通过，客户端才会认为对方是 “真实的服务器”，继续后续通信；否则会提示 “证书不安全”（如浏览器显示警告页面）。

## 面试官：说说你对slot的理解？slot使用场景有哪些？
定义：它是插槽，父组件给子组件通过这个接口，传递html结构，组件，或者内容
分为三个
- 默认插槽
子组件定义：
```vue
<!-- Child.vue -->
<template>
  <div class="container">
    <!-- 默认插槽：父组件未指定插槽名的内容会插入这里 -->
    <slot></slot>
  </div>
</template>
父组件使用：
vue
<!-- Parent.vue -->
<template>
  <Child>
    <!-- 这段内容会被插入到子组件的默认插槽中 -->
    <p>这是父组件传入的内容</p>
  </Child>
</template>
```
- 具名插槽
子组件定义：
```vue
<!-- Child.vue -->
<template>
  <div class="card">
    <!-- 具名插槽：header -->
    <slot name="header"></slot>
    <!-- 具名插槽：body -->
    <slot name="body"></slot>
    <!-- 具名插槽：footer -->
    <slot name="footer"></slot>
  </div>
</template>
父组件使用：
父组件通过v-slot:插槽名（简写为#插槽名）指定内容插入的目标插槽：
vue
<!-- Parent.vue -->
<template>
  <Child>
    <template #header>
      <h2>卡片标题</h2>
    </template>
    <template #body>
      <p>卡片内容...</p>
    </template>
    <template #footer>
      <button>确认</button>
    </template>
  </Child>
</template>
```
- 作用域插槽
子组件需要向父组件传递数据（供父组件定制内容时使用）时，通过slot绑定属性（“插槽 props”），父组件接收后基于数据渲染内容。
子组件需要向父组件传递数据（供父组件定制内容时使用）时，通过slot绑定属性（“插槽 props”），父组件接收后基于数据渲染内容。
子组件定义：
子组件通过v-bind向插槽传递数据（例如user）：
```vue
<!-- Child.vue -->
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <!-- 作用域插槽：向父组件传递当前user数据 -->
      <slot :user="user"></slot>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return { users: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }] }
  }
}
</script>
父组件使用：
父组件通过v-slot:插槽名="变量名"接收子组件传递的插槽 props，再基于数据自定义渲染：
vue
<!-- Parent.vue -->
<template>
  <Child>
    <!-- 接收子组件传递的user数据，自定义渲染方式 -->
    <template v-slot="scope">
      <p>姓名：{{ scope.user.name }}，ID：{{ scope.user.id }}</p>
    </template>
  </Child>
</template>
（注：scope是任意命名的变量，也可解构简化：v-slot="{ user }"）
```
**使用场景**
1. 弹窗，卡片，表单

## url 包含那些部分 ？
1. 协议 http：//,wss://,https://
2. 域名： www.example.com
- 子域名：www
- 主域名：example
- 顶级域名：com
3. 端口号：80，,443
4. 路径：
5. 查询参数
6. 锚点、

# 11.13
## JWT 如何自动更新 token ？
他是通过双令牌机制(访问 + 刷新)，核心思想使用短期的访问的令牌处理请求业务，
使用长期有效的刷新令牌访问令牌过期自动获取新的访问令牌
1. 双令牌生成
```js
// 登录成功后生成双令牌
const accessToken = jwt.sign({ userId: 123 }, 'access-secret', { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: 123 }, 'refresh-secret', { expiresIn: '7d' });
// 存储refreshToken（如数据库，关联用户ID，用于后续验证）
db.refreshTokens.create({ token: refreshToken, userId: 123, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });
// 返回给客户端
return { accessToken, refreshToken };
```
2. 业务的请求
```js
Authorization: Bearer token
```
服务器验证 Access Token 的有效性（签名、过期时间），验证通过则处理请求；若过期（返回 401 Unauthorized），则触发刷新流程。
3. 自动刷新
当客服端收到401：
- 客服端刷新token,发起请求，后端检查token 是否过期，是否在数据库，
- 验证后生成新的访问token 和刷新token,一起返回前端
- 客户端用新的 Access Token 重新发起原业务请求，并更新本地存储的 Access Token（和新的 Refresh Token）。
4. 刷新令牌过期（终极处理）
若 Refresh Token 也过期或无效（如用户长期未操作），服务器返回 401，此时客户端需引导用户重新登录，重新获取双令牌。

## 面试官：说说 HTTP1.0/1.1/2.0 的区别?
**HTTP1.0**
- 他是浏览器和服务器短暂的链接，浏览器每次请求都有发生一次tCp链接
**HTTP1.1**
- 在短暂链接改成持久链接，TCp 链接了不关闭，可以被多个请求复用
- 当时也要遵循规则，先处理上一个，在处理下一个，
- 新增一些请求方法和响应头
**HTTP2.0**
- 采用二进制格式，不是文本格式
- 一个TCp 链接，可以多个请求并发
- 使用报头压缩，降低开销
- 服务器推送

## 面试官：说说地址栏输入 URL 敲下回车后发生了什么?(必考)
**URL解析和缓存检查**
1. 判断用户的输入类型：url还是关键词
关键词，就直接搜索跳转到默认的页面
2. 如果是url,要补全协议，域名，端口号等
   
=========================================

1. 缓存查询：浏览器优先检查本地缓存（按优先级：浏览器缓存 → 系统缓存 → 路由器缓存），若缓存中存在该 URL 对应的 IP 和资源且未过期，则直接使用缓存，跳过后续部分步骤（如 DNS 解析、网络请求）。

**DNS 域名解析：将域名转换为 IP 地址**
域名（如www.example.com）是人类易读的标识，而计算机通信依赖 IP 地址，因此需要通过 DNS（域名系统）解析出对应的 IP。流程如下：
1. 
## 面试官：Vue中组件和插件有什么区别？
组件:是vue的基本模块，封装Ui结构，样式和局部逻辑
插件:插件是扩展 Vue 功能的工具，本质是 “为 Vue 全局添加功能的代码集合”，核心作用是增强 Vue 的能力（如添加全局方法、指令、混入，或集成第三方功能）。
# 11.14
## 面试官：css中，有哪些方式可以隐藏页面元素？区别?
## 面试官：JavaScript字符串的常用方法有哪些？

# 11.17
## 文件秒传
**问题背景**
在文件储存场景，如果多个用户传相同的内容，如果后端直接储存这些文件，会造成资源的空间大量的浪费
**实现的原理**
系统先对上传的文件计算唯一哈希标识，在将哈希值和已有文件的哈希库做一个对比
- 如果对应的哈希值存在，就不用重新储存新的文本，做为一个引用关系，指向新上传的文件
- 如果不存在，才会重新储存并记录到哈希值
这样的技术在网盘，云存储的平台很常见。
## 两个项目
一、文绘通 - 小说转漫画系统
### 1. 技术选型与 AI 集成类
问题：在 “文绘通” 中，选择 LLM（分镜生成）和 AIGC（图像生成）的技术栈是如何考虑的？具体实现流程是怎样的？回答：选择GPT-4o作为 LLM 是因其长文本理解和逻辑拆解能力突出，能高效将小说结构化数据转化为分镜脚本；AIGC 选用Stable Diffusion WebUI是看中其开源性和自定义性，支持 LoRA 模型微调多风格。实现流程分三步：
小说结构化解析：通过正则提取章节、人物、场景等信息，转化为{chapter: 1, character: [{name: "阿月", appearance: "白衣"}], scene: "星空下的楼阁"}这类结构化数据；
LLM 分镜生成：将结构化数据 + 分镜需求（如 “每章 3 个分镜，突出人物互动”）封装为 prompt，调用 OpenAI API 生成分镜脚本（包含镜头角度、人物动作等细节）；
AIGC 图像生成：将分镜脚本转化为图像 prompt，结合 “提示词工程 + LoRA 模型微调” 实现多风格（如 “古风：水墨质感，飞檐斗拱；科幻：赛博朋克光影”）。针对高频风格，我们训练了专属 LoRA 模型（如古风 LoRA 训练了 100 张古画数据），调用时通过 API 参数指定模型权重，确保风格精准。
### 2. 性能优化细节类
问题：“虚拟滚动、图片懒加载、搜索防抖” 使首屏加载时间缩短 30%，具体实现是怎样的？回答：
虚拟滚动：采用vue-virtual-scroller库，监听容器滚动事件，计算可视区域的startIndex和endIndex（通过scrollTop / 单条分镜高度取整），仅渲染该区域的分镜项（前后各加 5 条缓冲）。原本渲染 100 条 DOM，优化后仅渲染 25 条，DOM 节点减少 75%；
图片懒加载：自定义v-lazy指令，通过IntersectionObserver监听 img 元素，当元素进入视口（交叉比例 > 0.1）时，将data-src赋值给src。同时提前 50px 预加载下一个分镜的图片，避免滚动空白；
搜索防抖：用户输入时用setTimeout延迟 300ms 执行搜索请求，期间若再次输入则清除定时器重计时。原本输入 “古风漫画” 可能触发 6 次请求，优化后仅触发 1 次，大幅减少接口压力。实测首屏加载时间从 10 秒缩短至 7 秒，实现 30% 的提升。
### 3. 跨域与权限类
问题：“通过 window.print 解决漫画图跨域下载问题” 的原理是什么？如何平衡用户体验与技术限制？回答：原理是利用浏览器window.print的能力，将跨域图片嵌入打印页面后，通过 “打印预览 - 另存为图片” 的流程实现下载。
优点：前端可独立解决跨域问题，无需后端改造；
缺点：用户操作步骤较多（需手动选择 “另存为”），且仅兼容 Chrome、Edge 等主流浏览器。
我们通过在界面添加引导文案（如 “点击打印后选择‘另存为图片’即可下载”）降低用户操作门槛，同时针对小众浏览器 fallback 到 “提示用户联系管理员获取资源”，在资源有限的情况下平衡了需求与实现成本。
二、个人博客系统
### 1. 大模型 + 富文本类
问题：基于 wangEditor 定制的富文本编辑器，是如何实现 AI 续写、润色、总结功能的？如何保证格式兼容性？回答：
功能触发：在 wangEditor 工具栏新增 “AI 续写”“润色”“总结” 按钮，用户选中文本后点击，前端通过editor.getSelectionText()获取内容，调用后端接口并携带 “操作类型”（如{type: "polish", content: "原文..."}）；
格式兼容：大模型返回的内容若带 Markdown 格式（如**加粗**），通过marked库转为 HTML，再用editor.insertHtml()插入，确保与原有富文本格式（加粗、列表等）一致。若遇到复杂格式（如表格），会先校验 HTML 结构，不符合则降级为纯文本并提示用户，避免格式错乱。
### 2. 文件秒传与权限类
问题：“文件秒传” 如何处理大文件哈希计算的性能问题？不同用户上传相同文件时，如何保证权限隔离？回答：
大文件哈希优化：采用 “分片计算 + Web Worker” 方案 —— 将文件用File.slice()分成 1MB 分片，在 Web Worker 中对每个分片计算 MD5，最后拼接分片哈希得到整体哈希。这样既避免主线程阻塞（保证 UI 流畅），又通过并行计算将 1GB 文件的哈希时间从 8 秒缩短至 3 秒；
权限隔离：系统为每个用户维护 “文件引用表”，记录用户与文件哈希的关联关系。只有拥有该引用的用户才能访问文件，例如用户 A 上传的文件，用户 B 即使上传相同内容，也只能通过自己的引用访问，确保数据隔离。
### 3. 无感刷新类
问题：“无感刷新” 中 token 和 refresh token 的流程是怎样的？refresh token 过期后如何兜底？回答：
流程设计：登录时后端返回accessToken（2 小时有效期）和refreshToken（7 天有效期）。前端请求接口时自动携带accessToken；若接口返回 401（token 过期），响应拦截器自动调用刷新接口，用refreshToken换取新accessToken后重试原请求，用户无感知；
兜底方案：若refreshToken也过期，系统会清除本地所有 token，跳转到登录页并提示 “登录状态过期，请重新登录”。同时在登录页提供 “记住我” 选项，勾选后延长 refresh token 有效期，减少频繁登录的情况。
### 4. 技术栈对比类（两个项目联动问题）
问题：两个项目都采用了 Vite、Vue3、Node+Express+TypeORM 技术栈，有什么差异考虑？回答：技术栈复用是为了提升开发效率、减少学习成本。差异主要源于业务场景：
文绘通聚焦 “AI 生成 + 多媒体处理”，需处理大模型调用、图像生成的高并发，因此在 AIGC 集成、性能优化（虚拟滚动）上投入更多；
个人博客系统聚焦 “内容管理 + 用户体验”，因此在富文本定制、主题切换、文件秒传等场景做了深度优化。
这种技术栈的 “复用 + 差异化优化”，既保证了开发效率，又能针对性解决不同业务的痛点。
以上回答需结合你实际开发的细节调整，重点突出技术决策的逻辑、问题解决的具体步骤、数据化的成果，才能充分体现技术深度和项目把控力。

## Vue 组件的生命周期
他是组件从创造，挂载，更新，销毁的4个过程，每个阶段都有特定的生命周期函数，开发者可以在里面写对应的逻辑(初始化数据，操作DOM,清理资源)
1. 创造阶段(组件实例初始化)
- setup()
组件实例创建前执行(代替了Vue2 的 beforeCreate 和 created),这个时候实例还没有初始化，无法访问this
作用：初始化响应式数据（ref/reactive）、定义方法、设置监听（watch）等。
例：
```javascript
运行
import { ref, onMounted } from 'vue'
setup() {
  const count = ref(0) // 初始化响应式数据
  return { count } // 暴露给模板
}
```
2. 挂载阶段(组件与DOM结合)
- onBeforeMount
DOM 挂载前调用，这个时候模版已经编译，但是没有挂载页面(无法获取DOM元素)
- onMounted
DOM 挂载完后调用，这个时候可以通过ref获取DOM 元素，可以进行DOM 操作，发起接口请求
```js
import { onMounted, ref } from 'vue'
setup() {
  const domRef = ref(null)
  onMounted(() => {
    console.log('DOM已挂载', domRef.value) // 可获取DOM
    fetchData() // 发起数据请求
  })
  return { domRef }
}
```
3. 更新阶段(数据变化导致DOM重新渲染)
- onBeforeUpdate
数据更新后，DOM 重新渲染前调用，这个时候可以获取更新前的DOM 状态
作用：这个时候可以对比更新前后数据或者DOM 状态
- onUpdated
DOM 重新渲染后调用，这个可以获取DOM 更新后的DOM
注意：避免这个时候修改数据
4. 卸载阶段（组件从页面移除）
- onBeforeUnmount
组件卸载前调用，此时组件仍可用（可访问数据和 DOM）。作用：清理资源（如清除定时器、解绑事件监听、取消接口请求）。例：
```javascript
运行
import { onBeforeUnmount } from 'vue'
setup() {
  const timer = setInterval(() => {}, 1000)
  onBeforeUnmount(() => {
    clearInterval(timer) // 清理定时器
  })
}
```
- onUnmounted
组件卸载后调用，此时组件实例已销毁，无法访问数据和 DOM。作用：做最终的资源释放（如断开 WebSocket 连接）。
  
## 面试官：Vue中的$nextTick有什么作用？
它是等待Vue 异步DOM 更新完成后，执行回调函数，解决数据更新后DOM未同步的问题
**为什么要使用nextTick ?**
当改Vue 数据改变后，Vue不会触发DOM 跟新，将数据缓存在异步队列中
等待同步代码执行完后，才会统一跟新DOM,
如果在数据更新后执行DOM 操作，这个时候DOM 没有更新，会获取到老的DOM，这就是 $nextTick 要解决的核心问题。
**核心作用**
1. 获取最新的DOM 状态，
2. 保障数据与DOM 同步
**加分点**
1. 批量更新验证：如果有多次数据修改，Vue 会合并一次DOM 更新，nextTick 执行一次回答，确保性能。
2. 如果只操作DOM 使用，如果无DOM 交付，无需调用nextTick。

## 面试官：Vue项目中有封装过axios吗？主要是封装哪方面的？
封装的核心目的：减少代码的重复，处理通用的逻辑

**一、基础配置固化（减少重复配置）**
- 统一 baseURL：根据环境（开发 / 测试 / 生产）自动切换接口域名，通过 process.env.NODE_ENV 结合 Vue CLI 的环境变量（.env.development 等）实现，避免硬编码。
- 超时时间与请求头：全局设置超时时间（如 10s），默认请求头（如 Content-Type: application/json），表单提交场景单独配置 multipart/form-data。
});

**二、请求拦截器（处理请求前逻辑）**
- 统一携带 token：从 Vuex 或 localStorage 中获取登录令牌（如 token），在请求头中添加 Authorization: Bearer ${token}，无需每个接口单独处理。
- 参数序列化：对 GET 请求的 params 自动添加时间戳（防缓存），对 POST 表单数据自动转换为 FormData
- 
**三、响应拦截器（统一处理返回结果）**
- 剥离外层包装：多数接口返回格式为 { code: 200, data: {}, msg: '' }，拦截后直接返回 data 字段，业务代码无需重复解析。
- 错误码统一处理：
401（未登录 /token 过期）：自动跳转登录页，清除无效 token；
403（权限不足）：提示 “无操作权限”；
500（服务器错误）：提示 “服务异常，请稍后重试”；
避免业务代码中大量重复的错误判断。

**四、请求方法简化（提升开发效率）**
- 封装 get/post/put/delete 等常用方法，避免重复写 axios({ method, url, data })，直接通过 api.xxx() 调用。

**五、取消重复请求（优化性能与体验）**
- 针对用户快速点击按钮导致的重复请求（如提交表单），通过 axios.CancelToken 取消未完成的前一次请求，避免服务器压力和数据混乱。
实现逻辑：维护一个请求缓存池（Map），请求前存入标识（如 url + 参数），完成后删除；重复请求时取消前一次。

**六、环境区分与调试（适配多场景）**
- 开发环境启用 axios 拦截器打印请求日志（url、参数、响应时间），生产环境关闭，避免敏感信息泄露。
配合 mockjs 在开发环境模拟接口数据，封装时通过环境变量判断是否启用 mock 拦截，无需修改业务代码。  
# 11.18
## 普通函数与箭头函数差别 ？
**1. this绑定**
普通函数this 动态取决于调用方式，箭头函数的this固定外层作用域的this,不可改
**2.构造能力** 
普通函数可作为构造函数（用 new 创建实例，有 prototype）；箭头函数不行（无 prototype，new 调用报错）。
**3.参数与语法**
普通函数有 arguments 对象，语法完整；箭头函数无 arguments（用 ...args 替代），语法更简洁。
## 问知道vue 的响应式原理 ？

## Vue 上的ref 和 reactive  差别 ？
**数据类型的处理**
- ref 主要用于基本数据类型（Number、String、Boolean 等），也可以处理对象 / 数组（内部会自动转换为 reactive 代理对象）。
- reactive 仅用于对象类型数据（对象、数组、Map、Set 等），不支持基本类型（传入基本类型会报警告，且不会触发响应式）。

**访问与修改方式不同**
- ref：访问数据时，需通过 .value 属性（模板中使用时可省略 .value，Vue 会自动解析）。
- reactive：直接通过属性名访问 / 修改，无需 .value。

**适用场景**
- ref 单个简单数据
- reactive 复杂对象 / 关联属性集合

## Vue 组件的通信方式 ？
父子组件之间的通信
props emit
兄弟组件之间的通信
祖孙与后代组件之间的通信
provide 和  Inject
非关系组件间之间的通信
pinia

## 跨域的问题 ？

**什么跨域问题**
浏览器为了保证用户数据的安全：会执行「同源策略」：只有当两个页面(协议、域名、端口号)完全相同，才允许进行交互。
比如：
```js
前端页面地址：http://localhost:3000（协议 http，域名localhost，端口 3000）
后端接口地址：http://localhost:4000/api（端口不同） → 跨域
后端接口地址：https://localhost:3000/api（协议不同） → 跨域
```
**为什么会有跨域问题？**
同源策略是浏览器的核心安全机制，目的是防止恶意网站窃取用户数据。例如：如果没有同源策略，A网站可以直接访问B网站的资源，而B网站的用户数据就会被泄露。

**常见的跨域解决方案**
根据场景不同，解决方案可分为「后端主导」「前端辅助」「代理转发」等类型，常用的有以下几种：

- 后端主导
```js
app.use(cors({
  // 允许所有域名跨域访问
  origin:"*",
  // 允许所有 HTTP 方法跨域访问,这里默认是加了预检请求
  methods:["GET","POST","PUT","DELETE"],
  // 允许所有请求头跨域访问
  allowedHeaders:["Content-Type","Authorization"],
}))
优点：支持所有 HTTP 方法，安全可控，是现代项目的首选。
```
1. 设置 Content-Type（如 JSON 格式）
```js
// Axios
axios.post('https://后端域名/api', { name: 'test' }, {
  headers: {
    'Content-Type': 'application/json' // 声明JSON格式（会触发预检请求）
  }
});

// Fetch
fetch('https://后端域名/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'test' })
});
```
2. 自定义请求头（如 X-Token）
```js
// Axios
axios.get('https://后端域名/api', {
  headers: {
    'X-Token': 'user123-token' // 自定义令牌头
  }
});

// Fetch
fetch('https://后端域名/api', {
  headers: {
    'X-Token': 'user123-token'
  }
});
```
## 懒加载怎么实现的 ？

懒加载的核心是 “延迟加载资源”，仅当资源进入 / 即将进入可视区域时才加载，以优化性能

**一、图片懒加载（最常见）**
- 初始不设置 src（或用占位图），真实地址存到 data-src 等自定义属性。
- 监听图片是否进入可视区域，进入则将 data-src 赋值给 src 触发加载。

**二， 路由懒加载（Vue/React）**
- Vue 路由懒加载：
```javascript
运行
// 路由配置中使用 import() 动态导入
const Home = () => import('@/views/Home.vue')
const routes = [{ path: '/', component: Home }]
```
**列表数据懒加载（滚动加载更多）**
初始加载部分数据，滚动到页面底部时，触发下一页数据请求。

## 实现一个盒子垂直居中？如果那个盒子没有高度和宽度怎么搞 ?
flex布局
grid布局
利用定位+margin:负值
```js
<style>
    .father {
        position: relative;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left:-50px;
        margin-top:-50px;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```
利用定位+margin:auto
```js
<style>
    .father{
        width:500px;
        height:300px;
        border:1px solid #0a3b98;
        position: relative;
    }
    .son{
        width:100px;
        height:40px;
        background: #f0a238;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
    }
</style>
```
## 面试官：你是怎么理解ES6中 Promise的？使用场景？
