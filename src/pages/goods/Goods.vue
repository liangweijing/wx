<template>
<div class="goods" v-if="id">
    <div class="swiper">
        <swiper class="swiper-container" indicator-dots="true" autoplay="true" circular="true" interval="3000" duration="1000">
            <block v-for="(item, index) in imgUrls " :key="index">
                <swiper-item class="swiper-item">
                    <image :src="item" class="slide-image" />
                </swiper-item>
            </block>
        </swiper>
        <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-b">

        <div class="item">
            <wux-icon type="ios-done-all" size="18" color="#996600" /> 30天无忧退货</div>
        <div class="item">
            <wux-icon type="ios-done-all" size="16" color="#996600" />48小时快速退款</div>
        <div class="item">
            <wux-icon type="ios-done-all" size="16" color="#996600" />满88元免邮费</div>
    </div>
    <!-- <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div v-if="brand.name" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div> -->

    <!-- 选择规格 -->
    <van-cell title="选择产品规格" is-link @click="showMenu" />
    <!-- 详情和评论 -->
    <van-tabs sticky @click="onClick" color="#996600" active="0">
        <van-tab title="详情">
            <div v-if="goods_desc" class="detail">
                <wxParse :content="goods_desc" />
            </div>
        </van-tab>
        <van-tab title="评价">评价</van-tab>
    </van-tabs>

    <!-- 选择规格弹框 -->
    <div v-show="showpop" @click="showMenu" class="pop">

    </div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
        <div class="top">
            <div class="left">
                <img :src="listUrl" alt="">
        </div>
                <div class="right">
                    <div>

                        <p>￥{{price}}</p>
                        <p>请选择数量</p>
                    </div>
                </div>
                <van-icon name="close" size="20px" @click="showMenu" />
            </div>
            <div class="b">
                <p>数量</p>
                <div class="count">
                    <div @click="reduce" class="cut">-</div>
                    <input class="number" disabled="" v-model="number" />
                    <div @click="add" class="add">+</div>
                </div>
            </div>
        </div>

        <!-- 选择规格部分 -->

        <!-- 商品详情tabbar -->
        <div class="bottom">
            <div class="collect">
                <van-icon v-if="!star" name="https://i.loli.net/2019/06/07/5cfa59461d24a81714.png" size="30px" @click="clickIcon" />
                <van-icon v-else name="https://i.loli.net/2019/06/07/5cfa594c355e746103.png" size="30px" @click="clickIcon" />
            </div>
            <van-goods-action>
                <!-- 采坑，van-goods-action-icon的点击事件无用，用属性跳转 -->
                <van-goods-action-icon style="padding-left:50px;" type="plain" icon="cart-o" text="购物车" :info="number" link-type="switchTab" url="/pages/cart/main" />
                <van-goods-action-button text="加入购物车" type="warning" @click="addCart" />
                <van-goods-action-button text="立即购买" @click="buyRightRow" />
            </van-goods-action>
        </div>

        <!-- 全局提示信息引入：组件中加入标签，json配置。在main.js的vue中挂载全局方法 -->
        <i-toast id="toast" />
        <wux-toptips id="wux-toptips" />
    </div>
</template>

<script>
//富文本
import wxParse from 'mpvue-wxparse'
import {
    isLogin
} from "../../utils";
export default {
    components: {
        wxParse
    },
    mounted() {
        var that = this
        // console.log(that.globalData.userInfo)总是一清楚缓存就没了
        console.log(wx.getStorageSync("userInfo"));
        // 需要手动清空否则下次的轮播图会叠加到上次
        this.imgUrls = [];
        this.id = "";
        this.id = this.$root.$mp.query.goods_id;
        console.log("33", this.id);
        //判断是否收藏商品
        var starGoods = wx.getStorageSync("star");
        if (starGoods[0] != null) {
            console.log(111)
            starGoods.forEach(ele => {
                if (ele.skuId == this.id) {
                    this.star = true;

                }
            })
        }
        if (this.id) {

            this.getDetail();
        } else {

            //只好使用微信api保存
            wx.showToast({
                title: '没有传入商品ID',
                icon: 'none',
                duration: 2000
            })
            // this.showError("没有传入商品ID！");在methods里面可用在周期函数中的this好像不是vue.property,vue实例
        }

    },
    data() {
        return {
            star: false,
            number: 1,
            showpop: false,
            imgUrls: [],
            goods: {},
            id: "",
            goods_desc: "",
            listUrl: '',
            price: '',
            inventory: 0
        };
    },

    methods: {
        clickIcon() { //收藏

            this.star = !this.star;

            let starGoods = wx.getStorageSync("star")
            if (this.star) { //选择收藏去判断有无缓存

                if (starGoods[0] != null) { //真有缓存
                    console.log("have")
                    starGoods.push(this.goods);
                } else { //没缓存或者第一个是null
                    console.log("no")
                    let newStar = [];
                    newStar.push(this.goods);
                    wx.setStorageSync("star", newStar);
                }
            } else { //不收藏时不用对无缓存情况操作
                if (starGoods[0] != null) {

                    for (var i = 0; i < starGoods.length; i++) {
                        if (this.goods.skuId == starGoods[i].skuId) {
                            delete starGoods[i];
                        }
                    }
                    // 除去数组无效值undefined，false，0，null
                    starGoods.filter(Boolean);
                    wx.setStorageSync("star", starGoods);
                }
            }

            console.log("icon")
        },
        // 避免回调地狱，想要在goodsDetail请求中又发goodsSwiper请求
        async getDetail() {

            let swiperRes = await this.$net.get({
                url: "/goodsSwiper?id=" + this.id,
                data: {}
            }); //获得picSet实体类对象
            let goodsRes = await this.$net.get({
                url: "/goodsDetail?id=" + this.id,
                data: {}
            }); //goods实体类对象
            console.log(goodsRes);
            if (goodsRes.code == 1) {
                this.goods = goodsRes.data[0];
                this.goods_desc = goodsRes.data[0].detail;
                this.price = goodsRes.data[0].price;
                this.inventory = goodsRes.data[0].inventory;
                this.listUrl = goodsRes.data[0].listUrl;
                if (swiperRes.code == 0) {
                    this.imgUrls.push(goodsRes.data[0].coverUrl)
                } else if (swiperRes.code == 1) {
                    this.imgUrls.push(swiperRes.data[0].swiper1);
                    this.imgUrls.push(swiperRes.data[0].swiper2);
                }
            } else {
                this.showError(goodsRes.msg);
            }

            // this.$net.get({
            //   url: "/goodsDetail",
            //   data: {}
            // })
            // .then(res=>{
            //   (res.data || []).forEach(element => {

            //     var obj = {};
            //     obj.src = element.coverUrl;
            //     this.imgUrls.push(obj);
            //               });
            //   this.goodsDetail=res.data;
            // })
        },
        showMenu() {
            this.showpop = !this.showpop;
        },
        add() {
            this.number = this.number + 1;
            this.goods.number = this.number;
        },
        reduce() {
            if (this.number > 1) {
                this.number = this.number - 1;
                this.goods.number = this.number;
            } else {
                return false;
            }
        },

        onClick(event) {
            console.log(event)
            //坑，detail里面没有index只有X，Y坐标，比大小好了
            wx.showToast({
                title: "点击标签 " + event.mp.detail.index,
                icon: 'none'
            });
        },
        addCart() {
            //加入购物车
            if (isLogin()) {
                if (this.showpop) {
                    if (this.number > this.inventory) {
                        wx.showToast({
                            title: "您选择的数量超过库存！", //提示的内容,
                            duration: 2000, //延迟时间,
                            icon: "none",
                            mask: true, //显示透明蒙层，防止触摸穿透,
                            success: res => {}
                        });
                        return false;
                    }
                    //获取或新建购物车
                    var cart = wx.getStorageSync('cart') || {};
                    console.log("arr,{}", cart);
                    if (cart.goods) {
                        // 购物车不空，遍历购物车数组  
                        var flag = false;
                        console.log("noempty")
                        cart.goods.forEach(element => {
                            if (element.skuId == this.id) {
                                console.log("same")
                                //购物车已存在该商品
                                element.number = this.number;
                                flag = true;
                                // 最后，把购物车数据，存放入缓存（此处不用再给购物车数组push元素进去，因为这个是购物车有的，直接更新当前数组即可）  
                                try {
                                    wx.setStorageSync('cart', cart)
                                } catch (e) {
                                    console.log(e)
                                }
                                //提示
                                wx.showToast({
                                    title: '加入购物车成功！',
                                    icon: 'success',
                                    duration: 2000
                                });
                                this.showpop = false;
                                return; //无法用break
                            }
                        });
                        // 遍历完购物车后，没有对应的item项，把goodslist的当前项放入购物车数组  
                        if (!flag) {
                            console.log("nosame")
                            cart.goods.push(this.goods);
                        }

                    } else {
                        //购物车为空

                        var cart = {
                            uid: wx.getStorageSync("userInfo").uid,
                            goods: []
                        }
                        cart.goods.push(this.goods);
                    }
                    try {
                        wx.setStorageSync('cart', cart)
                    } catch (e) {
                        console.log(e)
                    }
                    //提示
                    wx.showToast({
                        title: '加入购物车成功！',
                        icon: 'success',
                        duration: 2000
                    });
                    this.showpop = false;
                    console.log(wx.getStorageSync("cart"))
                } else {
                    this.showpop = true;
                }
            } else {
                wx.navigateTo({
                    url: "pages/auth/main"
                })
            }
        }
    },
    buyRightRow() {
        //立即购买
    },
    goCart() {
        console.log(333)
        wx.switchTab({
            url: "/pages/cart/main"
        })
    },
    onClickIcon() {
        console.log(444)
    }
};
</script>

<style lang="scss" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
@import './style';

.bottom {
    width: 700rpx;
    height: 118rpx;
    position: fixed;
    bottom: 0px;

    .collect {
        position: absolute;
        z-index: 1111;
        margin: 0 9px;
        height: 50px;
        border-right: 1px solid #ddd;
        width: 82rpx;
        padding-top: 10px;

    }

}
</style>
