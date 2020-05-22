## fs模块 - 文件系统

> Nodejs中的文件系统模块是对POSIX（可移植性操作系统接口）的简单封装，每个功能都提供了同步和异步两种不同的形式
> 通常情况下我们都使用异步的模式，Nodejs中默认都是采用回调的形式。
> 这里需要注意的是**Nodejs回调函数中的参数列表的第一个参数，总是与异常相关的（不仅仅在fs模块中，Nodejs都是这样组织代码的）**

_此外需要注意的是，fs因为与操作系统有关，所以许多接口的可用性会根据系统的不同而有所区别，具体结合官方文档。_

接下来我们先认识几个基础的类

## fs.FSWatcher 类 - 处理文件变化的监听

```
var fsWatcher = fs.watch(filename[, options][, listener]); //通过工厂函数创建

// Events: 'change', 'error'

// fsWatcher.close();

// watch()参数中的listener自动绑定到change事件中

listener = (evtType, filename) => {
    // evtType: 'rename'/'change'
    // filename 并不会被稳定的提供
}
```

## fs.ReadStream 类

```
// Events: 'close', 'open'

// Property:
// readStream.bytesRead; //已读字节数
// readStream.path; //文件路径
```

## fs.WriteStream 类

```
// Events: 'close', 'open'

// writeStream.bytesWritten; //已写入字节数
// writeStream.path; //文件路径
```

## fs.Stats 类 - 文件状态

```
// Factory: fs.stat() / lstat() / fstat()

// Functions: 
// stats.isFile()/isDictory()/isBlockDevice()/isSocket()

// stats.atime/mtime/ctime - 时间值(ms)
// atime - 最近访问时间 - origin: mknod(2)/utimes(2)/read(2)
// mtime - 最近修改时间 - origin: mknod(2)/utimes(2)/write(2)
// ctime - 最近变化时间 - origin: chmod(2)/chown(2)/link(2)/rename(2)/unlink(2) + 上述atime/mtime引起变化的操作
// brithtime - 创建时间(不稳定，有可能被ctime值代替)
```

## fs全局函数

** 以下函数全为异步函数，同步请参考文档 **

* fs.access(path[, mode], callback]) - 检查文件的用户权限/可访问性

> 通常在使用一个文件之前不会进行权限检查，因为其他进程可能正在改变文件的状态，会造成许多不稳定性。推荐直接打开一个文件，若文件不可访问->直接处理错误

* **fs.open(path, flags[, mode], callback) - 打开一个文件**

> ** flags - 文件读写模式 **

```
* 'r' - 读（不存在则报错）
* 'r+' - 读写（不存在则报错）

* 'w' - 写（不存在则新建，存在则引用）
* 'w+' - 读写（不存在则新建，存在则引用）
* 'wx' - 新建并写（文件存在则报错）
* 'wx+' - 新建并读写（文件存在则报错）

* 'a' - 追加（不存在则新建）
* 'a+' - 读写和追加
* 'ax'/'ax+' - 同理

* 'rs+' - 绕过缓存实时读写

// 写与追加的区别
// 写 -> 可以指定文件内容的offset -> 从指定位置写入新内容
// 追加 -> 总是在文件结尾处写入新内容
```

```
callback = (err, fd) => {
    // fd // 文件描述符
}
```

* **fs.close(fd, callback) -> 关闭一个文件描述符/释放资源**

> **重点说明**
> **1.使用open打开一个文件，在回调中取得该文件的文件描述符fd，这个描述符有关的资源是不会自动释放的，当我们需要重复利用这一个文件时可以保持对这个fd引用，不需要的时候需要手动释放资源close(); 这里请注意！**
> **2.在下列方法函数中，一部分是直接使用path_url作为参数进行文件访问，内部会自动处理描述符资源。另一部分可以使用fd作用参数的函数，函数在结束操作时并不会自动处理描述符资源。两者的关系需要区别。**

#### 读文件
* fs.read(fd, buffer, offset, length, position, callback) - 读
* fs.readdir(path[, options], callback) - 读指定目录内容
* fs.readFile(path[, options], callback) - 读文件 // path->url/fd
* fs.createReadStream(path[, options]) // 创建文件读取流

#### 写文件
* fs.write(fd, buffer[, offset[, length[, position]]], callback) -> 写buffer
* fs.write(fd, string[, position[, encoding]], callback) -> 写string
* fs.writeFile(file, data[, options], callback) -> data = buffer/string
* fs.createWriteStream(path[, options]) // 创建文件可写流

#### 追加
* fs.appendFile(file, data[, options], callback) -> 追加

#### 权限管理
* fs.chmod(path, mode, callback) -> 修改文件权限
* fs.chown(path, uid, gid, callback)
* fs.fchmod(fd, mode, callback)
* fs.fchown(fd, uid, gid, callback)

#### 文件信息
* fs.stat(path, callback) -> 获取文件信息对象
* fs.fstat(fd, callback)

#### 文件其他
* fs.rename(oldPath, newPath, callback) -> 重命名
* fs.unlink(path, callback) -> 删除文件
* fs.copyFile(src, dest[, flags], callback) -> 复制
* fs.truncate(path[, len], callback) -> 截断文件 //超出len部分数据将丢失
* fs.link(existingPath, newPath, callback) -> 建立快捷方式
* fs.utimes(path, atime, mtime, callback) -> 修改文件时间戳
* fs.futimes(fd, atime, mtime, callback)

#### 其他
* fs.rmdir(path, callback) -> 删除目录
* fs.realpath(path[, options], callback) -> 路径是否有效
* fs.mkdtemp(prefix[, options], callback) -> 创建临时目录, 通常制定prefix = path.join(os.tmpdir(), 'yourprefix-')


## 总结

文件操作是我们利用Nodejs处理后台应用很重要的一部分，小型的应用可能会利用文件进行数据的持久化操作; 在前端工程化，我们通常说到的热加载也是基于文件的操作。这一块的内容实际上都是对操作系统底层命令的封装，便于我们更加灵活地构建Nodejs服务。

## 实战

* 基础实例
* 读取大型文件实例(MP4视频分割渲染压缩等)
* http-server之文件热更新(fs+websocket)
