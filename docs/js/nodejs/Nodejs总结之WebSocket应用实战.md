## Talk is Cheap, Show me the code!

[WebSocket-Nodejs无依赖实现-代码压缩包](/demo/node-knowledge/chatroom.zip)

## WebSocket

我们知道浏览器WWW的主要协议为http/https协议，而http协议是无状态的。在一次请求中数据传输只有一次。所有当我们需要处理实时性的需求时，通常会有一些hack方案: 如ajax polling轮询; http 长连接; 这些方案虽然都可以完成需求，但是处理起来不仅复杂而且浪费了许多不必要的网络资源等。

在HTML5规范中，为开发者提供了WebSocket方案。WebSocket是利用了HTTP的请求方案，基于TCP与服务器建立联系；利用相关接口Web开发将可以建立稳定可靠的双向通讯接口。

下面我们将讲解WebSocket的实现原理，然后从Web Browser端和Nodejs Server端具体讲解WebSocket的实现。

## 原理

**1. 基于HTTP**

> a. 当我们需要一个websocket连接时，我们需要向服务器发送一个HTTP请求 -> 建立tcp连接 -> 通过HTTP报文: 告诉服务器我需要的是一个WebSocket而不是HTTP Response.
> b. 服务器解析报文信息后: 告诉客户端 -> 好的，可以给一个WebSocket连接你。
> c. 这样我们就建立一个基于tcp的连接
> **注意：HTTP只是建立WebSocket时所使用的渠道，后续的数据传输工作都是基于tcp的**

**2. WebSocket数据报文**

> a. 建立好了一个WebSocket连接，下面我们要开始传输数据了。
> b. 大家都知道tcp是基于字节流的传输层协议
> c. 那么这些字节流数据就需要一定的格式约束 -> WebSocket报文格式
> d. 这些格式指示了解析数据的方式 -> 是否一次数据传输完成。这一次数据的数据量有多少。需不需要掩码等

## WebSocket in Server(Nodejs) 报文解析

### 请求报文

```
// 客户端发送一段数据 data = '123'
// 请求报文为 ->
// baowen = <Buffer 81 83 1c aa cd 3f 6d dd a8>
```
这一段数据的组成部分如下：
```
// 第一个字节
// baowen[0] = 0x81;
// baowen[0].toString(2); // -> 转为二进制
// '1 0 0 0 0 0 0 1'

// -> 取第一个bit -> 描述消息是否结束
// -> 1为消息结束 -> 0还有后续数据包
var bit1 = baowen[0] >> 7;

// -> 取5-8bit -> 消息类型
// -> 1为数据包 -> 8为请求close断开连接
var bit5_8 = baowen[0] & 0xF;
```

```
// 第二个字节 -> 描述掩码和消息长度
// baowen[1] = 0x83;

// 取最高位bit -> 是否有掩码
// 1 -> 有
var hasMask = (baowen[1] >>7);

// 后面7位用来描述消息长度
var lenFlag = baowen[1] & 0x7F;

// 当数据包小于126时 -> lenFlag为实际数据包长度
// 当数据包长度小于uint16时 -> lenFlag=126;
// 当数据包大于uint16时 -> lenFlag=127;
```

如果数据长度大于126小于uint16时 -> 接下来的两个字节表示数据包长度;
如果数据长度小于uint16 -> 接下来的四个字节表示数据包长度;
```
var nowi = 2;
if (lenFlag === 126) {
    pkgLength = Buffer.from(data.slice(2, 4)).readUInt16BE();
    nowi += 2;
} else if (lenFlag === 127) {
    pkgLength = Buffer.from(data.slice(2, 6)).readUInt32BE();
    nowi += 4;
}
```

如果hasMask为1 -> 有掩码 -> 取接下来的4个字节为掩码
```
if (hasMask) {
    maskCode = Buffer.from(baowen.slice(nowi, nowi+4));
    nowi += 4;
}
```

接下来的字节 -> 消息体
```
// 如果有掩码 -> 解码规则为1-4byte掩码循环和数据byte做异或操作
var result = Buffer.from(data.slice(nowi));
if (!!maskCode) {
    for(var i=0, len=result.length;i < len; i++) {
        result[i] = result[i] ^ maskCode[i%4];
    }
}
```

最后我们得到了我们需要的数据体 - result&lt;buffer&gt;

至此我们完成了客户端发来的数据报的解析

### 响应报文

我们不仅要读懂用户发来的数据，我们向用户发送的数据也需要用户可以看懂。所以需要对原始数据格式化后发送给客户端。

这一部分相对简单。

**以0x81开头，紧接发送内容的长度，最后是消息体;**

**注意这里的内容长度格式，依然需要遵守我们解析时的规则**


## WebSocket Server

看懂了报文，我们就拥有处理请求的能力了。接下来我们讲解如何与客户端握手成功(建立连接)，然后我们才能获取到报文数据，利用上面的知识与客户端通信。

**1. 由于WebSocket是通过HTTP来建立基于tcp的链接 -> 创建http服务器**

```
// -> 这里只处理websocket请求的情况
var socketServer = http.createServer((req, res) => {
    const body = http.STATUS_CODES[426];
    // 426 Upgrade Required -> 表示需要将当前协议进行转换

    res.writeHead(426, {
        'Content-Length': body.length,
        'Content-Type': 'text/plain'
    });
    res.send(body);
});
```

**2. HTTP -> WebSocket 协议升级**

```
// -> 接下来通过upgrade事件向websocket协议转换
socketServer.on('upgrade', (req, socket, head) => {
    // 根据请求报文验证websocket信息

    // 1. websocket版本号
    const version = +req.headers['sec-websocket-version'];

    // 2. websocket验证
    if (req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' || !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13)) {
        // -> 如果upgrade信息错误则返回
        return abortReqeust(socket, 400);
    }

    // 生成响应信息头

    // 3. 根据客户端提供的key值生成verify确认值
    const key = crypto.createHash('sha1')
        .update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
        .digest('base64');
    
    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${key}`
    ]

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);
    if (protocol[0]) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol[0]}`);
    }

    // if (req.headers['sec-websocket-extensions']) {
    //     headers.push(`Sec-WebSocket-Extensions: ${req.headers['sec-websocket-extensions']}`);
    // }
    
    socket.write(headers.concat('', '').join('\r\n'));

    // 创建完成
    // 通过MyClient维护socket数据流;
    const client = new MyClient([socket, head]）；
});
```

**3. 维护socket池**

这一部分具体请查看 - nodejs - net.Socket类
* [nodejs - net.Socket类](http://nodejs.cn/api/net.html#net_class_net_socket)
* [Nodejs总结2-网络处理http/net](/blog/2017/11/10/Nodejs总结2-网络处理http-net/)


## WebSocket in Browser

浏览器端的WebSocket开发相对而言就要简单很多了，因为我们不需要去处理报文的解析和编码;

```
var websocket = new WebSocket(url);
        
websocket.onopen = open;
websocket.onmessage = msg;
websocket.onclose = close;
websocket.onerror = err;

websocket.send(msg);
websocket.close();
```

**这里需要注意的是，close并不是直接关闭连接，而是向服务器发送一条请求关闭的报文。**

至此我们完成一个，比较完整的WebSocket服务构建。

## Socket.io

我们学习这些底层通讯协议的知识，是为了了解websocket的应用流程。更好的处理关联相关应用场景；但是个人的维护起这些底层的东西往往是不全面的，以及兼容性不好。这里推荐大家使用socket.io/ws库。

> 由于浏览器端对HTML5的支持不一，为了兼容所有浏览器，提供卓越的实时的用户体验，并且为程序员提供客户端与服务端一致的编程体验，于是socket.io诞生。Socket.io将Websocket和轮询 （Polling）机制以及其它的实时通信方式封装成了通用的接口，并且在服务端实现了这些实时机制的相应代码。

Socket.io都实现的通信机制：

* Adobe® Flash® Socket
* AJAX long polling
* AJAX multipart streaming
* Forever Iframe
* JSONP Polling


## 结语

本文介绍WebSocket相关的知识，其他运用的知识点：HTTP Upgrade进行协议升级，WebSocket协议相关的数据头和报文解析，以及Socket的维护。
在日常应用的开发中我们可以使用socket.io库来实现实时通讯技术的应用需求。

## 参考链接

* [Github - /websock/ws](https://github.com/websockets/ws)
* [Github - /socketio/socket.io/](https://github.com/socketio/socket.io/)
* [socket.io - 官方文档](https://socket.io/)
* [cnode - socket.io入门整理](https://cnodejs.org/topic/50a1fcc7637ffa4155b5a264)
<br/>
* [MSN - WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
* [cnblogs - WebSocket数据包协议详解](https://www.cnblogs.com/smark/archive/2012/11/26/2789812.html)
* [WebSocket协议详解](http://www.voidcn.com/article/p-sdgtzxzy-cc.html)
<br/>
* [知乎 - WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
