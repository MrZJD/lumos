# Service Worker

## Pre

* 必须HTTPS，host允许localhost/127.0.0.1进行调试
* CacheAPI
* HTML5 fetch API
* Promise

## 注册

```js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js', { scope: '/' })
            .then(function (registration) {
                console.log('registration success with scope: ', registration.scope)
            })
            .catch(function (err) {
                console.log('ServiceWorker registe failed: ', err)
            })
    })
}
```

## 安装

```js
// service worker install event
this.addEventListener('install', function (event) {
    // 阻塞安装事件 event.waitUntil(promise<Promise>)
    // promise reject时 安装失败 worker不会做任何事情
    event.waitUntil(
        // CacheStorage 缓存 open 打开对应缓存空间
        caches.open('my-test-cache-v1').then(function (cache) {
            // 添加 precache 缓存 // ** 静态缓存 **
            return cache.addAll([
                '/', '/index.html', '/main.css', '/main.js', '/image.jpg'
            ])
        })
    )
})
```

## 自定义响应请求

```js
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 代理
            if (response) { // 有缓存
                return response
            }

            let request = event.request.clone()

            // 请求网络 // ** 动态缓存 **
            return fetch(request).then(function (httpRes) {
                if (!(!httpRes || httpRes.status !== 200)) { // 请求成功 缓存
                    let responseClone = httpRes.clone()
                    caches.open('my-test-cache-v1').then(function (cache) {
                        cache.put(event.request, responseClone)
                    })
                }

                return httpRes // 返回
            })
        })
    )
})
```

## ServiceWorker.js 文件自身的更新策略

> 当打开的获取了新的sw.js时，会逐字节对比，安装新的文件并进入waiting阶段。旧的已激活状态下的sw，直到所有打开页面都关闭后自动停止。新的sw在重新打开的页面中生效。

**强制手动更新**

```js
// self.skipWaiting()
// self.clients.claim()

self.addEventListener('install', function (event) {
    event.waitUntil(
        self.skipWaiting() // 跳过等待 直接进入activate
    )
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            // 更新客户端
            self.clients.claim(),
            // 清理旧版本
            cache.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== 'my-test-cache-v1') {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
        ])
    )
})
```

**本地强刷**

```js
let version = '1.0.1'

navigator.serviceWorker.resgiter('sw.js').then(function (reg) {
    if (localStorage.getItem('sw_version') !== version) {
        reg.update().then(function () {
            localStorage.setItem('sw_version', version)
        })
    }
})
```

**debug强刷**

```js
self.addEventListener('install', function () {
    self.skipWaiting()
})
```

> 浏览器的缓存策略，添加版本号，或者设置server response缓存规则
> service worker应用了特殊的缓存策略，如果文件24h没有更新则当update触发时会强制更新

## ServiceWorker 生命周期

```js
-------------------------------------------------------------------------------------
|            JS MAIN THREAD            |             ServiceWorker THREAD           |
|                                     asyc                                          |
|  serviceWorkerContainer.register()  --->               install(ing)               |
|                                      |                                            |
|                                      |              installed(waiting)            |
|                                      |                                            |
|                                      |           activating(activate event)       |
|                                      |                                            |
|                                      |            activated(handle events)        |
|                                      |                                            |
|                                      |                  redundant                 |
-------------------------------------------------------------------------------------
```

events

* install
* activite
* message
* fetch/sync/push




