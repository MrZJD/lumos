## 写在前面
在C语言中我们有scanf函数来获取用户在命令行中的输入，而在浏览器JavaScript中由于直接通过UI界面与用户交互，所以只有console.log等输出函数。但是Nodejs扩展了JS的应用场景，相应也为开放着封装了相应的接口。

## readline 模块

> 实际上还是基于流的封装
> 如果是process中的stdin,stdout,stderr可变化流->则从控制台中读取输出
> 如果是file stream->则可以输出到文件中

### readline.Interface 类

```
var rl = readline.createInterface({
    input: inputReadableStream,
    output: outputWritableStream
});

// Events:
// 'close' //-> 已撤回对input/output的控制后
// 'line' //-> input接收到(\n,\r,\r\n)换行结束符时触发
// 'pause'/'resume'

// 'SIGTSTP' //-> 接收到一个 <ctrl>-Z 输入
// 'SIGCONT' //-> Nodejs进程从后台移回前台时
// 'SIGINT' //-> 接收到一个 <ctrl>-C 输入

// Methods:
// rl.close()
// rl.pause() //暂停input流
// rl.resume()
// rl.question(query, callback)
// rl.setPrompt(prompt)
// rl.write(data[, key])
```

### readline 全局方法
```
// readline.clearLine(stream, dir)
// readline.cursorTo(stream, x, y)
// readline.moveCursor(stream, dx, dy)
// readline.emitKeypressEvents(stream[, interface])

// readline.createInterface(options)
```

## repl-交互解释器模块

> repl 模块提供了一种“读取-求值-输出”循环（REPL）的实现

在一些特点场景下我们需要运行用户的输入(将用户的输入作为代码执行)，而不仅仅是将用户输入作为参数。这个时候repl模块就可以发挥作用了。

### repl.REPLServer 类

> 继承自 readline.Interface 类

```
// 通过repl.start() 创建

// Events:
// 'exit'/'reset'

// Methods:
// replServer.defineCommand(keyword, cmd)
// replServer.displayPrompt([preserveCursor])

// 命令与特殊键
// '.break' -> <ctrl>-C
// '.clear' -> 重置repl的context
// '.exit'
// '.help'
// '.save'
// '.load'
// '.editor' -> 进入编辑模式（<ctrl>-D 完成，<ctrl>-C 取消）

// 全局变量
// repl.start('> ').context.m = msg; // 定义context中的变量
// _ // 解释器会把最近一次解释的表达式的结果赋值给变量 _

// 注意
// 可自定义输入的执行器 -> 对应start中的eavl参数(eval默认)
// 也可自定义输出 -> 对应writer参数(util.inspect默认)
```

## 实战

* 编写一个初始化项目的repl应用 - 类似于npm init创建项目
* 通过socket远程执行用户输入

## 参考链接

[nodejs - readline](http://nodejs.cn/api/readline.html#readline_readline)
[nodejs - repl](http://nodejs.cn/api/repl.html#repl_repl)
