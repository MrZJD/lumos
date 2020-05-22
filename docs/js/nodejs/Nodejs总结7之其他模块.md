## 写在前面

前面我们学习了，Nodejs后台应用最基础的stream知识。利用stream我们可以处理网络IO，文件IO，process IO。利用这些基础的功能模块我们就可以开始进行Nodejs应用的编写了，但是在构建的过程中我们还有一些常用的工具库和变量等知识需要介绍。

## module模块加载系统

Nodejs - 采用CommonJS模块化规范标准

```
var moduleA = require('./moduleA.js'); //引入

module.exports = {};//导出
```

**注意**
* 模块在第一次加载后会被缓存，以后每次引入模块都会解析到同一个对象。(模块文件只会执行一次)
* 如果想要多次执行一个模块，可以导出一个函数，然后调用该函数。
* 当遇见循环引用时，系统会通过返回一个未完成的副本给循环引用的模块。

## global全局变量

** __dirname ** 当前模块的文件夹名称
** __filename ** 当前模块的文件名称(绝对路径)
** module ** 
** exports ** -> module.exports
** require() **

** Buffer **
** process **
** global **
** console **

** timer相关 **

## events - EventEmitter 类

由事件驱动的Nodejs为我们也提供了自定义订阅者模式的events模块。（在设计模式一书中学习过该模式的实现，没有联系过的同学可以根据接口来实现一下，有助于理解订阅者模式）

```
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

// 默认事件
// 'newListener' 事件 -> 注册新事件时触发
// 'removeListener' 事件

// emitter.addListener(eventName, listener)
// emitter.emit(eventName[, ...args])
// emitter.once(eventName, listener); //只触发一次的事件
// emitter.prependListener(eventName, listener); //添加到该事件队列的顶端
// emitter.prependOnceListener(eventName, listener)

// emitter.removeListener(eventName, listener)
// emitter.removeAllListeners([eventName])

// emitter.eventNames(); //-> 获取已注册的事件名称
// emitter.setMaxListeners(n); / emitter.getMaxListeners()
// emitter.listenerCount(eventName);
// emitter.listeners(eventName)
```

## path - 系统路径

我们知道在window和unix系统下，路径的表现有所不同。如win下通常'\\\\'来表示文件夹的层叠，而unix下使用'/'；win下使用';'分割多文件路径，unix使用':'。
为了是我们的代码不同平台下表现一直可以通过path来操作路径。

```
path.delimiter; //多路径分隔符

path.basename(path[, ext]); //获取path的最后一部分，文件夹或者文件
path.dirname(path); //path所在的文件夹
path.extname(path); //path的扩展名
path.isAbsolute(path);

path.join([...paths]); //**重点，使用对应的分隔符链接路径
path.resolve([...paths]); //根据path和当前路径解析成一个绝对路径

path.normalize(path); //规范化path解析
path.parse(path); //string -> obj
path.format(pathObject); //obj -> string
path.relative(from, to); //获取相对路径

path.win32/posix; //两种平台下的实现
```

## querystring 处理查询字符串

```
querystring.stringify(obj[, sep[, eq[, options]]]); //将一个对象解析成query
querystring.parse(str[, sep[, eq[, options]]]); //将一个字符串解析成obj

// 默认都会进行encodeURIComponent/decodeURIComponent()
```

## url 用于 URL 处理与解析

```
var url = new URL(input[, base]);

// url.href = https://user:pass@baidu.com:8000/pathname?searchquery#hash

// url.protocol/url.username/.password
// url.host/.origin/.hostname/.port -> hostname不包括端口号
// url.pathname
// url.search/url.searchParams
// url.hash

// URLSearchParams 类-操作url query
// ?/abc=123
// url.searchParams.get('abc'); //获取
// url.searchParams.append('abc', 'xyz'); //添加
// url.searchParams.delete('abc'); //删除
// url.searchParams.set('a', 'b'); //新增
// .toString()
// .has(name)
// .keys() / .entries() / .forEach(fn[, thisArg])
```

## string_decoder 字符串解码器
用于把 Buffer 对象解码成字符串

```
const decoder = new StringDecoder('utf8')
stringDecoder.write(buffer);
stringDecoder.end([buffer]);
```

## 其他

* [cluster](http://nodejs.cn/api/cluster.html#cluster_cluster) - 用于集群处理(多个Nodejs进程)
* [dgram](http://nodejs.cn/api/dgram.html#dgram_udp_datagram_sockets) - udp处理
* [dns](http://nodejs.cn/api/dns.html#dns_dns) - 处理dns相关
* [error](http://nodejs.cn/api/errors.html#errors_errors) - 了解相关错误异常相关信息
* [zlib](http://nodejs.cn/api/zlib.html#zlib_zlib) - 压缩/解压缩数据
* [util](http://nodejs.cn/api/util.html#util_util) - 工具库-提供了promise/callback的相关转换，inherits等函数


## 参考链接
* [AMD, CMD, CommonJS和UMD](https://segmentfault.com/a/1190000004873947)
* [nodejs - global - 全局变量](http://nodejs.cn/api/globals.html#globals_global_objects)
* [nodejs - events (事件)](http://nodejs.cn/api/events.html#events_events)
