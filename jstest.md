```js
function login(name,password) {
    return new Promise((resolve,reject)=> {
        console.log('登录请求:.............', name, password);
        
        if(name === 'admin' && password === '123456'){
            // 模拟登录成功，返回token和用户信息
            resolve({token:'abc123',user:{name:'管理员'}});
        }else{
            // 模拟登录失败
            reject(new Error('用户名或密码错误'));
        }
    })
}
login('admin','123456')
    .then((userInfo)=>{
        console.log('登录成功:',userInfo);
    })
    .catch((error)=>{
        console.error('登录失败:',error.message);
    }).finally(()=>{
        console.log('登录请求结束');
    })
```