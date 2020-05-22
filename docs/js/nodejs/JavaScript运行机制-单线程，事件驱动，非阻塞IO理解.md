## Nodejs-单线程？多线程？

单线程
> 总所周知，Nodejs一直以单线程，事件驱动，非阻塞IO标榜自己的并发处理。这也导致Nodejs在处理CPU密集任务时无法充分利用多核CPU的效率。
> **但实际上，Nodejs的单线程指的是自身JavaScript运行环境的单线程，Nodejs在Javascript接口上并没有创建新线程的能力。**

单线程的I/O如何处理？
> Nodejs中的IO为文件IO和网络IO（libuv实现）
> filesystem, DNS操作 -> 通过Thread Pool线程池实现
> net.io -> epoll, IOCP, kqueue来实现

所以Nodejs底层内部是有多线程的处理的，那如何与Javascript通讯呢？ - 事件驱动

**重点-JavaScript异步模型**
> JavaScript Api -> 调用异步方法，注册回调函数 -> 封装成一个异步请求对象，将这个对象推入I/O线程池等待执行 -> JavaScript 代码继续执行(非阻塞)
> 新线程或epoll等方式，执行IO操作 -> I/O完成后 -> 为请求对象添加result请求结果 -> 添加进事件队列中 -> 时间循环执行回调
> 底层平台(浏览器/Nodejs)维护这个I/O线程池，JavaScript代码没有创建新线程

**事件循环：**
> 在我们编写一个C程序求两个add的结果时，程序计算出来后输出结果，该进程就退出了。
> 那么在JavaScript中在此基础上再绑定一个IO事件，程序是不会在计算add结果后就退出。而是内部维护了一个事件队列，如果还有事件在pending状态则不断的循环，直到队列为空时程序退出。

观察下面的程序
```
setTimeout(() => {
    console.log('timer');
}, 1000);
while(true) {
    // forever loop
}
```
我们发现，程序并不会打印'timer'。这是因为内部运行机制所导致的。

**重点-JavaScript运行机制**
> 所有的同步任务(即js的代码部分)都是在主线程上执行的。
> 此外该线程上还维护了一个事件队列
> 当所有同步任务完成，系统就会读取事件队列中的内容
> 这称之为一个事件循环周期，直到事件队列中所有任务完成，没有事件在pending状态，主线程结束，退出程序。

## 梳理一下

根据上面的讨论，我们可以这样理解JavaScript的运行逻辑：
1. main -> 执行js代码，运行一系列操作(逻辑运算等)，绑定事件(DOM事件，异步操作等) -> 这一步可以称之为执行栈
2. 代码执行完毕 -> 程序不会退出而是进入event loop检测事件状态，IO回调等
3. 如果有事件触发/IO完成 -> 将任务放进执行栈
4. 重复上面3个阶段，直到没有IO和事件监听，程序才会退出

## 深入Event loop

那事件循环的内部执行的逻辑究竟如何呢？(这里解释Nodejs下的事件循环)
1. 事件循环维护了一个队列，和一个time字段(初始化时为0，每次循环都会更新这个值)
2. a. -> 更新time
3. -> b.检测循环是否还有需要处理的任务, 没有则跳出循环结束程序, 有则进行下一步
4. -> c.timer定时器中指定的时间与time字段比较, 如果timer&gt;time, 则执行该定时器
5. -> d.I/O polling 阻塞住线程等待IO事件完成, 如果有事件完成，则放入执行栈中, 超出等待时间后，再次检查timer定时器的时间是否到期
6. -> e.进入下一次循环

**这个事件队列是有先后顺序的，先入列的先检测**

## Q&A

### 进程与线程
> 进程是资源分配的基本单位。一个运行的任务即占有一个进程。
> 线程是CPU运行调度的基本单位。一个进程可以有多个线程。

### 多个定时器有没有性能问题？
根据我们事件循环的执行逻辑，多个定时器之间没有性能问题。但是多个定时器之间的任务逻辑需要准确把握。多个回调函数内部操作公共数据的逻辑需要清晰。

### 浏览器中的setTimeout,setInterval,requestAnimationFrame的区别与联系

我们通常使用setTimeout(fn, 0)来控制下一次事件循环开始时执行，此外HTML5规定间隔时间最短为4ms，从某种程度上来说这个时间间隔也并不可靠，它与当前执行栈的执行时间有关。
setInterval(fn, time)中的time表示执行间隔，但是当执行栈的耗时过长(程序阻塞时间过长)，是不能保证执行间隔的可靠性，所以一般通过setTimeout内部回调setTimeout来代替这种方式更符合逻辑。
我们知道浏览器的UI绘制每16ms执行一次，所以当我们使用setTimeout或者setInterval进行绘制动画时往往与JS代码阻塞情况有关。而requestAnimationFrame将动画执行逻辑交给了UI线程，由系统根据情况指定绘制时间间隔。

### Nodejs中的process.nextTick和setImmediate

**process.nextTick将回调放在eventloop之前执行，即任务栈的最后。内部递归调用自己，则程序永远不会执行eventloop**
setImmediate在官网文档中称它的回调在事件循环中执行顺序优先级高于setTimeout

## 参考链接

这篇文章内容有误，请酌情参考 -> [阮一峰-JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

[单线程的 Node.js](http://blog.csdn.net/xjtroddy/article/details/51388655)

[深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)

[官网文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
