官网这样介绍
> Rx: An API for asynchronous programming with observable streams

文档中这样介绍
> ReactiveX 结合了 观察者模式、迭代器模式 和 使用集合的函数式编程，以满足以一种理想方式来管理事件序列所需要的一切

### Rx Programming Model-编程范式

<p style="display:block;">核心概念：Observable, Observer, Operator, Subscription, Subscriber</p>

```
var stream$ = Rx.Observable.create(subscriber); // 1 -> 定义Observable
stream$.opt().opt(); // 2 -> 流操作 Operators操作符来操作数据流

var subscription = stream$.subscribe(observer); // 3 -> 订阅Observable -> 开始观察数据流
subscription.unsubscribe(); // 4 -> (可选)停止观察
```

### Observable - 可观察对象

* 在同一 Observable 的多个观察者之间是不共享的 -> 即状态不共享

```
Rx.Observable.of('foo', 'bar'); //从一个值或多个值
Rx.Observable.from([1, 2, 3]); //从数组
Rx.Observable.fromEvent(document.querySelector('button'), 'click'); //从事件
Rx.Observable.fromPromise(fetch('/users')); //从Promise
Rx.Observable.bindCallback(fs.exists); //从回调函数
Rx.Observable.create //- 自定义
```

```
stream$.subscribe(observer); //- 订阅-表示 Observable 的执行
```

### Observer - 观察者
```
var observer = {
    next: x => console.log('Got value: ', x),
    error: err => console.error('Error occurred: ', err),
    complete: () => console.log('Stream Done')
}
```

### Subscriber - 对观察者的操作

```
var subscriber = (observer) => {
    observer.next(1);
    observer.next(2);
    observer.complete();
    observer.error("Wrong Value");

    return function unsubscribe() {
        console.log("observable clean");
        clearInterval(interId);
    };
}
```

### Subscription - 观察者观察的控制 - 订阅对象/可清理资源的对象

```
var subsciption = observable.subscribe(observer);
subsciption.unsubscribe();
```

### Operator - 操作符 - *重点*

1. 1. 操作符是 Observable 类型上的方法
2. 2. 当操作符被调用时，它们不会改变已经存在的 Observable 实例。相反，它们返回一个新的 Observable ，它的 subscription 逻辑基于第一个 Observable
3. 3. 操作符是纯函数 (pure function)，它基于当前的 Observable 创建一个新的 Observable。这是一个无副作用的操作：前面的 Observable 保持不变。
4. 4. 订阅输出 Observalbe 同样会订阅输入 Observable - 操作符订阅链


* 创建操作符：from / range / of
* 多流操作符：combineLatest / concat / merge / zip
* 数学操作符：max / min / reduce
* 时间操作符：timer / take / delay / sampleTime / debounceTime / throttleTime
* 分组操作符：buffer / bufferTime / groupBy
* 异常处理： catch / retry / retryWhen

<p style="display:block;">更多代码详情看Demo Code</p>

<p style="display:block;">自定义操作符</p>

```
// - 创建自定义操作符
// * 操作符应该永远返回一个 Observable
// * 确保对你的操作符返回的 Observalbe 内部所创建的 subscriptions 进行管理
// * 确保处理传入函数中的异常
// * 确保在返回的 Observable 的取消订阅处理方法中释放稀缺资源

// -> 原理添加一个中间层代理，响应变化
function mySimpleOperator(cb) {
    return Rx.Observable.create(subscriber => {
        var source = this;

        var subsciption = source.subscribe(value => {
            try {
                subscriber.next(cb(value));
            } catch (err) {
                subscriber.error(err);
            }
        }, err => subscriber.error(err), () => subscriber.complete())
        
        return subsciption;
    });
}
```

### Subject - 多播外部Observer

<p style="display:block;"> (Observable --传值--> Subject --multicast--> Subscriber)</p>

```
var multicasted$ = Observable.multicast(Subject);
multicasted$.connect();
```
<p style="display:block;">refCount - 通常，当第一个观察者到达时我们想要自动地连接，而当最后一个观察者取消订阅时我们想要自动地取消共享执行，产生引用计数refCount</p>

```
var refCountSource = Rx.Observable.interval(1000);
var refCountSubject = new Rx.Subject();

var refCounted = refCountSource.multicast(refCountSubject).refCount();
var subScription1, subScription2;

console.log("RefCountObs A Connect!");
subScription1 = refCounted.subscribe(v => console.log("RefCountObs A:", v));

setTimeout(() => {
    console.log("RefCountObs B Connect!");
    subScription2 = refCounted.subscribe(v => console.log("RefCountObs B:", v));
}, 3000);

setTimeout(() => {
    console.log('RefCountObs A unsubscribed');
    subScription1.unsubscribe();
}, 5000);

setTimeout(() => {
    console.log('RefCountObs B unsubscribed');
    subScription2.unsubscribe();
}, 7000);
```

### Scheduler - 调度器
* 调度器控制着何时启动 subscription 和何时发送通知。
* 调度器可以让你规定 Observable 在什么样的执行上下文中发送通知给它的观察者。
* 是一种数据结构, 是执行上下文, 有一个(虚拟的)时钟


### 编写弹珠测试 - Marbles Test

```
var { marbles } = require('rxjs-marbles');
var merge = require('rxjs').Observable.merge;

// - 编写弹珠测试
// - unit test func
// - hot(marbles: string, values? : object, error? : any) - 已经在运行中的Observable - 可以使用'^'表示初始帧所在位置
// - code(marbles, values, error) - 当测试开始时开始订阅
// - expectObservable(actualObs).toBe(marbles, values, error) - 断言
// - expectSubscription(actualSubscriptionLogs).toBe(subscriptionMarbles) - 订阅返回值的断言

// Synatx
// '^' -> subscribe订阅点
// '-' -> 10帧
// '|' -> Observable.empty() // complete()
// '#' -> Observable.throw() // error()
// 'a' -? next('a')
// '(abc)' -> next('a') //—> 多个事件同时发出值

// '!' -> 取消订阅时间点

describe('Test', () => {
    it('demo1', marbles((m) => {
        var e1 = m.hot('--^--b-------c--|');
        var e2 = m.hot( '-^--e---------f----|');
        var expected =   '---(be)----c-f----|';

        m.expect(e1.merge(e2)).toBeObservable(expected);
    }));
});
```

### 应用的状态处理

<p style="display:block;">应用的状态与存储</p>

```
var incre$ = Rx.Observable.fromEvent(document.querySelector("#app .incre"), "click")
    .map(() => state => Object.assign({}, state, { count: state.count + 1 }));

var decre$ = Rx.Observable.fromEvent(document.querySelector("#app .decre"), "click")
    .map(() => state => Object.assign({}, state, { count: state.count - 1 }));

var inputEnter$ = Rx.Observable.fromEvent(document.querySelector("input"), "keypress")
    .map(ev => state => Object.assign({}, state, { inputVal: ev.target.value }));

var state$ = Rx.Observable.merge(incre$, decre$, inputEnter$) // - 合并状态
    .scan((state, changeFn) => changeFn(state), { count: 0, inputVal: "" });

state$.subscribe(state => {
    document.querySelector("#app .state").innerHTML = state.inputVal + state.count;
});
```

### Todo List

* Auto Complete - 智能补全
* Infinite Scroll - 无限滚动
* Market Cart - 购物车案例

















