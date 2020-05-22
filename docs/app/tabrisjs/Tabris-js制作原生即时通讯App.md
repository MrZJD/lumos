## 写在前面

最近闲来无事看了看js开发移动应用方面的知识，刚好有朋友的毕业设计是制作一款即时通讯APP，就顺便实战撸了一个。开发过程不到一周，开发体验对于我这样的小白来说算是很友好了。

* UI: Tabris.js
* Server: Nodejs(koa)
* 通讯: WebSocket

## Weex/RN vs Cordova(hybrid) vs Tabris.js

简单说一下自己对这方面的见解:

** Weex/RN 跨平台移动应用开发框架 **

> 这一套前端理念非常的好，通过一个中间层可以将UI转换成不同的平台组件。
> 工具链非常完善，完全可以把用在web上的技术移植过来。
> 平台封装好了部分原生组件，编译打包，性能方面很优秀，UI定制化效果实现复杂一点的效果应该也没有任何问题。

** Cordova 混合应用开发 **

> Cordova核心是Webview内的JS-binding，以及Webview壳的打包。所以Cordova提供了非常多的插件供web开发者使用。
> 由于是通过webview操作dom ui，所以性能上不太理想。但是可以无缝移植WebApp，添加功能化插件的代码即可。

** Tabris.js **

> Tabris的核心使用js命令式生成原生UI界面。通过cordova plugins提供js执行系统api的能力。
> 准确来说Tabris并不是一款跨平台的应用开发框架，而是为js开发者提供了制作原生app的途径。
> 对于中小应用来说应用性能算是很好，UI界面效果偏简单。由于内部依然是执行js所以执行性能可能还是略有欠缺。

开发体验上几款框架都有尝试，最后选择Tabris。Tabris开发体验极其好，提供了测试app，利用cordova打包编译或者直接在官网上打包生成安装包。命令式UI让js开发不用再去书写html/css，all-in-js的开发体验非常棒。

不选择Weex/RN的原因是其繁琐的工具链打包过程，折腾了几天都搞不定，最后只能放弃了。如果能在Tabris上响应数据流的变化，那应该就是完美了。如果有机会，可以自己撸一个。

## UI图

<p class="imgbox">
![welcome](http://ouzcfzhgs.bkt.clouddn.com/blog/20171130/114904353.png)
![login](http://ouzcfzhgs.bkt.clouddn.com/blog/20171130/114907150.png)
</p>

<p class="imgbox">
![chatlist](http://ouzcfzhgs.bkt.clouddn.com/blog/20171130/114912697.png)
![chat](http://ouzcfzhgs.bkt.clouddn.com/blog/20171130/114910291.png)
![search](http://ouzcfzhgs.bkt.clouddn.com/blog/20171130/114915510.png)
</p>

## Tabris.js All-In-JS

记录一下UI开发上遇到的问题:

* 1.NavigationView不好用

> 使用NavigationView内部会有一个toolbar就是顶部的导航标题栏 -> 变动性太小
> NavigationView从父页面进入子页面，父页面的ui不会丢弃，子页面回到父页面，子页面的ui.disposed。
> NavigationView回到子页面时页面UI不会重新渲染，数据流的变化有些复杂(这一块可能是我自己的应用编写经验不足，有了解的小伙伴可以一起交流一下)
> app.backNavigation事件在页面dispose之前触发
> NavigationView的后退按钮，没有相关事件的触发

* 2.highlightOnTouch

> 用在父组件上时UI发生闪动，而且子控件位置效果会发生变化

* 3.fs操作fs.cacheDir

> 文件在app推出后会发生丢失？或许这只是tabris开发者APP的一个问题？

* 4.animation动画只能改变位置

> 动画只能修改控件的x/y位置以及scale/rotate等效果，空间大小无法修改

* 5.cordova plugins

> 直接在confing.xml中写入配置，无需安装，打包时会自动安装。
> tabris.js app调试时如果需要引入插件，则需要重新打包该调试app

## Nodejs Server

* api server - 通过koa编写接口服务
* websocket server - 管理websocket链接(这一块参考前面的websocket协议文章)
* sequelize - mysql-ORM对象关系映射

> koa很棒，简单明了，直接写中间件函数就可以
> 没有使用socket.io的原因是tabris.js内置了websocket, 而socket.io需要客户端和服务端都使用socket.io才能协同工作. 这一块tabris.js如何嵌入socket.io可以研究一下.
> mysql进行数据管理

** sql **
``` sql
create database chatapp;

create table user (
    userid int(6) not null primary key auto_increment,
    username char(16) not null,
    pswd char(40) not null
);

create table userinfo {
    userid int(6) not null primary key,
    username char(16) not null,
    nikename char(16) not null,
    avatar char(40) not null
};

create table token {
    token char(30) not null primary key,
    userid int(6) not null
}
```

> pswd md5 hex加密后存入
> token md5 base64为键值
> 通过文件管理用户的联系人 -> 因为这一块不清楚sql的实现.......逃...

## 总结

多写多练多接触。-> 没什么创新性，懒得传github了........逃...

## 参考链接

* [Tabrisjs - 中文文档](https://youjingyu.github.io/Tabris-Documention/)
* [Tabrisjs - 官网](https://tabrisjs.com)
* [websocket - 实战](/blog/2017/11/16/Nodejs总结之WebSocket应用实战/)
* [socket.io doc](https://socket.io/docs/)
* [Sequelize 中文文档](https://itbilu.com/nodejs/npm/VkYIaRPz-.html)
* [koa - 中文网](http://koacn.com/)
* [koa - 官网](http://koajs.com/)
* [cordova中文网 - 插件](http://cordova.axuer.com/plugins/)
