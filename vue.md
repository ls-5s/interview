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
回调地狱：多层异步操作嵌套导致的代码可读性差、维护困难（如 fs.readFile 嵌套调用）。
内部有三种状态：pending（初始）、fulfilled（成功，由 resolve 触发）、rejected（失败，由 reject 触发），状态一旦改变不可逆。
通过 then 链式调用串联多个异步操作，前一个异步的结果可作为后一个的输入；通过 catch 统一捕获链条中任何位置的错误。

# 11.19
## 面试官：如何实现单行／多行文本溢出的省略样式？
**1. 单行文本溢出省略**
核心是通过 white-space 限制文本不换行，再用 text-overflow: ellipsis 显示省略号。
```css
.single-line {
  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden;    /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 溢出部分显示省略号 */
  /* 可选：设置宽度限制（如固定宽度或 max-width） */
  width: 200px;
}
```
原理：
white-space: nowrap 确保文本在一行内显示，不自动换行；
overflow: hidden 隐藏超出容器宽度的内容；
text-overflow: ellipsis 规定溢出文本以省略号（...）替代。

**2. 多行文本溢出省略**
多行文本需要限制最大行数，主流方案使用 webkit-line-clamp（WebKit 内核浏览器支持，兼容性较好）。
```css
.multi-line {
  display: -webkit-box; /* 将元素作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置伸缩盒子的子元素排列方式为垂直 */
  -webkit-line-clamp: 3; /* 限制显示的最大行数（这里为3行） */
  overflow: hidden; /* 隐藏溢出内容 */
  /* 可选：设置宽度限制 */
  width: 200px;
}
```
兼容性：
支持 Chrome、Safari、Edge 等 WebKit 内核浏览器，以及大部分现代浏览器；
不支持 IE（可通过 JS 方案降级处理）。
注意：
## 面试官：SSR解决了什么问题？有做过SSR吗？你是怎么做的？
**SSR 解决了什么问题？**

- 首屏加载速度慢
SPA 需要先下载完整的 JS bundle，解析后才能渲染页面，导致首屏出现 “白屏” 或 “空白期”，尤其在弱网或低性能设备上更明显。
SSR 则在服务端直接生成完整的 HTML（包含页面内容），浏览器加载后可直接渲染，大幅减少首屏等待时间。

- 首屏用户体验差
除了白屏，SPA 在 JS 加载完成前，页面可能无法交互（如点击按钮无响应），而 SSR 的首屏 HTML 是 “可交互前的完整内容”，用户能更早看到有效信息，感知体验更好。

- SEO 不友好
搜索引擎爬虫通常优先抓取 HTML 内容，而 SPA 的初始 HTML 是空白的，依赖 JS 动态生成的内容难以被爬虫识别，导致页面无法被有效索引。
SSR 让服务端返回包含完整内容的 HTML，爬虫能直接读取，提升 SEO 效果（尤其对内容型网站如博客、电商详情页至关重要）。

**具体实现步骤**
- 项目初始化与路由配置
- 服务端数据预取
- 模板渲染与客户端激活
- 构建与部署

# 11.20
## 面试官：双向数据绑定是什么？
**核心定义:** 它是数据模型与视图之间的双向自动同步机制
- 当数据模型（如 Vue 的data、React 的state）发生变化时，视图会自动更新。
- 当用户操作视图（如输入框输入、按钮点击）时，数据模型会自动同步更新，无需手动编写 DOM 操作或事件监听代码。
- 简单说：数据变 → 视图变，视图变 → 数据变，无需人工干预两者的同步。

**双向绑定的本质:** 是 “单向绑定（数据→视图）+ 视图事件监听（视图→数据）” 的组合，拆解为两步：
- 数据→视图：通过 “数据劫持” 或 “发布订阅” 监听数据变化，触发视图重新渲染；
- 视图→数据：监听视图的用户交互事件（如input、change），将视图值同步回数据模型。
- 两者结合，形成 “双向闭环”—— 这也是 Vue 中v-model的核心原理（v-model本质是v-bind:value+v-on:input的语法糖）。

**使用场景:**
- 登录 / 注册页（用户名、密码、验证码输入，实时校验格式是否合法）；
- 信息提交表单（如个人资料编辑、订单提交、问卷填写，多字段联动（如 “确认密码” 与 “密码” 实时比对））；
- 搜索框（实时输入、实时联想提示，输入内容同步到数据，数据变化触发联想接口请求）；

## 面试官：动态给vue的data添加一个新的属性时会发生什么？怎样解决？
**发生什么:** 
- Vue 2：动态添加的新属性「数据会更新，但视图不刷新」。比如给data中的item新增newProperty，控制台能打印出新属性，但页面不会同步渲染该属性的值；
- Vue 3：对象动态添加属性默认支持响应式（数据 + 视图同步更新），但数组「直接修改索引」「修改 length」仍非响应式（数据更、视图不更）。

**底层原理：**

=================================

**vue2**
- 初始化时，Vue 会遍历data中所有已声明的属性，通过Object.defineProperty为其添加getter（收集依赖）和setter（触发视图更新）；
- 动态新增的属性，并未经过Object.defineProperty的 “劫持” 处理，缺少对应的setter，因此修改时无法通知 Vue 触发视图更新 —— 相当于 Vue “看不到” 这个新属性，自然无法同步视图。

**vue3**
- Proxy直接监听整个对象 / 数组，而非单个属性，因此对象动态新增属性时，能直接捕获到操作，自动转为响应式；
- 例外：为兼顾性能，Vue 3 未对数组「直接修改索引（如arr[0] = 100）」「修改 length（如arr.length = 0）」做响应式处理，这类操作仍需特殊处理。

===================================

**解决方案**
- Vue.set（最推荐，适用于少量属性）
Vue 官方提供的 API，专门用于给响应式对象 / 数组添加响应式属性，内部逻辑：
```js
// 给对象添加新属性
this.$set(this.item, 'newProperty', '新属性值');

// 给数组添加/修改元素（通过索引）
this.$set(this.arr, 0, '修改索引0的值'); // 数组响应式更新
```
- 数组特殊操作（索引 / 长度修改）：用Array.prototype.splice或重新赋值数组
```js
const arr = reactive([1, 2, 3]);
// 1. 修改索引：用splice替代直接赋值
arr.splice(0, 1, 100); // 替换索引0的值为100（响应式）
// 2. 清空数组：用splice替代修改length
arr.splice(0); // 响应式清空
// 3. 新增元素：用push（原生支持响应式）
arr.push(4);
```

# 11.25
## 面试官：大文件上传如何做断点续传？
- 文件分片
计算分片数量：totalChunk = ceil(文件大小 / 分片大小)；
生成唯一标识：为每个文件生成唯一 ID（如MD5(文件名 + 文件大小 + 最后修改时间)），用于服务端识别同一文件的分片，避免重复上传。
- 断点记录：后端记录每个文件已上传成功分片分片索引，前端上传前先查询已传分片，只传未完成的部分。
- 合并文件：所以的分片上传完后，后端安分片的顺序拼接为完整文件.

## 请描述下你对vue生命周期的理解？
Vue 生命周期是 组件从创建到销毁的完整过程
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
  
## 面试官：什么是防抖和节流？有什么区别？如何实现？
节流: n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
防抖: n 秒后在执行该事件，若在 n 秒内被重复触发，则重新计时
防抖在连续的事件，只需触发一次回调的场景有：

搜索框搜索输入。只需用户最后一次输入完，再发送请求
手机号、邮箱验证输入检测
窗口大小resize。只需窗口调整完成后，计算窗口大小。防止重复渲染。
节流在间隔一段时间执行一次回调的场景有：

滚动加载，加载更多或滚到底部监听
搜索框，搜索联想功能
防抖代码实现
```js
function de(func,wait) {
  let timeout 
    return function(...args) {
      let context = this
      clearTimeout(timeout)
      timeout = serTimeout(()=>{
        func.apply(context,args)
      },wait)
    }
}
```
节流
```js
function throttle(func, limit) {
  let lastCall = 0;
  // 保存上一次执行的时间戳，初始值为0（第一次调用时会更新）
  return function(...args) {
    // 保存当前上下文的this指向（确保原始函数执行时，this能指向正确的对象）
    const context = this;
    // 获取当前时间戳（毫秒级），用于计算时间差
    const now = Date.now();
    // 检查是否超过时间限制
    if (now - lastCall >= limit) {
      func.apply(context, args);
      lastCall = now;
    }
  };
}
```
## 面试官：说说 Javascript 数字精度丢失的问题，如何解决？
一个经典的面试题
```js
0.1 + 0.2 === 0.3 // false
```
JavaScript 中所有数字（整数、小数）都遵循 IEEE 754 标准，以 64 位双精度浮点数 存储。这种存储方式的核心问题的是：部分十进制数无法被二进制精确表示，只能存储近似值，进而导致计算时出现精度偏差。
1. 存储结构（64 位双精度浮点数）
1 位符号位（正 / 负）
11 位指数位（表示数值的量级）
52 位尾数位（表示数值的精度，决定了有效数字的上限）

解决方法
```js
function add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
}
```

BigInt 是 JavaScript 中用于表示任意精度整数的原始类型。它可以表示比 Number 大得多的整数，而不会丢失精度。
在整数后面加上 n 后缀。
BigInt 和 Number 是不同的类型，不能直接进行混合运算。
在需要进行比较时要小心，10n === 10 的结果是 false，因为它们的类型不同。
BigInt 不能用于 Math 对象的方法中。
如果从后端 API 接收大整数，最好让后端以字符串形式返回，然后在前端用 BigInt() 解析，以避免在传输和解析过程中丢失精度。

## 面试官：Javascript中如何实现函数缓存？函数缓存有哪些应用场景？
一、什么是函数缓存？
函数缓存（Function Caching）是一种优化技术，它的核心思想是：将一个函数的计算结果，根据其输入参数（或部分关键参数）进行存储。当后续再次使用相同的参数调用该函数时，直接返回已存储的结果，而不是重新执行函数体。
二、如何实现函数缓存？
1. 基础实现：使用闭包和对象
```js
function memoize(fn) {
  // 缓存容器，存储格式为 { '参数1,参数2': '结果' }
  const cache = {};
  // 返回一个新的函数，这个函数会先检查缓存
  return function(...args) {
    // 将参数数组转换为字符串，作为缓存的 key
    // 注意：这种方式对引用类型参数有局限性，后面会讨论
    const key = JSON.stringify(args);
    // 检查缓存中是否存在该 key
    if (cache.hasOwnProperty(key)) {
      console.log(`从缓存中获取结果 for ${key}`);
      return cache[key];
    }
    // 如果缓存中没有，则执行原始函数
    console.log(`计算结果 for ${key}`);
    const result = fn.apply(this, args);
    // 将结果存入缓存
    cache[key] = result;
    // 返回结果
    return result;
  };
}
```
```js
// 一个耗时的计算函数
function add(a, b) {
  console.log("执行了 add 函数");
  return a + b;
}
// 创建一个被缓存的 add 函数
const memoizedAdd = memoize(add);
memoizedAdd(1, 2); // 打印 "计算结果 for [1,2]" 和 "执行了 add 函数"，返回 3
memoizedAdd(1, 2); // 打印 "从缓存中获取结果 for [1,2]"，直接返回 3
memoizedAdd(3, 4); // 打印 "计算结果 for [3,4]" 和 "执行了 add 函数"，返回 7
```
三.函数缓存的应用场景
- 计算密集型函数：
数学计算，如阶乘、斐波那契数列、矩阵运算。
数据加密 / 解密、
本质是：函数缓存是一种强大的性能优化手段，其核心是空间换时间。在 JavaScript 中，我们主要利用闭包来实现缓存的存储，并可以结合 Map、WeakMap 或 LRU 等数据结构和策略来优化缓存的行为。

## 面试官：Javascript本地存储的方式有哪些？区别及应用场景？
- cookie
- sessionStorage
- localStorage
- indexedDB


**cookie**
存储大小限制在 4KB 左右。
数据会自动随着 HTTP 请求发送到服务器。
可以通过 expires 或 max-age 设置过期时间，未设置则为会话级（关闭浏览器后删除）。
使用
存储会话标识（如登录凭证）。
记住用户偏好设置（如语言、主题）。

**localStorage**
存储大小通常为 5MB。
数据仅存储在客户端，不会发送到服务器。
生命周期为永久，除非手动删除（通过代码或浏览器设置）。
使用
存储用户登录状态（如 Token，但需注意安全）。
缓存不常变化的数据（如商品列表、配置信息）。

**sessionStorage**
存储大小通常为 5MB。
数据仅存储在客户端，不会发送到服务器。
生命周期为当前会话（关闭标签页或浏览器后数据丢失）。
使用
保存会话期间的临时状态（如分页信息、排序条件）。
防止重复提交（如表单提交后禁用按钮的状态）。

**IndexedDB**
存储大小无固定限制（取决于硬盘空间）。
属于 NoSQL 数据库，支持复杂数据结构（如对象、数组、Blob）。
使用
离线应用数据存储（如 PWA 离线缓存）。
存储大量用户数据（如聊天记录、邮件）。

## 面试官：说说 JavaScript 中内存泄漏的几种情况？
内存泄漏（Memory Leak）指的是程序中已分配的内存，在不再需要时没有被正确释放，导致内存占用持续升高，最终可能导致应用性能下降、卡顿甚至崩溃。

1. 意外的全局变量
这是最常见也是最容易发生的内存泄漏。在非严格模式下，未声明的变量会自动成为全局对象（window 或 global）的属性，从而不会被垃圾回收机制（Garbage Collector, GC）回收。
```js
// 错误示例：未声明变量
function foo() {
  bar = "hello world"; // bar 成为 window 的属性
}
foo();

// 错误示例：this 指向全局
function Person() {
  this.name = "John"; // 如果没有使用 new 关键字调用，this 指向 window
}
Person(); // window.name 被创建
```

2. 闭包引起的内存泄漏
但如果闭包被长期持有，并且它引用了外部函数中的大量数据，就可能导致这些数据无法被回收，从而造成内存泄漏。
```js
function createHeavyObject() {
  // 一个很大的数据结构
  const largeData = new Array(1000000).fill('some data');
  
  return function() {
    // 闭包引用了 largeData
    console.log(largeData.length);
  };
}

// 将闭包赋值给一个全局变量
window.myFunction = createHeavyObject(); 
// 此时，createHeavyObject 函数已经执行完毕，但由于 myFunction 持有闭包，
// largeData 及其所在的作用域无法被 GC 回收。
```
如果必须使用，确保在不再需要时手动解除引用（window.myFunction = null;）。

3. 被遗忘的定时器和回调函数
setInterval 和 setTimeout 是常见的定时器。如果定时器的回调函数引用了某个对象，并且定时器没有被 clearInterval 或 clearTimeout 清除，那么只要定时器在运行，这个对象就无法被回收。

在不再需要定时器时，务必调用 clearInterval(id) 或 clearTimeout(id)。

## 面试官：说说你对事件循环的理解
**一、为什么需要事件循环？**
JavaScript 是一门单线程语言，这意味着它同一时间只能执行一个任务。如果没有事件循环，当代码执行到一个耗时操作（比如网络请求、定时器、读取文件）时，线程就会被阻塞，后面的代码无法继续执行，导致整个程序卡死。

JS 事件循环是单线程下处理异步的核心机制：同步代码优先执行，同步任务完成后清空所有微任务，再执行一个宏任务，如此循环。

宏任务
宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求就不太符合
setTimeout/setInterval
微任务
一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前
Promise.then
async/await（本质是 Promise 的语法糖，await 后的代码会进入微任务队列）
DOM 事件：click / scroll / resize 等事件的回调函数
```js
console.log(1)
setTimeout(()=>{
    console.log(2)
}, 0)
new Promise((resolve, reject)=>{
    console.log('new Promise')
    resolve()
}).then(()=>{
    console.log('then')
})
console.log(3)
```

## 面试官：说说 HTTP1.0/1.1/2.0 的区别?
**一、HTTP1.0**
HTTP 1.0 浏览器与服务器只保持短暂的连接，每次请求都需要与服务器建立一个TCP连接
服务器完成请求处理后立即断开TCP连接,服务器不跟踪每个客户也不记录过去的请求

简单来讲，每次与服务器交互，都需要新开一个连接

例如，解析html文件，当发现文件中存在资源文件的时候，这时候又创建单独的链接

最终导致，一个html文件的访问包含了多次的请求和响应，每次请求都需要创建连接、关系连接

这种形式明显造成了性能上的缺陷

如果需要建立长连接，需要设置一个非标准的Connection字段 Connection: keep-alive

**二、HTTP1.1**
在HTTP1.1中，默认支持长连接（Connection: keep-alive），即在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟

建立一次连接，多次请求均由这个连接完成



这样，在加载html文件的时候，文件中多个请求和响应就可以在一个连接中传输

同时，HTTP 1.1还允许客户端不用等待上一次请求结果返回，就可以发出下一次请求，但服务器端必须按照接收到客户端请求的先后顺序依次回送响应结果，以保证客户端能够区分出每次请求的响应内容，这样也显著地减少了整个下载过程所需要的时间

同时，HTTP1.1在HTTP1.0的基础上，增加更多的请求头和响应头来完善的功能，如下：

引入了更多的缓存控制策略，如If-Unmodified-Since, If-Match, If-None-Match等缓存头来控制缓存策略
引入range，允许值请求资源某个部分
引入host，实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多个虚拟WEB站点
并且还添加了其他的请求方法：put、delete、options...

**三、HTTP2.0**

而HTTP2.0在相比之前版本，性能上有很大的提升，如添加了一个特性：

多路复用
二进制分帧
首部压缩
服务器推送
#多路复用
HTTP/2 复用TCP连接，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了”队头堵塞”



上图中，可以看到第四步中css、js资源是同时发送到服务端

#二进制分帧
帧是HTTP2通信中最小单位信息

HTTP/2 采用二进制格式传输数据，而非 HTTP 1.x的文本格式，解析起来更高效

将请求和响应数据分割为更小的帧，并且它们采用二进制编码

HTTP2中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流

每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装，这也是多路复用同时发送数据的实现条件

#首部压缩
HTTP/2在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送

首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新

例如：下图中的两个请求， 请求一发送了所有的头部字段，第二个请求则只需要发送差异数据，这样可以减少冗余数据，降低开销



#服务器推送
HTTP2引入服务器推送，允许服务端推送资源给客户端

服务器会顺便把一些客户端需要的资源一起推送到客户端，如在响应一个页面请求中，就可以随同页面的其它资源

免得客户端再次创建连接发送请求到服务器端获取

这种方式非常合适加载静态资源



# 11.26
## 面试官：说说地址栏输入 URL 敲下回车后发生了什么?

## HTTP 和 HTTPS 的区别?
- HTTP 和 HTTPS 使用连接方式不同，默认端口也不一样，HTTP是80，HTTPS是443
- HTTPS是HTTP协议的安全版本，HTTP协议的数据传输是明文的，是不安全的，HTTPS使用了SSL/TLS协议进行了加密处理，相对更安全
- HTTPS需要SSL，SSL 证书需要钱，功能越强大的证书费用越高
- HTTPS 由于需要设计加密以及多次握手，性能方面不如 HTTP

## 面试官：如何理解UDP 和 TCP? 区别? 应用场景?
**UDP（用户数据报协议）**
- 通俗类比：像 “寄明信片”—— 无需提前建立连接，直接发送数据报，不保证对方收到、不保证顺序，也不重传丢失的数据，但发送速度快、开销小。
- 核心设计目标：以最小开销实现 “快速传输”，适用于对延迟敏感、能容忍少量丢包的场景。

**TCP（传输控制协议）**
- 通俗类比：像 “打电话”—— 通话前需拨号（三次握手）建立连接，通话中双方确认接收（ack 机制），挂电话后需挂机（四次挥手）释放连接，确保信息不丢、不重、不乱。
- 核心设计目标：在不可靠的网络中，提供 “无差错、按序交付” 的字节流传输，适用于对数据完整性要求极高的场景。

**区别**
- TCP
登录 / 注册 / 实名认证：账号密码、身份证信息等敏感数据传输，需确保完整性（避免信息丢失导致登录失败）；
订单提交 / 支付流程：订单信息、支付凭证、交易记录传输，需保证数据可靠（防止交易漏记、支付状态同步失败）；
个人信息修改：昵称、手机号、地址等数据更新，需确保修改指令准确送达服务器（避免修改未生效）。

- UDP
语音 / 视频通话：微信 / QQ 通话、APP 内置客服音视频沟通（需 100-300ms 低延迟，少量丢包可通过音频降噪、视频帧补全弥补）；
直播互动：游戏直播、娱乐直播的画面 / 声音传输（主播画面推流、观众实时互动，延迟优先于完整性，避免卡顿）。

## 面试官：说一下 GET 和 POST 的区别？
**一、设计用途（语义区别）**
- GET:  “获取” 资源，用于从服务器请求已存在的资源（如查询数据、加载网页）。
- POST：“提交” 资源，用于向服务器发送数据，通常会导致服务器上的资源被创建或修改（产生副作用）

**二、参数传递方式**
- GET：参数通过URL 传递，以 “键值对” 形式拼接在 URL 末尾，用 ? 分隔 URL 和参数，多个参数用 & 连接。例：https://example.com/search?keyword=java&page=1，其中 keyword=java 和 page=1 是 GET 参数。
- POST：参数通过请求体（Request Body） 传递，不会出现在 URL 中。例：请求体中可能是 { "username": "admin", "password": "123" }（JSON 格式），或表单数据 username=admin&password=123。

**三、参数长度限制**
- GET：参数长度受限于URL 长度（不是 HTTP 协议规定，而是浏览器 / 服务器的限制）。例如：IE 浏览器对 URL 长度限制约 2048 字符，超过会被截断；服务器（如 Nginx）也可能配置 URL 长度上限。因此 GET 不适合传递大量数据。
- POST：参数放在请求体中，理论上没有长度限制（但服务器可能会设置请求体大小上限，比如 Nginx 默认限制 1M，可通过配置修改），适合传递大量数据（如表单提交、文件上传）。

**四、安全性（相对概念）**
- GET：参数暴露在 URL 中，会被记录在浏览器历史、服务器日志、代理日志中，安全性较低。例：如果用 GET 传递密码，别人可能通过查看 URL 或历史记录获取密码。
- POST：参数在请求体中，不会直接暴露在 URL 或历史记录中，相对更安全。但注意：这只是 “相对安全”，POST 数据本身不会加密，若要真正安全，需通过 HTTPS 协议加密传输（GET 和 POST 都可配合 HTTPS）。

**五、缓存机制**
- GET：请求可以被缓存（浏览器、CDN 等会缓存结果），下次相同请求可直接使用缓存，减少服务器压力。例：浏览器访问 https://example.com/logo.png（GET 请求），会缓存图片，下次打开无需重新请求。
- POST：请求默认不被缓存（因为 POST 通常用于提交数据，重复提交可能产生副作用，如重复下单），浏览器一般不会缓存 POST 结果。

**六、幂等性（关键区别）**
幂等性：指 “多次执行相同请求，是否对服务器资源产生相同影响”。
- GET：幂等。多次执行相同的 GET 请求，不会改变服务器资源（只是重复读取）。
例：多次调用 GET /api/users/1，每次返回的用户信息相同，不会修改用户数据。
- POST：非幂等。多次执行相同的 POST 请求，可能会对服务器资源产生不同影响（如重复创建数据）。
例：多次调用 POST /api/orders，可能会创建多个相同订单（除非服务器做了去重处理）。

## 面试官：如何理解CDN？说说实现原理？
**定义**
CDN（Content Delivery Network，内容分发网络）本质是 “分布在全球各地的缓存服务器集群”，核心目标是：让用户 就近获取内容，解决跨地域访问时的 “网络延迟高、源站压力大、访问不稳定” 三大问题。

可以类比成 “快递中转站”：
源站 = 商家仓库（存储所有原始内容：静态资源、视频、API 数据等）；
CDN 节点 = 全国各城市的快递中转站（提前缓存热门内容）；
用户 = 收件人（不用直接去商家仓库取件，而是从最近的中转站拿，速度更快）。

**核心价值（面试必提）：**
- 提速：减少跨运营商、跨地域的网络传输距离，降低延迟（比如北京用户访问广州源站的图片，从天津 CDN 节点获取，延迟从 50ms 降到 10ms）；
- 减压：大部分请求由 CDN 节点处理，源站只需应对 “缓存未命中” 或 “动态请求”，避免峰值流量击垮源站；
- 高可用：CDN 节点多地域部署，某节点故障时会自动切换到其他节点，提升服务稳定性；
- 防攻击：部分 CDN 自带 DDoS 防护、CC 防护能力，拦截恶意请求，保护源站安全。

**典型应用场景（结合移动 / 前端开发）：**
- 静态资源加速：网站 / APP 的 JS、CSS、图片、图标、字体文件；
- 视频 / 直播加速：短视频、影视点播、直播流（如抖音、B 站）；
- API 加速：移动端接口请求（如 APP 首页数据、列表接口）；
- 全球加速：跨境 APP / 网站（如中国用户访问海外源站，通过海外 CDN 节点提速）。

**CDN实现原理核心**
1. 用户请求绑定CDN的资源域名（如图片、JS）；
2. CDN的DNS调度系统根据用户位置、网络质量，分配最近的边缘节点IP；
3. 边缘节点有缓存则直接返回内容，无缓存则回源站获取并缓存，后续同区域用户复用该缓存。

本质：通过“就近节点+缓存复用”，跳过跨地域访问源站的环节，实现提速、减压。

# 11.27
## async/await
**定义**
async/await 是 JavaScript 中处理异步操作的语法糖，基于 Promise 实现，核心作用是让异步代码写起来、读起来像同步代码，解决了传统回调函数的 “回调地狱” 和 Promise.then() 链式调用的冗余问题，大幅提升代码可读性和可维护性。

**一、先搞懂：它解决了什么问题？**
1. 回调函数：回调地狱（Callback Hell）
嵌套层级多，代码杂乱，难以调试：
```javascript
运行
// 回调地狱：获取用户 -> 获取用户订单 -> 获取订单详情
getUser(userId, (user) => {
  getUserOrders(user.id, (orders) => {
    getOrderDetail(orders[0].id, (detail) => {
      console.log(detail); // 嵌套3层，多了更乱
    }, (err) => console.error(err));
  }, (err) => console.error(err));
}, (err) => console.error(err));
```
2. Promise 链式调用：冗余且不直观
虽然解决了回调地狱，但 then() 链过长时，代码依然不够简洁，逻辑分散：
```javascript
运行
// Promise 链式调用
getUser(userId)
  .then(user => getUserOrders(user.id))
  .then(orders => getOrderDetail(orders[0].id))
  .then(detail => console.log(detail))
  .catch(err => console.error(err));
```
3. async/await：同步化的异步代码
用 async/await 改写后，代码线性执行，逻辑清晰，和同步代码几乎无差别：
```javascript
运行
// async/await 写法
async function getOrderInfo(userId) {
  try {
    const user = await getUser(userId); // 等待 Promise 完成，拿到结果
    const orders = await getUserOrders(user.id);
    const detail = await getOrderDetail(orders[0].id);
    console.log(detail);
    return detail;
  } catch (err) {
    console.error(err); // 统一捕获所有异步错误
  }
}
```
**二、核心用法：2 个关键字（async + await）**
async/await 必须成对使用（await 不能脱离 async 函数单独存在），核心规则如下：
1. async：标记异步函数
用 async 修饰函数（普通函数、箭头函数均可），表示该函数是异步函数。
异步函数的返回值会自动包装成 Promise：
若函数内部 return 普通值（如数字、字符串），则返回 Promise.resolve(普通值)；
若函数内部 throw 错误，则返回 Promise.reject(错误)；
若直接返回 Promise，则直接返回该 Promise（不二次包装）。
示例：
```javascript
运行
// 普通函数
async function fn1() {
  return 123; // 等价于 return Promise.resolve(123)
}
fn1().then(res => console.log(res)); // 输出 123

// 箭头函数
const fn2 = async () => {
  throw new Error("出错了"); // 等价于 return Promise.reject(new Error("出错了"))
};
fn2().catch(err => console.log(err.message)); // 输出 "出错了"

// 返回 Promise
async function fn3() {
  return Promise.resolve("直接返回 Promise");
}
fn3().then(res => console.log(res)); // 输出 "直接返回 Promise"
```
2. await：等待异步结果
await 只能用在 async 函数内部（或 ES2022 后的模块顶层），作用是等待一个 Promise 完成。
执行到 await 时，函数会暂停执行（但不会阻塞主线程），直到 Promise 状态变为 fulfilled（成功）或 rejected（失败）：
若 Promise 成功（fulfilled），await 会返回 Promise 的 resolve 值；
若 Promise 失败（rejected），await 会抛出异常，需用 try/catch 捕获。
示例：
```javascript
运行
async function fetchData() {
  try {
    // 等待 fetch 异步请求完成（fetch 返回 Promise）
    const response = await fetch("https://api.example.com/data");
    const data = await response.json(); // 等待响应解析完成
    console.log(data);
  } catch (err) {
    // 捕获 fetch 或 json() 抛出的所有错误
    console.error("请求失败：", err);
  }
}
```
**三、关键特性：提升开发效率的核心点**
1. 错误处理：统一捕获，更直观
async/await 配合 try/catch，可以统一捕获所有 await 后的异步错误，比 Promise 链式调用的 catch() 更集中、更易维护（不用在每个 then() 后加错误处理）。
2. 并行执行：避免串行等待（关键优化）
如果多个异步操作互不依赖，直接用 await 串行执行会浪费时间（等前一个完成才执行下一个），此时需配合 Promise.all() 实现并行执行：
示例：错误的串行（耗时 = 1s + 2s = 3s）：
```javascript
运行
async function badParallel() {
  const res1 = await delay(1000); // 1秒后完成
  const res2 = await delay(2000); // 再等2秒（总共3秒）
  console.log(res1, res2);
}
```
示例：正确的并行（耗时 = 2s，取最长的异步操作时间）：
```javascript
运行
async function goodParallel() {
  // 先启动所有异步操作（并行），再等待所有完成
  const promise1 = delay(1000);
  const promise2 = delay(2000);
  const [res1, res2] = await Promise.all([promise1, promise2]); // 总共2秒
  console.log(res1, res2);
}

// 辅助函数：延迟ms后返回结果
function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(`延迟${ms}ms`), ms));
}
```
3. 条件执行：更灵活的逻辑控制
相比 Promise 链式调用，async/await 可以轻松实现基于异步结果的条件判断，逻辑更自然：
```javascript
运行
async function getInfo(userId) {
  const user = await getUser(userId);
  // 基于异步结果的条件判断
  if (user.isVip) {
    const vipInfo = await getVipInfo(user.id); // 仅VIP执行
    return { ...user, ...vipInfo };
  } else {
    const normalInfo = await getNormalInfo(user.id); // 普通用户执行
    return { ...user, ...normalInfo };
  }
}
```
**四、总结**
async/await 的核心作用是 “用同步的语法写异步代码”，本质是 Promise 的语法糖，没有改变 JavaScript 异步非阻塞的本质，但解决了传统异步写法的痛点：
- 替代回调地狱，让代码层级更扁平；
- 替代冗长的 then() 链，让逻辑更线性、易读；
- 用 try/catch 统一处理错误，更易维护；
- 支持灵活的条件执行和并行优化。

使用场景：所有需要处理异步操作的场景（网络请求、文件读写、数据库操作、定时器等），是目前 JavaScript 异步编程的首选方案。

## setTimeout 和 setInterval 差别
- 延迟 delay 毫秒后，仅执行1次回调	
- 每隔 delay 毫秒，重复执行回调（循环触发）

**二、代码示例：直观感受差异**
1. setTimeout：延迟一次，执行后终止
```javascript
运行
// 延迟2000毫秒（2秒）后，仅执行1次回调
const timeoutId = setTimeout(() => {
  console.log("setTimeout：延迟2秒，只执行1次");
}, 2000);

// 可选：如果需要取消（比如1秒后反悔，不让它执行）
// setTimeout(() => {
//   clearTimeout(timeoutId); // 传入定时器ID取消
//   console.log("setTimeout被取消，未执行");
// }, 1000);
```
2. setInterval：循环执行，需手动终止
```javascript
运行
// 每隔1000毫秒（1秒），重复执行回调
const intervalId = setInterval(() => {
  console.log("setInterval：每隔1秒，重复执行");
}, 1000);

// 必须手动取消！否则会一直执行（比如5秒后停止）
setTimeout(() => {
  clearInterval(intervalId); // 传入定时器ID取消循环
  console.log("setInterval被取消，停止执行");
}, 5000);
```
// 输出结果：1秒打印1次，共打印4次后停止

**三、关键坑点：为什么 setInterval 容易出问题？**
setInterval 的最大痛点是 “间隔不精准，可能回调叠加”—— 它的逻辑是 “每隔 delay 毫秒触发一次回调”，而非 “前一次回调执行完后，再等 delay 毫秒触发”。
比如：如果回调执行时间超过 delay（比如 delay=1000ms，但回调里有复杂操作耗时 1500ms），下一次回调会 “插队” 执行，导致两个回调叠加，占用过多资源。

**setTimeout每次执行的时间一定是一样的吗？**
1. 主线程被同步代码阻塞（最常见）
```js
// 设置延迟1000ms（1秒）执行
console.log("开始时间：", new Date().getSeconds());
setTimeout(() => {
  console.log("setTimeout执行时间：", new Date().getSeconds()); // 实际延迟≈2秒
}, 1000);

// 主线程有2秒的同步阻塞代码（循环耗时）
const start = Date.now();
while (Date.now() - start < 2000) {} // 占用主线程2秒
console.log("同步代码执行完：", new Date().getSeconds());
```
2. 事件队列排队等待
setTimeout 的回调属于「宏任务」，会被加入宏任务队列。如果队列中还有其他宏任务（比如其他 setTimeout 回调、setInterval 回调、I/O 回调等），当前回调需要排队等待前面的宏任务执行完才能触发，进一步延迟执行时间。
```js
// 第一个宏任务：延迟0ms（理论上立即入队）
setTimeout(() => {
  console.log("第一个setTimeout");
  // 回调内有耗时操作，阻塞宏任务队列
  const start = Date.now();
  while (Date.now() - start < 1000) {}
}, 0);

// 第二个宏任务：同样延迟0ms
setTimeout(() => {
  console.log("第二个setTimeout"); // 实际延迟≈1秒
}, 0);
```

3. 浏览器 / 环境的最小延迟限制
浏览器为了避免频繁触发回调导致性能问题，规定 setTimeout 的 delay 最小有效值为 4ms（HTML5 标准）。如果设置的 delay < 4ms，会被强制改为 4ms，导致实际延迟大于设置值。
示例：
```javascript
运行
// 设置延迟1ms（小于4ms）
setTimeout(() => {
  console.log("延迟1ms实际执行");
}, 1);

// 实际执行延迟≈4ms（浏览器环境下）
```