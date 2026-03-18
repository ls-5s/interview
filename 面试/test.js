/**
 * 防抖函数：高频触发事件时，只在最后一次触发后等待指定时间再执行函数
 * （或立即执行一次，等待期内不再重复执行）
 * @param {Function} func - 需要防抖处理的目标函数
 * @param {Number} wait - 等待时间（毫秒），触发间隔小于该时间则不执行
 * @param {Boolean} immediate - 是否立即执行：true=首次触发立即执行，等待期内不重复执行；false=最后一次触发后延迟执行
 * @returns {Function} 经过防抖处理后的函数
 */
function debounce(func, wait, immediate) {
  // 定时器ID：用于存储 setTimeout 的返回值，控制定时器的清除和状态判断
  var timeout;
  // 存储目标函数 func 执行后的返回值（支持函数有返回值的场景）
  var result;

  // 闭包核心：返回的防抖处理函数（真正被事件调用的函数）
  var debounced = function () {
    // 保存原函数的执行上下文（this指向），防止定时器改变this指向
    var context = this;
    // 保存原函数的参数，确保防抖后函数能接收原参数
    var args = arguments;

    // 核心逻辑：如果已有定时器，清除上一次的定时器（重新计时）
    if (timeout) clearTimeout(timeout);

    // -------------------------- 立即执行模式 --------------------------
    if (immediate) {
      // callNow 判断是否需要立即执行：
      // 首次触发时 timeout 为 undefined → !timeout = true → 立即执行
      // 等待期内再次触发：timeout 有值 → !timeout = false → 不执行
      var callNow = !timeout;

      // 设置定时器：等待 wait 毫秒后，将 timeout 置为 null（重置状态，允许下一次立即执行）
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);

      // 如果满足立即执行条件，调用原函数（绑定this和参数），并存储返回值
      if (callNow) result = func.apply(context, args);
    }
    // -------------------------- 延迟执行模式（默认） --------------------------
    else {
      // 设置定时器：等待 wait 毫秒后，执行原函数（绑定this和参数）
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }

    // 返回原函数的执行结果（立即执行模式有效，延迟执行模式返回undefined）
    return result;
  };

  // 给防抖函数添加取消方法：手动清除定时器，重置状态
  debounced.cancel = function () {
    // 清除未执行的定时器
    clearTimeout(timeout);
    // 重置定时器ID为null，释放内存
    timeout = null;
  };

  // 返回防抖处理后的函数
  return debounced;
}
