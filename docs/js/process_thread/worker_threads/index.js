'use strict';

console.log('pid:', process.pid)

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

function run() {
    // Init data
    const numberOfFactorization = 256*5;
    console.log(`Computing ${numberOfFactorization} prime factorizations...`);

    //
    // Start of processing
    //

    let start = Date.now();
    let results = [];
    for (let idx = 0; idx < numberOfFactorization; idx++) {
        const result = computePrimeFactorization(9007199254040991 + idx);
        // console.log('--> result -->\n', result)
        // console.log('<<<-- ', idx, '-->>>')
        results.push(result);
    }
    let end = Date.now();

    //
    // End of processing
    //

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

run();