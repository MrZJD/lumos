### 架构图

```txt
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

node index.js -> init event loop
              -> handler script
              -> handed
              -> enter event loop

### Process 1 timers

定时器阶段：timerQueue = []

```js
if (timerQueue.length === 0) {
    next()
} else {
    FIFO(timerQueue) // FIFO 执行队列
    next()
}
```

### Process 2 pending callbacks

该阶段执行系统相关错误的回调 如TCP ECONNREFUSED: sysQueue = []

```js
if (sysQueue.length === 0) {
    next()
} else {
    FIFO(sysQueue) // FIFO 执行队列
    next()
}
```

### Process 3 idle, prepare

系统内部使用，不讨论

### Process 4 polling

轮询阶段：

```js
const pollingQueue
const thereHasImmediate

// Calculating how long it should block and poll for I/O
const blockDuration = calc()

if (pollingQuene.length !== 0) {
    FIFO(pollingQuene) // FIFO 执行队列
} else {
    if (thereHasImmediate) {
        next()
    } else {
        waiting() // 阻塞等待
        FIFO(pollingQuene)
    }
}

// has timer need to be execed
goto(timerProcess)
```

### Process 5 check

> setImmediate() is actually a special timer that runs in a separate phase of the event loop

```js
exec(immediate)
next()
```

### Process 6 close callbacks

```js
exec(errors)
goto(timerProcess) // -> timers
```

### 结论

1. 其实整个event loop主要分为两类execCallbacks(执行回调)和polling(轮询等待)

2. setImmediate 的怪异表现的分析

```js
setTimeout(() => {
    console.log('timeout')
})

setImmediate(() => {
    console.log('immediate')
})

// 二者执行顺序是随机的
```

```js
setTimeout(() => {
    setTimeout(() => {
        console.log('timeout')
    })

    setImmediate(() => {
        console.log('immediate')
    })
})

// 执行顺序依然随机
```

```js
fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout')
    })

    setImmediate(() => {
        console.log('immediate')
    })
})

// 执行顺序不随机
```

> 解释：在polling阶段执行的脚本结束后才会判断是否有immediate，如果有则执行。而timer的执行时间并不准确。而fs io polling之后会检测是否有immediate脚本，如果有则直接执行，导致了immediate > timer

### Code分析

```js
var fs = require('fs');

fs.readFile('test.txt', function(err, data){
  console.log('io')
})

setTimeout(function(){
  console.log('timer')
})

var a;
console.time('process')
for(var i = 9000000000; i > 0; i--) {
  a = 1;
}
console.timeEnd('process')

setImmediate(function(){
  console.log('setImmediate')
})

// output: (stable)
// timer
// setImmediate
// io
```

> timer > setImmediate 因为主程序阻塞。immediate > io 只能说明 两者不在同一个loop周期中，根据v友编译node源代码的执行结果表明: loop1: -> process loop2: -> timer -> io -> immediate。说明根据eventloop的执行流程这一块是没有问题。出现这个现象的原因，可能是node fs等io模块对libuv做了优化，导致immediate与io不在同一个loop之中

v2ex讨论见下面两贴

[关于 nodejs event loop: immediate io polling 执行序列的问题](https://www.v2ex.com/t/536584)
[Node.js 事件循环](https://www.v2ex.com/t/536121#reply3)

### 最后

关于EventLoop正如许多大神说的那样，了解其中的机制，以及浏览器与Nodejs模型中的异同点即可。在实际编码中我们也不会依赖于异步回调的执行时机来编写业务逻辑。

### Reference参考链接

[深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)

[深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser)

[event-loop-timers 官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

[[译]事件循环总览—— Nodejs 事件循环 Part 1](https://github.com/zhangxiang958/zhangxiang958.github.io/issues/43)
