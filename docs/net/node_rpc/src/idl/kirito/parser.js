'use strict';

const {
    tokenizer,
    parser,
    transformer,
    TYPE,
    EXP
} = require('./common.js');

exports[parser] = function (tokens) {
    const ast = {
        type: 'Program',
        body: []
    };

    let current = 0;

    function walk () {
        let token = tokens[current];

        // 变量 数据类型
        if (token.type === TYPE.VARIABLE) {
            current++;
            return {
                type: EXP.VARIABLE,
                struct: tokens[current].value === '=' ? false : true,
                value: token.value
            };
        }

        // 符号
        if (token.type === TYPE.SYMBOL) {
            // @
            if (token.value === '@') {
                token = tokens[++current];
                let node = {
                    type: EXP.VAR_DECLARATION,
                    name: '@',
                    value: token.value,
                    params: []
                };

                token = tokens[++current];

                while (token.value !== ';') {
                    node.params.push(walk());

                    token = tokens[current];
                }

                current++;

                return node;
            }

            // =
            if (token.value === '=') {
                token = tokens[++current];
                current++;
                return {
                    type: EXP.TYPE,
                    value: token.value
                };
            }

            current++;
        }

        // 关键词
        if (token.type === TYPE.KEYWORD) {
            // service struct
            if (['struct', 'service'].indexOf(token.value) !== -1) {
                let keywordName = token.value;

                token = tokens[++current];

                let node = {
                    type: EXP.STRUCT_DECLARATION,
                    name: keywordName,
                    value: token.value,
                    params: []
                };

                token = tokens[++current];
                // {
                if (token.type === TYPE.SYMBOL && token.value === '{') {
                    token = tokens[++current];

                    while (token.value !== '}') {
                        node.params.push(walk());
                        
                        token = tokens[current];
                    }

                    current++;
                }

                return node;
            }

            // method
            if (token.value === 'method') {
                token = tokens[++current];

                let node = {
                    type: EXP.STRUCT_DECLARATION,
                    name: 'method',
                    value: token.value,
                    params: []
                };

                token = tokens[++current];

                if (token.type === TYPE.SYMBOL && token.value === '(') {
                    token = tokens[++current];

                    while (token.value !== ')') {
                        node.params.push(walk());

                        token = tokens[current];
                    }

                    current++;
                }

                return node;
            }
        }

        // 抛出未匹配到的错误
        throw new TypeError(token.type);
    }

    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}
