### 前言

该帖子先介绍Cordova的开发环境配置，以及如何编译成Android Apk文件。后续作为一个系列，通过SPA来构建一个移动APP。

### 搭建环境

1. 1.安装JDK -> 并配置到环境变量中
2. 2.安装Android Studio -> 目的是安装AndroidSDK, 以及安卓开发的模拟器和编译apk所依赖的gradle -> 也需要配置到环境变量
3. 3.可能需要单独安装gradle -> 同理配置到环境变量
4. 4.安装Cordova -> `npm install -g cordova`


### 项目构建cli

```
cordova create [AppName] [com.domain.pakName] [titleName] # 创建项目

cordova platform add android # 添加开发平台

cordova build android # 编译安卓项目

cordova run android # 运行设备测试
```

说明

1. 测试cordova所需环境是否ok -> ```cordova requirements```
2. 可能存在编译版本依赖的问题, 具体参考官网说明, 视情况安装对应版本的AndroidSDK


### 附录

* [w3cschool-Cordova教程](https://www.w3cschool.cn/cordova/cordova_overview.html)
* [Cordova中文网](http://cordova.axuer.com)
* [Gradle](https://services.gradle.org/distributions/)
* [Android Studio](http://www.android-studio.org/)
* [Oracle Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
