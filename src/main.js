import Vue from 'vue'
import App from './App'
import '../static/weui/weui.css'
import { $Toast } from '../static/iview/dist/base/index';
import { $wuxToptips } from '../static/wux/dist/index'
import net from '@/utils/net'; //导入封装好的net
// const Fly = require('flyio/dist/npm/wx')
import fly from '@/utils/flyconfig'
// const fly = new Fly()

Vue.prototype.$fly = fly //将fly实例挂在vue原型上
Vue.prototype.$net = net; //微信小程序网络请求的配置
Vue.config.productionTip = false
App.mpType = 'app'


//iview全局提示toast方法
Vue.prototype.handleWarning = function(tip) {
    $Toast({
        content: tip,
        type: 'warning',
        duration: 3
    });
}

//wux全局顶部提示toptip方法
Vue.prototype.showError = function(tip) {
    $wuxToptips().error({
        hidden: false,
        text: tip,
        duration: 3000,
        success() {},
    })
}


const app = new Vue(App)
app.$mount()

//全局变量
Vue.prototype.globalData = getApp().globalData;