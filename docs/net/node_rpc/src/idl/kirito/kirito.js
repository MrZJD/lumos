'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const {
    tokenizer,
    parser,
    transformer,
    TYPE,
    EXP
} = require('./common');
const getTokens = require('./tokenizer')[tokenizer];
const getAST = require('./parser')[parser];
const getFomer = require('./transformer')[transformer];

// const readFile = promisify(fs.readFile);

module.exports = {
    load (path) {
        let proto = fs.readFileSync(path, 'utf8');
        let token = getTokens(proto);
        let ast = getAST(token);
        return getFomer(ast);
    }
}
