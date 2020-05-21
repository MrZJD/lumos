// const pool = {
//     maxlen: 6,
//     _threads: [],
//     get () {
//         let hasWaiting = false
//         for (let i = 0; i < )
//     }
// }

const {
    Worker
} = require('worker_threads')
const {
    resolve
} = require('path')

class CalcWorker {
    constructor (mark) {
        this._mark = mark
        this.isfree = true
        this.ins = new Worker(resolve(__dirname, './index_in_thread.js'))
    }

    goWork (args) {
        this.ins.postMessage({
            cmd: 'calc',
            data: args
        })
        return this
    }

    onDone (cb) {
        this.ins.on('message', (cmd) => {
            // console.log('Done in Thread: ', this._mark)
            if (cmd.cmd === 'done') {
                this.ins.removeAllListeners('message')
                this.isfree = true
                cb(cmd.data)
            }
        })
    }
}

class WorkerPool {
    constructor (maxsize) {
        this.maxsize = maxsize
        this._threads = []
        this._line = {}
    }

    _new (mark) {
        return new CalcWorker(mark)
    }

    _memo () {
        const _self = this
        return {
            _wating: Date.now() + Math.random() * 10000, // 随机戳
            goWork (args) {
                _self._line[this._wating] = {
                    _wating: this._wating,
                    goWork: args
                }
                return this
            },
            onDone (cb) {
                _self._line[this._wating] && (_self._line[this._wating].onDone = cb)
            }
        }
    }

    checkline () {
        let waitingIns = null

        for (let key in this._line) {
            let target = this._line[key]
            if (!!target && target._wating) {
                this._line[key] = null
                waitingIns = target
                delete this._line[key]
                break
            }
        }

        if (waitingIns) {
            this.getWorker().goWork(waitingIns.goWork).onDone(waitingIns.onDone)
        }
    }

    getWorker () {
        let target = null

        for (let i = 0; i < this._threads.length; i++) {
            if (this._threads[i].isfree) {
                target = this._threads[i]
                break
            }
        }

        if (!target) {
            if (this._threads.length === this.maxsize) {
                // no free
                return this._memo()
            } else {
                target = this._new(this._threads.length)
                this._threads.push(target)
            }
        }

        target.isfree = false

        let onDone = target.onDone
        target.onDone = (callback) => {
            onDone.call(target, (result) => {
                callback.call(null, result)
                this.checkline()
            })
        }

        return target
    }
}

module.exports = WorkerPool
