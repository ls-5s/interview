## 浅拷贝（Shallow Copy）与深拷贝（Deep Copy）解析及深拷贝函数实现
浅拷贝:
他是创建一个新的对象，拷贝原来的对象，如果是基本类型，就拷贝值，如果是引用类型，就拷贝地址。它只拷贝最外面的一层
我一般使用// 浅拷贝：扩展运算符const shallowCopy = { ...original };实现
深拷贝：
深拷贝是创建一个新的对象，拷贝原来的对象，如果是基本类型，就拷贝值，如果是引用类型，就递归拷贝。和浅拷贝不同的是，深拷贝会拷贝所有的层级。和原来的是两个独立的个体
我一般使用// 深拷贝：JSON.parse(JSON.stringify(original));实现
JSON.parse（JSON.stringify(original));序列化会剥离原对象的内存引用关系,解析过程中，会为字符串中的每一个值（包括嵌套的对象、数组）在内存中创建新的存储空间：基本类型会生成新的值，引用类型会生成新的对象 / 数组（与原对象的引用类型完全独立）。

手写deepClone函数
```js
function deepClone(target, map = new WeakMap()) {
    if( target instanceof Date) return new Date(target )
    if( target instanceof RegExp) return new RegExp(target)
    // 判断之前是否拷贝过，如果是，直接返回
    if(map.has(target)) return map.get(target)

    const CloneTarget = Array.isArray(target) ? [] : {}
    map.set(target, CloneTarget)


    // for(let key in target){
    //     if(target.hasOwnProperty(key)){
    //         CloneTarget[key] = deepClone(target[key], map)
    //     }
    // }
    for(let key of target) {
        if(target.hasOwnProperty(key)){
            CloneTarget[key] = deepClone(target[key], map)
        }
    }
    return CloneTarget
}
 
```
浅拷贝