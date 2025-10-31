## 如和区分数组和对象(基础类型和引用类型)
```js
function getType(data) {
    const typedata = typeof data;
    if(typedata === 'object'){
       if(data === null){
           return 'null';
       }else if(Array.isArray(data)){
           return 'array';
       }else {
           return 'object';
       }
    }else {
        return typedata;
    }

}
```
## 数组去重
```js
const data = document.querySelectorAll('*');
const da = Array.from(data).map((item)=>item.tagName.toLowerCase());
const d = [...new Set(da)];
console.log(d);
```
function unique(arr) {
    return [...new Set(arr)];
}
function unique(arr) {
    const res = [];
    for(let i = 0;i<arr.length;i++){
        if(res.indexOf(arr[i]) === -1){
            res.push(arr[i]);
        }
    }
    return res;
}
##  说说 Javascript 数字精度丢失的问题，如何解决？
原因：js 采用了IEEE 754 标准来表示数字，但是该标准只能表示有限的精度，导致在进行一些计算时会出现精度丢失的问题。
1 个符号位：表示数字的正负。
11 个指数位：表示数字的范围。
52 个尾数位：表示数字的精度。
对于小数：
0.1 + 0.2 === 0.3 // false
整数的话
如果大于 2^53 - 1，就会出现精度丢失的问题。
我们要使用bigint 来解决这个问题。它表示任意精度的整数。

解决小数的问题
比如
```js
function add(a,b){
    const a1 = (a.toString().split('.')[1] || '').length;
    const b1 = (b.toString().split('.')[1] || '').length;
    const max = Math.pow(10,Math.max(a1,b1));

    return (a*max+b*max)/max;
    
}
```
## 什么是防抖和节流？有什么区别？如何实现？

防抖： 在事件n秒后触发，如果在n秒内再次触发，则重新计时。
代码实现：
```js
<!-- HTML部分：一个输入框 -->
<input type="text" id="searchInput" placeholder="输入关键词搜索...">

<script>
// 1. 定义需要防抖的目标函数（比如搜索逻辑）
function handleSearch(value) {
  console.log('执行搜索：', value);
  // 实际开发中可能是接口请求等操作
}

// 2. 用debounce包装目标函数，延迟500ms
const debouncedSearch = debounce(handleSearch, 500);

// 3. 在输入框事件中调用“防抖处理后的函数”
const input = document.getElementById('searchInput');
input.addEventListener('input', function(e) {
  // 调用防抖处理后的函数，传入输入值（参数会被传递给原函数handleSearch）
  debouncedSearch(e.target.value);
});

// 你提供的防抖函数
function debounce(func, delay) {
  let timer = null;
  return function(...args) {
    const context = this; // 保留调用时的this（比如这里的input元素）
    clearTimeout(timer); // 清除上一次的定时器
    timer = setTimeout(() => {
      // 延迟后执行原函数，并绑定正确的this和参数
      func.apply(context, args);
    }, delay);
  };
}
</script>

```
js 节流： 在事件n秒后触发，如果在n秒内再次触发，则不触发。
代码实现
```js
function  j(fn,delay) {
    let timer = 0
    return function(...args) {
        const context = this;
        const now = Date.now();
        if(now - timer >= delay){
            fn.apply(context,args);
            timer = now;
        }
    }
}
```
## 你是怎么理解ES6中 Promise的？使用场景？
Promise 是ES6引入的一个内置的对象，用于表示一个异步操作的最终完成（或失败）及其结果值。
它是为了解决函数回调地狱的问题，
那什么是函数回调地狱？
函数在异步操作完成后，会调用一个回调函数来处理结果。
如果异步操作依赖于其他异步操作，那么就会出现回调函数嵌套的情况，这就形成了函数回调地狱。如果一个结果有问题，那么就会导致后续的回调函数无法执行。在这种情况下，我们要使用 Promise 来解决这个问题。
Promise 它 有三种状态：
1. pending：初始状态，不是成功或失败。
2. fulfilled：意味着操作成功完成。
3. rejected：意味着操作失败。
那怎么使用 Promise 来解决函数回调地狱的问题？

function getList() {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            // 模拟异步操作，1秒后返回一个数组成功的结果
            resolve([1,2,3,4,5]);
        },1000);
        // 模拟异步操作，1秒后返回一个失败的结果
        reject(new Error('获取列表失败'));
    })
}
getList().then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
它还可以链式调用，比如：
```js
getList().then((res)=>{
    console.log(res);
    return res.map((item)=>item*2);
}).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
```
还可以使用 Promise.all 来同时执行多个异步操作，比如：
它是等所有 Promise 都完成后，才会调用 then 方法。
```js
Promise.all([getList(),getList2()]).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
```
这个是 Promise.race ，它会返回第一个完成的 Promise 的结果。
```js
Promise.race([getList(),getList2()]).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
```