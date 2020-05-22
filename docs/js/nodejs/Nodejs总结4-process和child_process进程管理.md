## 写在前面
作为服务器端的JavaScript, 在摆脱了浏览器的限制之后, 终于拥有很多系统的操作能力。这篇文章就主要来介绍Nodejs的进程管理功能。

## process - 主进程

### process事件
> process 对象是一个 global （全局变量），提供有关信息，控制当前 Node.js 进程。

```
// Events:
// 'beforeExit': -> 回调可包含异步操作(说明在这个事件之后Nodejs还会进行eventloop)
//               -> process.exit()/throw error不会触发该事件

// 'exit': process.exit()/eventloop unalive触发 -> 回调不允许异步操作

// 'disconnect'
// 'message'

// 'uncaughtException' -> 有未捕获异常抛出时，用于处理程序异常退出时资源清理操作
//                     -> 不要用于重启应用，更可靠的方式是通过另外一个进程来探测应用是否出错

// 'warning' -> 应用性能，缺陷，安全隐患
// 'rejectionHandled'/'unhandledRejection' -> promise reject被处理和不被处理下触发

// Signal Event
// 当Node.js进程接收到一个信号时，会触发信号事件
// <Ctrl>-C -> 'SIGINT'
process.on('SIGINT', () => {
    console.log('Received SIGINT.  Press Control-D to exit.');
});
```

### process属性

```
process.arch; //String-处理器架构 'arm'/'x64'等
process.argv; //Array-启动参数 // process.argv0->对应第一个参数
process.config; //Object-nodejs配置项
process.env; //用户环境
process.title; //进程名字
process.version/versions; //执行环境版本信息

process.execArgv; //nodejs特定命令项 // --harmony
process.execPath; //node可执行文件的绝对路径
process.exitCode; //进程结束时的状态码

process.pid; //PID
process.platform; //平台 'linux' 'win32'

process.stderr; //错误流
process.stdin; //输入流
process.stdout; //输出流
```

### process方法

```
process.abort(); //进程立即结束
process.exit([code]); //进程退出
process.disconnect(); //关闭进程IPC通道

process.cwd(); //当前工作目录
process.chdir(dir); //变更工作目录
process.cpuUsage([previousValue]);
process.memoryUsage()

process.emitWarning(warning[, options]); //
process.kill(pid[, signal]); //将signal发送给pid标识的进程。
process.uptime(); //进程运行时间

process.nextTick(callback[, ...args])
```

**重点process.nextTick(callback[, ...args])**
> 回调函数将在执行栈的最末尾执行，而不是eventloop的顶端


## child_process 子进程

### 1.创建子进程

```
ls = child_process.spawn(); // 在 Node.js 的父进程与衍生的子进程之间会建立 stdin、stdout 和 stderr 的管道
ls.stdin.on('data', listener);
ls.stdout.on('data', listener);
ls.stderr.on('data', listener);

child_process.exec(); //1. 衍生一个 shell 并在 shell 上运行命令
child_process.execFile(); //2. 直接衍生命令，且无需先衍生一个 shell
child_process.fork(); //3. 衍生一个新的 Node.js 进程

//注意：
//在Unix下, execFile效率更高, 因为不需要shell
//但在window中执行.bat/.cmd时, execFile不可执行, 可以通过exec/spawn指定shell
```

### 2.ChildProcess 类

```
// Events: 'close', 'disconnect', 'error', 'exit', 'message'

// Property: connected, channel, killed, pid

// Methods: disconnect, kill, send,

// subprocess.stdio -> stdin, stdout, stderr
```

## 应用实战

* 多任务管理 - 多视频转码

## 参考

[nodejs-process](http://nodejs.cn/api/process.html#process_process)
[nodejs-child_process](http://nodejs.cn/api/child_process.html#child_process_child_process)
