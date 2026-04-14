function thr(func, wait) {
  var lastTime = 0;
  var thrd = function () {
    var now = Date.now();
    var context = this;
    var args = arguments;
    if (now - lastTime >= wait) {
      func.apply(context, args);
      lastTime = now;
    }
  };
  return thrd;
}

// 要执行的函数
function handleClick() {
  console.log("按钮被点击了！");
}

// 包装成节流函数：每隔 1000ms 执行一次
const throttleClick = thr(handleClick, 1000);

// 高频场景（背这 3 个就够）
// 滚动条滚动 scroll（下拉加载、滚动监听）
// 高频点击（秒杀、抢购）
// 游戏技能冷却
