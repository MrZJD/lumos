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