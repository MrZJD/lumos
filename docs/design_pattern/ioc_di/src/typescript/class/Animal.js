"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.eat = function () {
        console.log(this + " eat " + this.food);
    };
    return Animal;
}());
exports.default = Animal;
