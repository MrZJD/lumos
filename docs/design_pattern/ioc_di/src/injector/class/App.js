// container
const Injector = require('../Injector')

class App {
    constructor () {
        this.injector = new Injector()
    }

    inject (obj) {
        for (let di in obj) {
            this.injector.put(di, obj[di])
        }
    }

    resolve (diers) {
        diers.forEach(dier => {
            dier[2][dier[3]] = this.injector.resolve(dier[0], dier[1])
        })
    }

    run () {
        this.main()
    }
}

module.exports = App
