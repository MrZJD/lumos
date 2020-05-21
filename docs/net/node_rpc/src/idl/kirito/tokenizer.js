'use strict';

const {
    tokenizer,
    parser,
    transformer,
    TYPE,
    EXP
} = require('./common.js');

exports[tokenizer] = function (input) {
    const KEYWORD = ['service', 'struct', 'method'];
    const SYMBOL = ['{', '}', '(', ')', '=', '@', ';'];
    const WHITESPACE = /\s/;
    const LETTERS = /^[a-z]$/i;
    const NUMBER = /\d/;

    const source = input.split('\n');

    const tokens = [];

    source.some(line => {
        let current = 0;
        let isCountinue = false

        while (current < line.length) {
            let char = line[current];

            // 空格
            if (WHITESPACE.test(char)) {
                current++;
                continue;
            }

            // 注释
            if (char === '#') {
                isCountinue = true;
                break;
            }

            // 字符串: 关键词 变量名 类型名
            if (LETTERS.test(char)) {
                let value = '';

                // 获取当前的word
                while (LETTERS.test(char) || NUMBER.test(char)) {
                    value += char;
                    char = line[++current];
                }

                if (KEYWORD.indexOf(value) !== -1) { // 是关键词
                    tokens.push({
                        type: TYPE.KEYWORD,
                        value
                    });
                } else { // 变量名 或 类型
                    tokens.push({
                        type: TYPE.VARIABLE,
                        value
                    });
                }

                continue;
            }

            // 符号
            if (SYMBOL.indexOf(char) !== -1) {
                tokens.push({
                    type: TYPE.SYMBOL,
                    value: char
                });

                if (char === '@') {
                    char = line[++current];

                    if (NUMBER.test(char)) {
                        let index = '';
                        while (NUMBER.test(char)) {
                            index += char;
                            char = line[++current];
                        }
                        tokens.push({
                            type: TYPE.INDEX,
                            value: index
                        });
                    }
                    continue;
                }
                current++;
                continue;
            }

            current++;
        }

        // 跳过注释
        if (isCountinue) return false;
    });

    return tokens;
}
