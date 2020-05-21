# 《JavaScript是如何工作的》 系列博文笔记

[JavaScript是如何工作的 - 系列文章链接](https://segmentfault.com/a/1190000018854431)

## Menu

- [引擎，运行时，调用堆栈](#引擎，运行时，调用堆栈)
- [了解V8，优化编写的代码](#了解V8，优化编写的代码)
- [JS的内存模型](#js的内存模型)

## 引擎，运行时，调用堆栈

> 引擎：V8 -> CallStack调用堆栈 + Heap内存堆 + 其它

> 运行时：(js引擎) + WebApis / NodeJSApis + EventLoop/CallbackQueue

## 了解V8，优化编写的代码

**V8的工作原理**

v8: js source code -> machine code

### v8优化代码的策略

#### 1.内联代码

> 使用被调用函数主体 替换 调用点

```js
function a () {
    console.log(1 + 1);
}

a();
```

```js
console.log(1 + 1);
```

#### 2. 隐藏类

> 优化 JS动态语言在对象实例化之后添加和删除属性

传统实现方式: 字典结构(哈希表)来存储对象属性值在内存中的位置

```js
class A {
    constructor (a, b) {
        this.a = a
        this.b = b
    }
}
var a = new A(1, 2)

// new A时创建一个hash map
// this.a = 1 // => hash map { 'a': $address }
// this.a // => hash map get('a')

// 每次读取存储都需要去hashmap中获取位置
```

隐藏类: 通过类来定义属性的offset, class查找速度由于hash表查找

```js
class A {
    constructor (a, b) {
        this.a = a
        this.b = b
    }
}
var a = new A(1, 2)
a.c = 3
a.d = 3
var a2 = new A(1, 2)
a2.d = 4
a2.c = 4

// new A时创建一个隐藏类C0
// this.a = 1 // => 创建C1 extends C0 + 并记录a在内存中的偏移量
// this.b = 2 // => 创建C2 extends C1 + 并记录b在内存中的偏移量

// a.c = 3 // C3 extends C2
// a.d = 3 // C4 extends C3

// a2.d = 4 // C5 extends C2
// a2.c = 3 // C6 extends C5 // 顺序不同 offset不同 隐藏类则不同
```

#### 3. 代码优化策略

1. 对象属性顺序保持一致，有利于隐藏类的复用
2. 避免动态属性，应在构造函数中分配所有对象的属性
3. 避免稀疏数组
4. 避免使用delete删除对象属性，内存地址稀疏

## JS的内存模型

### Call Stack 调用栈

```js
var a = 1
```

_Identifier: a_

_Call Stack:_

|   Address   | value |
| :---------: | :---: |
| 0012CCGWH80 |   1   |

**a -> 0012CCGWH80 -> 1**

> Attention: 所有基础类型值(string, number, bool)都是分配在栈内存之中，并且值不可变

> a 没有指向时 值为null
> 
> a 有地址指向时 值未初始化时为undefined
> 
> 这也就是为什么 const 需要在声明时初始化值, 因为后续 identifier -> andress过程 在const声明时不可变化

### Heap 堆

```js
var b = []
```

_Identifier: a_

_Call Stack:_

|   Address   |   value   |
| :---------: | :-------: |
| 0012CCGWH80 | 22VVCX011 |

_Heap:_

|  Address  | value |
| :-------: | :---: |
| 22VVCX011 |  []   |

**a -> 0012CCGWH80 -> 22VVCX011 -> []**

> Heap内存 堆可以存储无序的数据
