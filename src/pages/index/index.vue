<template>
<div>

    <!-- 轮播图 -->
    <div class="swiper">
        <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
            <block v-for="(item, index) in imgUrls " :key="index">

                <swiper-item class="swiper-item" @click="goodsDetail(item.id)">
                    <image :src="item.src" class="slide-image" />
                </swiper-item>

            </block>
        </swiper>
    </div>

    <!-- 获取地理位置并跳转底部导航 -->
    <!-- <div class="weui-cells weui-cells_after-title">
      <navigator open-type="switchTab" url="/pages/classify/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">获取地理位置并跳转</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div> -->
    <!-- 可以转跳除底部tabbar之外的页面 -->
    <van-cell title="店铺位置" icon="location-o" is-link url="/pages/map/main" />

    <!-- 九宫格 -->

    <div class="pages">
        <div class="page__bd">
            <div class="weui-grids weui-grids2">
                <block v-for="(item,index) in grids" :key="index">
                    <div @click="goGridesList(item.name)" class="weui-grid weui-grid2" hover-class="weui-grid_active">
                        <image class="weui-grid__icon" :src="item.src" />
                        <div class="weui-grid__label">{{item.name}}</div>
                    </div>
                </block>
            </div>
        </div>
    </div>

    <!-- 客服 bind:contact改成@contact失效，他不是bindtap-->
    <wux-cell-group>
        <wux-cell thumb="https://i.loli.net/2019/05/30/5cefd501de7bf60836.png" title="打开客服会话" is-link open-type="contact" bind:contact="onContact"></wux-cell>
    </wux-cell-group>

    <!-- 精品推荐 -->
    <choiceness></choiceness>

    <!-- 页脚 -->
    <div class="weui-footer">
        <div class="weui-footer__links">
            <navigator url="" class="weui-footer__link">家家裕电器商城</navigator>
        </div>
        <div class="weui-footer__text">Copyright © 2008-2018 lwj.graduation</div>
    </div>

</div>
</template>

<script>
import card from '@/components/card';
import choiceness from '@/components/choiceness';
export default {
    beforeCreate() {
         var that = this; //在小程序的生命周期中使用this要变
        // that.globalData.userInfo = {
        //     avatarUrl: "",
        //     gender: 2,
        //     nickName: "梁炜婧测试",
        //     uid: 1
        // };
        // wx.setStorageSync("userInfo", that.globalData.userInfo);
        var userInfo = wx.getStorageSync('userInfo')
        console.log("缓存",userInfo);
        console.log("购物车",wx.getStorageSync("cart"));
        if (!userInfo) {
            console.log(111)
            wx.navigateTo({
                url: "/pages/auth/main"
            })
            console.log(222)
        }else{
            that.globalData.userInfo=userInfo;
        }
    },
    mounted() {
        this.getSwiper();
    },
    data() {
        return {
            imgUrls: [],
            grids: [{
                    src: 'https://i.loli.net/2019/05/30/5cefd47e498c685424.png',
                    name: '电水壶'
                },
                {
                    src: 'https://i.loli.net/2019/05/30/5cefd49b3d3b956137.png',
                    name: '电饭锅/煲'
                },
                {
                    src: '/static/images/stove.png',
                    name: '电磁炉'
                },
                {
                    src: 'https://i.loli.net/2019/05/30/5cefd509589b838433.png',
                    name: '特卖'
                },
                {
                    src: 'https://i.loli.net/2019/05/30/5cefd47a3b5a551765.png',
                    name: '热卖'
                },
                {
                    src: 'https://i.loli.net/2019/05/30/5cefd42b60a8234079.png',
                    name: '优惠券'
                },
            ],

        };
    },
    components: {
        choiceness,
    },
    methods: {
        goGridesList(name) {
            switch (name) {
                case "电水壶":
                case "电饭锅/煲":
                case "电磁炉":
                    wx.navigateTo({
                        url: "/pages/grides_list/main?goods_name=" + name
                    });
                    break;
                case "特卖":
                    wx.navigateTo({
                        url: "/pages/gride_onSale/main"
                    });
                    break;
                case "热卖":
                    wx.navigateTo({
                        url: "/pages/gride_hotSale/main"
                    });
                    break;
                case "优惠券":
                    wx.navigateTo({
                        url: "/pages/coupon/main",
                    });
                    break;
            }

        },
        getSwiper() {
            this.$net.get({
                    url: "/getIndexSwiper",
                    data: {}
                })
                .then(res => {

                    (res.data || []).forEach(element => {

                        var obj = {};
                        obj.id = element.skuId;
                        obj.src = element.coverUrl;
                        this.imgUrls.push(obj);
                    });

                })
        },
        goodsDetail(id) {

            wx.navigateTo({
                url: "/pages/goods/main?goods_id=" + id
            })
        },
        onContact(e) {
            console.log('onContact', e)
        },
    }

};
</script>

<style lang="scss">
.pages {
    margin: 10px 0;
    background-color: #fff;
}

.weui-grids2 {
    border-top: 0;
    border-left: 0;
}

.weui-grid2 {
    border-right: 0;
    border-bottom: 0;
}

.swiper {
    width: 100%;
    height: 500rpx;

    .swiper-container {
        width: 100%;
        height: 100%;

        .swiper-item {
            width: 100%;
            height: 100%;

            .slide-image {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
