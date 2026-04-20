// 手写 Promise 版 Ajax（腾讯面试高频标准答案）
function ajax(url) {
  // 返回 Promise 处理异步
  return new Promise((resolve, reject) => {
    // 1. 创建 XHR 实例
    const xhr = new XMLHttpRequest();

    // 2. 初始化请求：GET 请求、地址、异步true
    xhr.open("GET", url, true);

    // 3. 监听请求状态变化
    xhr.onreadystatechange = function () {
      // 状态4 = 请求完成
      if (xhr.readyState === 4) {
        // 状态码 200 ~ 300 都算成功（更标准）
        if (xhr.status >= 200 && xhr.status < 300) {
          // 成功：把后端字符串转成对象
          resolve(JSON.parse(xhr.responseText));
        } else {
          // 失败
          reject("请求失败，状态码：" + xhr.status);
        }
      }
    };

    // 监听网络错误（断网）
    xhr.onerror = function () {
      reject("网络异常");
    };

    // 4. 发送请求
    xhr.send(null);
  });
}
