const http = require('http')
const cpuNums = require('os').cpus().length
const cluster = require('cluster')

if (cluster.isMaster) {
    console.log('Master process id is:', process.pid)

    for (let i = 0; i < cpuNums; i++) {
        cluster.fork()
    }

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker process died, id:', worker.process.pid)
    })
} else {
    http.createServer(function (req, res) {
        res.writeHead(200)
        res.end('hello world in pid')
    }).listen(8000)

    console.log(`工作进程 ${process.pid} 已启动`);
}
