let dependenciesMap = {}

export let injector = {
    resolve: function (constructor) {
        let deps = dependenciesMap[constructor.name]
        deps = deps.map((dependency) => {
            return dependenciesMap[dependency.name] ? injector.resolve(dependency.fn) : new dependency.fn()
        })

        let mockContructor: any = function () {
            constructor.apply(this, deps)
        }
        mockContructor.prototype = constructor.prototype

        return new mockContructor
    }
}

export function Inject (...deps) {
    return function (constructor) {
        dependenciesMap[constructor.name] = deps.map(dep => ({
            name: dep.name,
            fn: dep
        }))
        return constructor
    }
}

export default {
    Inject, injector
}