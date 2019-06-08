<template>
<div class="my">
    <!-- 用户信息 -->
    <div class="myinfo">
        <div class="userinfo" v-if="openid">
            <div class="userinfo-avatar">
                <open-data type="userAvatarUrl"></open-data>
            </div>
            <open-data type="userNickName"></open-data>
        </div>
        <div v-else>
            <button class='auth_btn'  open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo">
        授权登录
    </button>
        </div>

        <!-- <img @click="toLogin" :src="avator" alt="">
      <div @click="toLogin">
        <p>{{userInfo.nickName}}</p>
        <p v-if="userInfo.nickname">点击登录</p>
        <p v-else>微信用户</p>
      </div> -->
    </div>
    <!-- 订单 -->
    <div>
        <wux-cell-group >
            <wux-cell is-link url="/pages/order_list/main?status=全部" title="全部订单"></wux-cell>
     
        </wux-cell-group>
    <wux-grids col="3" :bordered="false">
            <wux-grid @click="goOrder('支付失败',1)" thumb="https://i.loli.net/2019/06/05/5cf7ab880905d88162.png" label="待支付" />
            <wux-grid @click="goOrder('支付成功',2)" thumb="https://i.loli.net/2019/06/05/5cf7aba2d0c3c16097.png" label="待收货" />
            <wux-grid @click="goOrder('收货成功',3)" thumb="https://i.loli.net/2019/06/05/5cf7abc0b0cd756256.png" label="待评价" />
       
        </wux-grids>
    </div>
    <!-- 其他 -->
    <van-cell title="我的地址" is-link url="/pages/address/main" link-type="navigateTo" />
    <van-cell title="我的优惠券" is-link url="/pages/dashboard/main" link-type="navigateTo" />
    <van-cell title="我的收藏" is-link url="/pages/star_list/main" link-type="navigateTo" />
    <van-cell title="关于我们" is-link url="/pages/dashboard/main" link-type="navigateTo" />

    <van-cell title="意见与反馈" is-link url="/pages/dashboard/main" link-type="navigateTo" />
</div>
</template>

<script>
export default {
    data() {
        return {
            openid: "",
        }
    },
    mounted() {
        if (wx.getStorageSync("userInfo")) {
            this.openid = wx.getStorageSync("userInfo").openid;
        }
    },
    methods: {
        goOrder(status,active){
            console.log("tz",status);
            wx.navigateTo({
                url:"/pages/order_list/main?status="+status+"&active="+active
            })
        }

    },
}
</script>

<style lang="scss" scoped>
@import "./style";

.userinfo {
    position: relative;
    width: 750rpx;
    height: 320rpx;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin:30rpx auto;
    .userinfo-avatar {
        overflow: hidden;
        display: block;
        width: 160rpx;
        height: 160rpx;
        margin: 20rpx;
        margin-top: 50rpx;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);

    }

}
</style>
