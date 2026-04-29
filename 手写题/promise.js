class MyPromise {
  // 初始状态
  constructor(executor) {
    this.status = "pending";
    this.value = null; // 成功值
    this.reason = null; // 失败原因
    // 存储then回调
    this.onFulfilled = null;
    this.onRejected = null;

    // 成功函数
    const resolve = (val) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = val;
        // 异步执行回调
        this.onFulfilled && this.onFulfilled(val);
      }
    };

    // 失败函数
    const reject = (err) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = err;
        this.onRejected && this.onRejected(err);
      }
    };

    // 执行传入的执行器函数
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // 简易then方法
  then(successCb, failCb) {
    this.onFulfilled = successCb;
    this.onRejected = failCb;
  }
}
