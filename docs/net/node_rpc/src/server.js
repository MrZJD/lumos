'use strict';

const Server = require('./pRPC/server/index');
const path = require('path');
const kiritoProto = './idl/kirito/sample.kirito';

const proto = require('./idl/kirito/kirito').load(path.resolve(__dirname, kiritoProto));
const server = new Server();

function test (call, cb) {
    cb(null, {
        age: call.age,
        name: call.name + 'in rpc'
    })
}

server.addKiritoService(proto.testService, {
    ping: test
});

server.listen(10003);
