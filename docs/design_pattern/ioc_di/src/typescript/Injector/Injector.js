"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dependenciesMap = {};
exports.injector = {
    resolve: function (constructor) {
        var deps = dependenciesMap[constructor.name];
        deps = deps.map(function (dependency) {
            return dependenciesMap[dependency.name] ? exports.injector.resolve(dependency.fn) : new dependency.fn();
        });
        var mockContructor = function () {
            constructor.apply(this, deps);
        };
        mockContructor.prototype = constructor.prototype;
        return new mockContructor;
    }
};
function Inject() {
    var deps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        deps[_i] = arguments[_i];
    }
    return function (constructor) {
        dependenciesMap[constructor.name] = deps.map(function (dep) { return ({
            name: dep.name,
            fn: dep
        }); });
        return constructor;
    };
}
exports.Inject = Inject;
exports.default = {
    Inject: Inject, injector: exports.injector
};
