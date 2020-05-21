var mapGame = function (container, data) {
    this.container = document.querySelector(container);
    this.map = data;
    this.mapRowlen = data.length;
    this.mapCollen = data[0] && data[0].length;

    this.moves = []; //存正在行走的路径数据
    this.route = []; //存成功的路径数据

    this.stepNum = 0;
    this.startIndex;
    this.endIndex;
    this.currIndex;

    this.init();

    this.mapdoms = this.getDom();

    this.start();
}

mapGame.prototype.init = function () {
    var res = '';
    var temp;
    for (let row=0, rowlen=this.mapRowlen; row < rowlen; row++) {
        res += '<div class="row">';
        for (let col=0, collen = this.mapCollen; col<collen; col++) {
            temp = this.map[row][col];
            if (temp === 1) {
                this.startIndex = {row: row, col: col};
                res += '<div class="col start"></div>';
                continue;
            }

            if (temp === 2) {
                this.endIndex = {row: row, col: col};
                res += '<div class="col end"></div>';
                continue;
            }

            if (temp === -1) {
                res += '<div class="col block"></div>';
                continue;
            }

            res += '<div class="col"></div>';
        }
        res += '</div>';
    }
    this.container.innerHTML = res;
}

mapGame.prototype.getDom = function () {
    return document.querySelectorAll('.col');
}

/**
 * 根据坐标计算元素在数组中的下标
 */
mapGame.prototype.calcI = function (x, y) {
    return y * this.mapCollen + x;
}

/**
 * step
 */
mapGame.prototype.step = function (currIndex) {
    var stepRes = {};
    var x, y;
    y = currIndex.row-1;
    x = currIndex.col;
    if ( y >= 0 && this.map[y][x] >=0 ) {
        // 向上走
        stepRes.top = {row: y, col: x};
    }

    y = currIndex.row + 1;
    if (y < this.mapRowlen && this.map[y][x] >=0) {
        // 向下走
        stepRes.down = {row: y, col: x};
    }

    y = currIndex.row;
    x = currIndex.col - 1;
    if (x >= 0 && this.map[y][x] >=0) {
        // 向左走
        stepRes.left = {row: y, col: x};
    }

    x = currIndex.col + 1;
    if (x < this.mapCollen && this.map[y][x] >=0) {
        // 向右走
        stepRes.right = {row: y, col: x};
    }
    return stepRes;
}

/**
 * 获取下一步需要走的节点数据
 */
mapGame.prototype.nextMoveData = function () {
    var nextData = [];
    this.moves.map((move, parentI) => {
        if (move) {
            nextData.push({
                index: move.slice(-1)[0],
                parentI: parentI
            });
        } 
    });
    if (nextData.length === 0) {
        return false;
    } else {
        return nextData;
    }
}

/**
 * isSuccess
 */
mapGame.prototype.isSuccess = function (point) {
    if (this.map[point.row][point.col] === 2) {
        console.log("success!");
        return true;
    } else {
        return false;
    }
}

/**
 * drawIt
 */
mapGame.prototype.drawIt = function (point, step) {
    var domIndex = this.calcI(point.col, point.row);
    this.mapdoms[domIndex].innerText = step;
}

/**
 * 检测这一步是否走过了
 */
mapGame.prototype.isStepped = function (route, point) {
    var val;
    for (var i=0, len=route.length; i<len; i++) {
        val = route[i];
        if (val.row === point.row && val.col === point.col) {
            return true;
        }
    }
    return false;
}

/**
 * makestep
 */
mapGame.prototype.makeStep = function (currPoint) {
    var nextStep = this.step(currPoint.index);
    
    var currRoute = this.moves.splice(currPoint.parentI, 1, null)[0];
    var nextRoute = [];
    for (var dir in nextStep) { 
        if ( this.isSuccess(nextStep[dir]) ) {
            this.route.push(currRoute.concat([nextStep[dir]]));
        } else if ( this.isStepped(currRoute, nextStep[dir]) ) {
        } else {
            nextRoute.push(currRoute.concat([nextStep[dir]]));
            this.drawIt(nextStep[dir], this.stepNum);
        }
    }

    this.moves = this.moves.concat(nextRoute);
}

/**
 * print route
 */
mapGame.prototype.print = function () {
    var routeTxt = '';
    this.route.forEach(router => {
        routeTxt += router.map(point => {
            return `(${point.col}, ${point.row})`;
        }).join(' -> ') + '\n';
    });
    alert(`共有${this.route.length}条路线，分别为: \n${routeTxt}`);
}


/**
 * main
 */
mapGame.prototype.start = function () {
    this.moves.push([this.startIndex]);
    var nextData = this.nextMoveData();
    while (nextData) {
        this.stepNum++;
        nextData.forEach(this.makeStep.bind(this));
        nextData = this.nextMoveData();
    }
    // this.print();
}

/**
 * stepBystep
 */
mapGame.prototype.move = function () {
    var nextData = this.nextMoveData();

    if (!nextData) {
        alert("已经无路可走了！");
    } else {
        this.stepNum++;
        nextData.forEach(this.makeStep.bind(this));
    }
}

const map = [
    [0, 1, 0],
    [0, -1, 0],
    [2, 0, 0]
];

const map2 = [
    [0, 1, 0, -1],
    [0, 0, -1, 0],
    [0, 0, 0, 0],
    [0, -1, 2, -1]
];

var mapgame = new mapGame('#gamebox', map2);

document.querySelector(".button").onclick = () => {
    mapgame.print();
}