<template>
    <div class=" choice">

        <div class=" list">

            <h2 class="head">精.品.推.荐</h2>
            <div class="sublist">
                <div @click="goodsDetail(item.skuId)" v-for="(item, index) in choiceness" :key="index">
                    <img :src="item.listUrl" >
                    <p>{{item.title}}</p>
                    <p>￥{{item.price}}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { formatPrice } from '@/utils/index'
export default {
    onShow() {
  

    },
    mounted() {
        
        console.log("渲染了精品");
        this.getList();

    },
    data() {
        return {
            choiceness: []
        }
    },
    methods: {
        getList() {
            this.$fly.get("/grideChoiceness")
                .then(({
                    data: res
                }) => {
                    
                    res.data.forEach(element => {
                        element.price=formatPrice(element.price);
                    });
                   this.choiceness=res.data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        goodsDetail(id){
            wx.navigateTo({
                url:"/pages/goods/main?goods_id="+id
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.choice {
    margin-top: 20rpx;
    padding: 0 10rpx 25rpx 10rpx;

    .head {
        padding: 16rpx 0;
        text-align: center;
        color:#996600;
        font-weight:700;
        letter-spacing:14rpx;
        font-size:34rpx;

    }

    .sublist {
        display: flex;
        flex-wrap: wrap; //不够则换行
        justify-content: space-between; //对其方式两端对齐
        width: 730rpx;
        margin: 0 auto;

        div {
            width: 360rpx;
            background: #fff;
            margin-bottom: 10rpx;
            padding-bottom: 10rpx;

            img {
                display: block;
                width: 302rpx;
                height: 302rpx;
                margin: 0 auto;
            }

            p {
                margin-bottom: 5rpx;
                text-indent: 1em;//缩进
                font-size:28rpx;

            }

            p:nth-child(2) {
                overflow: hidden;
                text-overflow: ellipsis;//溢出省略号代替
                white-space: nowrap;//文本不换行
                width: 98%;
                font-size:30rpx;

            }

            p:nth-child(3) {
                color:#996600;
            }
        }

        div:nth-child(2n) {
            margin-left: 10rpx;
        }
    }
}
</style>
