<template>
<div class="cart">

    <div class="cartlist">

        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con" @click="getCoupon(item.id,index)">
                <div class="left">
                    <div class="img">
                        <img :src="item.couponUrl" alt="">
            </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            listData: [],
            openid: "",
        }
    },
    mounted() {
        console.log("coupon")
        this.getCouponList();
    },
    methods: {
        getCouponList() {
            console.log("get")
            this.$net.get({
                    url: "/grideCoupon"
                })
                .then(res => {
                    if (res.code == 1) {
                        this.listData = res.data;
                    }

                })
        },
        async getCoupon(id, index) {
            console.log(888, id, index);
            //领取优惠券
            //先判断是否授权
            if (wx.getStorageSync("userInfo")) {
                this.openid = wx.getStorageSync("userInfo").openid;
                //查询数据库该券用户是否领取过,同步
                let res = await this.$net.get({
                    url: "/checkCoupon",
                    data: {
                        openid: this.openid,
                        couponId: id
                    }
                });
                // console.log(res)微信发请求返回的都是处理好的res
                if (res.code == 1) { //领取过了
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    this.$net.post({
                        url: "/getCoupon",
                        data: {
                            openid: this.openid,
                            status: "未使用",
                            couponId: id,
                            desc: this.listData[index].desc,
                            discount: this.listData[index].discount,
                            num: 1
                        }
                    }).then(res => {
                        if (res.code == 1) {
                            wx.showToast({
                                title: res.msg,
                                icon: 'success',
                                duration: 2000
                            })
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'error',
                                duration: 2000
                            })
                        }
                    })
                }
            } else { //跳转授权页
                wx.redirectTo({
                    url: "/pages/auth/main",

                })
            }
        }

    },
}
</script>

<style lang="scss" scoped>
.cart {
    overflow-x: hidden;

    .cartlist {
        background: #fff;
        margin-bottom: 110rpx;

        .item {
            margin-bottom: 20rpx;
            border-bottom: 1rpx solid #f4f4f4;
            height: 200rpx;
            position: relative;

            .con {
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 300ms ease;
                width: 100%;

                .left {
                    display: flex;
                    align-items: center;
                    width: 100%;

                    .img {
                        height: 200rpx;
                        width: 100%;
                        display: block;
                        background: #f4f4f4;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }

        }

    }
}
</style>
