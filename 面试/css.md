# 面试官：说说你对盒子模型的理解?

一、标准开场（定义先稳住）

盒子模型（Box Model） 是浏览器在进行页面布局时，把每个元素都看作一个矩形盒子，它由四个部分组成：

👉 content（内容） + padding（内边距） + border（边框） + margin（外边距）
二、细节展开（内容、内边距、边框、外边距）

二、结构拆解（面试官最想听你讲清楚的）

一个盒子从里到外是这样的：

margin
  border
    padding
      content
1️⃣ content
实际内容区域（文本、图片）
默认 width / height 指的就是它
2️⃣ padding（内边距）
内容和边框之间的空间
会 撑大盒子
3️⃣ border（边框）
包裹 content + padding
也会 影响盒子总尺寸
4️⃣ margin（外边距）
控制元素之间的间距
不会影响自身大小，但会影响布局
三、核心重点（大厂一定会追问🔥）
👉 1. 标准盒模型 vs 怪异盒模型
✅ 标准盒模型（默认）
box-sizing: content-box;

👉 width = content

真实宽度计算：

总宽度 = width + padding + border

box-sizing: border-box;

👉 width = content + padding + border

总宽度 = width（不会再撑大）

👉 2. margin 塌陷（高频拷打🔥）
现象：

两个垂直 margin 会合并，取较大的值

div1 margin-bottom: 20px
div2 margin-top: 30px

最终间距 = 30px（不是50）

# 面试官：css选择器有哪些？优先级？哪些属性可以继承？

这个问题其实是 CSS 三连问（基础 + 深度 + 细节）🔥，答好了直接拉开差距。我给你一版**大厂面试标准答案（结构清晰 + 可直接背）**👇

1️⃣ 基础选择器（必须先说）

```js
* {}           /*通配符 */
div {}         /* 标签选择器 */
.class {}      /* 类选择器 */
# id {}         /* ID选择器*/
```

2️⃣ 组合选择器（面试常考🔥）
div p {}       /*后代选择器 */
div > p {}     /* 子选择器 */
div + p {}     /* 相邻兄弟 */
div ~ p {}     /* 通用兄弟*/

3️⃣ 属性选择器
input[type="text"] {}
a[href^="https"] {}

4️⃣ 伪类选择器（高频🔥）
a:hover {}
li:first-child {}
li:nth-child(2) {}
5️⃣ 伪元素选择器
::before
::after
::first-letter

✅ 优先级从高到低：
!important  >  行内样式  >  ID  >  类/伪类/属性  >  标签  >  *

✅ 权重计算（大厂加分🔥）

👉 可以用“四位数”表示：

!important      → ∞
行内样式         → (1,0,0,0)
ID             → (0,1,0,0)
类/伪类/属性      → (0,0,1,0)
标签/伪元素       → (0,0,0,1)

⚠️ 面试陷阱点（一定要说🔥）

👉 权重相同 → 后写的覆盖前写的（就近原则）

👉 !important 尽量避免（破坏可维护性）
✅ 可以继承的（核心记忆口诀🔥）

👉 “文本相关基本都能继承”

# 面试官：说说em/px/rem/vh/vw区别?

👉 px 是固定单位，em/rem 是相对字体的单位，vh/vw 是相对视口的单位。
1️⃣ px（像素）

👉 绝对单位

1px = 屏幕上的一个像素（逻辑像素）
不会随父元素或根元素变化
width: 100px;
✅ 特点：
精确、稳定
最常用
❌ 缺点：
不利于响应式

2️⃣ em

👉 相对于当前元素的 font-size

.parent {
  font-size: 16px;
}
.child {
  font-size: 2em; /*= 32px*/
}
/*第一层：父 div */
.box {
  font-size: 2em;
  /* 父的父是浏览器默认 16px → 2×16 = 32px*/
}

/*第二层：子 div */
.box .child {
  font-size: 2em;
  /* 父现在是 32px → 2×32 = 64px*/
}

/*第三层：孙 div */
.child .grandson {
  font-size: 2em;
  /* 父现在是 64px → 2×64 = 128px*/
}
3️⃣ rem（重点🔥）

👉 相对于根元素 html 的 font-size

html {
  font-size: 16px;
}
div {
  font-size: 2rem; /*= 32px*/
}

✅ 优点：
不会像 em 一样叠加
统一控制（改 html 就全局变化）

4️⃣ vw / vh（视口单位🔥）

👉 相对于浏览器视口

width: 50vw;  /*屏幕宽度的50% */
height: 100vh; /* 屏幕高度100%*/
✅ 特点：
天然响应式
不依赖父元素
⚠️ 移动端坑（加分点🔥）
✅ 优点：
👉 100vh 在移动端可能不准（浏览器地址栏影响）

# 面试官：css中，有哪些方式可以隐藏页面元素？区别?

1️⃣ display: none

```css
div {
  display: none;
}
```

✅ 特点：
❌ 不占空间
❌ 不可交互
❌ 不会被渲染（直接从渲染树移除）

2️⃣ visibility: hidden
div {
  visibility: hidden;
}
✅ 特点：
✅ 占空间
❌ 不可交互
✅ 仍然参与布局

3️⃣ opacity: 0
div {
  opacity: 0;
}
✅ 特点：
✅ 占空间
✅ 可以交互（重点🔥）
✅ 参与渲染

4️⃣ position: absolute + 移出屏幕
div {
  position: absolute;
  left: -9999px;
}
✅ 特点：
❌ 不在视口中
❌ 一般不可见
⚠️ 仍然存在 DOM
5️⃣ z-index / 层级覆盖
div {
  position: absolute;
  z-index: -1;
}

👉 被其他元素遮挡

三、面试加分点（重点🔥）
👉 1. display: none vs visibility: hidden

👉 核心一句：

display: none → 直接移除布局
visibility: hidden → 保留布局
👉 2. opacity: 0 为什么还能点击？

👉 因为：

元素还在渲染树中
只是“透明”，没有被移除
👉 3. 动画为什么不能用 display？

👉 因为：

display 不能过渡
opacity / visibility 可以做动画
👉 4. 性能差异（大厂会问🔥）

👉 简单答：

display: none → 会触发 回流（reflow）
visibility / opacity → 主要是 重绘（repaint）
四、最佳实践（大厂加分🔥）

👉 你可以主动补一句：

动画：用 opacity
频繁切换：用 visibility / opacity
完全移除：用 display: none
五、一句话总结（收尾🔥）

👉 display 控制“是否存在”，visibility 控制“是否可见”，opacity 控制“透明度”。

# 面试官：怎么理解回流跟重绘？什么场景下会触发？

回流（Reflow）一定会引起重绘（Repaint），但重绘不一定会引起回流。
👉 回流 = 布局发生变化，浏览器需要重新计算元素的几何信息（位置 + 大小）
❗ 常见触发场景（必须会背🔥）
重新计算元素位置
重新计算尺寸
影响其他元素布局（可能“连锁反应”🔥）

```js
改变元素尺寸
width / height / padding / margin / border

改变布局
display / position / float

改变内容
文字变化、图片加载

获取布局信息（重点🔥）
offsetWidth / scrollTop / getComputedStyle
```

面试加分一句：

👉 回流是“重排”，成本高，会影响性能
三、什么是重绘（Repaint）
👉 重绘 = 元素外观发生变化，但不影响布局
会做什么？
重新绘制颜色、背景、阴影等

```js
color
background
visibility
outline
```

👉 1. 为什么回流开销大？

👉 因为：

要重新计算整个布局树
可能导致多次连锁更新（父子、兄弟）

# 面试官：谈谈你对BFC的理解？

一、先给一句标准定义（开场稳住🔥）

👉 BFC（Block Formatting Context，块级格式化上下文）是一个独立的布局区域，内部元素的布局不会影响外部，外部也不会影响内部。

二、BFC 的核心特性（重点🔥）
✅ 1. 内部元素不会影响外部

👉 形成“隔离作用”

✅ 2. 可以包含浮动元素（解决高度塌陷🔥）

👉 普通容器：

.container {
  border: 1px solid red;
}
.float {
  float: left;
}

👉 容器高度塌陷 ❌

👉 开启 BFC 后 ✔

✅ 3. 阻止 margin 重叠（高频🔥）

👉 BFC 内部不会发生 margin 塌陷

✅ 4. 不会与浮动元素重叠

👉 BFC 区域会避开浮动元素

 三、如何触发 BFC（必须会背🔥）

```js
overflow: hidden;
display: flow-root;   /* 推荐🔥 */
float: left/right;
position: absolute/fixed;
display: inline-block;
```

四、BFC 的实际应用（面试最关键🔥）

👉 这一段说出来直接拉开差距！
✅ 1. 清除浮动（最经典🔥）
.container {
  overflow: hidden;
}

👉 利用 BFC 包裹浮动元素
浮动元素会脱离文档流，导致父容器高度塌陷（高度为 0）给父容器触发 BFC → BFC 会强制包裹住内部所有浮动子元素 → 自动撑开父容器高度 → 完成清除浮动
✅ 2. 解决 margin 塌陷
.parent {
  overflow: hidden;
}
✅ 3. 自适应两栏布局（高频🔥）
.left {
  float: left;
  width: 200px;
}
.right {
  overflow: hidden; /*BFC*/
}
👉 BFC 本质是一个“独立布局容器”，常用于解决浮动、高度塌陷和 margin 重叠问题。
在现代开发中：

优先用 flex / grid 替代传统 float
BFC 更多用于兼容和细节控制
flow-root 是更规范的 BFC 触发方式

# 面试官：元素水平垂直居中的方法有哪些？如果元素不定宽高呢？

1. Flex 布局（⭐⭐⭐ 最推荐、最简单）
{
    display: flex;
    justify-content: center;
    align-items: center;
      /*必须给父元素设置高度，否则垂直居中无效*/
  height: 300px;
}
2. grid 布局

```js
   .father {
            display: grid;
            align-items:center;
            justify-content: center;
            width: 200px;
            height: 200px;
            background: skyblue;

        }
```

1. 绝对定位 + margin: auto（✅ 不定宽高）
小众用法，支持不定宽高，利用绝对定位的自动外边距特性。
css
.parent {
  position: relative;
  height: 300px;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

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

首选 Flex 布局：父元素 display:flex + justify-content:center + align-items:center，最简单，完全支持不定宽高；
绝对定位 + transform：子绝父相，top/left:50% + translate(-50%,-50%)，兼容好，支持不定宽高；
Grid 布局：父元素 display:grid + place-items:center，代码极简，现代浏览器首选；

# 面试官：如何实现两栏布局，右侧自适应？三栏布局中间自适应呢？

一、两栏布局（右侧自适应）
✅ 方案一：Flex（最推荐🔥）
.container {
  display: flex;
}

.left {
  width: 200px;
}

.right {
  flex: 1;
}
👍 优点：
简单直观
自适应能力强
现代开发首选
✅ 方案二：BFC（经典面试🔥）
.left {
  float: left;
  width: 200px;
}

.right {
  overflow: hidden; /*触发 BFC*/
}
👍 原理：

👉 右侧形成 BFC，不与浮动重叠 → 自动填满剩余空间
✅ 方案三：Grid
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
}
👍 优点：
语义清晰
专门为布局设计
二、三栏布局（中间自适应）
✅ 方案一：Flex（最推荐🔥）
.container {
  display: flex;
}

.left {
  width: 200px;
}

.right {
  width: 200px;
}

.center {
  flex: 1;
}
✅ 方案二：Grid（最优雅🔥）
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
