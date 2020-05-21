const http = require('http')
const fork = require('child_process').fork

const server = http.createServer((req, res) => {
    if (req.url === '/compute') {
        const compute = fork('./process.compute.js')

        compute.send('开启一个新的子进程')

        compute.on('message', sum => {
            res.end(`Sum is ${sum}`)
        })

        compute.on('close', (code, signal) => {
            console.log(`收到close事件, 子进程收到信号 ${signal} 而终止, 退出码 ${code}`)
        })

        // req on close -> kill child_process
    } else {
        res.end('End')
    }
})

server.listen(3000, () => {
    console.log('Server started at port: 3000')
})
