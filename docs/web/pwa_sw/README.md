# PWA && Workbox

## PWA 介绍

> PWA: Progressive Web APP 渐进式Web应用
> 通过App Manifest 和 Service Worker来实现安装和离线缓存

## PWA 初步

1. html引入manifest

```html
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <!-- ... -->
        <link rel="manifest" href="manifest.json">
        <!-- ... -->
    </head>
    <!-- ... -->
</html>
```

2. [manifest.json配置项文档](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)

3. Service Worker

app.js

```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then(registration => {
        // register success!
    }).catch(err => {
        // register failed!
    })
}
```

sw.js

```js
const cacheStorageKey = 'cachesName'
const cacheList = [
    // 缓存资源列表
]

self.addEventListener('install', function (e) {
    // 缓存资源
    e.waitUntil(
        caches.open(cacheStorageKey).then((cache) => {
            return cache.addAll(cacheList)
        })
    )
})

self.addEventListener('activate', function (e) {
    // 过期资源释放
    let cacheDeletePromises = caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(name => {
            if (name !== cacheStorageKey) {
                return caches.delete(name)
            } else {
                return Promise.resolve()
            }
        }))
    })

    e.waitUntil{
        Promise.all([cacheDeletePromises])
    }
})

self.addEventListener('fetch', function (e) {
    // 缓存策略

    e.responseWith(
        // 1. 缓存中返回
        // caches.match(e.request)
        // 2. 远端拉取
        // fetch(e.request.url) // -> put caches
        // 3. mock
        // new Response('mock')
    )
})
```

## Workbox3

> Workbox: Google PWA 框架 用于简化 Service Worker

sw.js

```js
importScript('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js')

workbox.precaching([
    // 注册成功立即缓存的资源列表
])

workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.networkFirst()
)

workbox.routing.registerRoute(
    new RegExp('.*\.(?:js|css)'),
    workbox.strategies.cacheFirst()
)

workbox.routing.registerRoute(
    new RegExp('https://your.\.cdn\.com/'),
    workbox.strategies.stateWhileRevalidate()
)

// 缓存策略
// stateWhileRevalidate -> 有缓存直接返回，并且发送网络请求更新缓存，没有缓存直接网络请求
// networkFirst -> 网络请求优先，拿到结果刷新缓存并返回，失败返回已有缓存
// cacheFirst -> 缓存优先 -> 没有缓存发起网络请求并缓存
// networkOnly
// cacheOnly

// 自定义
```