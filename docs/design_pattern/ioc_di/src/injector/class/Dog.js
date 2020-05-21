const Animal = require('./Animal')

class Dog extends Animal {
    constructor () {
        super()
        this.type = 'Dog'
    }
    init (food) {
        this.food = food
    }
    toString () {
        return this.type
    }
}

module.exports = Dog