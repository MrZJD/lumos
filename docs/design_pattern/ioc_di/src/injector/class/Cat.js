const Animal = require('./Animal')

class Cat extends Animal {
    constructor () {
        super()
        this.type = 'Cat'
    }
    init (food) {
        this.food = food
    }
    toString () {
        return this.type
    }
}

module.exports = Cat