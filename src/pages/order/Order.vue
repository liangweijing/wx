<template>
  <div class="order_confirm">
<!-- 订单状态 -->
    <div class="top">
      <wux-icon type="ios-checkmark-circle-outline" size="48" color="green"/>
      <div>交易状态：{{orderInfo.status}}</div>
    </div>
    <!-- 地址信息 -->
     <div @click="toAddressList"  class="address">
        <div class="item">
            <div class="list">
                <div class="addresslist">
                    <div>
                        <span>{{address.consignee}}</span>
                        <div v-if="address.isDefault" class="moren">
                            默认
                        </div>
                    </div>
                    <div class="info">
                        <p>{{address.mobile}}</p>
                        <p>{{address.address+address.detail}}</p>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
<!-- 商品信息 -->
        <div class="cartlist">
          
        <div class="item" v-for="(item,index) in listData" :key="index">
            <div class="con">
                <div class="left">
                    <div class="img">
                        <img :src="item.listUrl" alt="">
            </div>
                        <div class="info">
                            <p>{{item.title}}</p>
                            <p v-if="discouuntPrice"> ￥{{item.discountPrice}}</p>
                            <p v-else>￥{{item.price}}</p>
                        </div>
                    </div>
                    <div class="right">
                        <div class="num">
                            x{{item.number}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="other">
          <i-cell-group>
            <i-cell title="运费：" value="￥10"></i-cell>

            <i-cell title="优惠：" :value="orderInfo.couponPrice"></i-cell>
        </i-cell-group>
        </div>
       

        <wux-wing-blank size="default">
            <wux-card title="订单信息"  thumb="https://i.loli.net/2019/06/05/5cf780321eeac41646.png">
                <div slot="body">
                  <div>订单编号：{{orderInfo.id}}</div>
                  <div>创建时间：{{orderInfo.addTime}}</div>
                  <div>成交时间：{{orderInfo.payTime}}</div>
                </div>
                <div slot="footer">
                  <wux-button  outline type="balanced"><wux-icon type="ios-save" size="16" /> 联系客服</wux-button>
                  <wux-button  outline type="balanced"><wux-icon type="ios-save" size="16" /> 联系卖家</wux-button>
                </div>
            </wux-card>
        </wux-wing-blank>
  </div>
</template>
<script>
import { timestampToTime,getFormatDate } from '@/utils/index'
export default {
  onUnload(){
    //需要获得页面的传参所以在onShow里写方法不可以，所以刷新信息就手动在页面销毁时做
   this.orderId="";
   this.addressId="";
      this.listData=[];
      this.orderInfo={};
      this.address={};
    
    
  },
mounted() {
  this.addressId=wx.getStorageSync("addressId");
  if(this.$root.$mp.query.orderId){
    this.orderId=this.$root.$mp.query.orderId;
  }else{
    this.orderId=wx.getStorageSync("orderId");
  }
  this.getAdress();
    this.getOrderUser();
    this.getOrderGoods();
},
  data(){
    return{
      addressId:"",
      listData:[],
      orderId:'',
      orderInfo:{},
      address:{}
    }
  },
  methods: {
     async getAdress() {
            await this.$net.get({
                url: "/getAddress",
                data: { //不用传openid地址ID是唯一的
                    id: this.addressId
                }
            }).then(res => {
                if (res.code == 1) {
                    this.address = res.data;
                } else {
                    wx.showToast({
                        title: "获取地址失败",
                        icon: 'none',
                        duration: 2000
                    })
                }
            }).catch(err => {
                console.log(err)
            })

        },

        async getOrderUser(){
          
          await this.$net.get({
           url: "/getOrderUser",
           data:{
             oid:this.orderId}})
          .then(res=>{
            
            //数据库查出的日期是一个13位的时间戳类似1567900390011，格式化
            res.data.payTime=getFormatDate(res.data.payTime);
             res.data.addTime=getFormatDate(res.data.addTime);
            
            res.data.couponPrice="减￥"+res.data.couponPrice;
            this.orderInfo=res.data
           
          })
        },
        async getOrderGoods(){
          await this.$net.get({
            url:"/getOrderGoods",
            data:{
                orderId:this.orderId
            }
          }).then(res=>{
            if(res.code==1){
              this.listData=res.data;
            }
            
          })
        }
  },

}
</script>
<style lang="scss" scoped>
@import './style';
.top{
  height:150rpx;
}
.other{
  margin-bottom:30rpx;
margin-top:-10rpx;

}
</style>
