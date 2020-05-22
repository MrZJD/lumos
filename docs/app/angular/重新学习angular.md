## 前沿

Angular是由Google主导的一套JS开发平台，他有完整的构建体系，以及采用TypeScript所带来的构建大型应用的流畅开发体验。

## 环境搭建

```
npm install -g @angular/cli

ng new project-name

cd project-name

ng serve --open

npm start
```

## 架构概览

<img src="https://angular.cn/generated/images/guide/architecture/overview2.png" alt="架构" style="max-width:80%">

1. 使用Angular扩展语法编写HTML模块
2. 使用组件类管理这些模板
3. 使用Services添加服务
4. 利用模块系统打包发布组件与服务

## 模块系统

> 每个应用至少有一个根模块 AppModule

```
//-- app.module.ts

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	exports: [],
	imports: [
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
```

```
//-- 引导文件

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from 'app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

## 模板与数据绑定

```
// - template

// 1. 元素, 指令, 组件 -> 绑定值
<img [src]="imgurl"/>
<div [ngClass]="{'special':isSpecial}"></div>
<child [prop]="parentProp"></child>

// 2. 绑定事件
<button (click)="onClick($event)"></button>
<div (myClick)="click=$event" clickable>绑定clickable指令的事件别名</div>
<child (eventType)="listener()"></child>

// 3. 多种用法
<button [attr.aria-label]="help">绑定到属性Attribute上</button>
<div [class.special]="isSpecial"></div>
<p [style.color]="isSpecial ? 'red' : 'green'"></p>

// 4. others
<img src="{{imgurl}}"/>
<p>{{specialHTML}} - 内容会转义输出</p>
<p [innerHTML]="specialHTML"></p>
```

### 指令系统

1. NgIf

> 区别NgIf与隐藏元素的区别：ngIf会销毁组件及状态(用于提升性能), 隐藏只是样式层面的显隐切换(用于提升交互); 此外ngIf可用于防范空指针错误

```
<div class="ngIfBox">
	<h2>ngIfBox</h2>
	<button (click)="toggleShow()">{{ngIfState ? 'hide' : 'show'}}</button>
	<p *ngIf="ngIfState">ng if show or hide</p>
	<p [style.display]="ngIfState ? 'block' : 'none'">class hidden show or hide</p>
</div>
```


2. NgFor

> 了解带索引循环，用trackBy提升渲染性能

```
//-- template
<div class="ngForBox">
	<ul class="mylist" (click)="delegateChild($event)">
		<li *ngFor="let val of myList; let i=index; trackBy: traceByIds">{{val.name}} -- {{val.id}}</li>
	</ul>
	<button (click)="additem()">add item</button>
	<button (click)="deleitem()">delete item</button>
</div>

//-- class
myList = [
	{id: 1, name: 'qwe'},
	{id: 2, name: 'asd'},
	{id: 3, name: 'zxc'}
];

additem = function () {
	this.myList.push({
		id: this.myList.length + 1,
		name: 'additem'
	});
};

deleitem = function () {
	this.myList.splice(this.myList.length - 1);
};

delegateChild = function (evt) {
	console.log(evt.target);
};

traceByIds = function (index: number, val): number {
	return val.id;
};
```

3. NgSwitch

```
<div class="ngSwitchBox" [ngSwitch]="myCase">
	<div class="case-a" *ngSwitchCase="'caseA'">Case-A</div>
	<div class="case-b" *ngSwitchCase="'caseB'">Case-B</div>
	<div class="case-c" *ngSwitchCase="'caseC'">Case-C</div>
	<div class="case-default" *ngSwitchDefault>Case-Default</div>
</div>
```

4. 模板引用变量

```
<div class="refValBox">
	 <input #refVal placeholder="tplVarity Number"/>
	 <button (click)="log(refVal.value)">click me!</button>
</div>
```

5. 模板表达式操作符

> 管道操作符(|), 安全导航操作符(?)

```
<div class="optsBox">
	<p>{{hero.name}}</p>
	<p>{{hero.child?.name}}</p>
	<p>{{hero.parent!.name}}</p>
</div>

// class
hero = {
	name : 'zjd123',
	age : 23,
	parent : {
		name : 'qwe123'
	},
	child : null
};
```

## 组件

1. 组件生命周期

> ngOnChanges -> ngOnInit -> ngDoCheck -> ngAfterContentChecked/ngAfterContentInit -> ngAfterViewInit/ngAfterViewChecked -> ngOnDestory

2. 组件之间的交互

```
// 1. 父组件传递数据到子组件
// parnet tpl
<child [info]="childInfo"></child>

// child tpl
<div><label>Name: </label>{{childInfo.name}}</div>

// child class
// a. 通过setter进行变化拦截
// b. 通过onChanges进行变化拦截
childInfo: Info;

@Input()
set info (info: Info) {
	this.childInfo = info;
	console.log('Setter for Info');
}

ngOnChanges (changes: {
	[propKey: string]: SimpleChange
}) {
	console.log(changes);
}
```

```
// 2. 父组件监听子组件的事件
// parent tpl
<child (evtType)="evtHandler($event)"></child>

// child class
@Output()
evtType = new EventEmitter<T>();

this.evtType.emit(T);
```

```
// 3. 通过模板引用变量互动
<countdown-timer #timer></counter-timer>
<button (click)="timer.start()">Start!</button>
<button (click)="timer.stop()">Stop!</button>
<div class="seconds">{{ timer.seconds }}</div>
```

```
// 4. 父组件调用@ViewChild

@ViewChild(ChildBoxComponent)
private childComponent = ChildBoxComponent;
```

```
// 5. 通过service通讯
```

## 动态加载组件

```
// template
<ng-template appAdHost></ng-template>

// class
@ViewChild(AdDirective)
adHost: AdDirective;

constructor (private componentFactoryResolver: ComponentFactoryResolver) {}

ngAfterViewInit () {
	this.loadComponent();
}

ngOnDestroy () {

}

loadComponent () {
	let compFactory = this.componentFactoryResolver.resolveComponentFactory(SampleComponent);

	let viewContainerRef = this.adHost.viewContainerRef;

	viewContainerRef.clear();

	let componentRef = viewContainerRef.createComponent(compFactory);

	(<AdComponent>componentRef.instance).data = this.data;
}
```

```
//-- SampleComponent为需要动态载入的组件
//-- AdDirective为指令类型

//-- module.ts中声明所有文件，entryComponents中声明动态载入的组件
```

## 指令系统

1. 自定义属性型指令

```
import { Directive, ElementRef, Input } from '@angular/core';

import { HostListener } from '@angular/core';

@Directive({
	selector: '[appHighlight]' // 指令名
})
export class  HightlightDirective {
	// 获取对应的元素
	constructor (el: ElementRef) {
		el.nativeElement.style.backgroundColor = 'yellow';
	}
	
	// 捕获元素上的事件
	@HostListener('mouseenter')
	onMouseEnter () {
		console.log('Mouse Enter!');
	}

	@HostListener('mouseleave')
	onMouseLeave () {
		console.log('Mouse Leave!');
	}
}

// 可以通过Input获取属性参数值
```

2. 自定义结构型指令

```
// 原理与动态加载组件相同。
// 这里重复练习一遍，深入理解运作原理。

import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

@Directive({
	selector: '[appList]'
})
export class ApplistDirective {
	constructor (
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef) {}

	@Input()
	set appList(list) {
		if (list) {
			console.log(list);
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}
}

```

3. 自定义管道

> 理解纯管道与非纯管道的区别：是否影响引用的内部变化从而引起检查。非纯管道代表：AsyncPipe;

> 每个绑定的管道都有自己的实例(区别于服务数据不共用)

```
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'expStrength'
})
export class ExpStrengthPipe implements PipeTransform {
	transform (target: number, param: number) {
		return target * param;
	}
}
```

## 动画

> *状态表示匹配任何动画状态
> void状态表示元素没有添加试图的时候

> void => &lowast; (别名 = :enter): 进场动画
> &lowast; => void (别名 = :leave): 离场动画

> 动画回调：<code>(@animationName.start)="start($event)" (@animationName.done)="done($event)"</code>

```
//-- app.module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//-- component
import { trigger, state, style, animate, transition } from '@angular/animations';

template: `
	<div [@heroState]="mystate">hello animations!</div>
`,
animations: [
	trigger('heroState', [
		state('inactive', style({backgroundColor: '#eee'})),
		state('active', style({backgroundColor: '#111'})),
		transition('inactive => active', animate('1000ms ease-in')),
		transition('active => inactive', animate('1000ms ease-out'))
	])
]

```

## DI依赖注入

```
import { Injectable } from '@angular/core';

@Injectable()
export class DependencyService {
	info = {
		type: 'testType',
		name: 'diService',
		count: 0
	};

	constructor () {}

	getInfo () {
		this.info.count++;
		return this.info;
	}
}

// inject
providers: [ DependencyService ]
constructor (private diService: DependencyService) {}
```

## HttpClient

> 可以通过结果来描述返回值类型

> 请求非json数据 <code>http.get('/textfile.txt', {responseType: 'text'})</code>

> 可以利用Rxjs 操作符进行复杂处理

> post api等详情见接口文档 [Angular Http](https://angular.cn/guide/http)

```
import { HttpClient } from '@angular/common/http';

constructor (private http: HttpClient) {}

ngOnInit () {
	this.http.get('https://api.github.com/search/repositories?q=angular')
		.subscribe(data => {
			this.res = data;
		}, err => {
			console.error(err);
		});
}
```

## 路由

```
//-- index.html
<base href="/">

//-- module
import { routerModule } from '././.';

//-- component template 路由出口
<router-outlet></router-outlet>

//-- template 导航
<a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>

//-- routerModule
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/heroes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];
RouterModule.forRoot(
	appRoutes,
	{ enableTracing: true } // <-- debugging purposes only
)

//-- components - ActivatedRoute对象 获取当前路由信息
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

constructor(
	private service: HeroService,
	private route: ActivatedRoute
) {}

ngOnInit() {
	this.heroes$ = this.route.paramMap
	  .switchMap((params: ParamMap) => {
		// (+) before `params.get()` turns the string into a number
		this.selectedId = +params.get('id');
		return this.service.getHeroes();
	  });
}
```

## 说明

* 本贴只包括angular4的基础知识内容，更多内容在实战接触后在总结
* [Angular中文网](https://angular.cn/guide/)
