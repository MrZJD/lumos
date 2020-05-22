const AOPUtils = require('./aop')

/* 基于原型链 */

// 1. 对函数进行切面操作
function targetFn (a, b) {
    console.log(a + b)
}

function beforeValidate (a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return true
    }
    console.log('参数必须为数字')
    return false
}

function afterRelease (a, b) {
    console.log('after')
}

targetFn = targetFn.before(beforeValidate).after(afterRelease)

targetFn(1, 'a')

// 2. 对方法进行切面操作
class Target {
    constructor (a, b) {
        this.a = a
        this.b = b
    }

    t () {
        console.log(this.a + this.b)
    }
}

Target.prototype.t = Target.prototype.t.before(function () {
    if (typeof this.a === 'number' && typeof this.b === 'number') {
        return true
    }
    console.log('参数必须为数字')
    return false
}).after(afterRelease)

let targetIns = new Target(1, 2)
targetIns.t()


/* 基于工具类 */
// 1. 函数
function plus (a, b) {
    console.log(a * b)
}

plus = AOPUtils.before(plus, function (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return new Error('参数类型有误')
    }
})
plus = AOPUtils.after(plus, function (a, b) {
    console.log('AOPUtils after')
})

let eil = plus(3, 2)
console.log(eil)

// 2. 方法
class Plus {
    constructor (a, b) {
        this.a = a
        this.b = b
    }

    exec () {
        console.log(this.a * this.b)
    }
}

Plus.prototype.exec = AOPUtils.before(Plus.prototype.exec, function () {
    // (after 2)
    if (typeof this.a !== 'number' || typeof this.b !== 'number') {
        return new Error('参数类型有误')
    }
})
Plus.prototype.exec = AOPUtils.after(Plus.prototype.exec, function () {
    console.log('after 1 ')
})
Plus.prototype.exec = AOPUtils.before(Plus.prototype.exec, function () {
    console.log('(before 1) 多层级this测试: ', this.a, this.b) // 最后加的before最先执行
})
Plus.prototype.exec = AOPUtils.after(Plus.prototype.exec, function () {
    console.log('after 2 ')
})
Plus.prototype.exec = AOPUtils.after(Plus.prototype.exec, function () {
    console.log('after 3 ') // 最后加的after最后执行
})

let p = new Plus(2, 9)
p.exec()
