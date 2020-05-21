## Vue Component Static Development 组件化开发 无需打包部署 本地化开发方案

> 可用于cordova等本地化h5开发

模块化开发依赖 sea.js seajs-text.js

数据绑定依赖vue：vuejs / vue-router / vuex (并不必须使用全家桶，vue只作为数据绑定的功能实现)

UI: 无依赖 可使用swiper better-scroll成熟的解决方案 或使用其他ui框架

### 项目结构

```
static-vue
├─bower_components      // bower 资源
├─components            // 自定义组件资源
├─public
│  ├─css
│  └─images
├─template              // 对应组件模板
├─views                 // views视图
├─index.html            // 入口html
└─main.js               // 入口js
```

入口html：
```html
<link rel="stylesheet" href="./bower_components/swiper/dist/css/swiper.min.css">
<link rel="stylesheet" href="./public/css/base.css">
<link rel="stylesheet" href="./public/css/indexPage.css">

<div id="app"></div>

<script src="./bower_components/seajs/dist/sea-debug.js"></script>
<script src="./bower_components/seajs-text/dist/seajs-text.js"></script>
<script src="./bower_components/swiper/dist/js/swiper.js"></script>
<script src="./bower_components/vue/dist/vue.js"></script>
<script src="./bower_components/vue-router/dist/vue-router.js"></script>
<script>
    /* mobile rem */
    (function(){
        var screenW= document.documentElement.clientWidth || document.body.clientWidth;
        var hDom = document.getElementsByTagName('html')[0];
        if(screenW>640) screenW = 640;
        hDom.style.fontSize = screenW  /  18.75 +'px';
    }());

    seajs.use('./main.js');
</script>
```

main.js
```javascript
'use strict';

define(function (require, exports, module) {
    /* 定义路由 */
    var router = new VueRouter({
        routes: [
            {
                path: '/',
                component: require('./views/index.js')
            }
        ]
    });

    var vm = new Vue({
        el: '#app',
        router: router,
        template: require('./frame.html')
    });
    exports.vm = vm;
});
```

views / components

引入模板
``` javascript
template: require('./template/index.html')
```

引入组件
``` javascript
components: {
    'calendar-box': require('../components/calendar.js')
}
```

完整写法
```javascript
'use strict';

define( function (require, exports, module) {
    module.exports = {
        template: require('./index.html'),
        data: function () {
            return {
                msg: 'indexView',
                activei: 0
            };
        },
        methods: {
            swiperTo: function (pagei) {
                this.swiper.slideTo(pagei);
            }
        },
        components: {
            'calendar-box': require('../components/calendar.js')
        },
        mounted: function () {
            this.swiper = new Swiper('.tab-content');

            var _self = this;
            this.swiper.on('slideChange', function() {
                _self.activei = this.activeIndex;
            });
        }
    }
});
```