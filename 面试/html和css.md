# 面试官：说说你对盒子模型的理解?

 盒子模型是浏览器进行布局计算的基础模型，一个元素由 content、padding、border、margin 组成，核心差异在于 box-sizing 对尺寸计算方式的影响。

二、标准盒子模型
标准盒子模型，是浏览器默认的盒子模型

下面看看标准盒子模型的模型图：

从上图可以看到：

盒子总宽度 = width + padding + border + margin;

盒子总高度 = height + padding + border + margin

也就是，width/height 只是内容高度，不包含 padding 和 border值

所以上面问题中，设置width为200px，但由于存在padding，但实际上盒子的宽度有240px

三、IE 怪异盒子模型
同样看看IE 怪异盒子模型的模型图：

从上图可以看到：

盒子总宽度 = width + margin;

盒子总高度 = height + margin;

也就是，width/height 包含了 padding和 border值

 Box-sizing
CSS 中的 box-sizing 属性定义了引擎应该如何计算一个元素的总宽度和总高度

语法：

box-sizing: content-box|border-box|inherit:
content-box 默认值，元素的 width/height 不包含padding，border，与标准盒子模型表现一致
border-box 元素的 width/height 包含 padding，border，与怪异盒子模型表现一致
inherit 指定 box-sizing 属性的值，应该从父元素继承
回到上面的例子里，设置盒子为 border-box 模型

```
<style>
  .box {
    width: 200px;
    height: 100px;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
<div class="box">
  盒子模型
</div>
```

# 开发一个无限下拉加载图片的页面，如何给每个图片绑定 click 事件？

无限下拉场景中，应使用事件委托（Event Delegation），把 click 事件绑定在父容器上，而不是逐个绑定到图片节点。

【1. 为什么不能给每个图片单独绑定？（面试关键🔥）】

假设你这么写：

images.forEach(img => {
  img.addEventListener('click', handler)
})

❌ 1. 性能问题

图片很多（上千）

每个节点一个监听器 → 内存占用高 + 注册成本高

❌ 2. 动态内容失效

无限滚动会不断新增图片

新节点不会自动绑定事件

👉 你还得重新绑定 → 很麻烦

❌ 3. 不利于维护

逻辑分散

容易出现重复绑定 / 内存泄漏

【2. 正确方案：事件委托（核心🔥）】

👉 利用 事件冒泡机制，统一在父容器处理

const container = document.getElementById('image-list')

container.addEventListener('click', function (e) {
  const target = e.target

  if (target.tagName === 'IMG') {
    console.log('点击了图片：', target.src)
  }
})
【3. 原理（面试加分🔥）】

👉 点击流程：

img → div → body → document

# 面试官：css选择器有哪些？优先级？哪些属性可以继承？

CSS 选择器用于定位元素，优先级由 !important > 行内样式 > id > class/属性/伪类 > 标签/伪元素 > 通配符 决定，而可继承属性主要集中在文本和字体相关属性。

【4. 面试加分点（大厂思维🔥）】
✅ 1. 如何强制继承？
color: inherit;
✅ 2. 如何重置继承？
all: unset;
✅ 3. 为什么设计继承机制？

👉 本质：

减少重复代码

提高样式一致性

提升渲染效率

color: inherit;
✅ 2. 如何重置继承？
all: unset;

# 面试官：说说em/px/rem/vh/vw区别?

【0. 一句话结论】

px 是绝对单位，em/rem 是相对字体的单位，vh/vw 是相对视口的单位，它们分别解决固定布局 / 字体缩放 / 响应式布局问题。

【1. 基础概念（What）】
1️⃣ px（像素）
绝对单位（CSS 像素）
不随父元素变化
设备上会做 DPR 适配（不是物理像素）

👉 特点：稳定、可控

2️⃣ em
相对单位
相对于 当前元素的 font-size

👉 计算规则：

1em = 当前元素的 font-size

👉 特点：会继承 + 会叠加（容易失控）

3️⃣ rem（root em）
相对于 根元素 html 的 font-size

👉 计算规则：

1rem = html 的 font-size

👉 特点：全局统一，避免 em 级联问题

4️⃣ vw / vh（viewport）
相对于视口尺寸
1vw = 视口宽度的 1%
1vh = 视口高度的 1%

# 面试官：元素水平垂直居中的方法有哪些？如果元素不定宽高呢？
