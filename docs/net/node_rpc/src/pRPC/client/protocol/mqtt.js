'use strict';

const net = require('net');
const debug = require('debug')('polix-rpc:mqtt');
const EventEmitter = require('events').EventEmitter;
const mqttCon = require('mqtt-connection');

class MQTT extends EventEmitter {
    constructor (server) {
        super();

        this.host = server.host || 'localhost';
        this.port = server.port || 10003;

        this.connected = false;
        this.closed = false;
    }

    connect (cb) {
        if (this.connected) {
            cb && cb(new Error('mqtt rpc has already connected'), null);
            return ;
        }

        const self = this;
        const stream = net.createConnection(this.port, this.host);
        
        this.socket = mqttCon(stream);
        this.socket.on('connack', pkg => {
            debug('connack: %j', pkg);
        });

        this.socket.on('error', function (err) {
            debug('error: %j', err);
        });

        this.socket.on('publish', pkg => {
            const content = pkg.payload.toString();
            debug(content);

            this.emit('data', JSON.parse(content));
        });

        this.socket.on('puback', pkg => {
            debug('puback: %j', pkg);
        });

        this.socket.connect({
            clientId: 'MQTT_RPC_' + Math.round(new Date().getTime() / 1000)
        }, () => {
            if (self.connected) {
                return ;
            }

            self.connected = true;

            cb && cb(null, {
                connected: self.connected
            });
        })
    }

    send (param) {
        this.socket.publish({
            topic: 'rpc',
            qos: 1,
            messageId: 1,
            payload: JSON.stringify(param || {})
        });
    }

    close () {
        if (this.closed) {
            return ;
        }

        this.closed = true;
        this.connected = false;
        this.socket.destory();
    }
}

module.exports.create = function (server) {
    return new MQTT(server || {});
}
