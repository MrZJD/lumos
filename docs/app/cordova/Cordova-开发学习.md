## 让我们开始接触第一个Hybrid App开发!

### 项目配置 config.xml

<p style="display:block;">- config.xml</p>

```
<?xml version='1.0' encoding='utf-8'?>
<!-- widget 指定的应用程序反向域值 -->
<widget id="io.cordova.hellocordova" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <!-- AppName -->
    <name>HelloCordova</name>
    <description>
        A sample Apache Cordova application that responds to the deviceready event.
    </description>
    <author email="dev@cordova.apache.org" href="http://cordova.io">
        Apache Cordova Team
    </author>
	<!-- App程序起始页 -->
    <content src="index.html" />
	<!-- 用于控制对外部域的访问 -->
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
	<!-- 构建应用程序的平台 -->
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
    </platform>
    <engine name="android" spec="^6.2.3" />
	<!-- Cordova插件 -->
    <plugin name="cordova-plugin-whitelist" spec="^1.3.2" />
</widget>
```

<p style="display:block;">自定义图标</p>

```
<icon src="res/icon.png" /> # 配置所有平台的唯一默认图标

<platform name="android">
    # 单独配置不同平台的不同分辨率屏幕
	<!--
		ldpi    : 36x36 px
		mdpi    : 48x48 px
		hdpi    : 72x72 px
		xhdpi   : 96x96 px
		xxhdpi  : 144x144 px
		xxxhdpi : 192x192 px
	-->
	<icon src="res/android/ldpi.png" density="ldpi" />
	<icon src="res/android/mdpi.png" density="mdpi" />
	<icon src="res/android/hdpi.png" density="hdpi" />
	<icon src="res/android/xhdpi.png" density="xhdpi" />
	<icon src="res/android/xxhdpi.png" density="xxhdpi" />
	<icon src="res/android/xxxhdpi.png" density="xxxhdpi" />
</platform>
```

> 不同平台属性值不同 - 具体参考[Cordova手册](http://cordova.axuer.com/docs/zh-cn/latest/config_ref/images.html)


### 应用的本地数据处理

* localStorage
* [Cordova File Plugin](https://github.com/apache/cordova-plugin-file/blob/master/README.md)
* [Cordova SQLite Plugin](https://github.com/litehelpers/Cordova-sqlite-storage)

### 设备基础事件

* deviceReady - 一旦Cordova完全加载，事件就会触发。这有助于确保在加载所有内容之前没有调用Cordova函数。
* pause - 当应用程序进入后台时触发事件。
* resume - 当应用程序从后台返回。
* backbutton - 当按下返回按钮。
* menubutton - 当按下菜单按钮。
* searchbutton - 当按下Android搜索按钮。
* startcallbutton/endcallbutton - 按下启动呼叫按钮/结束通话按钮时。
* volumedownbutton/volumeupbutton - 按下音量调低/提高按钮时。

> 我们应该始终在 js 中添加事件监听器，而不是内联事件调用，因为Cordova 内容安全策略不允许内置Javascript，使用事件的正确方法是使用 addEventListener

> 禁用一些默认操作 <code>e.preventDefault()</code>


### Plugman/CordovaCli

> Cordova plugman是用于安装和管理插件的有用的命令行工具.
> 如果您希望您的应用在一个特定平台上运行，则应使用 plugman 。如果您要创建跨平台应用，则应使用 cordova-cli ，这将修改不同平台的插件。

```
npm install -g plugman

plugman install --platform android --project platforms\android --plugin cordova-plugin-camera # 安装cordova插件
```

```
cordova plugin add cordova-plugin-battery-status # Cordova-Cli安装插件

cordova plugin list # 查看已安装插件
```

### Plugins

<p style="display:block;">设备</p>

```
// cordova-plugin-device

function cordovaDevice() {
	alert("Cordova version: " + device.cordova + "\n" +
	  "Device model: " + device.model + "\n" +
      "Device platform: " + device.platform + "\n" +
      "Device UUID: " + device.uuid + "\n" +
      "Device version: " + device.version);
}
```

<p style="display:block;">电池</p>

```
// cordova-plugin-battery-status

window.addEventListener("batterystatus",(info) => {
   alert("BATTERY STATUS:  Level: " + info.level + " isPlugged: " + info.isPlugged);
}, false);

// 其他事件: batterylow/batterycritical
```

<p style="display:block;">相机</p>

```
// cordova-plugin-camera

btn.addEventListener("click", function(){
	navigator.camera.getPicture(onSuccess, onFail, { 
		quality: 50,
		destinationType: Camera.DestinationType.DATA_URL, //-> FILE_URI/NATIVE_URI 文件URI
		// sourceType: Camera.PictureSourceType.PHOTOLIBRARY //-> 加入此属性,从相册中获取图片
		// -> 还有其他属性 mediaType/cameraDirection 等
	});

	function onSuccess(imageData) {
		var image = document.getElementById('myImage');
		image.src = "data:image/jpeg;base64," + imageData;
	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}
});
```


<p style="display:block;">联系人</p>

```
// cordova-plugin-contacts
```

<p style="display:block;">In App Browser</p>

```
// cordova-plugin-inappbrowser //-> 在Cordova应用程序中打开Web浏览器

function openBrowser() {
   var url = 'https://cordova.apache.org';
   var target = '_blank';
   var options = "location=yes"
   var ref = cordova.InAppBrowser.open(url, target, options);

   ref.addEventListener('loadstart', loadstartCallback);
   ref.addEventListener('loadstop', loadstopCallback);
   ref.addEventListener('loadloaderror', loaderrorCallback);
   ref.addEventListener('exit', exitCallback);

   function loadstartCallback(event) {
      console.log('Loading started: '  + event.url)
   }

   function loadstopCallback(event) {
      console.log('Loading finished: ' + event.url)
   }

   function loaderrorCallback(error) {
      console.log('Loading error: ' + error.message)
   }

   function exitCallback() {
      console.log('Browser is closed...')
   }
}
```

<p style="display:block;">Media</p>

```
// cordova-plugin-media

var myMedia = null;

function playAudio() {
   var src = "/android_asset/www/audio/piano.mp3";

   if(myMedia === null) {
      myMedia = new Media(src, onSuccess, onError);

      function onSuccess() {
         console.log("playAudio Success");
      }

      function onError(error) {
         console.log("playAudio Error: " + error.code);
      }

   }

   myMedia.play();
}

// getCurrentPosition/getDuration/seekTo/setVolume/release/startRecord/stopRecord/pause/stop/
```

<p style="display:block;">网络信息</p>

```
// cordova-plugin-network-information

document.addEventListener("offline", onOffline, false);
document.addEventListener("online", onOnline, false);
```


<p style="display:block;">启动屏</p>

```
// cordova-plugin-splashscreen

// - config.xml
<preference name = "SplashScreen" value = "screen" />
<preference name = "SplashScreenDelay" value = "3000" />

<!-- 针对不同设备 不同平台 -->
<platform name="android">
    <!-- you can use any density that exists in the Android project -->
    <splash src="res/screen/android/splash-land-hdpi.png" density="land-hdpi"/>
    <splash src="res/screen/android/splash-land-ldpi.png" density="land-ldpi"/>
    <splash src="res/screen/android/splash-land-mdpi.png" density="land-mdpi"/>
    <splash src="res/screen/android/splash-land-xhdpi.png" density="land-xhdpi"/>

    <splash src="res/screen/android/splash-port-hdpi.png" density="port-hdpi"/>
    <splash src="res/screen/android/splash-port-ldpi.png" density="port-ldpi"/>
    <splash src="res/screen/android/splash-port-mdpi.png" density="port-mdpi"/>
    <splash src="res/screen/android/splash-port-xhdpi.png" density="port-xhdpi"/>
</platform>


<platform name="browser">
    <preference name="SplashScreen" value="/images/browser/splashscreen.jpg" /> <!-- defaults to "/img/logo.png" -->
    <preference name="SplashScreenDelay" value="3000" /> <!-- defaults to "3000" -->
    <preference name="SplashScreenBackgroundColor" value="green" /> <!-- defaults to "#464646" -->
    <preference name="ShowSplashScreen" value="false" /> <!-- defaults to "true" -->
    <preference name="SplashScreenWidth" value="600" /> <!-- defaults to "170" -->
    <preference name="SplashScreenHeight" value="300" /> <!-- defaults to "200" -->
</platform>

```

<p style="display:block;">StatusBar</p>

```
// cordova-plugin-statusbar

if (cordova.platformId == 'android') {
    StatusBar.backgroundColorByHexString("#333");
}
```

<p style="display:block;">其他</p>

```
// cordova-plugin-device-motion //-> 加速计
// cordova-plugin-device-orientation //-> 设备方向compass
// cordova-plugin-dialogs //-> 设备对话框navigator.notification
// cordova-plugin-file //-> fs
// cordova-plugin-file-transfer //-> 上传下载文件
// cordova-plugin-geolocation //-> GEO
// cordova-plugin-media-capture //媒体捕获，当拍照录音录像完成后获取数据
// cordova-plugin-vibration //震动

```



















