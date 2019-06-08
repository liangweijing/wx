<template>
<div class="cart">

    <div v-if="hascart" class="cartlist">

        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con">
                <div class="left">
                    <!-- select按钮 -->
                    <div class="icon" @click="changeColor(index,item.skuId)" :class="[ Listids[index] ? 'active' : '',{active:allcheck}]"></div>
                    <div class="img">
                        <img :src="item.listUrl" alt="">
            </div>
                        <div class="info">
                            <p>{{item.title}}</p>
                            <p>{{item.sellPoint}}</p>
                            <!-- <p v-if="item.discountPrice">￥{{item.discountPrice}}</p>
                            <p v-else>￥{{item.price}}</p> -->
                            <p >￥{{item.price}}</p> 
                        </div>
                    </div>

                </div>
                <div class="right">
                    <view slot="footer">
                        <button type="default" @click="reduce" size="mini" class="operate">-</button>
                        <div class="num">
                            {{item.number}}
                        </div>
                        <button type="default" @click="add" size="mini" class="operate">+</button>
                    </view>
                    <div @click="delGoods(item.skuId)" class="delete">
                        <img src="https://i.loli.net/2019/06/08/5cfb7a064869486983.png" alt="">
        </div>
                    </div>

                </div>
            </div>
            <div v-if="!hascart" class="nogoods">
                <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
    </div>
                <div class="fixed">
                    <div @click="allCheck" :class="{active:allcheck}" class="left">
                        全选({{isCheckedNumber}})
                    </div>
                    <div class="right">
                        <!-- 合计 -->
                        <div>
                            ￥{{allPrice}}
                        </div>
                        <div @click="orderDown">下单</div>
                    </div>
                </div>
            </div>
</template>

<script>
//未授权用户可以看空的购物车
// import { isLogin } from '../../utils';
import { formatPrice } from '@/utils/index'
export default {
    data() {
        return {
            userInfo: {},
            listData: [],
            hascart: true,
            allcheck: false,

            Listids: [],
            userInfo: {},

        };
    },
    computed: {

        //判断是否全选
        isCheckedNumber() {
            let number = 0;
            for (let i = 0; i < this.Listids.length; i++) {
                if (this.Listids[i]) {
                    number++;
                }
            }
            if (number == this.listData.length && number != 0) {
                this.allcheck = true;
            } else {
                this.allcheck = false;
            }
            return number;
        },
        allPrice() {
            var price = 0;
            for (let i = 0; i < this.Listids.length; i++) {
                if (this.Listids[i]) {
                  price = price + this.listData[i].price * this.listData[i].number;
                    // price = price +this.Listids[i].discountPrice? this.listData[i].price * this.listData[i].number;
                  
                    
                }
            }
            return formatPrice(price);
        }
    },
    onShow() {
      console.log("isf")
        this.userInfo = wx.getStorageSync("userInfo");

        // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
        var arr = wx.getStorageSync('cart') || {};
        console.info("购物车缓存缓存数据：" + arr);
        // 有数据的话，就遍历数据，计算总金额 和 总数量  
        if (arr.goods) {
            // 更新数据  
            console.log("666")
            this.listData = arr.goods;
            this.hascart = true;

        } else {
            console.log("缓存数据：" + arr);
            this.hascart = false;
        }
    },
    methods: {
        add() {
            this.number = this.number + 1;
            this.goods.number = this.number;
        },
        reduce() {
            if (this.number > 1) {
                this.number = this.number - 1;
                this.goods.number = this.number;
            } else {
                return false;
            }
        },
        delGoods(skuId) {
          var that=this;
            wx.showModal({
                title: "提示",
                content: "确认删除该商品？",
                success: function (res) {
                    if (res.confirm) {
                        var arr= wx.getStorageSync("cart").goods;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].skuId == skuId) {
                                delete arr[i];
                            }
                        }
                        //坑：该方法原数组不变，返回筛选后的数组
                        arr=arr.filter(d=>d);
                        console.log(arr)
                        if (!arr.length>0) {
            
                            wx.setStorageSync("cart",{});
                        }else{
                          var obj={
                            uid:wx.getStorageSync("cart").uid,
                            goods:arr
                          };
                          wx.setStorageSync("cart",obj);
                        }
                        
                        wx.showToast({
                            title: "删除成功",
                            icon: "success",
                            duration: 2000
                        });
                        console.log("fresh")
                        wx.reLaunch({
                          url:"/pages/cart/main"
                        })
                    } else if (res.cancel) {
                        console.log("用户点击取消");

                    }
                }
            });

        },

        //改变select状态
        changeColor(index, id) {
            console.log(index, id)

            if (this.Listids[index]) { //若已选中设为false
                //vue.set解决数组响应式问题，无法使用下标赋值
                this.$set(this.Listids, index, false);
            } else {
                console.log(555)
                this.$set(this.Listids, index, id);
            }
            console.log(this.Listids)
        },
        allCheck() {
            //先清空
            this.Listids = [];
            if (this.allcheck) {
                this.allcheck = false;
            } else {
                console.log("选择全部");

                this.allcheck = true;
                //循环遍历所有的商品id
                for (let i = 0; i < this.listData.length; i++) {
                    const element = this.listData[i];
                    this.Listids.push(element.skuId);
                }
            }
        },
        async orderDown() {
            console.log("已选择的id", this.Listids)
            if (this.Listids.length == 0) {
                wx.showToast({
                    title: "请选择商品",
                    icon: "none",
                    duration: 1500
                });
                return false;
            }
            // 去掉Listids数组中空的false的,即没选中的商品
            var newgoodsid = [];
            for (let i = 0; i < this.Listids.length; i++) {
                const element = this.Listids[i];
                if (element) {
                    newgoodsid.push(element);
                }
            }
            //新建一个存放订单商品的缓存——优化
            var orderGoods = [];

            for (let j = 0; j < newgoodsid.length; j++) {
                for (let k = 0; k < this.listData.length; k++) {
                    if (this.listData[k].skuId == newgoodsid[j]) {
                        orderGoods.push(this.listData[k]);
                    }
                }
            }
            wx.setStorageSync("orderGoods", orderGoods);
            console.log("ordergoods", wx.getStorageSync("orderGoods"))
            // var goodsId = newgoodsid.join(",");
            // const data = await post("/insertOrder", {
            //   goodsId: goodsId,
            //   openId: this.openId,
            //   allPrise: this.allPrise
            // });
            // const data=await get("/getAddress?openid="+this.userInfo.openid)

            wx.navigateTo({
                url: "/pages/order_confirm/main"
            });

        },
    }

};
</script>

<style lang="scss" scoped>
@import './style';
</style>
