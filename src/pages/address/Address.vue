<template>
<div class="address">

    <scroll-view scroll-y="true" class="addcont" style="height: 100%;">
        <!-- <div class="addcont"> -->
        <div v-if="listData.length!=0" class="item">
            <div class="list" @touchstart="startMove" :data-index="index" @touchmove="deleteGoods" @touchend="endMove" v-for="(item, index) in listData" :key="index">
                <div class="addresslist" :style="item.textStyle">
                    <div>
                        <span>{{item.consignee}}</span>
                        <div v-if="item.isDefault" class="moren">
                            默认
                        </div>
                    </div>
                    <div @click="selAddress(item.id)" class="info">
                        <p>{{item.mobile}}</p>
                        <p>{{item.address+item.detail}}</p>
                    </div>
                    <div @click="toAddressDetail(item.id)"></div>
                </div>
                <div @click="delAddress(item.id)" class="delete" :style="item.textStyle1">
                    <div>
                        删除
                    </div>
                </div>
            </div>

        </div>

        <div v-else class="center">
            <p>收货地址在哪里?</p>
        </div>
    </scroll-view>
    <!-- 页底提示 -->

    <i-load-more v-if="foot" style="margin-bottom:30px;" tip="已触底没有数据啦！" loading="false" />

    <div class="bottom">
        <div @click="wxaddress(1)">+新建地址</div>
        <div @click="wxaddress">一键导入微信地址</div>
    </div>
</div>
</template>

<script>
export default {
    onShow() {
        this.getTotalPage();
        if (wx.getStorageSync("userInfo").openid) {
            this.openid = wx.getStorageSync("userInfo").openid;
            this.getAddressList();
        }

    },
    mounted() {
        // console.log("栈",getCurrentPages()); 

    },
    data() {
        return {
            listData: [],
            openid: "",
            currentPage: 1, // 当前页数
            total_page: 0, // 总页数
            foot: false,
            tranX: 0,
            tranX1: 0,
            startX: "",
            startY: "",
            moveX: "",
            moveY: "",
            moveEndX: "",
            moveEndY: "",
            X: 0,
            Y: "",
            flag: false
        }
    },
    // 上拉触底事件
    onReachBottom() {
        if (this.currentPage >= this.total_page) {
            console.log('数据加载完了');
            this.foot = true;
        } else {
            // 下一页
            this.currentPage = this.currentPage + 1
            this.getAddressList()
        }
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 初始化页码
        this.currentPage = 1
        this.getAddressList()
    },
    methods: {
        //滑动删除h5的touch事件
        initTextStyle() {
            //滑动之前先初始化数据
            for (var i = 0; i < this.listData.length; i++) {
                this.listData[i].textStyle = "";
                this.listData[i].textStyle1 = "";
            }
        },
        startMove(e) {
            this.initTextStyle();
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
        },
        endMove(e) {
            var index = e.currentTarget.dataset.index;
            if (this.X > -50) {
                this.tranX1 = 0;
                this.tranX = 0;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            } else if (this.X <= -50) {
                this.tranX1 = -100;
                this.tranX = -100;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            }
        },
        async delAddress(id) {
            var _this = this;
            wx.showModal({
                title: "",
                content: "是否要删除该收货地址",
                success: function (res) {
                    if (res.confirm) {
                         _this.$net.get({
                            url: "/deleteAddress",
                            data: {
                                id: id
                            }
                        }).then(res => {
                            if (res.code == 1) {
                                _this.getAddressList();
                            }
                        });
                    } else if (res.cancel) {
                        console.log("用户点击取消");
                        //滑动之前先初始化样式数据
                        _this.initTextStyle();
                    }
                }
            });
        },
        deleteGoods(e) {
            //滑动之前先初始化样式数据
            this.initTextStyle();
            var index = e.currentTarget.dataset.index;
            console.log(this.X);
            if (this.X <= -100) {
                this.flag = true;
            }
            if (!this.flag) {
                this.moveX = e.touches[0].pageX;
                this.moveY = e.touches[0].pageY;
                this.X = this.moveX - this.startX;
                this.Y = this.moveX - this.startY;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                if (this.X >= 100) {
                    this.X = 0;
                }
                this.tranX = this.X;
                if (this.X <= -100) {
                    this.X = -100;
                }
                this.tranX1 = this.X;
                this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
            } else {
                this.moveX = e.touches[0].pageX;
                this.moveY = e.touches[0].pageY;
                this.X = this.moveX - this.startX;
                this.Y = this.moveX - this.startY;

                this.tranX = this.X - 100;
                this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
                // transform:'translateX(' + tranX + 'rpx)'
                console.log("heyushuo");

                console.log(this.listData[index].textStyle);

                if (this.X + -100 > -100) {
                    this.flag = false;
                }
                this.tranX1 = -100;
                this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
                console.log(this.listData[index].textStyle1);
                // this.listData = this.listData;
            }
        },
        async getTotalPage() {
            await this.$net.get({
                url: "/getAddressNum"
            }).then(res => {
                this.total_page = parseInt(res.data / 6 + 1);
                console.log(this.total_page);
            })
        },
        getAddressList() {
            console.log(777, this.currentPage)
            this.$net.get({
                url: "/getAddressByOpenid",
                data: {
                    openid: this.openid,
                    currentPage: this.currentPage,
                }
            }).then(res => {
                // 关闭下拉刷新动画
                wx.stopPullDownRefresh()
                if (res.code == 1) {
                    // 数据追加  
                    if (this.currentPage > 1) {
                        // 数据追加
                        this.listData.push(...res.data)

                    } else {
                        // 数据
                        this.listData = res.data
                    }

                }
            })
        },
        wxaddress(index) {
            if (index == 1) { //普通添加地址
                wx.navigateTo({
                    url: "/pages/address_add/main"
                });
            } else { //导入微信地址
                wx.chooseAddress({
                    success: function (res) {
                        var res = encodeURIComponent(JSON.stringify(res));
                        wx.navigateTo({
                            url: "/pages/addaddress/main?res=" + res
                        });
                    }
                });
            }
        },
        selAddress(id) {
            var pages = getCurrentPages();
            if (pages[pages.length - 2].route == "pages/center/main") {
                return false;
            }
            console.log("已选", id)
            wx.setStorageSync("addressId", id);
            // wx.redirectTo({ url: "/pages/order/main?id=" + id });
            wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
        },
        toAddressDetail(id) {
            console.log(id);
            wx.navigateTo({
                url: "/pages/address_add/main?id=" + id
            });
        },
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
