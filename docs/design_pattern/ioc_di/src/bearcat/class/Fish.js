function Fish () {
    this.type = 'Fish'
}

Fish.prototype.toString = function () {
    return this.type
}

module.exports = Fish