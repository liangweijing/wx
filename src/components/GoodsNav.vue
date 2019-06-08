<template>
  <div class="nav">
    <ul>
      <li v-for="(item,index) in nav" :key="index" >
        <!-- 点击则先清除遍历所有的active，再给自己加上 -->
        <span v-if="item!='价格' || '销量'" class="active" @click="setClass_sendRequest">{{item}}</span>
        <span v-if="item=='价格'">价格
          <!-- <i></i>点击切换i中的图标 -->
        </span>
        <span v-if="item=='销量'">销量
          <!-- <i></i>点击切换i中的图标 -->
        </span>
      </li>
      <!-- <li >综合</li>
      <li >销量</li>
      <li>新品</li>
      <li>价格  </li> -->
    </ul>
  </div>
</template>
<script>
export default {
  props:['nav']
};
</script>
<style lang="scss" scoped>
.nav {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #fff;
  margin-bottom: 30rpx;
  ul {
    display: flex;

    li {
      flex: 1;
      text-align: center;
    }
    li.active{
      color: #ab2b2b;
    }
  }
}
</style>
