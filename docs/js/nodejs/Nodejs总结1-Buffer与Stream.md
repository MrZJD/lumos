## 什么是Buffer和Stream

> Buffer是用于管理和操作存放二进制数据的**缓存区**的类型 (Buffer中的数据形式为Uint8Array)
> Stream是处理流数据的抽象接口 (流是一组有序的、有起点和终点的字节数据的传输手段)

Stream将数据存储到内部缓存Buffer中，流的消费者通过接口读取数据。这种形式提供了操作大量数据时的行为方式：读取文件->文件数据分割chunk->推入一部分到内存中->消费者读取一部分数据

ex. 处理这样一个需求：前端上传一个文件保存到文件系统中。
没有Stream我们这样处理: **client -> upload file -> chunk += chunk(等待数据网络传输全部完成) -> opt(data)(数据操作) -> save file**。
而通过Stream: **client -> upload file -> save( opt(chunk) )**。

如果在数据量非常大的情况下，第一种方式所消耗的内存非常的大，而且等待数据io/写入一个大文件io都非常的耗时；相比较通过Stream，当网络返回一个数据包chunk时就通过流放入缓存中，同时通过消费者(写入文件)及时消费，不仅节约内存而且耗时也会减少许多。

## 应用场景

在Nodejs中，只要是与数据IO相关的处理多少都需要用到流。如HTTP服务器处理req, res; FileSystem的读写操作等; 这里介绍流的使用范式。

Stream的类型：可写流Writable，可读流Readable，可读可写流Duplex，变换流Transform

## 可写流(stream.Writable 类)

```
var writerStream = WriterStream(); //假设writer为一个可写流

writerStream.write('data1');
writerStream.write('data2');
writerStream.end('end data');

// Event: 'finish', 'error', 'drain', 'pipe', 'close', 'unpipe'

// 这里主要说明drain情况
// Stream中highWaterMark将决定缓存的大小(总字节数)
// 当缓存中的数据到达阈值时，push/write将不再生效，直到缓存的数据被消费

// drain事件就是可写流缓存数据过大，暂停缓存后数据被消费后恢复可写入的状态时触发的事件

// Function: pipe, end, cork, uncork, setDafaultEncoding, write, destory

// cork / (uncork, end) 配对使用
// cork执行后流的写入将强制写入内存缓冲区，通过uncork/end进行释放。
// 避免不间断的写入小chunk导致性能下降
// 指定多个cork点时，只有全部释法才会开始写入数据
```

## 可读流(stream.Readable 类)

两种工作模式：**flowing** 和 **paused**

> flowing: 通过监听data事件获取数据片段
> paused: 显示调用stream.read来获取数据片段
> 两者可以相互转化，具体见官方文档

```
// Event: 'close', 'data', 'end', 'error', 'readable'

// 下面这种方式可以代替data事件
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
    // 有一些数据可以读了
    console.log('readable:', rr.read());
});

// Function: isPaused, read, pipe, resume, pause

// pause/resume 方法用于停止/回复流的数据输出 
```

## Duplex 与 Transform 流

同时具备可读可写的属性和方法

> 如websocket既可以向客户端写入response流，又可以读取request流

## 实战

* 写一个http下载器，输入一个网络http资源的地址，进行文件下载保存

## 参考链接

[nodejs - Buffer](http://nodejs.cn/api/buffer.html#buffer_buffer)
[nodejs - Stream](http://nodejs.cn/api/stream.html#stream_stream)
[类型化数组 - TypedArray(Uint8Array)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)