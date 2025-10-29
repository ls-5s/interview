# css 的盒子模型的理解
在html 页面所以的元素都可以看成一个盒子
盒子:magrin + padding +border + content
标准盒子模型 magrin + padding +border + content

IE 盒子模型 magrin + content(padding + border)

盒子总宽度 = width + margin;
盒子总高度 = height + margin;
box-sizing :content-box / border-box

# css 选择器的优先级
css 样式渲染，给同一个项目设置不同的样式，哪个选择器的优先级高，就渲染哪个选择器的样式
!important > 行内样式 > id 选择器 > 类选择器/伪类选择器 > 通配符选择器 > 全局选择器

# px 和rem 单位的区别
px是像素,显示器上给我们呈现画面的像素，每个像素的大小一样，绝对单位长度
rem 是相对单位，相对于html 根节点的font-size 的值，默认是16px
1rem = 16px
{
    html {
        font-size: 50%
    }
}