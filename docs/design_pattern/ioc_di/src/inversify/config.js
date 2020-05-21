"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var TYPES_1 = require("./TYPES");
var Cat_1 = require("./class/Cat");
var Bone_1 = require("./class/Bone");
var container = new inversify_1.Container();
exports.container = container;
container.bind(TYPES_1.TYPES.Animal).to(Cat_1.default);
container.bind(TYPES_1.TYPES.Food).to(Bone_1.default);
