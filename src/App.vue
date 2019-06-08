<template>
<div>
    <!-- <button  open-type="getUserInfo" bindgetuserinfo="bindgetuserinfo">授权 </button> -->
    <!-- <button v-if="!hasUserInfo && canIUse" open-type="getUserInfo" bindgetuserinfo="bindgetuserinfo">授权 </button> -->

</div>
</template>

<script>
// 本页没有template
export default {
    onLaunch() {
        // console.log(666)
        // //调用API从本地缓存中获取数据
        // // var userInfo = wx.getStorageSync('userInfo') || []
        // var userInfo = wx.getStorageSync('userInfo')
        // var that = this;
        // if (!userInfo) { //无缓存，没授权过
        //     console.log(77)
        //     wx.showModal({
        //         title: '提示',
        //         content: '为了您更好的体验,请先同意授权',
        //         success(res) {
        //             if (res.confirm) {
        //                 console.log('用户点击确定');
        //                 that.canIUse = true;

        //                 // userInfo.unshift(Date.now())
        //                 // wx.setStorageSync('userInfo', userInfo)

        //             } else if (res.cancel) {
        //                 wx.showToast({
        //                     title: '抱歉，部分功您能将不能使用！',
        //                     icon: 'none',
        //                     duration: 2000
        //                 })
        //                 console.log('用户点击取消')
        //             }
        //         }
        //     });

        // } else {
        //     this.hasUserInfo = true;
        // }

    },
    created() {
        // 调用API从本地缓存中获取数据
        /*
         * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
         * 微信：mpvue === wx, mpvuePlatform === 'wx'
         * 头条：mpvue === tt, mpvuePlatform === 'tt'
         * 百度：mpvue === swan, mpvuePlatform === 'swan'
         * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
         */

        //   let logs
        //   if (mpvuePlatform === 'my') {
        //     logs = mpvue.getStorageSync({key: 'logs'}).data || []
        //     logs.unshift(Date.now())
        //     mpvue.setStorageSync({
        //       key: 'logs',
        //       data: logs
        //     })
        //   } else {
        //     logs = mpvue.getStorageSync('logs') || []
        //     logs.unshift(Date.now())
        //     mpvue.setStorageSync('logs', logs)
        //   }
        // },
        // log () {
        //   console.log(`log at:${Date.now()}`)

        console.log('小程序启动')
    },
    data() {
        return {
            canIUse: false,
            hasUserInfo: false,
        }
    },
    methods: {
        bindgetuserinfo(e) {
            var that = this;
            console.log(e.mp)
            if (e.mp.detail.userInfo) {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.login({
                    success: res => {
                        console.log(res.code, e.mp.detail.iv, e.mp.detail.encryptedData)
                        wx.request({
                            //后台接口地址
                            url: '',
                            data: {
                                code: res.code,
                                iv: e.mp.detail.iv,
                                encryptedData: e.mp.detail.encryptedData,
                            },
                            method: 'GET',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (res) {
                                console.log('请求成功')
                            },
                            fail: function () {
                                console.log('后端错误')
                            }
                        })
                    },
                    fail: function () {
                  console.log('获取登录code错误')
                }
                })
            } else {
                console.log( '执行到这里，说明拒绝了授权')
                wx.showToast({
                    title: "抱歉，部分功您能将不能使用！",
                    icon: 'none',
                    duration: 2000
                });
            }
        }

    },
}
</script>

<style>
/* @import url("./iconfont/iconfont.css"); */

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
}

button {
    background: none;
    padding: 0;
    font-weight: normal;
    font-size: 32rpx;
    box-sizing: content-box;
}

button::after {
    border: 0;
}

view,
text {
    font-size: 28rpx;
    color: #333;
}

/* .wxParse .p {
  margin: 0 !important;
}

.wxParse .img {
  display: block !important;
} */

/* this rule will be remove */

/* * {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
} */
</style>
