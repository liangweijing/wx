<template>
<div>
    <div class="filterbar">
        <i-tabs :current="current " color="#996600" @change="handleChange">
            <i-tab key="synthesize" title="综合"></i-tab>
            <i-tab key="newgoods" title="新品"></i-tab>
            <i-tab key="volumn" title="销量"></i-tab>
            <i-tab key="price" title="价格"></i-tab>
        </i-tabs>
    </div>
    <div class="goodsList">
        <div v-for="(item,index) in goodsList" :key="index">
            <!-- <van-card price="2.00" desc="描述信息" title="商品标题">
            <img slot="thumb" :src='item.url' class="van-card__img thumb-class" @click="goProduct(item.id)">
            </van-card> -->
            <div class="goods_list" @click="goProduct(item.id)" v-if="pageName!='特卖' &&pageName!='热卖' && pageName!='优惠券'">
                <van-card :price="item.price" :desc="item.sellPoint" :title="item.title" :thumb="item.listUrl">
                    <van-tag slot="tags" plain type="danger">包邮</van-tag>
                </van-card>
            </div>
        </div>
    </div>
    <!-- 页面底部提示，无数据 -->
      <i-load-more v-if="foot" tip="已触底没有数据啦！" :loading="loading" />
    <!-- 全局提示信息引入：组件中加入标签，json配置。在main.js的vue中挂载全局方法 -->
    <i-toast id="toast" />
    <wux-toptips id="wux-toptips" />
</div>

<!-- <goods-item v-for="(item,index) in getData" :key="index" :item="item"></goods-item> -->
</template>

<script>
import GoodsNav from '@/components/GoodsNav';
import GoodsItem from '@/components/GoodsItem';
import {
    formatPrice
} from '@/utils/index'
// import {
//     $Toast
// } from '../../../static/iview/dist/base/index';
export default {
    components: {
        GoodsNav,
        GoodsItem,
    },
    created() {
        // this.getList()不放这里，这里每次只在小程序启动时执行一次
    },
    onLoad() {
        //手动清空，因为小程序页面销毁不销毁Vue组件，会出现点击电饭锅闪一下上次点击的电水壶
        this.goodsList = [];
        this.pageName = '';
        this.brand="",
        this.current="synthesize"
    },
    onShow(options) {
        //用options.goods_name不行获取不了参数
    },
    mounted() {
        //从分类页跳过来
        if(this.$root.$mp.query.name){
            //动态设置标题
        wx.setNavigationBarTitle({
            title: this.$root.$mp.query.brand
        });
        //获取上个页面传参
        this.pageName = this.$root.$mp.query.name;
        this.brand=this.$root.$mp.query.brand
        //放在这里，放在mounted开头，pageName还没被赋值
        this.getClassifyList(this.pageName,this.brand, "synthesize");
        }else{
            //从九宫格跳过来
             //动态设置标题
        wx.setNavigationBarTitle({
            title: this.$root.$mp.query.goods_name
        });
        console.log("22", this.pageName);
        
        //获取上个页面传参
        this.pageName = this.$root.$mp.query.goods_name;
        //查询数据库该九宫格数据总条数
        if(this.pageName=="电饭锅/煲"){
            this.getTotalPage("电饭锅");
        }else{
            this.getTotalPage(this.pageName);
        }
        
        //放在这里，放在mounted开头，pageName还没被赋值
        this.getList(this.pageName, "synthesize");
        }
       
    },
    data() {
        return {
            goodsList: [],
            current: 'synthesize',
            pageName: '',
            currentPage: 1, // 当前页数
            total_page: 0, // 总页数
            foot: false,
            brand:"",
            loading:false
        };
    },
    // 上拉触底事件
    onReachBottom() {
        if (this.currentPage >= this.total_page) {
            console.log('xia',this.currentPage);
            this.foot = true;
        } else {
            // 下一页
            this.foot = false;
            this.currentPage = this.currentPage + 1
            this.getList(this.pageName, "synthesize");
        }
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 初始化页码
        this.currentPage = 1
        this.getList(this.pageName, "synthesize");
    },
    methods: {
        async getTotalPage(searchName){
            await this.$net.get({
                url:"/getTotalPage",
                data:{
                    name:searchName
                }
            }).then(res=>{
                if(res.code==1){
                    this.total_page= parseInt(res.data/2+1);
                    
                }
            })
        },
        goProduct(id) {
            wx.navigateTo({
                url: "/pages/goods/main?goods_id=" + id
            });
        },
        handleChange(e) {
            // console.log('onChange', e)
            // console.log("current:", e.mp.detail.key);
            this.current = e.mp.detail.key;
            if(!this.brand){
                this.getList(this.pageName, e.mp.detail.key);
            }else{
                this.getClassifyList(this.pageName,this.brand,e.mp.detail.key);
            }
            
            

            //无法使用微信的这个方法报错
            // this.setData({
            //     current: e.mp.detail.key,
            // })
        },
        //分类页请求数据
        getClassifyList(pageName,brand,filterName){
            this.$net.get({
                url:"/grideGoods?searchName=" + pageName +"&brand=" + brand+ "&filterName=" + filterName+ "&currentPage=0"
            }).then(res=>{
                if (res.code == 1) {
                        //格式化价格
                        res.data.forEach(element => {
                            element.price = formatPrice(element.price);
                        });
                        this.goodsList = res.data
                       

                    } 
            })
        },
        async getList(pageName, filterName) {
            console.log("222", pageName);
            if (pageName == '电饭锅/煲') {
                pageName = '电饭锅';
            }

            // await this.$net.get("/");获取该种类的总条数
            //传递页码
            await this.$fly.get("/grideGoods?searchName=" + pageName + "&filterName=" + filterName + "&currentPage=" + this.currentPage)
                .then(({
                    data: res
                }) => {
                    wx.hideLoading();
                    // 关闭下拉刷新动画
                    wx.stopPullDownRefresh()

                    if (res.code == 1) {
                        //格式化价格
                        res.data.forEach(element => {
                            element.price = formatPrice(element.price);
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
};
</script>

<style lang="scss" scoped>
// .vant_img {
//     height: 90rpx;
//     width: 90rpx;
//     position: relative;

//     img {
//         width: 100%;
//         height: 100%;
//     }
// }

// .van-card__img {
//     width: 100%;
//     height: 100%;
// }

// .van-card .van-card__title {
//     line-height: 24px;

// }

// .buy {
//     position: absolute;
//     right: 50rpx;
//     bottom: 20rpx;

// }
</style>
