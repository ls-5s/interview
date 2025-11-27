## 面试官：说说JavaScript中的数据类型？存储上的差别？
基础数据类型和引用数据类型
对象数组函数，、
number ,string ,null,underfined,symbol,boolean
简单类型的值存放在栈中，在栈中存放的是对应的值
引用类型对应的值存储在堆中，在栈中存放的是指向堆内存的地址
不同的类型数据导致赋值变量时的不同：
简单类型赋值，是生成相同的值，两个对象对应不同的地址
复杂类型赋值，是将保存对象的内存地址赋值给另一个变量。也就是两个变量指向堆内存中同一个对象
## 面试官：数组的常用方法有哪些？
增：a.push(),unshift(),concat(),splice()
删：pop(),shift(),splice()
查： indexof(),includes()
改 splice()
迭代方法
some() every()
map() find()
forEach()
filter()
reduce()
## 面试官：谈谈 JavaScript 中的类型转换机制 ?
显示转换，和 隐式转换
比较运算（==、!=、>、<）、if、while需要布尔值地方
算术运算（+、-、*、/、%）
## 面试官：== 和 ===区别，分别在什么情况使用








