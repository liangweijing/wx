<template>
<div class="cart">

    <div v-if="hasStar" class="cartlist">

        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con" @click="goGoodsDetail(item.skuId)">
                <div class="left">                   
                    <div class="img">
                        <img :src="item.listUrl" alt="">
            </div>
                        <div class="info">
                            <p>{{item.title}}</p>
                            <p>{{item.sellPoint}}</p>
                            <p v-if="item.discountPrice">￥{{item.discountPrice}}</p>
                            <p v-else>￥{{item.price}}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div v-if="!hasStar" class="nogoods">
            <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
    </div>
        </div>
</template>

<script>
export default {
    onShow() {
        if(wx.getStorageSync("star")[0]!=null){
            this.hasStar=true;
            this.listData=wx.getStorageSync("star");
        }else{
            this.hasStar=false;
        }
        
    },
    data(){
        return{
            listData:[],
            hasStar:false
        }
    },
    methods: {
        goGoodsDetail(skuId){
            console.log("tz");
            wx.redirectTo({
                url:"/pages/goods/main?goods_id=" + skuId
            })
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
            padding: 20rpx 0;
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

                    .icon {
                        height: 125rpx;
                        width: 62rpx;
                        background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat center center;
                        background-size: 34rpx 34rpx;
                        margin: 0 20rpx;
                    }

                    .icon.active {
                        background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat center center;
                        background-size: 34rpx 34rpx;
                    }

                    .img {
                        height: 165rpx;
                        width: 165rpx;
                        display: block;
                        background: #f4f4f4;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .info {
                        width: 100%;
                        padding: 20rpx;

                        p {
                            line-height: 40rpx;
                        }
                    }
                }
            }

        }

    }

    .nogoods {
        margin-top: 200rpx;

        img {
            margin: 0 auto;
            display: block;
            width: 258rpx;
            height: 258rpx;
        }
    }
}
</style>
