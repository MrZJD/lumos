const Animal = require('./Animal')

function Dog (food) {
    this.type = 'Dog'
    this.food = food
}

Dog.prototype = new Animal()

Dog.prototype.toString = function () {
    return this.type
}

module.exports = Dog