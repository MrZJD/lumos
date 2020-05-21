## Process & Thread in Nodejs

**进程**

- 定义: 程序关于某个数据集合上的一次运行活动
- 系统进行资源分配和调度的最小单位
- 操作系统结构的基础
- 进程是线程的容器
- 一个进程拥有独立的空间地址，数据栈
- 一个进程无法访问另一个进程里定义的变量，数据结构
- 进程与进程之间可以通过IPC进行通信

**线程**

- 系统进行运算调度的最小单位
- 隶属于进程
- 单线程：即一个进程只开一个线程

**单线程**

- node.js 是 单线程模型。即，同步耗时操作会阻塞程序。（事件驱动，异步 -> 提高并发）（没有 创建线程、线程上下文切换 -> 降低了资源开销）
- 单线程无法利用多核cpu
- node.js `child_process.fork` 开启多进程 （多进程 + 单线程）-> 利用多核CPU

**Node.js中的进程**

_process_

```js
// process // 全局对象 EventEmitter

// process.env // 当前进程运行时的环境变量
// process.pid
// process.ppid
// process.title
// process.cwd // 工作目录
// process.platform
// process.uptime

// process.stdout
// process.stdin
// process.stderr

// process.nextTick
```

_child\_process_

```js
const { spawn, exec, execFile, fork } = require('child_process')

// 1. spawn // 适用于返回大量数据的场景 (图像处理，二进制数据处理)
// 2. exec // 少量数据场景 maxBuffer: 200*1024
// 3. execFile // 无shell, 不支持 i/o重定向 文件查找 等
// 4. fork // 衍生新的子进程 数量最好 <= 系统CPU总核心数
```

_child\_cluster_

1. cluster 采用主从模型
2. cluster 内部使用 Round-robin算法(循环算法) 处理负载均衡
3. master接收socket后转发给子进程

**进程间通讯 IPC**

- IPC: Inter-Process Communication
- 底层实现方式: 命名管道, 匿名管道, socket, 信号量, 共享内存, 消息队列等
- Node依赖libuv实现，windows下由命名管道(name pipe)实现，unix由 Unix Domain Socket 实现
- 创建子进程前，先创建ipc通道，并通过环境变量将ipc文件描述符传递给子进程。

**自定义实现 多进程架构守护**

**Node.js 关于单线程的误区**

> 当使用node创建一个http服务时，开启了一个进程。`top -H -p $PID` 查看线程数，线程数通常 > 1. 

- Node启动后 会创建v8实例，v8实例为多线程
- v8多线程
  - 主线程：编译，执行代码
  - 编译/优化线程：在主线程执行的时候 可以优化代码
  - 分析器线程：记录分析代码运行时间 为Crankshaft优化代码提供依据
  - GC线程

- node.js 单线程 指的是 JS的执行 是单线程的。
- JS的宿主环境 无论是Node还是浏览器都是多线程的。此外libuv会通过类似线程池的实现来模拟不同操作系统的异步调用。

`process.env.UV_THREADPOOL_SIZE = 64` 手动更改Node的线程池数量 (libuv threadpool size)

**Node.js中线程的创建**

`worker_threads`

## Reference

[深入理解Node.js 进程与线程](http://www.sohu.com/a/336237386_505818)
