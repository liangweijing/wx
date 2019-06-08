<template>
<div class="search">
    <!-- weui -->
    <div class="page__bd">
        <div class="weui-search-bar">
            <div class="weui-search-bar__form">
                <div class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
                    <input type="text" class="weui-search-bar__input" placeholder="搜索" v-model="inputVal" :focus="inputShowed" @input="inputTyping" />
                    <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
                        <icon type="clear" size="14"></icon>
                    </div>
                </div>
                <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <div class="weui-search-bar__text">搜索</div>
          </label>
            </div>
            <!-- <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div> -->
            <div class="weui-search-bar__cancel-btn" :hidden="!inputVal.length > 0" @click="search">搜索</div>
        </div>
    </div>
    <!-- weui搜索栏结束 -->

    <!-- <div class="searchtips" v-if="inputVal.length > 0">
        智能下拉框模糊匹配搜索到的关键词
      <div @click="searchWords" v-if="tipsData.length!=0" :data-value="item.name" v-for="(item,index) in tipsData" :key="index" hover-class="weui-cell_active">
        {{ item.name }}
      </div>    
    </div> -->
    <div v-if="!result">
        <div class="history" v-if="historyData.length!=0">
        <div class="t">
            <div>历史记录</div>
            <div @click="clearHistory">

            </div>
        </div>
        <div class="cont">
            <!-- <div @click="searchWords" :data-value="item.keyword" v-for="(item,index) in historyData" :key="index">
                {{item.keyword}}
            </div> -->
            <i-tag v-for="(item,index) in historyData" :key="index" @change="changeHistory" checkable="true" :name="index" :color="item.color" :checked="item.checked" type="border" style="margin-right:5px;">
                {{item.name}}
            </i-tag>
        </div>
    </div>
    <div class="history hotsearch">
        <div class="t">
            <div>热门搜索</div>
        </div>
        <div class="cont">
            <!-- <div @click="searchWords" v-for="(item,index) in hotData" :data-value="item.keyword" :class="{active:0==index}" :key="index">
                {{item.keyword}}
            </div> -->
            <i-tag v-for="(item,index) in tags" :key="index" @change="onChange" checkable="true" :name="index" :color="item.color" :checked="item.checked" type="border" style="margin-right:5px;">
                {{item.name}}
            </i-tag>
        </div>
    </div>
    </div>
    
    <!-- 显示搜索结果页 -->
    <div class="goodsList" v-if="result">
        <!--商品列表  -->
        <div v-if="listData.length!=0" >
            <div class="filterbar">
                <i-tabs :current="current " color="#996600" @change="handleChange">
                    <i-tab key="synthesize" title="综合"></i-tab>
                    <i-tab key="newgoods" title="新品"></i-tab>
                    <i-tab key="volumn" title="销量"></i-tab>
                    <i-tab key="price" title="价格"></i-tab>
                </i-tabs>
            </div>
            <div >
                <div v-for="(item,index) in listData" :key="index">
                    <!-- <van-card price="2.00" desc="描述信息" title="商品标题">
            <img slot="thumb" :src='item.url' class="van-card__img thumb-class" @click="goProduct(item.id)">
            </van-card> -->
                    <div class="goods_list" @click="goProduct(item.id)">
                        <van-card :price="item.price" :desc="item.sellPoint" :title="item.title" :thumb="item.listUrl">
                            <van-tag slot="tags" plain type="danger">包邮</van-tag>
                        </van-card>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="nogoods">
            数据库暂无此类商品...
        </div>
    </div>

</div>
</template>

<script>
import GoodsNav from '@/components/GoodsNav';
export default {
    onLoad(){
        //初始化
        
            this.inputVal= "", //输入框值
            this.historyData= [],
            this.listData= [], //商品数据
            this.tagName="";
    },
    onShow() {
         wx.removeStorage("history");
         if(!wx.getStorageSync("history")){
             var arr = [];
             wx.setStorageSync("history",arr)

         }else{
            this.historyData = wx.getStorageSync("history");
         }
        
    },
    components: {
        GoodsNav
    },
    data() {
        return {
            current: 'synthesize',
            tags: [{
                    name: '电水壶',
                    checked: false,
                    color: "red"
                },
                {
                    name: '电饭锅/煲',
                    checked: false,
                    color: "red"
                },
                {
                    name: '电磁炉',
                    checked: false,
                    color: "red"
                }
            ],
            inputShowed: false, //显示输入框可以数据数据，初始为放大镜图标
            inputVal: "", //输入框值
            historyData: [],
            // tipsData: [],智能匹配的搜索词
            listData: [], //商品数据
            result: false,
            isHot: false,
            isHis:false,
            tagName: "",
            historyTag:""
        }
    },
    methods: {
       
        //点击热词搜索
        onChange(event) {
            this.isHot = true;
            const detail = event.mp.detail;
            console.log(event.mp.detail) //点击打印的是name:index和checked:true or false    
            this.tagName = this.tags[detail.name].name;
            //状态转换
            this.tags[detail.name].checked = detail.checked
            console.log("发请求")
            this.getList(this.tagName, "inventory");
        },
         //点击历史搜索
        changeHistory(event){
              this.isHis = true;
            const detail = event.mp.detail;
            console.log(event.mp.detail) //点击打印的是name:index和checked:true or false    
            this.historyTag = this.historyData[detail.name].name;
            //状态转换
            this.historyData[detail.name].checked = detail.checked
            console.log("发请求")
            this.getList(this.historyTag, "inventory");
        },
        showInput() {
            this.inputShowed = true;
        },
        search() {
            var obj = {
                    checked: false,
                    color: "default"
                };
                obj.name=this.inputVal;
            this.historyData.push(obj);
            // this.historyData.push(this.inputVal);
            wx.setStorageSync("history", this.historyData);
            this.getList(this.inputVal, "inventory");
        },
        //点击筛选导航，判断是点击热词还是搜索框出现的搜索
        handleChange(e) {
            this.current = e.mp.detail.key;
            if(this.isHis){
                this.getList(this.historyTag, this.current)
            }else if (this.isHot) {
                this.getList(this.tagName, this.current);
            } else {
                this.getList(this.inputVal, this.current);
            }

        },
        goProduct(id) {
            wx.navigateTo({
                url: "/pages/goods/main?goods_id=" + id
            });
        },

        getList(searchMsg, filterName) {
            console.log("send request");
            console.log(searchMsg);

            this.$net.get({
                url: "/searchGoods",
                data: {
                    searchMsg: searchMsg,
                    filterName: filterName
                }
            }).then(res => {
                this.result = true;
                if (res.code == 1) {
                    this.listData = res.data;
                }else{
                    this.listData=[];
                }
                
            })
        },
        // hideInput() {
        //   this.inputVal = '';
        //   this.inputShowed = false
        // },
        clearInput() {
            this.inputVal = '';
            this.inputShowed = false;
            this.result = false;
        },
        inputTyping(e) {
            // console.log(e);
            this.inputVal = e.mp.detail.value
        },
        async clearHistory() {
            const data = await post("/search/clearhistoryAction", {
                openId: this.openid
            });
            console.log(data);
            if (data) {
                this.historyData = [];
            }
        },
         searchWords(e) {
      
          
        },
        clearHistory() {
      wx.removeStorageSync('key');
      this.historyData=[];
    },
    }
}
</script>

<style lang="scss" scoped>
@import "./style";

.searchbar-result {
    margin-top: 0;
    font-size: 14px;
}

.searchbar-result:before {
    display: none;
}

.weui-cell {
    padding: 12px 15px 12px 35px;
    height: 91px;
}
</style>
