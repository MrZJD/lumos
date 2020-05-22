### 前言

<p style="display:block;">CycleJS本身是基于xstream-一个简化版的RxJS来处理数据流，业务逻辑等。两者的api接口其实还是有不少差别，为了更好的掌握RxJS，所以采用了对于CycleJS来说比较繁琐的RxJS。</p>
<p style="display:block;">对于数据流动，对于MVI中I - intent意图的理解，以及通过RxJS的弹珠图来理解不同但相似的operator。</p>

### [Env-Test-在线效果页面](/demo/cycle_rx_demo/sources/index.html)

### Demo1 - AutoCompleteInput

![效果图](http://ouzcfzhgs.bkt.clouddn.com/blog/20170902/211726325.png)

<p style="display:block;"> - AutoCompleteInput.js </p>

```
/**
 * 这是一个简单的自动填充搜索结果的input框
 * 
 * Stream Thinking: 
 * 1: Focus -> Input -> debounceTime 1s -> Ajax Search -> Render Result -> ShowList
 * 2: Blur/Fouces -> HideList/ShowList
 * 3: debounceTime 1s -> loading icon -> Ajax Search -> loaded icon
 * 4: Ajax Search -> Xhr Request -> Wait Response -> Response
 * 
 * 重点是弄清楚stream之间的依赖关系，combine和merge的区别
 * 
 * 需要用到的状态：
 * loading -> 是否正在获取后台数据
 * hidelist -> 是否显示list
 */

import Rx from 'rxjs';
import { html } from 'snabbdom-jsx';

import { xhr2promise } from '../lib/utilAjax';

function _intent_(srcDom) {
    return srcDom.select(".search-box .prompt").events("input")
        .map(ev => ev.target.value);
}

function _model_(action$, props) {

    //@1 -> input stream
    var click$ = action$.map((val) => {
        return (state) => {
            return Object.assign({}, state, {value: val})
        };
    });

    //@2 -> input 1s search stream
    var search$ = action$.debounceTime(1000);

    //@3 -> input null
    var searchNull$ = search$.map((query) => (state) => {
        if( !query ){
            return  Object.assign({}, state, {hidestate: 1});
        }
        return state;
    });

    //@4 -> input not null
    var searchNotNull$ = search$.filter(val => val ? true : false);

    //@5 -> loading state
    var loading$ = searchNotNull$.map((res) => (state) => Object.assign({}, state, {loading: true, result: {}}));

    //@6 -> fetch data stream -> loaded
    var fetchData$ = searchNotNull$
        .flatMap(query => Rx.Observable.from(xhr2promise({
            methods: "get",
            url: "https://api.github.com/search/repositories?q=" + query,
            params: ""
        })))
        .map(res => {
            res = JSON.parse(res);

            res.items = res.items.slice(0, 5).map((val, index) => {
                return {
                    name : val.name,
                    full_name : val.full_name,
                    html_url: val.html_url
                }
            });

            return res;
        })
        .map((res) => (state) => Object.assign({}, state, {result: res, loading:false, hidestate: -1}) );

    var state$ = Rx.Observable.merge(click$, loading$, fetchData$, searchNull$)
        .scan((state, change) => change(state), props)
        .startWith(props)
        .catch(err => console.log(err));
    
    return state$;
}

function _view_(srcDom, state$) {
    return state$.map( state => {
        var hidestate = state.hidestate;
        var resultHtml;

        if( !!state.result || state.result === null ){
            var resultList = [];
            if( state.result === null ){
                resultList.push(<a className="result" href={val.html_url}>
                    <div className="content">
                        <div className="title">无搜索结果</div>
                    </div>
                </a>);
            }
            
            if( state.result.items ){
                state.result.items.map((val) => {
                    resultList.push(<a className="result" href={val.html_url}>
                        <div className="content">
                            <div className="title">{val.full_name}</div>
                        </div>
                    </a>);
                });
            }

            resultHtml = <div className={(hidestate !== -1) ? "results" : "results transition visible"}>
                {resultList}
            </div>;
        }
        else{
            resultHtml = <div className="results">
                <a className="result">
                <div className="content">
                    <div className="title">null</div>
                </div>
                </a>
            </div>;
        }

        return <div className="search-box">
            <h3>{state.title}</h3>
            <p>{state.summary}</p>
            <div className="ui search">
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder={state.placeholder} value={state.value}/>
                    <i className={state.loading ? "spinner loading icon" : "search icon"}></i>
                </div>
                {resultHtml}
            </div>
        </div>;
    });
}

export function AutoCompleteInput(sources) {
    var props = sources.props;

    var action$ = _intent_(sources.DOM);
    var state$ = _model_(action$, props);
    var vdom$ = _view_(sources.DOM, state$);

    return {
        DOM: vdom$,
        value: state$
    };
}
```


### Demo2 - TodoList

![效果图](http://ouzcfzhgs.bkt.clouddn.com/blog/20170902/211740889.png)

<p style="display:block;"> - TodoList.js </p>

```
/**
 * 编写组件时先确立state数据结构, 渲染的dom结构
 * Intent中确立好所有的事件源数据源
 * Model中对状态进行组合持久化
 */

import Rx from "rxjs";
import { html } from "snabbdom-jsx";


function _intent_(sourceDom) {
    //@1 -> 添加
    var addItem$ = sourceDom.select(".mainedit .add").events("click")
        .map(ev => {
            var val = document.querySelector(".mainedit input").value;
            return val ? val : false;
        })
        .filter(val => {
            if( val ){
                return val;
            }else{
                alert("添加待办事项名称不能为空");
                return false;
            }
        })
        .filter(val => {
            return confirm("确认添加待办事项 - " + val);
        })
        .map(val => {
            document.querySelector(".mainedit input").value = '';
            return val;
        });

    
    //@2 -> 事件代理对象
    var delegateItem$ = Rx.Observable.from(sourceDom.select(".mainlist").events("click"))
        .map(ev => ev.srcElement);
    
    //@3 -> 双击输入框进入编辑状态
    var editItem$ = delegateItem$
        .filter(editEle => editEle.className.indexOf('content') > -1 ? true : false)
        .buffer(Rx.Observable.interval(500))
        .filter(val => val.length == 2 ? true : false)
        .map(editEle => {
            editEle[0].focus();
            return editEle[0].parentElement.getAttribute("data-id");
        });

    //@4 -> 删除
    var deleItem$ = delegateItem$
        .filter(deleEle => deleEle.className.indexOf('remove') > -1 ? true : false)
        .map(deleEle => deleEle.parentElement.getAttribute("data-id"))
        .filter(val => {
            return confirm("确认删除待办事项 - " + val);
        });
    
    //@5 -> edit enter确认修改
    var modifyItem$ = Rx.Observable.from(sourceDom.select(".mainlist").events("keypress"))
        .filter(ev => ev.srcElement.className.indexOf('content') > -1 ? true : false)
        .filter(ev => ev.keyCode == 13 ? true : false)
        .map(ev => ({
            id: ev.srcElement.parentElement.getAttribute("data-id"),
            title: ev.srcElement.innerText.trim()
        }));
    
    return {addItem$, editItem$, deleItem$, modifyItem$};
}

function _model_(action$, props) {
    var addState$ = action$.addItem$.map((val => (state) => {
        state.list.push({title: val, edit:false, id:"list"+Math.random().toString(16).substring(2)});
        return state;
    }));

    var editState$ = action$.editItem$.map((val) => (state) => {
        state.list = state.list.map((item, ind) => {
            if( item.id == val ){
                item.edit = true
            }
            return item;
        });
        return state;
    });

    var deleState$ = action$.deleItem$.map((val) => (state) => {
        state.list = state.list.filter((item, ind) => {
            return item.id == val ? false : true;
        });
        return state;
    })

    var modiState$ = action$.modifyItem$.map((val) => (state) => {
        state.list = state.list.map((item, ind) => {
            if( item.id == val.id ){
                item.title = val.title;
                item.edit = false;
            }
            return item;
        });
        return state;
    })

    return Rx.Observable.merge(addState$, editState$, deleState$, modiState$)
        .scan((state, change) => change(state), props)
        .startWith(props)
        .catch(console.log);
}

function _view_(state$) {
    return state$.map(state => {

        var listEle = [];
        state.list.map((val, ind) => {
            listEle.push(<div className="item ui icon input" attrs={{"data-id": val.id}}>
                <div className="content" attrs={{contenteditable: val.edit}}>{val.title}</div>
                <i className="circular remove link icon"></i>
            </div>);
        });

        return <div className="todolist-box">
            <h3>{state.title}</h3>
            <p>{state.summary}</p>
            <div className="ui icon input mainedit">
                <input type="text" placeholder="Add Something Todo:"/>
                <i className="circular add link icon"></i>
            </div>
            <div className="ui mainlist segment">
                {listEle}
            </div>
        </div>;
    });
}

export function TodoList(sources) {
    var props = sources.props;

    var action$ = _intent_(sources.DOM);

    var state$ = _model_(action$, props);

    var vdom$ = _view_(state$);

    return {
        DOM: vdom$,
        value: state$
    }
}
```


### More

* [RxJS - map VS flatMap](http://www.cnblogs.com/Answer1215/p/4789763.html)
* [Github - xstream](https://github.com/staltz/xstream)
* [ReactiveX - operators](http://reactivex.io/documentation/operators.html)
* [Github - Rx-DOM](https://github.com/Reactive-Extensions/RxJS-DOM)