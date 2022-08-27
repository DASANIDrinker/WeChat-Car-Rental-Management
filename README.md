# management

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目简介
租车应用后台管理系统

## 分支管理
master/main：主分支，线上项目打包使用
develop：开发分支， 本地开发使用， 每一次发布新的版本前，需要将develop分支代码合并到master上
develop-> merge -> master:
  1. 保存develop代码，并提交到github
  2. git checkout master // 切换到master分支
  3. git pull origin master // 从github拉取master分支最新代码,确保没有任何冲突
  4. git merge develop // 本地master合并develop代码，确保没有任何冲突，有冲突的话以comming code为准
  5. git push origin master // 合并完代码，提交到github master 分支

创建其他分支：
git branch 分支名
git checkout 分支名 // 切换到该分支
