// worker 工作进程

// 1. 创建Server
// 2. 通过message事件接收主进程send发送的消息
// 3. uncaughtException 捕获未处理异常，发送自杀信息 由主进程重建进程 子进程在连接关闭后退出

'use strict'

const http = require('http')
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.end('I am a worker, pid: ' + process.pid, ' , ppid: ' + process.ppid)

    throw new Error('worker process exception!')
})

let worker

process.title = 'node-worker'

process.on('message', function (message, sendHandle) {
    if (message === 'server') {
        worker = sendHandle

        worker.on('connection', function (socket) {
            server.emit('connection', socket)
        })
    }
})

process.on('uncaughtException', function (err) {
    process.send({ act: 'suicide' })

    worker.close(function () {
        process.exit(1)
    })
})
