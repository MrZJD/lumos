# IoC & DI 模式 , 以及其在js中的运用

IoC (Inverse of Control) 控制反转: 调用者不再依赖被调用者的实例 由容器实现

DI (Dependence Injection) 依赖注入: 容器创建好实例后再注入调用者

## Why IoC?

without ioc

```js
class Tire {
    constructor () {
        this.size = 30
    }
}

class Bottom {
    constructor (tire) {
        this.tire = new Tire()
    }
}

class CarFrame {
    constructor () {
        this.bottom = new Bottom()
    }
}

class Car {
    constructor () {
        this.frame = new CarFrame()
    }
}

var car = new Car()
// 控制器分散在每一层
```

with ioc

```js
class Tire {
    constructor (size) {
        this.size = size
    }
}

class Bottom {
    constructor (tire) {
        this.tire = tire
    }
}

class CarFrame {
    constructor (bottom) {
        this.bottom = bottom
    }
}

class Car {
    constructor (frame) {
        this.frame = frame
    }
}

// 这里才是实际的控制器
var tire = new Tire(10)
var bottom = new Bottom(tire)
var frame = new CarFrame(bottom)
var car = new Car(frame)
```

## More Situation 更多场景助于理解

```js
// 需求编写一个狗吃骨头的程序
class Animal {
    eat () {
        console.log(`${this} eat ${this.food}`)
    }
}
class Bone {
    constructor () {
        this.type = 'Bone'
    }
    toString () {
        return this.type
    }
}
class Dog extends Animal {
    constructor () {
        super()
        this.type = 'Dog'
        this.food = new Bone()
    }
    toString () {
        return this.type
    }
}

// main
let dog = new Dog()
dog.eat()
```

```js
// 需求变换 狗吃鱼
// ...
class Fish {
    constructor () {
        this.type = 'Fish'
    }
    toString () {
        return this.type
    }
}
class Dog extends Animal {
    constructor () {
        super()
        this.type = 'Dog'
        this.food = new Fish()
    }
    toString () {
        return this.type
    }
}
// ...
// main
let dog = new Dog()
dog.eat()
```

```js
// 需求再变换 猫吃鱼
// ...
class Fish {
    constructor () {
        this.type = 'Fish'
    }
    toString () {
        return this.type
    }
}
class Cat extends Animal {
    constructor () {
        super()
        this.type = 'Cat'
        this.food = new Fish()
    }
    toString () {
        return this.type
    }
}
// ...
// main
let cat = new Cat()
cat.eat()
```

With IoC

```js
class Animal {
    eat () {
        console.log(`${this} eat ${this.food}`)
    }
}
class Bone {
    constructor () {
        this.type = 'Bone'
    }
    toString () {
        return this.type
    }
}
class Fish {
    constructor () {
        this.type = 'Fish'
    }
    toString () {
        return this.type
    }
}
class Dog extends Animal {
    constructor (food) {
        super()
        this.type = 'Dog'
        this.food = food
    }
    toString () {
        return this.type
    }
}
class Cat extends Animal {
    constructor (food) {
        super()
        this.type = 'Cat'
        this.food = food
    }
    toString () {
        return this.type
    }
}

// main
let food = new Bone()
let animal = new Dog(food)
animal.eat()

// 需求变化
let food = new Fish()
let animal = new Dog(food)
animal.eat()

// 需求变化
let food = new Fish()
let animal = new Cat(food)
animal.eat()
```

> 注意区别js的函数式编程 与 OOP编程的模式区别

> js很多时候就是写函数，所以依赖都抽象成函数参数的形式
> 而OOP编程很多时候需要在 构造器中指定依赖数据
> 对于IoC模式而言，本质上都是希望依赖前置，将依赖单独成配置，而不是写在逻辑之中
> 核心思想依然是 **面向接口编程**
> 显而易见的提升就是 我们不在需要在业务代码中实例化对象作为依赖。当我们的逻辑需要依赖时 -> 直接去provider中获取对应的实例。

## DI 依赖注入

```js
// 在上面的app主逻辑中
let food = new Fish()
let animal = new Cat(food)
animal.eat()

/* with di */
// let container help us
let _cache = {}
_cache.food = new Fish()
_inject(animal.constructor, _cache.food)

// main
let animal = new Cat()
animal.eat()
```

> 最后我们只需要修改容器中的配置依赖即可 (这里的配置依赖，可以通过依赖注入，或者依赖查找)

## 更具体的例子

without ioc

```js
// 需求从list.json中获取数据并渲染html显示
// Loader.js
export default class Loader {
    constructor(url) {
        this.url = url;
    }

    async load() {
        let result = await fetch(this.url);
        return result.text();
    }
}

// List.js
import Loader from './Loader';
export default class List {
    constructor(container) {
        this.container = container;
        this.loader = new Loader('list.json');
    }

    async render() {
        let items = await this.loader.load();
        this.container.textContent = items;
    }
}

// main.js
import List from './List';
let list = new List(document.getElementById('a'));
List.render();
```

with ioc

```js
// List.js
export default class List {
    constructor(container, loader) {
        this.container = container;
        this.loader = loader;
    }

    async render() {
        this.container.textContent = await this.loader.load();
    }
}

// ThirdLoader.js
import {request} from '../third/sdk';
export default class ThirdServiceLoader {
    async load() {
        return request();
    }
}

// main.js
import List from './List';
import Loader from './Loader';
import ThirdLoader from './ThirdLoader';
let listA = new List(document.getElementById('a'), new Loader('list.json'));
listA.render();

let listB = new List(document.getElementById('b'), new ThirdLoader());
listB.render();
```

## bearcat 实现 (es5)

_src/bearcat_

```js
// config.js 导出元数据
module.exports = {
    name: "bearcat ioc",
    beans: [{
        "id": "animal",
        "func": "Cat",
        "props": [{
            "name": "food",
            "ref": "Fish"
        }]
    }, {
        "id": "Bone",
        "func": "Bone"
    }, {
        "id": "Fish",
        "func": "Fish"
    }]
}
// main.js
const bearcat = require('bearcat')

bearcat.createApp([
    require.resolve('./class/config.js')
])

bearcat.start(function () {
    let animal = bearcat.getBean('animal')
    animal.eat()
})
```

## typescript decorators实现

_src/typescript_

```js
// 装饰器实现 injector.ts
let dependenciesMap = {}

export let injector = {
    resolve: function (constructor) {
        let deps = dependenciesMap[constructor.name]
        deps = deps.map((dependency) => {
            return dependenciesMap[dependency.name] ? injector.resolve(dependency.fn) : new dependency.fn()
        })

        let mockContructor: any = function () {
            constructor.apply(this, deps)
        }
        mockContructor.prototype = constructor.prototype

        return new mockContructor
    }
}

export function Inject (...deps) {
    return function (constructor) {
        dependenciesMap[constructor.name] = deps.map(dep => ({
            name: dep.name,
            fn: dep
        }))
        return constructor
    }
}

export default {
    Inject, injector
}

// di - cat.ts
import Animal from './Animal'
import { Inject } from '../Injector/Injector'
import Fish from './Fish'

@Inject(Fish)
export default class Cat extends Animal {
    type: String = 'Cat'
    food

    constructor (food) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}

// main.js
@Inject(Cat)
class App {
    constructor (animal: Animal) {
        animal.eat()
    }
}

var app = injector.resolve(App)
```

## 基于ts的inversify实现 - 最佳实践

_src/inversify_

```js
// 1. define DI TYPES - TYPES.ts
const TYPES = {
    Animal: Symbol.for('Animal'),
    Food: Symbol.for('Food')
}

export { TYPES }

// 2. 配置注入文件 - config.ts
import { Container } from 'inversify'
import { TYPES } from './TYPES'

import Dog from './class/Dog'
import Bone from './class/Bone'

const container = new Container()
container.bind(TYPES.Animal).to(Dog)
container.bind(TYPES.Food).to(Bone)

export { container }

// 3. 入口 - index.ts
import { container } from './config'
import Animal from './class/Animal'
import { TYPES } from './TYPES'

const animal = container.get<Animal>(TYPES.Animal)
animal.eat()

// 4. 其余的逻辑class参考 - Dog.ts
import Animal from './Animal'
import { injectable, inject } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../TYPES'

@injectable()
class Dog extends Animal {
    type: String = 'Dog'
    food

    constructor ( @inject(TYPES.Food) food: any ) {
        super()

        this.food = food
    }

    toString (): String {
        return this.type
    }
}

export default Dog
```

### Reference参考

[细数Javascript技术栈中的四种依赖注入](https://www.cnblogs.com/front-end-ralph/p/5208045.html)

[深入理解DIP、IoC、DI以及IoC容器](http://www.cnblogs.com/liuhaorain/p/3747470.html)

[ioc framework: bearcat](https://github.com/bearcatjs/bearcat)

[InversifyJS](http://inversify.io/)