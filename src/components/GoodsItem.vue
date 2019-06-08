<template>
  <div class="item">
    <div class="weui-badge" style="margin-left: 5px;">特价</div>
    <div class="left">
      <div class="img">
        <img :src="item.url" alt="">
      </div>

      <div class="right">
        <div class="info">
          <p>{{item.goods_name}}</p>
          <p>描述</p>
          <p>￥36.00</p>
          <p v-if="item.origin" class="origin">￥12.00</p>
        </div>
        <div class="footer">
          <button type="default">立即购买</button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: ['item'],
  onShow() {
    console.log(item.url);
  },
};
</script>
<style lang="scss" scoped>
.item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f4f4f4;
  height: 166rpx;
  position: relative;
  .left {
    display: flex;
    align-items: center;
    width: 80%;

    .img {
      height: 125rpx;
      width: 125rpx;
      display: block;
      background: #f4f4f4;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right {
    padding-right: 50rpx;
    .info {
      width: 50%;
      padding: 20rpx;
      p {
        line-height: 40rpx;
      }
      .origin{
        text-decoration: line-through;
      }
    }
  }
}
</style>
