<template>
<div>
    <div class="filterbar">
        <i-tabs :current="active " color="#996600" @change="handleChange">
            <i-tab key="all" title="全部"></i-tab>
            <i-tab key="pay" title="待支付"></i-tab>
            <i-tab key="receive" disabled title="待收货"></i-tab>
            <i-tab key="comment" title="待评价"></i-tab>
        </i-tabs>
    </div>


    <div class="orderItem" v-for="(item,index) in orderList" :key="index" @click="goOrderDetail(item.order_id)">
        <van-cell title="订单信息" icon="orders-o" />
        <div v-if="item.discount_price">
            <van-card v-for="(ele,id) in item.subgoods" :key="id"  :num="ele.number" :price="ele.discount_price" :origin-price="ele.price" :desc="ele.sell_point" :title="ele.title" :thumb="ele.list_url" />
        </div>
        <div  v-else>
            <van-card v-for="(ele,id) in item.subgoods" :key="id" :num="ele.number" :price="ele.price"  :desc="ele.sell_point" :title="ele.title" :thumb="ele.list_url" />
        </div>
        <van-cell title="运费" value="10" />
        <van-cell title="优惠" :value="item.coupon_price" />
        <van-cell title="合计" :value="item.total_price" />
        <div class="footer">
            <van-button round plain size="small" type="warning">删除</van-button>
            <van-button round plain size="small" type="warning">评价</van-button>
        </div>
    </div>
       
</div>
</template>

<script>
import { formatPrice } from '@/utils/index'
export default {
    onShow() {
        if (wx.getStorageSync("userInfo")) {
            this.openid = wx.getStorageSync("userInfo").openid;
        }
        console.log(1,this.openid);
        
    },
    mounted() {
        console.log("mounted");
        console.log(this.$root.$mp.query.status);
        this.status = this.$root.$mp.query.status;
        if(this.$root.$mp.query.active){
            this.active=this.$root.$mp.query.active;
        }
        
        this.getOrderList()
    },
    data() {
        return {
            active: 0,
            openid: "",
            orderList: [],
            status: "",
            active: 'all',
        }
    },
    methods: {
        handleChange(e) {
            //点击的tabs的key值
            this.active = e.mp.detail.key;
            switch( this.active){
                case "all":this.status="全部";break;
                case "pay":this.status="支付失败";break;
                case "receive":this.status="支付成功";break;
                case "comment":this.status="收货成功";break;         
            }
            this.getOrderList();
            
        },
        getOrderList() {
            console.log(2,this.openid);
            this.$net.get({
                url: "/getOrderList",
                data: {
                    openid: this.openid,
                    status: this.status
                }
            }).then(res => {
                res.data.forEach(element=>{
                    element.price=formatPrice(element.price);
                    element.dicount_price=formatPrice(element.discount_price);
                })
                this.orderList = res.data;
            })
        },
        goOrderDetail(orderId){
            wx.navigateTo({
                url:"/pages/order/main?orderId"+orderId
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.orderItem {
    margin:20rpx;
border:1px solid #eee;
border-radius:20rpx;
overflow:hidden;
background-color: #fff;
// box-shadow:1rpx 1rpx 1rpx 1rpx;
    .footer{
        height:90rpx;
        line-height: 90rpx;
        ._van-button{
            float:right;
        }
    }
}
</style>
