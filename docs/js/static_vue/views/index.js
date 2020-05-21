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
                throw new Error('123');
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