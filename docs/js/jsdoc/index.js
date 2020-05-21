// 1. 代码位置

// 1. a 头部
/**
 * @function func
 * @param {string} a
 * @return {string}
 */
function func (a) {
    return a
}

func('a')

// 1. b inline

function func2 (/** @type {number} */ a) {
    return a
}

func2()

// 2. 类型

// /** @type {number} */
// /** @type {string} */
// /** @type {boolean} */
// /** @type {RegExp} */
// /** @type {function} */
// /** @type {function(number, string): boolean} */
// /** @type {function({ arg1: number, arg2: string })} */
// /** @type {Promise<number>} */

// 3. 复杂类型

/**
 * @function
 * @param {Object} userInfo 用户信息
 * @param {string} userInfo.a 年龄
 * @param {number} userInfo.b 性别
 * @return {number}
 */
function func3 (userInfo) {
    return userInfo.b
}

func3()

/**
 * @typedef {Object} Test 测试类
 * @property {string} sex 性别
 * @property {number} age 年龄
 */

/** @type {Test} */
let t

console.log(t.sex)

// 4. function

/**
 * @function tF
 * @param {string} p1
 * @param {number} [p2=123] 默认参数
 * @param {boolean} [p3] 可选参数
 */
function tF (p1, p2 = 123, p3) {}

console.log(tF)

// 5. module

let my = require('./module')

console.log(my.sex)

/**
 * a
 * @function
 * @return {Promise}
 */
function a () {
    return new Promise(() => {})
}
