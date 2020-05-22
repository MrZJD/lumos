## 写在前面

最近停用了QQ空间，但是想把空间里面保存的照片都导出来。找了一圈下载工具，要么有权限限制，要么下载的图片是压缩过后的图片。所以决定自己来写一个工具，顺便学习一下headless browser.

环境配置:
* headless chrome / chromium - 这一块需要翻墙下载
* chrome canary (window下代替上一项)
* npm pkg: puppeteer

## 1. 爬取流程

先简单介绍一下流程：
```
// a. -> 启动headless chrome
// b. -> 建立页面 -> 进入QQ空间登陆页面
// c. -> 登陆 -> 页面跳转至QQ个人空间
// d. -> 进入QQ相册列表页
// e. -> 获取相册列表 albumlist
// f. -> 遍历列表，获取相册中的照片数据
```

重点说明：
```
//-> 1. 关于持久化登陆
//-> 原本想登陆一次，记录下cookies。然后短期内下次进入页面不需要登陆。
//-> 可是通过cookies来记录数据没有用，转为记录storage，结果也没用。
//-> 有了解QQ web端登陆机制的可以交流一下。

//-> 2. 页面嵌入了iframe
//-> 登陆用了iframe, 相册数据用了iframe...腾讯这样做是为了？

//-> 3. album数据
//-> 从DOM中获取data-id -> 对应了相册的链接中的id

//-> 4. photo数据
//-> 从DOM中拿到预览数据 -> 根据预览数据uri转换到原图uri 
```

数据说明:
```
//-> 登陆iframe页面
login_url = https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=549000912&s_url=https%3A%2F%2Fqzone.qq.com

//-> album页面
albums_url = https://user.qzone.qq.com/{qq_id}/photo
album_url = https://user.qzone.qq.com/{qq_id}/photo/{album_id}

//-> photo img
//获取到预览图片的img.src
//改变src中的hostname -> 对应到原图host: 'http://r.photo.store.qq.com/psb'
//-> 有部分年代比较久远或者原图本来就很小的 -> host: 'http://b221.photo.store.qq.com'
```

## puppeteer相关接口

```
// -> 启动
var browser = await puppeteer.launch({
    executablePath: config.executablePath
});

// -> 页面
var page = await browser.newPage();

// -> 页面操作
// page.goto(uri);
// page.waitForFunction(filter); //-> 页面进行等待 -> 知道filter返回true; 用于等待页面的加载跳转等
// page.$()/$$(); //-> 获取domHandler -> 注意这里不是获取原生DOM, 而是封装过后处理器
// page.evaluateHandle(fn); //-> 将fn放入page环境中执行 //-> 用于返回window/document等处理对象
// page.evaluate(fn, args); //-> 同上 //-> 用于返回一下非DOM/BOM的数据对象(如获取DOMAttribute)

// -> 元素操作
// element.type();/click();

// 更多参考文档
```

## 总结

这算得上是第一次利用async/await语法写一个实战应用。总体感觉相对于promise来说，编码体验好很多。不需要一个一个then方法的执行。少了很多不必要的代码。但是利用async/await在调试错误处理方面的体验却不是很好，异常直接抛出。可以使用try/catch来捕获异常，但是代码结构上面又变得不是特别优雅了。这一块可能需要再深入学习一下相关资料，看是否有最佳实践。


## 参考链接

* [知乎 - 使用 Headless Chrome 进行页面渲染](https://zhuanlan.zhihu.com/p/26810049)
* [知乎 - 无头浏览器Puppeteer初探](https://zhuanlan.zhihu.com/p/30203613)

* [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/)
* [Github - chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)
* [Github - Puppeteer](https://github.com/GoogleChrome/puppeteer)
