<template>
<div class="auth">
    <div class="top">欢迎使用电器商城小程序</div>
    <div class="auth_btn">
        <!-- 要用@绑定事件 -->
        <button type="primary"  open-type="getUserInfo" @getuserinfo="bindgetuserinfo" >授权应用</button>
    </div>
</div>
</template>

<script>
export default {

    data() {
        return {
            // canIUse: false,
            //hasUserInfo: false,
            userInfo: {}
        }
    },
    methods: {
        async bindgetuserinfo(e) {
            var that = this;

            if (e.mp.detail.userInfo) {
                console.log('用户按了允许授权按钮');
                console.log(e.mp.detail);
                var info = e.mp.detail.userInfo;
                //发送 res.code 到后台换取 openId, sessionKey, unionId

                await wx.login({
                    success: res => {

                        wx.request({
                            url: 'https://api.weixin.qq.com/sns/jscode2session',
                            data: {
                                appid: "wxbf12cab6563eb5e2",
                                secret: "7ef305803ff6322c39493e7e0429933a",
                                js_code: res.code,
                                grant_type: " authorization_code"
                            },
                            success: function (res) {

                                console.log('请求微信接口成功', res)
                                that.userInfo = {
                                    openid: res.data.openid,
                                    session_key: res.data.session_key,
                                    nickName: info.nickName,
                                    avatarUrl: info.avatarUrl,
                                    gender: info.gender,
                                }
                                console.log(that.userInfo)
                                if (that.userInfo.openid) {
                                    //将用户信息插入数据库且返回用户标识ID
                                    that.$net.post({
                                        //后台接口地址
                                        url: '/insertUser',
                                        data: {
                                            avatarUrl: that.userInfo.avatarUrl,
                                            gender: that.userInfo.gender,
                                            nickName: that.userInfo.nickName,
                                            openid: that.userInfo.openid,
                                            sessionKey: that.userInfo.session_key,
                                        }

                                    }).then(res => {
                                        if (res.code == 1) {
                                            if (res.data == 1) {
                                                console.log("老用户");
                                                wx.switchTab({
                                                    url: "/pages/index/main"
                                                })
                                            } else {
                                                console.log("新用户");
                                                //插入数据库成功返回自增ID
                                                that.userInfo.uid = res.data;
                                                console.log("缓存", that.userInfo)
                                                wx.setStorageSync("userInfo", that.userInfo);
                                                console.log(444)
                                                wx.switchTab({
                                                    url: "/pages/index/main"
                                                })
                                                console.log(555)
                                            }
                                        }

                                    }).catch(err => {
                                        console.log('后端错误', err)
                                    })
                                }
                            },
                            fail: function (err) {
                                console.log("请求微信接口失败", err)
                            }
                        })

                    },
                    fail: function () {
                        console.log('获取登录code错误')
                    }
                })

            } else {
                console.log('执行到这里，说明拒绝了授权')
                wx.showToast({
                    title: "抱歉，部分功您能将不能使用！",
                    icon: 'none',
                    duration: 2000
                });
                console.log(888)
                //没有缓存信息
                wx.switchTab({
                    url: "/pages/index/main"
                })
                console.log(999)
            }

        },

    },
}
</script>

<style lang="scss" scoped>
.auth {
    .top {
        font-size: 46rpx;
        text-align: center;
        margin: 240rpx 0;
        font-weight: 700;

    }

    .auth_btn {
        button {
            height: 100rpx;
            line-height: 100rpx;
            margin: 0 20rpx;

        }
    }
}
</style>
