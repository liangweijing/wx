<<<<<<< HEAD
# my-project

> A Mpvue project

## 项目从无到有

``` bash

# 1. 先检查下 Node.js 是否安装成功
$ node -v
v8.9.0

$ npm -v
5.6.0

# 2. 由于众所周知的原因，可以考虑切换源为 taobao 源
$ npm set registry https://registry.npm.taobao.org/

# 3. 全局安装 vue-cli
# 一般是要 sudo 权限的
$ npm install --global vue-cli@2.9

# 4. 创建一个基于 mpvue-quickstart 模板的新项目
# 新手一路回车选择默认就可以了
$ vue init mpvue/mpvue-quickstart my-project

# 5. 安装依赖，走你
$ cd my-project
$ npm install
$ npm run dev

#在vue-cli生成的mpvue项目最外层有三个最主要的文件：main.js整个mpvue程序入口，main.json配置小程序，App.vue整个项目页面入口和最顶层的组件。然后在src文件夹下的Page文件夹下创建需要的页面文件夹并在其中创建两个文件，一个是.vue文件作为页面模板，一个是.js文件作为页面组件配置。运行npm run dev命令mpvue就会将他们解析为跟小程序对应的wxml，wxss，js，json文件放到dist文件夹下。用微信开发者工具打开项目根目录就可以看到小程序端界面。

#在utils文件夹下的net.js文件对微信小程序wx.request接口进行了封装，重写了get和post方法。设置了基地址为localhost：127.0.0.1:8090。真机调试时需要修改基地址的ip为正在使用的IP地址。注意，在这里遇到一个问题，真机调试必须手机和电脑在同一个局域网下但是测试机不能是提供网络环境的主机。
在main.js文件中将这两个方法挂载到了vue原型上。在其他文件需要向后端发送请求时直接调用this.$net.get()或者this.$net.post()就可以了。本地运行在8090端口的后端项目就可以收到请求了。在controller中对视图进行匹配处理，进一步根据对应的Mapper发送sql语句，返回相应数据。
同时在utils文件夹下的flyconfig.js尝试引入了fly发送请求，将其挂载在vue实例对象上可以用this.$fly。但是它不如小程序原生的请求封装了loading，并且在并发请求返回数据的绑定时出现问题，拿到了返回数据却无法绑定到页面。

#后端封装了相应实体类RespEntity来规范响应数据格式,响应数据必须带有code字段，1代表响应成功，0代表响应失败。msg字段，响应信息。data字段，响应数据。由于每一次响应都要创建一个RespEntity响应实体类对象非常麻烦，所以封装了一个响应工具类RespUtil调用它来简单设置响应实体类中的成员信息。

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
=======
# wx
graduation design
>>>>>>> 6715259feb710651243c016c40ef3622fdd6203d
