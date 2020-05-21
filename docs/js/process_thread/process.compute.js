
const computation = () => {
    let sum = 0
    console.info('start computing...')
    console.time('computing time')

    for (let i = 0; i < 1e10; i++) {
        sum += i
    }

    console.info('end computing...')
    console.timeEnd('computing time')

    return sum
}

process.on('message', msg => {
    console.log(msg, 'process.id', process.pid)

    process.send(computation());
})
