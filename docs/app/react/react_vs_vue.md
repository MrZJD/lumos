## React 与 Vue


个人Vue和React都使用过一段时间，并在实际项目中应用。最初是使用Vue开发，原因也比较简单，找工作需要。转向React，首先是个人比较喜欢all-in-js的统一写法，第二个react靠函数式理念使代码写起来更加灵活。

下面简单对比一下两者的差异，以及使用中各自不同的关注点。观点不建议作为任何技术选型的依据。

<br/>

### 1. React是先驱者，Vue站在巨人的肩膀上看的更远。


现代化前端框架有着统一的目标：抛弃传统jQuery式的开发，最小化dom修改以提高性能，将ui与状态分离从而构建大型前端富应用。

两者共同点：
* 都是UI渲染框架，帮助开发者构建响应式前端页面
* 都支持组件化
* 都有各自生态下的工具

React的关键词：_jsx_ _all-in-js_ _immutable_

Vue的关键词：_observer_ _directive_ _SFC_

<br/>

### 2. JSX 与 模板语法


通常Vue的开发将模板与js逻辑分开编写(尽管vue文件将template style script进行了组合)，在底层实现上 是将模板编译成虚拟DOM渲染函数。所以直接编写render渲染函数 或者 JSX 也是可以的。

这一点Vue(template/jsx)和React(jsx)都通过不同的方式将UI转变成了虚拟DOM渲染函数。

jsx => babel => render(h => h())

template => vue => render(h => h())

那么问题来了，**Vue多了一层模板编译，是否会影响效率性能？**

1. 首先明确问题，多了一层模板编译，模板编译这一块儿的工作是什么？由谁处理的？
 
    > 模板编译 指的是 template字符串 => render渲染函数 <br/>
    > [jsx => render] 是由babel在前端代码构建时完成转化 <br/>
    > [vue component template (单组件) => render] 由webpack(vue-loader)在前端代码构建时完成转化 <br/>
    > [vue html template / vue template属性 (模板字符串) => render] 由Vue.compile(template)生成

2. 结论：显而易见，使用Vue模板字符串，多了一个运行时的编译过程，会影响首次运行效率。

两者的优缺点：

* JSX更加灵活，all-in-js的写法见人见智。
* template可以自定义filter/directive等，基于模板语法复用逻辑。（JSX可以通过函数复用，这将在React的函数式思维中说明）

**参考**

- [关于template编译 - Vue生命周期](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)
- [Vue.compile](https://cn.vuejs.org/v2/api/#Vue-compile)

<br/>

### 3. 响应式UI & Virtual-DOM


响应式UI：view-model(vm) => view

> 三大框架(react, vue, angular)的响应式方式各有不同，这也是影响各框架性能的主要因素。<br/>
> Virtual-DOM 是为了减少不必要的DOM操作 以提高浏览器reflow/repaint性能

- `React => this.setState & vdom`
- `Vue => (es5)Object.defineProperty/(es6)Proxy & vdom`
- `Angular => 脏检查`

> 响应式更新UI都是异步的，根据环境差异通过Promise.then setImmediate setTimeout来实现。

```js
// vue
this.todo = [1,2,3] // todo会同步更新，但是ui更新是异步批量更新的
this.$nextTick(() => { /* ui 已更新 */ })

// react
this.setState({ // state.todo和ui更新为异步更新
    todo: [1, 2, 3]
}, () => { /* ui state已更新 */ })
```

<br/>

**Object.defineProperty的局限性**

* 无法检测到对象属性的新增和删除
* 部分数组操作无法检测 `vm.items[i] = newValue` `vm.items.length = newlen` —— `Vue数组的异变方法`

<br/>

**Immutable.js的优势**

> immutable.js的出现本义是解决react编程中的js引用赋值带来的可变共享状态问题。函数式编程要求状态不可变，每次都应该返回新的状态。

* immutable 利用结构共享 避免deepClone消耗性能
* react/vue 利用immutable虽然引用发生变化，但是会最大化利用现有结构 而不用重新渲染整个列表

```js
state = {
    todo: [1, 2, 3]
}

// vue
vm.todo[2]++ // (vue 数组内是基础类型时) data已变化 UI无法触发变化
vm.todo = vm.todo.map((i, ind) => ind === 2 ? i+1 : i)

// react 1
this.setState({
    'todo[2]': this.state.todo[2]+1 // ui可以变化
})
// react 2
let { todo } = this.state
todo[2]++
this.setState({ // todo数组引用没有发生变化，state变化，UI无法触发变化
    todo: todo
})
this.setState(state => {
    state.todos[2]++
    return state
})
this.setState({
    todo: todo.map((i, ind) => ind === 2 ? i+1 : i)
})
```

_利用immutable.js_

```js
state = {
    todo: Immutable.List([1, 2, 3])
}

// 修改immutable都是返回一个新引用

// vue
vm.todo = vm.todo.set(2, this.todo.get(2)++)

// react
let todos = this.state.todos
todos = todos.set(2, todos.get(2)+1)
this.setState({
    todos
})

this.setState(state => {
    return { ...state, todos: state.todos.set(2, state.todos.get(2)+1) }
})
```

**扩展问题**

- [不可思议的React Diff](https://zhuanlan.zhihu.com/p/20346379)
- [长列表优化](https://segmentfault.com/a/1190000017233625)

<br/>

### 4. 组件化 与 React的函数式思维


> 组件化，是现代前端框架的基本功能。目的是拆分功能区域，复用结构和逻辑，降低构建大型应用的复杂度难度。但是组件化也带来了新的问题，就是数据流动的问题。

> 函数式编程，即强调函数是first class。可以通过传递函数来实现，高阶函数，闭包。最大好处就是(纯)函数的结果只依赖输入的参数，即没有副作用。这样就有利用监控数据流动。（当然了，jsx中还依赖大量纯函数来生成ui）

<br/>

**组件间的通讯(基本情况)**

```jsx
// vue
<template>
    <ToDo>
        <ToDoItem :value="value" @toast="toastFn" />
    </ToDo>
</template>
// ToDo
{
    data: {
        value: "吃饭"
    },
    methods: {
        toastFn () { /* toast */ }
    }
}
// ToDoItem
{
    methods: {
        this.$emit('toast', '完成')
    }
}

// react
<ToDo>
    <ToDoItem value={this.state.value} toast={this.toastFn} />
</ToDo>
// ToDoItem
class ToDoItem {
    onClick () {
        this.props.toast()
    }
}
```

上面的例子可以看到，react没有多余的api，可以将函数通过props形式直接传递给子组件。

<br/>

**组件的嵌套**

```jsx
// vue通过slot插槽实现
<ToDo>
    <Button slot="confirm">确认</Button>
    <Button slot="cancel">取消</Button>
</ToDo>
// ToDo
<div class="todo">
    <slot name="confirm" />
    <slot name="cancel" />
</div>

// react - props (依然是函数式的方式)
<div class="todo">
    { this.props.children }
</div>
```

<br/>

**细说React组件：class component / pure component / functional component / HOC**

> 首先，React组件的形式可以是`class`或者`function`，本质都是通过某种形式的调用生成渲染结果。当为class形式时应继承自`React.Component`或者`React.PureComponent`。

**class component**，通常使用，有完整的组件生命周期。shouldComponentUpdate规则默认为state每次发生变化都会重新渲染。

**React.PureComponent**，纯组件，shouldComponentUpdate规则为将传入props与已有props已经浅对比(引用对比)，如果相同则不会重新渲染。

**Functional Component**，纯函数，输入为props 输出为渲染结果。没有生命周期。没有状态。

**HOC**，高阶组件，即接收一个组件为参数，返回一个组件的函数

**容器组件**，用来管理状态，不负责UI结构的渲染

**展示组件**，没有状态，只负责UI的渲染

_一个经典的例子_
```jsx
/* 工厂函数 */
const withState = (stateName, stateUpdateFn, initialState) => {
    /* 生成一个高阶组件 HOC */
    return Comp => {
        /* 高阶组件内部管理状态 - 容器组件 */
        const factory = createFactory(Comp)
        return createClass({
            getInitialState () { return { value: initialState } },
            stateUpdateFn (fn) { this.setState( ({ value }) => ({ value: fn(value) })) },
            render () {
                return factory({
                    ...this.props,
                    [stateName]: this.state.value,
                    [stateUpdateFn]: this.stateUpdateFn
                })
            }
        })
    }
}

const enhance = withState('counter', 'setCounter', 1)
const Counter = enhance(({ counter, setCounter }) => (
    /* 纯函数式组件用于渲染UI */
	<div>
    	Count: {counter},
        <button onClick={() => setCounter(n => n+1)}>Increment</button>
        <button onClick={() => setCounter(n => n-1)}>Decrement</button>
    </div>
))
```

了解完这几种类型之间的区别和联系，可以得到以下的组件编写规范：
1. 组件应优先使用PureComponent提高渲染效率。
2. 将容器组件和展示组件分离。
3. 重复的逻辑应该通过高阶函数的方式工厂化。
   
<br/>

**为什么React不需要 `filter` `computed`**

> filter 过滤器 => 通常依赖一个状态 常见于格式化文本 <br/>
> computed 计算值 => 可依赖多个状态，生成一个加工后的状态值 (computed的存在便于我们将基础状态原子化，含义分层更清晰)

React都可以通过函数的形式根据state生成。甚至于两者无需严格区分，state => fn => ui。这样函数式思维的表达更清晰统一。

<br/>

**keep-alive 动态组件**

React自带没有Vue中的动态组件keep-alive，可根据业务需要自行实现。github也有现成方案。

<br/>

### 5. 数据管理方案 Router SSR等

> 其他生态内容各有共通之处，并且可相互交叉使用。所以这里不讨论了，以后单独写一篇各种数据管理的方案。

<br/>

### 结语

总的来说，两者各有异同点。编写方式见仁见智。

<br/>

### 参考

* [vue.js](https://cn.vuejs.org/)
* [react.js](https://zh-hans.reactjs.org/)
