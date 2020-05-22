### CycleJS Module

* @cycle/dom – a collection of drivers that work with DOM; it has a DOM driver and HTML driver, based on the snabdom virtual DOM library 
* @cycle/history – a driver for the History API 
* @cycle/http – a driver for HTTP requests, based on superagent 
* @cycle/isolate – a function for making scoped dataflow components
* @cycle/jsonp – a driver for making HTTP requests through JSONP
* @cycle/run – a run function for apps made with xstream 
* @cycle/most-run – a run function for apps made with most 
* @cycle/rxjs-run – a run function for apps made with rxjs

### Project CLI - 代码环境配置

#### 基本配置
```
npm install --save @cycle/dom @cycle/run xstream
npm install --save-dev babel-cli babel-register babel-preset-es2015 babelify browserify mkdirp
```

<p style="display:block;">package.json</p>

```
"scripts": {
    "prebrowserify": "mkdirp dist",
    "browserify": "browserify sources/main.js -t babelify --outfile dist/main.js",
    "start": "npm install && npm run browserify && echo 'OPEN index.html IN YOUR BROWSER'"
  }
```

<p style="display:block;">.babelrc</p>

```
{
    "presets": ["es2015"]
}
```

* babel-cli - babel 命令行工具
* babel-register - babel require js时转码
* babel-preset-es2015 - babel es6 转码标准
* babelify - babel browserify 工具
* mkdirp - node命令行创建文件夹

#### JSX
```
npm install --save babel-plugin-transform-react-jsx snabbdom-jsx
```

<p style="display:block;">.babelrc</p>

```
{
    "presets": ["es2015"],
    "plugins": [
        ["transform-react-jsx", { "pragma": "html" }]
    ]
}
```

```
// - main.js
import {html} from 'snabbdom-jsx';
```

### Code Frame - 代码结构逻辑

```
import xs from "xstream";
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import {html} from 'snabbdom-jsx';

function main(sources) {
    // -> Driver传入sources
    const sinks = {
        DOM: domStream$
    };

    // -> 输出sinks
    return sinks;
}

run(main, {
    DOM: makeDOMDriver('#app') // -> Driver
});
```

<p style="display:block;">Drivers : -> 获取sinks( 输出流 ) -> Writeable Stream -> 转换成sources
Main() : -> sources -> 获取原始流 -> operators -> sinks(输出流)</p>


### Code Construction - 代码框架 - MVI

> MVI 是一种简单的模式来将 main() 函数重构为三个部分：Intent（监听用户）、Model（处理信息）、和 View（返回输出）

* intent() 函数
 * 目的: 将 DOM 事件解释为用户的意图 actions
 * 输入: DOM source
 * 输出: Action 流
* model() 函数
 * 目的: 管理状态
 * 输入: Action 流
 * 输出: State 流
* view() 函数
 * 目的: 视觉地展示 Model 中的状态
 * 输入: State 流
 * 输出: 作为 DOM Driver sink 的虚拟 DOM 节点流

```
function main(sources) {
    // const action$ = intent(sources.DOM);

    // const state$ = model(action$);

    // const vdom$ = view(state$);

    // return {
    //     DOM: vdom$
    // };

    return { DOM: view(model(intent(sources.DOM))) };
}
```

### Components in CycleJS

```
// - 定义组件
function Components(sources) {
    const props$ = sources.props; // -> 获取组件属性值

    const action$ = intent(sources.DOM);
    const state$ = model(action$, props$); // -> 将属性值置入组件状态
    const vdom$ = view(state$);

    return {
        DOM: vdom$,
        value: state$.map(state => state.value) // -> 组件的当前值/流
    };
}
// - 使用组件
function main(sources) {
    const props$ = xs.of(componentsPropObj);

    const compSources = { DOM: sources.DOM, props: props$ };
    const comp = Components(compSources);

    const childDom$ = comp.DOM; // -> 子组件dom
    const childValue$ = comp.value; // -> 子组件value

    const vdom$ = xs.combine(childDom$, childValue$)
        .map(([childVDom, childVal]) => {
			return <html>
        });

    return {
        DOM: vdom$
    };
}
```

<p style="display:block;">组件的作用域 - 隔离组件</p>

```
// -> Method-A
compSources = { DOM: sources.DOM.select('.compNamespace'), props: props$ };

childDom$ = comp.DOM
	.map(vnode => {
		vnode.sel += '.compNamespace';
		return vnode;
    });

// -> Method-B
const {isolateSource, isolateSink} = sources.DOM;
compSources = { DOM: isolateSource(sources.DOM, 'weight'), props: props$ };
childDom$ = isolateSink(comp.DOM, 'weight');

// -> Method-C
import isolate from "@cycle/isolate";
const IsoComponents = isolate(Components, NameSpace);
const comp = IsoComponents(compSources);
```


### Drivers in CycleJS

> 上文介绍了Cycle中业务代码的重头戏 - main()函数的编写，接下来深入CycleJS - Driver底层驱动的编写

<p style="display:block;">比较复杂，日后拓展：domDriver / httpDriver</p>


### 造轮子

* 轮播图
* TODO LIST
