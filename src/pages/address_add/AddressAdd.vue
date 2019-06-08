<template>
<div class="addaddress">
    <wux-cell-group>

        <wux-cell hover-class="none">
            <!-- 设置了最大长度和清除按钮 -->
            <wux-input label="收件人：" :value="addressDetail.consignee" controlled maxlength="12" clear @change="onChangeName"/>
        </wux-cell>
        <wux-cell hover-class="none">
            <wux-input label="联系电话：" :value="addressDetail.mobile" controlled :error="error" type="number" @change="onChange" @confirm="onConfirm" @error="onError" />
        </wux-cell>

    </wux-cell-group>

    <div class="item">
        <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
            <input type="text" placeholder="省份、城市、区县：" v-model="addressDetail.address">
      </picker>
    </div>
    <wux-cell-group>
        <wux-cell hover-class="none">
            <wux-textarea hasCount rows="3" cursorSpacing="80" controlled placeholder="详细地址：" :value="addressDetail.detail"  @change="changeDetail"/>
        </wux-cell>
    </wux-cell-group>

    <div class="item itemend">
        <checkbox-group @change="checkboxChange">
            <label class="checkbox">
            <!-- 只有选中和不选两种，选中就会得到值true,取消则值就是undefined -->
          <checkbox   class="box" value="true" :checked="checked" color="#B4282D" />设置为默认地址
        </label>
        </checkbox-group>
        <div @click="wxaddress">一键导入微信></div>
    </div>
    <div @click="saveAddress" class="bottom">
        保存
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            openid: "",
            region: [],
            customItem: "全部",
            
            error: "",
            
            addressId:null,
            checked: false,
           
            id:null,
            addressDetail:{
                mobile: "",
                 consignee: "",
                 address: "",
            detail:"",
            isDefault:null,
            }
        }

    },
    onUnload () {
      this.addressDetail={};
    },
    mounted() {
        var that=this;
        if (wx.getStorageSync("userInfo")) {
            this.openid = wx.getStorageSync("userInfo").openid;
        }
        console.log("参数",that.$root.$mp.query.id)
        if(that.$root.$mp.query.id){
            this.id=that.$root.$mp.query.id;
            this.getAdress();
        }
    },
    methods: {
        getAdress() {
            this.$net.get({
                url: "/getAddress",
                data: { //不用传openid地址ID是唯一的
                    id: this.id
                }
            }).then(res => {
                if (res.code == 1) {
                    //扩展运算符，对象深拷贝，obj1复制给obj2
                    this.addressDetail = {...res.data};
                    console.log(this.addressDetail)
                    if(this.addressDetail.isDefault==1){
                        this.checked=true;
                    }else{
                        this.checked=false;
                    }
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
        bindRegionChange(e) {
            var value = e.mp.detail.value;
            this.addressDetail.address = value[0] + " " + value[1] + " " + value[2];
        },
        changeDetail(e){
            this.addressDetail.detail=e.mp.detail.value;
        },
        onChangeName(e){
            this.addressDetail.consignee=e.mp.detail.value;
        },
        isTel(value) {
            return !/^1[34578]\d{9}$/.test(value);
        },
        onChange(e) {
            
            this.error = this.isTel(e.mp.detail.value);
            this.addressDetail.mobile = e.mp.detail.value;

        },
        onConfirm(e) {
            console.log('onConfirm', e)
        },
        onError() {
            wx.showModal({
                title: '请输入正确的手机号！',
                showCancel: !1,
            })
        },
        checkboxChange(e) {
            console.log("默认", e.mp.detail.value[0])
              this.checked = e.mp.detail.value[0];
        },
         saveAddress() {
          
             if(!this.id){//添加地址
                this.$net.post({
                url: "/insertAddress",
                data: {
                    consignee: this.addressDetail.consignee,
                    mobile: this.addressDetail,
                    address: this.addressDetail.address,
                    detail: this.addressDetail.detail,
                    isDefault: this.checked?1:0,
                    openid: this.openid,
                    
                }

            }).then(res=>{
                if (res.code==1) {
                console.log(222)
                //返回自增主键
                _this.addressId=res.data;
                // wx.setStorageSync("addressId",_this.addressId)
                // console.log( wx.getStorageSync("addressId"));
                console.log("栈",getCurrentPages()); 
                wx.showToast({
                    title: "添加成功", //提示的内容,
                    icon: "success", //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {
                        console.log(555);

                        //添加成功返回订单确认页,一开始在方法中加了async所以导致没有执行这里
                        wx.navigateBack({
                            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                        });
                    },
                    fail:function(err){
                        console.log(err);
                    },
                    complete:function(){
                        console.log("doit")
                    }
                });
            }
            }).catch(err=>console.log(err))
             }else{
                 //修改地址
                  this.$net.post({
                url: "/updateAddress",
                data: {
                    consignee: this.addressDetail.consignee,
                    mobile: this.addressDetail.mobile,
                    address: this.addressDetail.address,
                    detail: this.addressDetail.detail,
                    isDefault: this.checked?1:0,
                    openid: this.openid,
                    id:this.id
                    
                }

            }).then(res=>{
                if(res.code==1){//返回地址列表
                    wx.navigateBack({
                            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                        });
                }
            }).catch(err=>{
                console.log(err);
            })
             }
              
      
            
        },
        //     wxaddress() {
        //   var _this = this;
        //   wx.chooseAddress({
        //     success: function (res) {
        //       _this.consignee = res.userName;
        //       _this.phone = res.telNumber;
        //       _this.address = `${res.provinceName} ${res.cityName} ${res.countyName}`;
        //       _this.detail = res.detailInfo;
        //     }
        //   });
        // }
    },

}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
