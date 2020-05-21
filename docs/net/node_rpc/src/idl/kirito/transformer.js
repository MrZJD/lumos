'use strict';

const {
    tokenizer,
    parser,
    transformer,
    TYPE,
    EXP
} = require('./common.js');

exports[transformer] = function (ast) {
    const services = {};

    const structs = {};

    function traverseArray (array, parent) {
        array.some((child) => {
            traverseNode(child, parent);
        });
    }

    function traverseNode (node, parent) {
        switch (node.type) {
            case 'Program':
                traverseArray(node.body, parent);
                break;
            case 'StructDeclaration':
                if (node.name === 'service') {
                    parent[node.value] = {};

                    traverseArray(node.params, parent[node.value]);
                } else if (node.name === 'method') {
                    parent[node.value] = function () {};

                    parent[node.value].param = {};

                    traverseArray(node.params, parent[node.value].param);
                } else if (node.name === 'struct') {
                    structs[node.value] = {};

                    traverseArray(node.params, structs[node.value]);
                }
                break;
            case 'Identifier': 
                parent[node.value] = {};
                break;
            case 'VariableDeclaration':
                traverseArray(node.params, parent);
                break;
            case 'DataType':
                parent[Object.keys(parent).pop()] = node.value;
                break;
            default:
                throw new TypeError(node.type);
        }
    }

    traverseNode(ast, services);

    // merge
    const serviceKeys = Object.getOwnPropertyNames(services);
    serviceKeys.some(service => {
        const methodKeys = Object.getOwnPropertyNames(services[service]);
        methodKeys.some(method => {
            Object.keys(services[service][method].param).some(p => {
                if (structs[p] !== null) {
                    services[service][method].param[p] = structs[p];
                    // delete structs[p];
                }
            });
        });
    });

    return services;
}
