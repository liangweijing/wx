<template>
<div class="classify">
    <!-- 搜索栏weui -->
    <div class="page">
        <div class="page__bd">
            <div class="weui-search-bar">
                <div class="weui-search-bar__form">
                    <div class="weui-search-bar__box">
                        <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
                        <input type="text" class="weui-search-bar__input" placeholder="搜索`" />
                        <!-- <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14"></icon>
            </div> -->
                    </div>
                    <label class="weui-search-bar__label" :hidden="inputShowed" @click="inputTyping">
              <icon class="weui-icon-search" type="search" size="14"></icon>
              <div class="weui-search-bar__text">搜索</div>
            </label>
                </div>
                <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div>
            </div>
        </div>
    </div>

    <!-- 分类 -->
    <div class="content">
        <!-- 左侧栏 -->
        <scroll-view class="left" scroll-y="true">
            <div class="iconText" @click="selectitem(item.name,index)" v-for="(item, index) in listData" :class="[index==nowIndex?'active':'']" :key="index">
                {{item.name}}
            </div>
        </scroll-view>
        <!-- 右侧栏 -->
        <scroll-view class="right" scroll-y="true">
            <div class="banner">
                <img :src="detailData[0].banner" alt="">
            </div>
            <div class="title">
                <span>—</span>
                <span>{{detailData[0].name}}分类</span>
                <span>—</span>
            </div>
            <div class="bottom">
                <div @click="classifyList(item.name,item.brand)" v-for="(item,index) in detailData" :key="index" class="item">
                    <img :src="item.list_url" alt="">
                    <span>{{item.brand}}</span>
                </div>
            </div>
        </scroll-view>
    </div>
</div>
</template>

<script>
export default {
    onShow() {
        //获取列表数据
        this.getList();

    },

    data() {
        return {
            id: '1005000',
            nowIndex: 0,
            listData: [],
            detailData: [],
            rightData: []
        };
    },
    methods: {
        // 跳转搜索页
        inputTyping() {
            wx.navigateTo({
                url: '../search/main',
            });
        },
        getCategory() {
            return this.$fly.get('/getCategory');
        },

        getCategoryDetail() {
            return this.$fly.get('/getCategoryDetail');
        },
        async getList() {
            await this.$net.get({
                    url: "/getCategory"
                })
                .then(res => {
                    if (res.code == 1) {
                        this.listData = res.data;
                        console.log("listData", this.listData);
                    }

                })
                .catch(err => {
                    console.log(err);
                });

            await this.$net.get({
                    url: "/getCategoryDetail"
                })
                .then(res => {
                        if (res.code == 1) {
                            
                            this.rightData = res.data;
                            
                            this.rightData.forEach(element => {
                                var obj = {};
                                    if (element.name == this.listData[0].name) {
                                        obj.brand = element.brand;
                                        obj.list_url = element.list_url;
                                        obj.banner = element.banner;
                                        obj.name = element.name;
                                        this.detailData.push(obj);
                                    }
                                });
                                
                            }
                        }).catch(err => {
                        console.log(err);
                    })
                    //使用fly并发请求
                    // wx.showLoading({
                    //     title: '正在加载中....'
                    // })
                    // this.$fly.all([this.getCategory(), this.getCategoryDetail()])
                    //     .then(this.$fly.spread(function (leftRes, rightRes) {
                    //         //两个请求都完成
                    //         wx.hideLoading();
                    //         console.log(leftRes.data.data)打印有值且正确值
                    //         console.log(leftRes.data.code)
                    //         console.log("listData", this.listData);

                    //         if (leftRes.data.code == 1) {
                    //             this.listData = leftRes.data;使用fly发送请求一直报错说这里不能给listData赋值null
                    //         }
                    //         if (right.data.code == 1) {
                    //             var obj = {};
                    //             this.rightData = rightRes.data.data;
                    //             console.log("right", this.rightData)
                    //             this.rightData.forEach(element => {
                    //                 if (element.name == this.listData[0].name) {
                    //                     obj.brand = element.brand;
                    //                     obj.list_url = element.list_url;
                    //                     // obj.banner=element.banner;
                    //                     obj.name = element.name;
                    //                     this.detailData.push(obj);
                    //                 }
                    //             });
                    //             console.log("right2", this.detailData)
                    //         }

                    //     }))
                    //     .catch(function (error) {
                    //         console.log(error)
                    //     })
                },
                selectitem(name, index) {
                    this.nowIndex = index;
                    this.detailData = [];
                    
                    console.log(name)
                    console.log("right", this.rightData)
                    this.rightData.forEach(element => {
                        var obj = {};
                        if (element.name === name) {
                            obj.brand = element.brand;
                            obj.list_url = element.list_url;
                             obj.banner=element.banner;
                            obj.name = element.name;
                            this.detailData.push(obj);
                        }
                    });
                    console.log(this.detailData)
                },
                classifyList(name, brand) {
                    //跳转对应品牌商品列表
                    wx.navigateTo({
                        url:"/pages/grides_list/main?name="+name+"&brand="+brand
                    })
                }

            //点击左侧栏获取右侧栏
            // async selectitem(id, index) {
            //   this.nowIndex = index;
            //   const data = await get("/category/currentaction", {
            //     id: id
            //   });
            //   this.detailData = data.data.currentOne;
            // },
            //初始化左侧栏
            // getCategory() {
            //     return this.$fly.get('/category');
            // },
            // getGoodsList() {
            //     return this.$fly.post("/grideGoods?searchName=" + pageName, {
            //         currentPage: this.currentPage // 传递页码
            //     })
            // },
            // async getList() {
            //   let leftRes= await this.$net.get("/category");
            // },
        },
        //跳转详情页
        //    categoryList(id) {
        //     console.log("tiaozhuan");

        //     wx.navigateTo({
        //       url: "../categorylist/main?id=" + id
        //     });

        // },
    };
</script>

<style lang="scss" scoped>
@import './style';
</style>
