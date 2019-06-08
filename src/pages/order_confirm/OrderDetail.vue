<template>
<div class="order_confirm">
    <div @click="toAddressList" v-if="address.consignee" class="address">
        <div class="item">
            <div class="list">
                <div class="addresslist">
                    <div>
                        <span>{{address.consignee}}</span>
                        <div v-if="address.isDefault" class="moren">
                            默认
                        </div>
                    </div>
                    <div class="info">
                        <p>{{address.mobile}}</p>
                        <p>{{address.address+address.detail}}</p>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
    <div @click="toAdd" v-else class="seladdress">
        请点击添加收货地址
    </div>

    <div class="cartlist">
        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con">
                <div class="left">
                    <div class="img">
                        <img :src="item.listUrl" alt="">
            </div>
                        <div class="info">
                            <p>{{item.title}}</p>
                            <p v-if="discouuntPrice"> ￥{{item.discountPrice}}</p>
                            <p v-else>￥{{item.price}}</p>
                        </div>
                    </div>
                    <div class="right">
                        <div class="num">
                            x{{item.number}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <i-cell-group>
            <i-cell title="运费：" value="￥10"></i-cell>

            <!-- <i-cell title="优惠：" value="￥-10"></i-cell> -->
        </i-cell-group>
        <wux-cell-group>
            <wux-cell title="选择优惠券：" :extra="title1" @click="onClick1"></wux-cell>
        </wux-cell-group>
        <wux-select id="wux-select1" />
        <div class="bottom">
            <div>
                需付 : ￥{{allprice}}
            </div>
            <div @click="pay">
                支付
            </div>
        </div>
    </div>
</template>

<script>
// 优惠券下拉框
import {
    $wuxSelect
} from '../../../static/wux/dist/index';
import {formatPrice,
    uuid
} from "@/utils/index";
export default {
    onShow() {

        // 判断地址
        if (wx.getStorageSync("addressId")) {

            this.addressId = wx.getStorageSync("addressId");
            this.openId = wx.getStorageSync("userInfo").openId;
            console.log("地址", this.addressId)
            this.getAdress();
        }
        //判断加入订单的商品
        console.log("ordergoods", wx.getStorageSync("orderGoods"))
        if (!wx.getStorageSync("orderGoods")) {
            this.showError("没有选择下单商品！");
        } else {
            this.listData = wx.getStorageSync("orderGoods");
        }
        if (wx.getStorageSync("userInfo")) {
            this.openid = wx.getStorageSync("userInfo").openid;
        }
        //获取用户优惠券
        this.getCoupon();

    },

    data() {
        return {
            addressId: "",
            address: {},
            listData: [],
            value1: '',
            title1: '',
            openid: "",
            coupon: [],
            orderId: ""
        }
    },
    computed: {

        allprice() {
            var p = 0;
            this.listData.forEach(element => {
                if (element.discoutPrice) {
                    p += element.discoutPrice * element.number;
                } else {
                    p += element.price * element.number;
                }
                p -= Number(this.title1.substring(2)); //优惠券
                p += 10; //运费
            })
            return formatPrice(p);
        }
    },
    methods: {
        getCoupon() {
            this.$net.get({
                url: "/getCouponUser",
                data: {
                    openid: this.openid
                }
            }).then(res => {
                this.coupon = res.data;
            })
        },
        onClick1() {
            var arr = [];

            console.log(this.coupon);
            this.coupon.forEach(element => {
                var obj = {};
                obj.title = element.desc;
                obj.value = element.discount;
                arr.push(obj);
            })
            console.log(arr)
            $wuxSelect('#wux-select1').open({
                value: this.value1,
                options: arr,
                // options: [
                //     '新人无门槛5元券'+test,
                //     '满200减10券',

                // ],
                onConfirm: (value, index, options) => {
                    console.log('onConfirm', value, index, options)
                    if (index !== -1) {

                        this.value1 = value
                        // this.title1 = options[index]
                        this.title1 = "减￥" + value

                    }
                },
            })
        },
        toAddressList() { //跳转地址页选择其他地址
            wx.navigateTo({
                url: "/pages/address/main"
            });
        },
        toAdd() { //跳转地址列表
            wx.navigateTo({
                url: "/pages/address/main"
            });
        },
        getAdress() {
            this.$net.get({
                url: "/getAddress",
                data: { //不用传openid地址ID是唯一的
                    id: this.addressId
                }
            }).then(res => {
                if (res.code == 1) {
                    this.address = res.data;
                } else {
                    wx.showToast({
                        title: "获取地址失败",
                        icon: 'none',
                        duration: 2000
                    })
                }
            }).catch(err => {
                console.log(err)
            })

        },
        // insertOrderUser(){
        //     this.$net.post({
        //         url: "/insertOrderUser",
        //         data: {
        //             openid: this.openid,
        //             addressId: this.addressId,
        //             totalPrice: this.allprice,
        //             couponPrice: Number(this.title1.substring(2)),
        //             status:"支付失败"
        //         },
        //     }).then(res=>{
        //         if(res.code==1){
        //             wx.navigateTo({
        //                         url: "/pages/fail_pay/main"
        //                     })
        //         }
        //     })
        // },
        //一个方法就够了无论支付成功失败
        async insertOrder(status, url) {
            //实践了当后一个请求要用到前一个请求返回的数据时，用这种方式同步请求。将返回的数据绑在this.orderId没用。
            //放到缓存wx.setStorageSync是滞后一个的。  

            //sheng生成唯一订单号
            let oid = uuid();
            console.log(oid)
            wx.setStorageSync("orderId",oid);
            let data = await this.$net.post({
                url: "/insertOrderUser",
                data: {
                    oid: oid,
                    openid: this.openid,
                    addressId: this.addressId,
                    totalPrice: this.allprice,
                    couponPrice: Number(this.title1.substring(2)),
                    status: status
                },
            });

            this.listData.forEach(ele => {
                ele.orderId = oid;
                ele.totalPrice = ele.price * ele.number;
            })
            //传入orderGoods实体类对象数组
            let res = await this.$net.post({
                url: "/insertOrderGoods",
                data: this.listData
            });
            if (res.code == 1 && data.code == 1) {
                let end = await this.$net.get({
                    url: "/insertOrder",
                }).then(result => {
                    if (result.code == 1) {
                        wx.navigateTo({
                            url: url
                        })
                    }
                })
            }

        },
        pay() {
            var that = this;
            if (!this.addressId) {
                wx.showToast({
                    title: "请选择收货地址！", //提示的内容,
                    icon: "none", //图标,
                    duration: 1500, //延迟时间,
                    mask: false, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: '确认付款:￥' + this.allprice,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            that.insertOrder("支付成功", "/pages/success_pay/main");

                        } else if (res.cancel) {
                            console.log('用户点击取消')
                            // that.insertOrderUser();
                            that.insertOrder("支付失败", "/pages/fail_pay/main");

                        }
                    }
                })
            }

        },
    }
};
</script>

<style lang="scss" scoped>
@import './style';

.bottom {
    position: fixed;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    display: flex;
    background: #fff;
    font-size: 32repx;

    div:nth-child(1) {
        flex: 1;
        line-height: 100rpx;
        padding-left: 20rpx
    }

    div:nth-child(2) {
        width: 200rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 29rpx;
        background: #b4282d;
        color: #fff;
    }
}
</style>
