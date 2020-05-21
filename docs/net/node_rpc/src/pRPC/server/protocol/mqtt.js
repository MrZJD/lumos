'use strict';

const net = require('net');
const debug = require('debug')('polix-rpc:mqtt');
const EventEmitter = require('events').EventEmitter;
const mqttCon = require('mqtt-connection');

class MQTT extends EventEmitter {
    constructor () {
        super();

        this.inited = false;
        this.events = {};
    }

    listen (port, cb) {
        if (this.inited) {
            cb && cb(new Error('already inited.', null));
            return;
        }

        const self = this;
        this.inited = true;
        this.server  = new net.Server();
        this.port = port || 10003;

        this.server.listen(this.port);
        debug('MQTT Server is started for port: %d', this.port);

        this.server.on('error', (err) => {
            debug('rpc server is error: %j', err.stack);
            self.emit('error', err);
        });

        this.server.on('connection', (stream) => {
            const socket = mqttCon(stream)
            debug('=========== new connection ===========');

            socket.on('connect', () => {
                debug('connected');
                socket.connack({
                    returnCode: 0
                });
            });

            socket.on('error', (err) => {
                debug('error : %j', err);
                socket.destroy();
            });

            socket.on('close', () => {
                debug('=========== close ===========');
                socket.destroy();
            });

            socket.on('disconnect', () => {
                debug('=========== disconnect ===========');
                socket.destroy();
            });

            // -> publish: 接收client的请求
            socket.on('publish', (pkg) => {
                self.consumers(pkg, socket);
            });
        });
    }

    // 消费client端的请求
    consumers (pkg, socket) {
        const self = this;

        let content = pkg.payload.toString();
        debug(content);

        content = JSON.parse(content);
        const respMsg = {
            msgId: content.msgId
        };

        if (this.events[content.method] === null) {
            respMsg.error = {
                message: `not found ${content.method} method`
            };

            self.response(socket, {
                messageId: pkg.messageId,
                body: respMsg
            });
        } else {
            const fn = this.events[content.method].method;
            const callback = function (err, result) {
                respMsg.body = result;
                self.response(socket, {
                    messageId: pkg.messageId,
                    body: respMsg
                });
            };

            fn.call(fn, content.body, callback);
        }
    }

    // 推送数据包给client
    response (socket, result) {
        socket.publish({
            topic: 'rpc',
            qos: 1,
            messageId: result.messageId,
            payload: JSON.stringify(result.body)
        });
    }

    // 绑定监听器
    addEvent (events) {
        const eventKeys = Object.getOwnPropertyNames(events);

        eventKeys.some(event => {
            this.events[event] = {
                method: events[event].method,
                param: events[event].param
            };
        });
    }
}

module.exports.create = function () {
    return new MQTT();
};
