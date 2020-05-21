'use strict';

const {
    isMainThread,
    parentPort
} = require('worker_threads')

// Main processing function
function computePrimeFactorization(value) {
    const result = {
        value,
        factors: []
    };

    let i = 2;
    while (i * i < value) {
        while (value % i === 0) {
            result.factors.push(i);
            value = value / i;
        }
        i++;
    }

    if (value > 1 || result.factors.length == 0) {
        result.factors.push(value);
    }

    return result;
}

if (isMainThread) {
    console.log(process.pid)
    const WorkerPool = require('./WorkerPool');
    const workerPool = new WorkerPool(40);
    // Init data
    const numberOfFactorization = 256*5;
    console.log(`Computing ${numberOfFactorization} prime factorizations...`);

    //
    // Start of processing
    //

    let start = Date.now();
    let results = [];
    let lock = 0;
    for (let idx = 0; idx < numberOfFactorization; idx++) {
        lock++;

        // console.log('-->>> ', lock, '<<<-- ')
        workerPool.getWorker().goWork(9007199254040991 + idx).onDone((result) => {
            // console.log('<<<-- ', lock, '-->>>')
            results.push(result);

            lock--;
            if (lock <= 0) {
                finish()
            }
        })
    }

    function finish () {
        let end = Date.now();

        // Display results
        // results.forEach((it) => {
        //     console.error(`Prime factors of ${it.value} are ${it.factors}` +
        //         (it.factors.reduce((acc, prime) => acc *= prime) === it.value ? '' : ' [Error]'));
        // });
        console.log(`${results.length} prime factorizations computed in ${end - start}` +
            ` by Node with its unique thread` +
            ` on a ${require('os').cpus().length} CPU(s) host`);

        process.exit(0);
    }

    //
    // End of processing
    //
} else {
    // console.log(' -------> in worker thread <------- ')
    parentPort.on('message', function (data) {
        if (data.cmd === 'calc') {
            const result = computePrimeFactorization(data.data);
            parentPort.postMessage({cmd: 'done', data: result});
        }
    })

    // const result = computePrimeFactorization(workerData);
    // parentPort.postMessage({cmd: 'done', data: result});
}