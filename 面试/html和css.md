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
