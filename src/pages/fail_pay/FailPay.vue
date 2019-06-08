<template>
<div>
    <wux-result
    title="支付失败"
    :icon="icon"
    label="抱歉您没有支付成功,请检查是否网络可用再重新下单！"
    :buttons="buttons"
    extra="Jiajiayu © 2019 lwj app"
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
            icon:{
                type:"warn",
                color:"#eb4b3d"
            },
             buttons: [{
                type: 'balanced',
                block: true,
                text: '订单详情',
            },
            
        ],
        }

    },
    mounted() {
        console.log("fail_mounted");
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
        // 除去数组无效值undefined，false，0，null
       cartGoods= cartGoods.filter(Boolean)
        wx.setStorageSync("cart",cartGoods);
        wx.removeStorageSync("orderGoods")
      
    },
    methos:{
    //     onClick(e) {
    //     console.log(e)
    //     const { index } = e.mp.detail

    //     index === 0 && wx.navigateTo({
    //         url:"/pages/order/main"
    //     })

    //     index === 1 && wx.navigateBack()
    // },
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
    }
}
 </script>