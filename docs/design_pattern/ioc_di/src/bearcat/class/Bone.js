function Bone () {
    this.type = 'Bone'
}

Bone.prototype.toString = function () {
    return this.type
}

module.exports = Bone