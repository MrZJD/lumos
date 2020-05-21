'use strict';

const tokenizer = Symbol.for('kirito#tokenizer');
const parser = Symbol.for('kirito#parser');
const transformer = Symbol.for('kirito#transformer');

const TYPE = {
    KEYWORD: 'keyword', // service, struct, method
    VARIABLE: 'variable', // 
    SYMBOL: 'symbol', // { } ( ) , ; # @ =
    INDEX: 'index', //
};

const EXP = {
    VARIABLE: 'Identifier', // 变量
    STRUCT_DECLARATION: 'StructDeclaration', // 结构声明 service struct method
    VAR_DECLARATION: 'VariableDeclaration', // 变量声明 @
    TYPE: 'DataType', // 数据类型
};

module.exports = {
    tokenizer,
    parser,
    transformer,
    TYPE,
    EXP
};
