# manifest.json

> PWA实现将应用添加至桌面依赖于manifest.json

## 使用Usage

```html
<link rel="manifest" href="./manifest.json">
```

```json
{
    /*        基础设置        */
    // 名称
    "name": "$APP_NAME", // -> 用于安装，启动画面显示
    "short_name": "$APP_SHORT_NAME", // -> 主屏幕显示 (桌面上的显示)
    // 自定义图标
    "icons": [ // {Array.<ImageObject>}
        {
            "src": "icon_96x96.png",
            "type": "image/png",
            "sizes": "96x96" // w*h
        }
    ],
    // 启动网址
    "start_url": "./index.html", // 相对路径基于manifest.json
    // scope
    "scope": "/", // -> 默认为manifest.json所在目录

    /*        高级设置        */
    // 启动屏
    // 图像 -> icon 标题 -> name
    "background_color": "#00f", // 启动屏背景色 #000000 #000 rgb(0, 0, 0) transparent/blue/red..
    // 显示方式
    "display": "standalone", // "standalone" -> 隐藏浏览器UI / "fullscreen" -> 全屏启动 / "minimal-ui" -> 浏览器UI最小化 / "browser"
    // 显示方向
    "orientation": "", // any natural protrait landscape // protrait-primary/protrait-secondary landscape-primary/landscape-secondary
    // 手机状态栏 浏览器地址栏 颜色
    "theme_color": "", // color -> html <meta name="theme-color" content="green">
}
```

## 说明

**display 应用媒体查询改变样式**

```css
@media all and (display-mode: fullscreen) {
    body {
        margin: 0;
    }
}

@media all and (display-mode: standalone) {
    body {
        margin: 1px;
    }
}

@media all and (display-mode: minimal-ui) {
    body {
        margin: 2px;
    }
}

@media all and (display-mode: browser) {
    body {
        margin: 3px;
    }
}
```

**添加应用横幅**

自动显示横幅条件

* 具备manifest.json, 并有属性short_name/name/icons(image/png)/start_url/display(standalone/fullscreen)
* registe service worker
* https
* 至少被访问两次，且间隔五分钟以上

横幅相关api

```js
let deferP = null

// event: beforeinstallprompt
window.addEventListener('beforeinstallprompt', function (e) {
    // 1. 跟踪用于行为
    e.userChoice.then(function (res) {
        // res.outcome -> 'accepted' 'dismissed'
    })

    // 2. 取消弹窗
    e.preventDefault()

    // 3. 延迟模拟点击弹窗
    deferP = e

    e.preventDefault()

    return false;
})

button.addEventListener('click', function () {
    if (deferP != null) {
        deferP.prompt() // hack

        deferP.userChoice.then(function (res) {
            // res.outcome -> 'accepted' 'dismissed'
        })

        deferP = null
    }
})
```

引导安装原生应用

```json
// manifest.json
{
    // ...
    "related_applications": [
        {
            "platform": "play",
            "id": "com.baidu.samples.apps.iosched"
        }
    ],
    "prefer_related_applications": true // 只弹出安装原生应用 而非PWA
    // ...
}
```
