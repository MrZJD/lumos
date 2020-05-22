## 本文内容

* 开发环境搭建
* HelloWorld
* Phaser各功能简介

## 开发环境搭建

### based without js tools(不依赖工具链)的开发环境

``` html
<!-- 引入phaser版本包即可 -->
<script src="https://cdn.bootcss.com/phaser/2.6.2/phaser.min.js"></script>
<script>
// 这里编写游戏代码
</script>
```

### Using webpack + ES6/TypeScript

#### 1. 安装依赖

package.json

``` json
{
    "scripts": {
        "addtype": "cp ./node_modules/phaser/typescript/* ./typings",
        "build": "webpack",
        "dev": "webpack-dev-server --inline"
    },
    "dependencies": {
        "phaser": "^2.6.2"
    },
    "devDependencies": {
        "babel-core": "^6.26.0",
        "babel-loader": "^7.1.2",
        "babel-preset-env": "^1.6.1",
        "html-webpack-plugin": "^2.30.1",
        "webpack": "^3.10.0",
        "webpack-dev-server": "^2.10.1",
        "ts-loader": "^3.2.0", // for ts
        "typescript": "^2.6.2" // for ts
    }
}
```

#### 2. webpack.config.js / .babelrc

``` javascript
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry : {
        main : './src/index.ts'
    },
    output : {
        path : path.resolve(__dirname, './build'),
        filename : 'js/[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module : {
        loaders : [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello Phaser',
            template: './index.html',
            filename: 'index.html',
            chunks: ['main']
        })
    ]
};
```

#### 3. 添加代码提示

> 仅针对v2.x版本, 即将发布v3版本已全面支持es6和npm包

``` shell
# mkdir typings
# touch jsconfig.json

# npm run addtype
# cp ./node_modules/phaser/typescript/* ./typings
```


## Hello Phaser

> 后续内容均采用es6/ts语法进行编写，vanilla js同理。

``` TypeScript
>>>> index.ts <<<<
import WelcomeScene from './scene/welcome.scene';

/**
 * @class HelloGame
 */
class HelloGame {
    game: Phaser.Game;

    constructor (w, h) {
        this.game = new Phaser.Game(w, h, Phaser.AUTO, 'game');

        this.game.state.add('welcome', new WelcomeScene());
        
        this.game.state.start('welcome');
    }
}

new HelloGame(500, 600);

>>>> welcome.scene.ts <<<<
/**
 * @class WelcomeScene
 */
export default class WelcomeScene extends Phaser.State {

    constructor () {
        super();
    }

    preload () {
        this.load.image('text_start', '../assets/开始游戏.png');
    }

    create () {
        this.add.image(0, 0, 'text_start');
    }

}
```

> 当控制台中打印出Phaser版本号等信息，且没有报错时，说明代码运行成功。

## Phaser 游戏开发简单介绍

HTML5提供了canvas画布接口，其绘图方式有两种：2D(即Canvas), 3D(即WebGL).
通过画布我们可以绘制基础的图形，文字，以及图片等，通过绘图我们来进行游戏开发。当我们在编写动画时了解过帧这一个概念，同理的游戏就是许多帧的画面组成，而每一帧我们都可以来进行检测用户的操作，图形的物理运动等行为。

*如下，游戏及动画的开发逻辑(类比理解)*

```
var game;

setInterval(() => {
    //-> 画图
    
    //-> 用户逻辑
    
    //-> 碰撞检测等等
}, 1000/60); //-> 60fps
```

*Phaser 针对游戏开发为我们丰富了其生命周期*

```
var gamescene;

gamescene = {
    preload : () => {
        // -> 预加载资源;
    },
    create : () => {
        // -> 创建游戏界面;
        // -> 即加载游戏中出现的元素(Sprite, Image等等)
        // -> 初始化用户输入等;
    },
    update : () => {
        // -> 元素的物理运动;
        // -> 对用户输入的处理;
        // -> 等等;
    }
}

phaser: game -> start -> preload() -> create() -> update(); //-> 不断地调用update进行绘图;
```

**通过对比我们可以看到，Phaser为我们封装好的一个游戏的基本逻辑，我们只需要分门别类地在每一步处理对应的业务即可。**

编程的基础是数据结构和算法，后续文章我们将从游戏变成中特殊的数据结构(Sprite, TitleMap, Scene, Camera等)着手，逐步了解Phaser游戏的制作。

### 后续介绍

* Phaser中的'数据结构'
* Phaser的绘图及界面构建
* Phaser.State场景
* Phaser物理引擎
* Phaser处理用户输入
* Phaser的游戏配置


## 参考

[Phaser Doc](https://phaser.io/docs)
[Phaser 中文网](http://www.phaserengine.com/)
[Phaser 中文社区](http://club.phaser-china.com/)
[Phaser 小站](https://www.phaser-china.com/show.html)
[SF-从零到一：用Phaser.js写意地开发小游戏（Chapter 2 - 搭建游戏的骨架）](https://segmentfault.com/a/1190000009226335)




