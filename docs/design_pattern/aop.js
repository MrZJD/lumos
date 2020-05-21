/**
 * AOP: Aspect Oriented Programming
 * AOP in JS
 * @author mrzjd
 * @date 2019/7/17
 */

/* 基于原型链的实现 (侵入式修改) */
Function.execAOP = function () {
    if (!this._AOP) {
        return
    }

    for (let i = 0, len = this._AOP._before.length; i < len; i++) {
        let ref = this._AOP._before[i].apply(this._ctx, arguments)
        if (!ref) {
            return
        }
    }
    let ref = this._AOP._self.apply(this._ctx, arguments)
    for (let i = 0, len = this._AOP._after.length; i < len; i++) {
        let ref = this._AOP._after[i].apply(this._ctx, arguments)
        if (!ref) {
            return
        }
    }
    return ref
}

Function.prototype.before = function (before) {
    if (!this._AOP) {
        let ref = function () {
            ref._ctx = this // 作用域回溯
            return Function.execAOP.apply(ref, arguments)
        }
    
        ref._AOP = {
            _self: this,
            _before: [],
            _after: []
        }
        
        ref._AOP._before.push(before)

        return ref
    }

    this._AOP._before.push(before)
    
    return this
}

Function.prototype.after = function (after) {
    if (!this._AOP) {
        let ref = function () {
            ref._ctx = this // 作用域回溯
            return Function.execAOP.call(ref)
        }
    
        ref._AOP = {
            _self: this,
            _before: [],
            _after: [],
        }
        
        ref._AOP._after.push(after)

        return ref
    }

    this._AOP._after.push(after)
    
    return this
}

/* 基于方法类的实现 */
const AOPUtils = {
    noop () { /* block func */ },
    before (target, before) {
        return function () {
            let ref = before.apply(this, arguments)
            if (ref instanceof Error) {
                return ref
            }
            return target.apply(this, arguments)
        }
    },
    after (target, after) {
        return function () {
            let ref = target.apply(this, arguments)
            if (ref instanceof Error) {
                return ref
            }
            return after.apply(this, arguments)
        }
    }
}

module.exports = AOPUtils
