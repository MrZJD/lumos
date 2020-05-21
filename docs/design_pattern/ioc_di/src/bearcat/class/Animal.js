function Animal () {}

Animal.prototype.eat = function () {
    console.log(`${this} eat ${this.food}`)
}

module.exports = Animal