const userArr = [
    { name: '张三', age: 25 },
    { name: '李四', age: 20 },
    { name: '王五', age: 30 }
];
// 按 age 升序排序
userArr.sort((a, b) => b.age - a.age);
console.log(userArr);
// 输出：[{name: '王五', age: 30}, {name: '张三', age: 25}, {name: '李四', age: 20}]
