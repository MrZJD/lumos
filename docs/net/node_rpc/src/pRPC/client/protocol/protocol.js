'use strict';

const mqtt = require('./mqtt');

module.exports.create = function (opts = {}) {
    return mqtt.create(opts);
}
