<template>
<div>
<wux-result
    title="支付成功"
    label="微信小程序自定义组件 https://github.com/wux-weapp/wux-weapp"
    :buttons="buttons"
    extra="Copyright © 2018 wux weapp"
    fixed
    @click="onClick"
/>
<div class="back">
<wux-button block type="light" @click="goIndex">返回商城</wux-button>
</div>

</div>
</template>

<script>
export default {
   
    data() {
        return {
            buttons: [{
                type: 'balanced',
                block: true,
                text: '订单详情',
            },
           
        ],
        }

    },
    mounted() {
        console.log("success_mounted");
        //删掉购物车中已下单商品
        var cartGoods=wx.getStorageSync("cart").goods;
        var orderGoods=wx.getStorageSync("orderGoods");
        for(var i=0;i<cartGoods.length;i++){
            for(var j=0;j<orderGoods.length;j++){
                if(cartGoods[i].skuId==orderGoods[j].skuId){
                    delete cartGoods[i];//变为undefined
                    break;
                }
            }
        }
        //除去数组无效值undefined，false，0，null
        cartGoods=cartGoods.filter(Boolean)
        wx.setStorageSync("cart",cartGoods);
        wx.removeStorageSync("orderGoods")
        
    },
    methods: {
        onClick(e) {
            console.log(e.mp)
       wx.navigateTo({
           url:"/pages/order/main"
       })
    },
    goIndex(){
        wx.switchTab({
            url:"/pages/index/main"
        })
    }
    },
  
    
}
 </script>
 <style lang="scss" scoped>
 .back{
     margin:0 40rpx;
 }
 </style>
 