// 延迟函数（正确）
function sleep(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, ms);
  });
}

// 标志位：控制红绿灯是否运行
let isRunning = true;

// 红绿灯主函数
async function light() {
  // 标志位为true时循环
  while (isRunning) {
    console.log("🔴 红灯");
    await sleep(1000);

    console.log("🟢 绿灯");
    await sleep(1000);

    console.log("🟡 黄灯");
    await sleep(1000);
  }
}

// 启动红绿灯
light();

// 10秒后停止红绿灯（正确逻辑）
setTimeout(function () {
  isRunning = false;
  console.log("🛑 红绿灯已停止");
}, 10000);
