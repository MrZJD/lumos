# Git

## 原则

* 保证主干分支的清晰

## 1. Git常用命令 及 基础

```bash
git init . # 初始化目录为git库
git remote add origin <remote-url> # 添加远程仓库

git config [--local|--global|--system] -l # 配置查看
git config --global user.name "" # 设置git使用者用户名 (--global去除则是本地库的设置)
git config --global user.email "" # 设置git使用者email

git clone <url>

git fetch
git pull --rebase # 尽量使用 [fetch + rebase] 保证主干的清晰合理
git add <files> # 将文件添加到暂存区
git commit -m "" # 将暂存区的内容提交到分支 -am对已追踪的文件使用add后提交 --amend修改上一次commit信息
git status # 查看工作区状态
git diff # 工作区与暂存区的比较
git stash
git stash pop
git push

git show <commit_id> # 查看某个commit的修改情况
git log --oneline # 查看当前分支上的commit提交情况
git reflog # 所有分支的所有操作记录(包括删除的，不在分支上的commit，reset操作等)
git tag -a "" # 打标签

git merge <branch> # 合并分支
git rebase <branch> # 重整分支

git reset HEAD~1 # 回退分支的commit记录
git revert # 通过一个commit来回退分支
git cherry-pick <commitid_1, ...> # 拷贝commit | cid_s..cid_e | cid_s^..cid_e

git restore <--staged> <files> # 取消文件修改, 从暂存区中取出文件
```

### 关于`fast-forward`

> fast-forward: 当前分支合并到另一个分支时，如果没有分歧解决，就会直接移动文件指针。

```bash
# branch-a: A -> B -> C
# branch-b: A -> B -> C -> D -> E
git checkout branch-a
git merge branch-b # 此时会直接移动branch-a的head指针至E，不会产生新的节点

git merge --no-ff branch-b # 会产生一个新的节点
```

![分支master合并merge_no_ff 之前](https://wx2.sbimg.cn/2020/05/22/merge_ff_before.png)
![分支master合并merge_no_ff使用fast-foward](https://wx1.sbimg.cn/2020/05/22/merge_ff_after.png)
![分支master合并merge_no_ff使用--no-ff](https://wx2.sbimg.cn/2020/05/22/merge_ff_noff_after.png)

## 2. 常用场景及处理方案

### 无用的commit太多需要整合 ( push到远程分支前 | 本地合并到目标分支前 )

```bash
git rebase -i HEAD~3 # 合并前三次commit

# 进入vi选择每次commit执行的命令
# · p/pick 保留commit
# · s/squash 合并至前一个commit
```

![rebase_squash_before.png](https://wx1.sbimg.cn/2020/05/22/rebase_squash_before.png)
![rebase_squash_after.png](https://wx2.sbimg.cn/2020/05/22/rebase_squash_after.png)

```bash
#### ---- 方法二 ---- ####
git reset -i HEAD~3 # 取消前三次commit

git add .
git commit -am ""
```

### 回退 [删除|reset]等 操作

```bash
git reflog # 找到对应commit
git reset --hard <commit_id> # 回退
```

### 同步分支

__*不要通过rebase对任何已经提交到公共仓库中的commit进行修改__

```bash
git merge master # 同步分支 (打patch，新建一个commit)
git diff --check # 检查是否还有未解决的冲突

git rebase master # 重整分支 (将分支的分叉口处指针移动至，master的顶部，合并) 
```

![rebase_before.png](https://wx2.sbimg.cn/2020/05/22/rebase_before.png)
![merge.png](https://wx1.sbimg.cn/2020/05/22/merge.png)
![rebase_after.png](https://wx2.sbimg.cn/2020/05/22/rebase_after.png)

### 拷贝某一段commits到指定分支

```bash
## -- cherry-pick -- ##
# 用于少量commit的拷贝 (有多少commit拷贝就会生成多少commit，commits不会合并)
git cherry-pick <commit_id> #

## -- rebase --onto -- ##
# 用于一大段区域的commit的拷贝
git rebase commit_id commit_id --onto branch
git reset <new_commit_id> # 改变head指针的指向拷贝后的头部
```

![cherry_pick_before.png](https://wx1.sbimg.cn/2020/05/22/cherry_pick_before.png)
![cherry_pick_after.png](https://wx1.sbimg.cn/2020/05/22/cherry_pick_after.png)

### 将工作区/暂存区的修改添加进上一次commit

```bash
git commit --amend -a -m # -a 表示加入工作区的文件 否则加入暂存区的修改
```

## 3. 常见问题

### Gitlab在网页端进行merge request时出现反向合并的问题

> 网页端合并分支时，如果出现冲突，会反向合并分支尝试解决分支。

场景：将feature合并进test时出现冲突，反向合并test代码至feature，导致feature包含了test上的代码。发布feature时携带了不该有的信息。

解决方案：
1. 回退该次合并
2. 本地合并，本地解决冲突

## 4. 规范问题

> 具体细则根据团队而异

1. 分支名使用 `kebab-case`
2. CommitMessage规范：
```
<header> #必选：<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
* header必须，body/footer可选
  * type = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
  * scope表示修改设计的范围
  * subject简单描述，通常由动宾结构组成，结尾不加句号
* body详细描述
* footer: 用于不兼容变动 | 关闭issue | revert

## 5. git flow 工作流

![git flow](https://nvie.com/img/git-model@2x.png)

将分支分为以下几类:

`Production`分支：

通常为`master`分支，用于发布生产环境的代码，无法直接修改，只能由其他分支合并。

`Develop`分支：

主开发分支，包含所有发布到下一个release的代码。主要合并其他分支。

`Feature`分支:

开发新功能，完成后合并进develop。

`Release`分支：

当需要发布内容时，基于develop创建，完成后，合并进master和develop。

`Hotfix`分支：

发现production存在问题时，基于master创建，完成后合并回master和develop。

__工作流如下：__

1. 接到需求，需求分析后：master -> develop-v1
2. 分配工作：develop-v1 衍生若干 feature分支
3. 开发工作：feature分支 完成后 自测后合并到develop
4. 发布测试：在develop上打测试包
5. 测试期间bug: feature上修改 自测后合并到develop
6. 测试通过后：develop新建release分支 进行预发布测试 (预发布配置修改)
7. 发布上线：合并master/develop后打tag，打发布包


__测试工作：__
1. feature自测
2. develop新建release包测试(个人觉得直接在develop上测试也是可以)
3. 当存在多个不相关需求并行开发测试时，可以新建多个develop分支，新建一个共同的测试分支(不应该在项目划分上出现)
4. 预发布release阶段，可能会涉及一些配置的修改commit，所以需要重新合并回develop

## 参考

* [阮一峰 · git cherry-pick](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)
* [git flow](https://github.com/nvie/gitflow)
* [git flow · A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
* [简书 · git commit 规范指南](https://www.jianshu.com/p/201bd81e7dc9?utm_source=oschina-app)
* [github · commit提交工具commitizen](https://github.com/commitizen/cz-cli)
