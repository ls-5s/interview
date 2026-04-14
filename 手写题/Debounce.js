function debounce(func, wait) {
  var timeout = null;
  var deb = function () {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
  return deb;
}
function test() {
  console.log("我执行了！");
}
var deb = debounce(test, 5000);
deb();
// 高频场景（背这 4 个就够）
// 输入框搜索（输完再发请求）
// 按钮频繁点击（防止重复提交）
// 窗口大小改变 resize
// 鼠标移动 mousemove
