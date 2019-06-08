<template>
<div class="map_container">
    <map name="map-zsb"
    id="map-zsb"
    class="map-zsb"
    scale="16"
    latitude="34.273090"
    longitude="108.999680"
    :markers="markers"
    @callouttap="calloutTap"
    @regionchange="regionchange"
    @begin="begin"
    @end="end"
    show-location
    >
    </map>

</div>
</template>

<script>
let touchTimeStamp = 0;
export default {
    data: {
        markers: [{
            iconPath: 'https://i.loli.net/2019/05/30/5cefd49405eb951005.png',
            id: 0,
            latitude: 34.273090,
            longitude: 108.999680,
            width: 30,
            height: 30,
            callout: {
                content: "陕西省西安市新城区和信家电市场",
                fontSize: 14,
                bgColor: "#FFFFFF",
                borderRadius: 10,
                padding: 4,
                display: "ALWAYS",
                textAlign: "center"
            }

        }],

    },

    // 监听地图是否被拖动
    regionchange(param) {
        console.log('change', param) // （实测不会输出）
    },
    // 开始拖动
    begin({
        timeStamp
    }) {
        console.log('begin')
        touchTimeStamp = timeStamp
    },
    // 结束拖动
    end({
        timeStamp
    }) {
        console.log('end')
        // 添加拖动时长判断，防止误触操作
        if (timeStamp - touchTimeStamp > 100) {
            // 获取地图的中心点的坐标
            this.mapCtx.getCenterLocation({
                success: (res) => {
                    // 返回经纬度信息
                    console.log(res.longitude)
                    console.log(res.latitude)
                }
            })
        }
    },
    // 点击气泡回调
    calloutTap(marker) {
        // 点击气泡的操作
        console.log("暂无其他功能。")
    },

}
</script>

<style lang="scss" scoped>
.map_container {
    width: 100%;
    height: 100%;

    .map-zsb {
        width: 100%;
        height: 100%;
    }
}
</style>
