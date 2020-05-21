"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var TYPES_1 = require("./TYPES");
var animal = config_1.container.get(TYPES_1.TYPES.Animal);
animal.eat();
