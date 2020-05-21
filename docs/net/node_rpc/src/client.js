'use strict';

const Client = require('./pRPC/client/index');
const path = require('path');
const kiritoProto = './idl/kirito/sample.kirito';

const proto = require('./idl/kirito/kirito').load(path.resolve(__dirname, kiritoProto));
const client = new Client({
    host: 'localhost',
    port: 10003
}, proto.testService);

client.ping({
    age: 23,
    name: 'mrzjd'
}, function (err, result) {
    if (err) {
        throw new Error(err.message);
    }
    console.log(result);
});
