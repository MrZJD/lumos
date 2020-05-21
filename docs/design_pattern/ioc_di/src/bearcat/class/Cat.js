const Animal = require('./Animal')

function Cat (food) {
    this.type = 'Cat'
    this.food = food
}

Cat.prototype = new Animal()

Cat.prototype.toString = function () {
    return this.type
}

module.exports = Cat