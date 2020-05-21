/**
 * @param {number[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 * 
 * leetcode in-place 修改版
 */
var gameOfLife = function(board) {
    // 计算指定位置的周围细胞数成活数量
    function calcCellNeighbor (x, y) {
        return [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1]
        ].reduce((count, [x, y]) => {
            if (!board[x] || !board[x][y] || board[x][y] === 3) return count
            return count + 1
        }, 0)
    }

    // 计算生存状态
    function next () {
        board.forEach((row, x) => row.forEach((cell, y) => {
            let liveCount = calcCellNeighbor(x, y)
            let status = board[x][y]
            if (status === 0 && liveCount === 3) { // 复活
                board[x][y] = 1 + 2
                return
            }
            if (status === 1) {
                if (liveCount < 2 || liveCount > 3) { // 死亡
                    board[x][y] = 0 + 2
                    return
                }
            }
            board[x][y] = status
        }))

        board.forEach((row, x) => row.forEach((cell, y) => {
            board[x][y] &= 1
        }))

        // return board
    }

    next()
    // return next()
}

let source = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]

gameOfLife(source)

console.log(source)