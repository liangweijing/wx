<template>
<div>
    <div class="filterbar">
        <i-tabs :current="current " color="#996600" @change="onChange">
            <i-tab key="synthesize" title="综合"></i-tab>
            <i-tab key="newgoods" title="新品"></i-tab>
            <i-tab key="volumn" title="销量"></i-tab>
            <i-tab key="price" title="价格"></i-tab>
        </i-tabs>
    </div>
    <div class="goodsList">
        <div v-for="(item,index) in goodsList" :key="index">

            <div class="goods_list" @click="goProduct(item.id)" >
                <van-card tag="SALE" :price="item.price" :origin-price="item.discountPrice" :desc="item.sellPoint" :title="item.title" :thumb="item.listUrl">
                    <van-tag slot="tags" plain type="danger">包邮</van-tag>
                    <van-tag slot="tags" plain type="danger">优惠券</van-tag>
                </van-card>
            </div>
        </div>
    </div>
    <!-- 全局提示信息引入：组件中加入标签，json配置。在main.js的vue中挂载全局方法 -->
    <i-toast id="toast" />
    <wux-toptips id="wux-toptips" />
</div>
</template>
<script>
import { formatPrice } from '@/utils/index'
export default {
    
    onLoad() {
      //手动清空，因为小程序页面销毁不销毁Vue组件，会出现点击电饭锅闪一下上次点击的电水壶
      this.goodsList=[];
      
    },
   
    mounted() {

        wx.setNavigationBarTitle({
            title: "特卖"
        });
        
        //放在这里，放在mounted开头，pageName还没被赋值
        this.getList()
    },
    data() {
        return {
            goodsList: [],
            // nav: ["综合", "新品", "销量", "价格"],
            current: 'synthesize',
        };
    },
    methods: {

        goProduct(id) {
            wx.navigateTo({
                url: "/pages/goods/main?product_id=" + id
            });
        },
        onChange(e) {
            console.log('onChange', e)
            console.log("current:", e.mp.detail.key)
            //无法使用微信的这个方法报错
            // this.setData({
            //     current: e.mp.detail.key,
            // })
        },
        getList() {
           
            wx.showLoading({
                title: '正在加载中....'
            })
            this.$fly.get("/grideOnSale" )
                .then(({
                    data: res
                }) => {
                    wx.hideLoading();
                    if (res.code == 1) {
                        res.data.forEach(element => {
                            element.price=formatPrice(element.price);
                            element.discountPrice=formatPrice(element.discountPrice);
                        });
                        this.goodsList = res.data;
                       
                    } else {
                        // this.handleWarning("数据有误");
                        this.showError(res.msg);
                    }

                })
        }
    },
}
</script>