### 前言

<p style="display:block;">从零开始构建一个Android App. 熟悉Cordova相关插件及配置, App实质为一个SPA应用, 熟悉CycleJS的解决方案, RxJS对应用逻辑的处理。</p>

<p style="display:block;">本文先介绍关于App的基础常用设置，以及SPA的应用结构，路由处理等。默认已经安装好JDK, Android SDK 以及Cordova, CycleJS, RxJS, Webpack等工具链。</p>


### Start - config.xml

<p style="display:block;">配置app应用基础信息: 反向域名包名，应用名及描述，作者，内容页</p>
<p style="display:block;">设置应用图标</p>
	```
	<icon src="res/cordova.png" />
	```
<p style="display:block;">设置启动屏</p>
	```
	<preference name="SplashScreen" value="screen" />
    <preference name="SplashScreenDelay" value="3000" />
    <preference name="FadeSplashScreen" value="true" />
    <preference name="FadeSplashScreenDuration" value="500" />
    <preference name="ShowSplashScreenSpinner" value="false" />
	
	<platform name="android">
        <splash density="land-hdpi" src="res/screen/android/screen-hdpi-landscape.png" />
        <splash density="land-ldpi" src="res/screen/android/screen-ldpi-landscape.png" />
        <splash density="land-mdpi" src="res/screen/android/screen-mdpi-landscape.png" />
        <splash density="land-xhdpi" src="res/screen/android/screen-xhdpi-landscape.png" />
        <splash density="port-hdpi" src="res/screen/android/screen-hdpi-portrait.png" />
        <splash density="port-ldpi" src="res/screen/android/screen-ldpi-portrait.png" />
        <splash density="port-mdpi" src="res/screen/android/screen-mdpi-portrait.png" />
        <splash density="port-xhdpi" src="res/screen/android/screen-xhdpi-portrait.png" />
	</platform>
	```
<p style="display:block;">IOS需要在config中设置StatusBar / Android则在应用启动runtime中设置</p>

### CycleJS SPA

1. <p style="display:block;">根目录下建立sources文件夹用于SPA - JS代码</p>
	```
	├─components #存放SPA组件
	├─pages		 #存在SPA页面
	└─router	 #存放路由器
	--- main.js  #index
	```
2. <p style="display:block;">www目录为js -> 编译后的目标文件夹， 以及存放其他页面数据CSS/IMAGES等</p>
3. APP所有图标采用 font-awesome
4. SPA的点击事件依赖 FaskClick


### SPA 结构

```
import Rx from "rxjs";
import { run } from "@cycle/rxjs-run";
import { makeDOMDriver } from "@cycle/dom";
import { makeHashHistoryDriver } from "@cycle/history";
import { html } from "snabbdom-jsx";

import FastClick from "fastclick";

/* 路由处理器 */
import { useRouter } from "./router/route";

/* 公共组件 */
import MainNavigator from "./components/MainNavigator.component";
import MainHeader from "./components/MainHeader.component";

const AppLifeCycle = {
    'deviceready' : () => {
        /* APP 载入完成 */
        FastClick.attach(document.body);

        /* 启动SPA */
        run(appMain, {
            DOM: makeDOMDriver("#app"),
            history: makeHashHistoryDriver()
        });
    },
    'pause' : () => {},
    'resume' : () => {},
    'backbutton' : () => {},
    'searchbutton' : () => {}
}

function appMain (sources) {
    /* routeSinks分发出渲染的页面dom$ */
    /* 所有的页面路由都需要先在route中注册 */
    var routeSinks$ = Rx.Observable.from(sources.history)
        .map(useRouter);
    
    /* 公共组件 */
    var naviSinks$ = MainNavigator(sources);

    var headerSinks$ = MainHeader(sources);

    return {
        DOM : vdom$,
        history : history$
    };
}

function appInit () {
    try{
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#00AA98");
        }
    }catch(e){
        console.log(e);
    }

    for (var key in AppLifeCycle) {
        document.addEventListener(key, AppLifeCycle[key], false);
    }
    
    /* 便于浏览器端调试 */
    window.onload = AppLifeCycle['deviceready'];
}

appInit();
```

### SPA路由-route.js

```
/**
 * route.js
 * 
 * 负责路由定义分发
 * 所有的页面路由都需要在route中注册
 * 
 * 目前路由规则有待完善：
 * -> 路由的数据
 * -> 子路由的分发
 * -> 专题页面的分发
 */

import Rx from 'rxjs';

import IndexPage from '../pages/index.page.js';
import ArchivePage from '../pages/archive.page.js';
import NotFoundPage from '../pages/404.page.js';

const AppRouteList = {
    '/home': IndexPage,
    '/archive': ArchivePage,
    "/notfound": NotFoundPage
};

export function useRouter(history) {
    var pageSinks = null;
    if (history.pathname === '/') {
        pageSinks = AppRouteList['/home']();
    } else if (!AppRouteList[history.pathname]) {
        pageSinks = AppRouteList['/notfound']();
    } else {
        pageSinks = AppRouteList[history.pathname]();
    }

    return {
        DOM: pageSinks.DOM,
        history: Rx.Observable.of(history.pathname)
    };
}
```

### SPA - Pages

> page实际上一个完整的组件组合区域，状态共享区域

```
/**
 * IndexPage
 * 
 * 主页
 */

import Rx from "rxjs";
import { html } from "snabbdom-jsx";

function IndexPage () {

    return {
        DOM : Rx.Observable.of(<div className="homebox">
            <p className="info">index.page.js</p>
        </div>)
    }
}

export default IndexPage
```

### SPA - Components

> 组件，负责page中一部分的渲染，数据逻辑，各自分散独立，便于组合。数据来源可以是，根据父组件/pages传递进来，也可以自成一体。

```
/**
 * 应用的头部标题的状态
 * 
 * -> 根据不同的路由提供不同的状态
 */

import Rx from "rxjs";
import { html } from "snabbdom-jsx";
import isolate from "@cycle/isolate";

function proxyPath (pathObj) {
    var result = null;
    
    switch (pathObj.pathname) {
        case "/":
        case "/home": result = {
            name : "Home",
            type : 1
        }; break;
        case "/archive": result = {
            name : "Archive",
            type : 1
        }; break;
        default : result = {
            name : "Home",
            type : gettypeByUri(pathObj.pathname)
        }; break;
    }

    return result;
}

function gettypeByUri (pathname) {
    if ( /^\/[a-zA-Z]+\/?$/g.test(pathname) ) {
        return 1;
    } else if (/^\/[a-zA-Z]+\/[a-zA-Z]+\/?$/g.test(pathname)) {
        return 2;
    } else {
        return 3;
    }
}

function _intent_ (sources) {
    var routeUri$ = Rx.Observable.from(sources.history)
        .map(pathObj => proxyPath(pathObj));

    return routeUri$;
}

function _view_ (state$) {
    return state$.map(val => {
        if( val.type == 1 ){
            return <div className="main-header header-a">
                <span className="name">{val.name} - {val.type}</span>
                <span className="icon-info fa fa-cogs"></span>
            </div>;
        }

        if( val.type == 2 ){
            return <div className="main-header header-b">
                <span className="icon-back fa fa-chevron-left"></span>
                <span className="name">{val.name} - {val.type}</span>
                <span className="icon-info fa fa-cogs"></span>
            </div>;
        }

        if( val.type == 3 ){
            return <div className="main-header header-c">
                <span className="icon-back fa fa-chevron-left"></span>
                <span className="name">{val.name} - {val.type}</span>
                <span className="icon-info fa fa-cogs"></span>
            </div>;
        }
    });
}

function MainHeader (sources) {
    var actions$ = _intent_(sources);

    var vdom$ = _view_(actions$);

    return {
        DOM : vdom$
    };
}

const IsoMainHeader = isolate(MainHeader, "main-header");

export default IsoMainHeader;
```

### 效果图 

![Android App](http://ouzcfzhgs.bkt.clouddn.com/blog/20170910/125304484.png)










