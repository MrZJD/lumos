'use strict';

define(function(require, exports, module) {
    var headerComponent = {
        template: require('../template/header.html'),
        data: function () {
            return {
                test: 'asd'
            };
        }
    };
    module.exports = headerComponent;
});