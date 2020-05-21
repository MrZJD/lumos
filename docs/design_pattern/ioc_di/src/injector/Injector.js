/* 基于Injector Cache 函数参数 实现DI */

// 因为js没有 Reflection反射 -> hack: toString 分析依赖

class Injector {
    constructor () {
        this._cache = {}
    }

    put (name, di) {
        this._cache[name] = di
    }

    getParamNames (func) {
        let params = func.toString().match(/^\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
        params = params.replace(/ /g, '')
        params = params.split(',')
        return params
    }

    resolve (func, bind) {
        let params = this.getParamNames(func).map((name) => {
            return this._cache[name]
        })
        // func.apply(bind, params)
        return func.bind(bind, ...params)
    }
}

module.exports = Injector
