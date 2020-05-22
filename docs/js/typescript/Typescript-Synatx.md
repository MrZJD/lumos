## 前言

TypeScript是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。


### 基础类型

* boolean
* number
* string
* Array : number[] / Array<元素类型>
* Tuple : <code>let x: [string, number] //元组类型允许表示一个已知元素数量和类型的数组</code>
* Enum : <code>enum Color {Red, Green, Blue}</code>
* any
* void
* null / undefined : 是所有类型的子类型(然而，当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自)
* never

> 类型断言: 告诉编译器不进行特殊的数据类型检查和结构，<code>(&lt;string&gt;someValue) // (someValue as string)</code>

### 解构

```
// 数组
let [first, second] = [1, 2];

// 对象, 重命名, 默认值
let {a: newA, b: newB, c = 100} = {
	a: 'foo',
	b: 12
}

// 函数参数
function f([para1, para2]: [number, number]){}
f([1, 2])

// 函数声明
type C = {a: string, b?: number}
function f2({a, b}: C): void {}

// 区别
function fA({a, b} = {a: "", b: 0}): void{}
function fB({a, b=0} = {a: ""}): void{}
```

### 接口

```
interface Config {
	config?: string; // 可选属性
	width?: number;
	readonly x: number; // 只读属性
	[propName: string]: any; // 字符串索引签名
}

//可索引类型

interface StringArray {
	[index: number]: string;
}

interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

//类型方法
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

//扩展
interface Shape {
    color: string;
}
interface Square extends Shape {
    sideLength: number;
}

```

### 类

1. 理解private protected public
2. 参数属性

```
	private name: string;
	constructor (theName: string) {
		this.name = theName;
	}
	constructor(private name: string) { }
```
3. setter/getter
4. static
5. abstract class

### 函数

1. 函数类型

```
// 完整类型
let myAdd: (x:number, y:number)=>number =
    function(x: number, y: number): number { return x+y; };
// 使用类型推断
let myAdd2: (baseValue:number, increment:number) => number =
    function(x, y) { return x + y; };
```

2. 可选默认参数类型

```
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
function buildName(firstName: string, lastName?: string) {
    // ...
}
```

3. 剩余参数

```
function buildName(firstName: string, ...restOfName: string[]) {
	return firstName + " " + restOfName.join(" ");
}
```

4. 重载

```
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}
```

### 泛型

```
function identity<T>(arg: T): T {}

let myIdentity: <U>(arg: U) => U = identity;

// 泛型接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}
let myIdentity: GenericIdentityFn = identity;

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

### 高级类型

1. <T & U> 交叉
2. padding: string | number; 联合
3. type Name = string; 类型别名
4. 字符串字面量

```
type Easing = "ease-in" | "ease-out" | "ease-in-out";
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
    // ... code goes here ...
}
```

### Symbols

1. Symbols是不可改变且唯一的
2. es6+
3. 用于键值

### let..of/in..

1. 当一个对象实现了Symbol.iterator属性时，我们认为它是可迭代的
1. let val of list
2. let key in list

### 装饰器

> 了解Metadata - 参考reflect-metadata库(metadata api)

```
//1. 类装饰器: 应用于类构造函数
function sealed(constructor: Function) {} //@sealed

//2. 方法装饰器: 应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}
@enumerable(false)
greet() {
	return "Hello, " + this.greeting;
}

//3. 属性装饰器
@format("Hello, %s")
greeting: string;


//4. 参数装饰器
@validate
greet(@required name: string) {
	return "Hello " + name + ", " + this.greeting;
}
```

### 附录-[TypeScript w3cschool教程](https://www.w3cschool.cn/typescript/typescript-tutorial.html)


















