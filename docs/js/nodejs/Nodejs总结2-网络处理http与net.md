## Nodejs网络处理

Nodejs与其他平台无异，都提供了丰富的网络处理接口。

分为以下两个内容介绍:
> http/https模块提供了处理相关协议的服务器和客户端接口
> net模块提供 TCP/IPC 服务器和客户端的网络接口

## http.Agent 类 - (中间者，代理http的客户端请求)

> 负责客户端HTTP管理连接的持续和复用(创建一个单一Socket，一个等待请求的队列)
> 即一个Agent可以重复发送请求，可以指定内部Socket的相关配置(如keepAlive等)，如果不再需要这个客户端发送请求，需要手动 _agent.destory()_;

```
agent.createConnection(opts, callback); // 创建一个请求socket/流
```

## http.ClientRequest 类

> 通过 **http.get() / http.request()** 方法内部创建并返回，表示一个正在处理的请求。实现了可写流接口

```
var request = http.get(opts);

// Events: 'abort', 'connect', 'continue', 'response', 'socket', 'timeout', 'upgrade'

// 常用方法:
// request.setHeader('key', 'val'/[val, val2]);
// request.removeHeader('key); / request.getHeader('key');
// request.write(chunk); //发送请求主体
// request.end()
// request.abort()
// request.setTimeout()
```

## http.Server 类 extends net.Server

> 通过http.createServer创建并返回

```
var server = http.createServer( (req, res) => {} );

// Events:
// 'clientError' 客户端触发error事件时触发，监听器需要负责关闭和销毁socket
// 'request' 每次接受到一个请求时触发
// 'close', 'connect', 'connection', 'upgrade'

// Functions: close(), listen(), setTimeout()
```

_createServer方法会将监听器自动绑定到request事件上_

## http.ServerResponse 类

> 实现了可写流接口

```
var reqListener = (req, res) => {
    // res -> 即ServerResponse对象
};

// Events: 'close', 'finish'

// Functions:
// res.setHeader(key, val);
// res.getHeaders()
// res.getHeader(key)
// res.getHeaderNames()
// res.hasHeader(key)
// res.removeHeader(key)

// res.writeHeader(statusCode, statusMessage, headers)
// -> 对应到res.statusCode, res.statusMessage
// res.write(chunk);
```

## http.IncomingMessage 类

> 实现了可读流
> 在http.Server中作为监听器的req参数对象
> 在http.ClientRequest中作为response参数对象
> 实际就是表示来源数据的对象，在服务器中是客户端发过来的请求数据，在客户端中是服务器的响应数据

```
var incomingMsg;

// Events: 'aborted', 'close'

// Props:
// msg.headers //-> http数据头
// msg.method
// msg.rawHeaders
// msg.statusCode
// msg.statusMessage
// msg.url

// Function: msg.destroy()
```

## net.Server 类

```
var server = new net.Server(opts, listener); // listener -> 'connection'

// Events: 'close', 'connection', 'error', 'listening'

// Functions:
// server.address();
// server.close();
// server.getConnections(cb) //=> 异步获取当前并发数
// server.listen();

// listen方法参数的类型不同也决定其创建的服务器类型的不同
// server.listen([port][, host][, backlog][, callback]) -> tcp
// server.listen(path[, backlog][, callback]) -> ipc
// server.listen(options[, callback]) -> 根据option来判断类型
```

## net.Socket 类

实现了Duplex可读可写流

```

// Events: 'close', 'connect', 'data', 'drain', 'end', 'error', 'lookup', 'timeout'

// Functions:
// socket.connect(options[, connectListener])
// socket.connect(port[, host][, connectListener]) //-> tcp
// socket.connect(path[, connectListener]) //-> ipc

// socket.destory()
// socket.end()
// socket.write()
// socket.setTimeout()
// socket.setEncoding()
// socket.resume()
// socket.pause()

// socket.localPort/localAddress/remotePort/remoteAddress
```

## net 全局函数

```
net.createConnection() //=> 创建net.socket的工厂函数
// -> 同样拥有多种参数模式
// net.createConnection(options[, connectListener])
// net.createConnection(port[, host][, connectListener])
// net.createConnection(path[, connectListener])

net.connect() //=> 同createConnetion

net.createServer([options][, connectionListener]) //=> 创建net.Server的工厂

// other
// net.isIP()
// net.isIPv4/isIPv6()
```

## 实战：

* 利用http搭建静态服务器
* 利用http建立类似koa/express的服务器路由处理
* 编写http-body-parser完成服务器对post数据的解析
* 爬虫练习


* 利用net tcp服务器创建websocket聊天室

## 附录链接：

* [nodejs - http](http://nodejs.cn/api/http.html#http_http)
* [nodejs - net](http://nodejs.cn/api/net.html#net_net)
