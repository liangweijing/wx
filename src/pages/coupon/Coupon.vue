<template>
    <div class="cart">

    <div v-if="hasStar" class="cartlist">

        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con" @click="getCoupon(item.id)">
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
    data(){
        return{
            listData:[]
        }
    },
    mounted() {
        this.getCoupon();
    },
    methods: {
        getCoupon(){
            this.$net.get("/grideCoupon")
            .then(res=>{
                if(res.code==1){
                    this.listData=res.data;
                }
                
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

                    .img {
                        height: 165rpx;
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
