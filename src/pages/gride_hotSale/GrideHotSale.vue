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

            <div class="goods_list" @click="goProduct(item.id)">
                <van-card tag="HOT" :price="item.price" :desc="item.sellPoint" :title="item.title" :thumb="item.listUrl">
                    <van-tag slot="tags" plain type="danger">包邮</van-tag>
                    <van-tag slot="tags" plain type="danger">优惠券</van-tag>
                </van-card>
            </div>
        </div>
    </div>
    <!-- 页面底部提示weui -->
    <div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-if="foot">
      <div class="weui-loadmore__tips weui-loadmore__tips_in-line weui-loadmore__tips_in-dot"></div>
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
        this.goodsList = [];

    },

    mounted() {

        wx.setNavigationBarTitle({
            title: "热卖"
        });

        //放在这里，放在mounted开头，pageName还没被赋值
        this.getList()
    },
    data() {
        return {
            goodsList: [],
            foot:false,
            current: 'volumn',
             currentPage: 1, // 当前页数
            total_page: 0 // 总页数
        };
    },
    // 上拉触底事件
    onReachBottom() {
        if (this.currentPage > this.total_page) {
            console.log('数据加载完了');
            this.foot=ture;
        } else {
            // 下一页
            this.currentPage = this.currentPage + 1
            this.getList()
        }
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 初始化页码
        this.currentPage = 1
        this.getList()
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
            this.$fly.get("/grideHotSale?currentPage="+this.currentPage)
                .then(({
                    data: res
                }) => {
                    wx.hideLoading();
                    // 关闭下拉刷新动画
                    wx.stopPullDownRefresh()
                    if (res.code == 1) {
                         res.data.forEach(element => {
                        element.price=formatPrice(element.price);
                    });
                        
                        // 数据追加  
                        if (this.currentPage > 1) {
                            // 数据追加
                            this.goodsList.push(...res.data)

                        } else {
                            // 数据
                            this.goodsList = res.data
                        }
                        // 总页数
                        // this.total_page = res.data.total_page

                    } else {
                        // this.handleWarning("数据有误");
                        this.showError(res.msg);
                    }

                })
        }
    },
}
</script>
