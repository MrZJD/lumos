## 本文介绍

本文将介绍游戏编程中常用的元素<数据结构>，如Sprite, Image，Text等。

_文末将附上Sample示例_

![tilemap](http://ouzcfzhgs.bkt.clouddn.com/blog/20180124/204303451.png)

## GameObject 之 Display Object

> GameObject: 所有的游戏Object都来自于这个类。其控制一个物件的状态与生命周期。

``` javascript
alive, exists, visible //-> 三种状态

gameobject.kill(); //-> 三种状态全部置空 (can be reused)
gameobject.destory(); //-> 释放该物件的内存 (cannot be reused)
```

### 1. Sprite

在官网中是这样介绍Sprite于游戏的重要性：Sprites are the lifeblood of your game.
我们可以这样定义：**精灵(Sprite) 是一个能通过改变自身的属性：角度，位置，缩放，颜色等，变成可控制动画的 2D 图像。**

> 在游戏中的动画，一般为帧动画(通过播放一系列的frame图片)，而不是通过代码来改变物件所形成。

功能：**绘制游戏的角色，物件；**

```
// 1.-> 加载Sprite
//   -> 加载一张包含多个状态的物体图片 
loader.spritesheet(key, url, frameWidth, frameHeight, frameMax?, margin?, spacing?); 

// 2.-> 添加Sprite
scene.add.sprite(x, y, key, frame?, group?)

// 3.-> 操作Sprite
sprite.play(); //-> 动画
sprite.body.velocity.x = 100; //-> 物体速度

// 4.-> sprite reuse
sprite.kill();
sprite.reset(w, y);
```

### 2. Image

与精灵的区别在于：**不需要物理控制和动画**，仍然可以控制宽高旋转缩放等属性

功能：**logo, background, button，不需要运动的其他图形**

```
// -> 加载
loader.image(key, url);
// -> 使用
add.image(x, y, key, frame?, group?);
// -> attr
img.width/height/scale/position
```

### 3. TileSprite

TileSprite是用于制作重复的纹理。可以滚动和缩放。

功能：**需要重复纹理的物件，如窗帘.地面等**

```
loader.image(key, url); //-> spritesheet 也可以

// 该物件将使用重复的纹理铺满width/height大的区域
add.tileSprite(x, y, width, height, key, frame?, group);

tileSprite.autoScroll(xDelta, yDelta); // stopScroll() per second;
```

### 4. Button

按钮是一种用于处理Pointer事件的Sprite。

其四种状态: *Over, Out, Down, Up*

```
add.button(x, y, key, cb, cbOrigin, overFrame, outFrame, downFrame, upFrame, group);

// onInputDown / onInputOut / onInputOver / onInputUp
```

### 5. SpriteBatch

用于渲染很多Sprite的容器。

功能：**粒子器等**

```
var batch = add.sprite(parent, name, addToStage);
```

### 6. Rope

表面有重复纹理的带状精灵。

功能: **骨骼动画**

```
add.rope(x, y, key, frame, points, group);
```

## GameObject 之 Graphics Object

> Graphics Object用于自定义创建图形游戏对象

### 1. Graphics

**可以自定义绘制的Sprite**，用于**绘制简单图形**，如线条，矩形，圆，多边形等;

```
var graphics = add.graphics(x, y, group);

graphics.beginFill(0xff0000);
graphics.drawCircle(50, 50, 100);
graphics.endFill();
```

### 2. BitmapData

**实际为新建了一个经过封装的Canvas Drawer**，它和游戏不属于同一个画布，可用于自定义绘制。

### 3. RenderTexture

**一种实时渲染的纹理，可以将其他复杂的display object渲染在其中**

## Graphics拓展 Geometry

常用几何图形 - 通常用于debug
```
// Circle
new Circle(x, y?, diameter?);
// Ellipse 
new Ellipse(x, y, width, height);
// Line
new Line(x1, y1, x2, y2);
// Point
new Point(x, y);
// Polygon
new Polygon(points);
// Rectangle
new Rectangle(x, y, width, height);
// RoundedRectangle
new RoundedRectangle(x, y, w, h, radius);
```

## GameObject 之 Text Object

### 1. Text

基础文字: 使用web字体，可以填充颜色等;

```
add.text(x, y, text, style?);
```

### 2. BitmapText

像素图字体

```
load.bitmapFont(key, textureURL, atlasURL, atlasData [, xSpacing] [, ySpacing]);

add.bitmapText(x, y, font, text, size, group);
```

### 3. RetroFont

像素图字体: 每一个字的大小格子相同

## GameObject 之 Animation

使用动画

```
// 通常使用sprite的属性animations: AnimationManager来创建并执行动画

sprite.animations.add(key, frames?, frameRate?, loop?, useNumericIndex?)

sprite.animations.play(key, frameRate?, loop?, killOnComplete?);
```

## 进阶: Tilemap

Tilemap是一种瓷片地图类型。它构建了一个格子型的游戏世界，每一个格子贴上不同的瓷片。

> 创建一个Tilemap需要**一张包含了所有格子种类的sprite图**，和**一份描述文件**。Phaser支持Phaser.Tilemap.TILED_JSON和CSV两种格式的描述文件。

```
loader.tilemap(key, url, data, format);

var map = add.titlemap(key, tileWidth, tileHeight, width, height);
// -> 添加Tileset图
map.addTilesetImage(tileset, key);
// -> create
var layer = map.createLayer(layerName);
layer.resizeWorld();
layer.wrap = true;
```

## 示例

> **以下示例均来自Phaser小站 [https://www.phaser-china.com](https://www.phaser-china.com)**

[Sprite](https://www.phaser-china.com/example-23.html)
[Graphics](https://www.phaser-china.com/example-12.html)
[Geometry](https://www.phaser-china.com/example-15.html)
[Tilemap](https://www.phaser-china.com/example-26.html)

## 参考链接

[Phaser v.CE Api](https://photonstorm.github.io/phaser-ce/)
[Phaser v.2 Api](https://phaser.io/docs)
[Phaser 小站](https://www.phaser-china.com)






